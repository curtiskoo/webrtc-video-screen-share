import React from "react";
import RTCMultiConnection from "rtcmulticonnection"
import io from "socket.io-client"
import MessageList from "./MessageList";
import Card from '@material-ui/core/Card';
import {makeOrJoinRoom, scrollToBottom} from "../methods";
import SessionAppBar from "./SessionAppBar";
import VoiceCall from "./VoiceCall";

window.io = io;

class ScreenShareSession extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            videosContainer: null,
            roomid: null,
            screenCaptureStream: null,
            messages: [],
            contentDisplay: "Stream Chat",
            voicePeers: [],
            voiceStreaming: false,
            voiceMuted: false,
            voiceSession: null,
        }

        this.connection = new RTCMultiConnection


        this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

        this.connection.socketMessageEvent = 'audio-plus-screen-sharing-demo';
        this.connection.session = {
            audio: true, // merely audio will be two-way, rest of the streams will be oneway
            screen: true,
            video: true,
            // oneway: true
        };

       this.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        };

        // this.connection.videosContainer = document.getElementById('videos-container');
        // this.connection.audiosContainer = document.getElementById('audios-container');
        this.connection.onopen = (event) => {
            console.log('WebRTC app opened!');
            this.getExistingMessages()
        };

        this.connection.onmessage = (event) => {
            // console.log(`${event.userid}: ${event.data}`)
            // console.log(event)
            if (event.data.message) {
                console.log("message!")
                this.collectMessage(event.data)
            }
            if (event.data.voice) {
                console.log("voice!")
                console.log(event)
                this.getVoiceJoinedPeers()
            }
        }

        // this.connection.onExtraDataUpdated = (event) => {
        //     console.log(event)
        // }

        this.connection.onstream = (event) => {
            console.log('onstream')
            let streamtype;
            if(event.type === 'remote' && !this.connection.session.video) {
                // document.getElementById('btn-add-video').disabled = false;
            }
            console.log(event.mediaElement.nodeName)
            console.log(event)
            if (event.mediaElement.nodeName === "VIDEO") {
                streamtype = document.querySelector('video')
                streamtype.srcObject = event.stream
                streamtype.play()
                streamtype.muted = false
            } else if (event.mediaElement.nodeName === "AUDIO") {
                streamtype = document.getElementById('audio-only')
            }
            console.log(streamtype)

            // setTimeout(function() {
            //     event.mediaElement.media.load();
            // }, 5000);
            event.mediaElement.id = event.streamid;
        };

        this.connection.onstreamended = function(event) {
            var mediaElement = document.getElementById(event.streamid);
            if(mediaElement) {
                mediaElement.parentNode.removeChild(mediaElement);
            }
        };
    }

    toggleScreenShare = () => {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        var displayMediaStreamConstraints = {
            video: true, // currently you need to set {true} on Chrome
            audio: true,
            screen: true,
        };

        if (navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia(displayMediaStreamConstraints)
                .then((stream1) => {
                    console.log(this.connection)
                    this.connection.addStream(stream1)
                    // this.connection.attachStreams.push(stream1)
                    console.log(this.connection.videosContainer)
                    console.log(stream1)
                    console.log(stream1.getVideoTracks())
                    console.log(stream1.getAudioTracks())
                    this.setState({screenCaptureStream: stream1})

                    var video = document.querySelector('video')
                    console.log(video)
                    video.srcObject = stream1
                    video.play()
                    video.muted = true

                    console.log(this.connection)
                    return;
                })
        } else {
            // navigator.getDisplayMedia(displayMediaStreamConstraints)
            //     .then(stream => {
            //         this.connection.session.audio = true;
            //         this.connection.session.video = true;
            //
            //         this.connection.addStream({
            //             audio: true, // because session.audio==true, now it works
            //             video: true, // because session.video==true, now it works
            //             oneway: true
            //         });
            //     })

            alert("Only Chrome browser is supported at this time! :( ")
        }
    }

    setRoomID = () => {
        let input = this.props.match.params.id
        console.log(input)
        this.setState({roomid: input})
        makeOrJoinRoom(input, this.connection, {data : true})
    }

    removePeerStreams = (stream_id) => {
        // this.connection.getAllParticipants().forEach((participantId) => {
        //     var peer = this.connection.peers[participantId].peer;
        //
        //     // call RTCPeerConnection Native "removeStream"
        //     // it works only in Chrome
        //     peer.removeStream(stream);
        // })

        var streamToRemove = null;
        var newArray =  [];
        this.connection.attachStreams.forEach(function(stream) {
            if(stream.id === stream_id) {
                streamToRemove = stream;
            }
            else newArray.push(stream);
        });
        this.connection.attachStreams = newArray;

        this.connection.renegotiate()

    }

    endScreenFeed = () => {
        console.log(this.state.screenCaptureStream)
        // this.connection.removeStream(this.state.screenCaptureStream.id)
        if (this.state.screenCaptureStream) {
            this.removePeerStreams(this.state.screenCaptureStream.id)
            this.state.screenCaptureStream.stop()
        }
        this.connection.closeSocket()
        this.setState({roomid: null})
    }

    exitRoom = () => {
        this.endScreenFeed()
        this.props.history.push(`/`)
    }

    sendMessage = (e) => {
        e.preventDefault()
        let elem = document.getElementById('message-input')
        let input = elem.value
        let message = {
            id : this.connection.userid,
            username : this.props.username,
            time: new Date(),
            text: input,
            message: true,
        }
        this.connection.send(message)
        this.collectMessage(message)
        elem.value = ""
    }

    collectMessage = (message) => {
        let messages = this.state.messages
        messages.push(message)
        console.log(message)
        this.setExtraMessages(messages)
    }

    setExtraMessages = (messages) => {
        this.setState({messages: messages}, () => {
            scrollToBottom("message-inner-list")
            this.connection.extra.messages = this.state.messages
            this.connection.updateExtraData()
        })
    }

    getExistingMessages = () => {
        let peers = Array.from(this.connection.getAllParticipants())
        peers = peers.filter(p => this.connection.peers[p].extra.messages != null)
        // console.log(peers)
        for (let i = 0; i < peers.length; i++) {
            console.log(`Already in channel: ${peers[i]}`)
            if (this.connection.peers[peers[i]].extra.messages) {
                let messages = this.connection.peers[peers[i]].extra.messages
                console.log(messages)
                this.setExtraMessages(messages)
                break
            }
        }
    }

    changeContent = (listItem) => {
        this.setState({contentDisplay: listItem})
    }

    getVoiceJoinedPeers = () => {
        let peers = Array.from(this.connection.getAllParticipants())
        // peers = peers.filter(p => this.connection.peers[p].extra.voiceJoined != null)
        // console.log(this.connection.peers[peers[0]])
        // // console.log(this.connection.peers)
        // for (let i = 0; i < peers.length; i++) {
        //     console.log(peers[i])
        //     console.log(this.connection.peers[peers[i]])
        // }
        this.connection.getAllParticipants().forEach((id) => {
            let user = this.connection.peers[id]
            let extra = user.extra
            console.log(user, extra)
        })

        this.setState({voicePeers: peers.filter(p => this.connection.peers[p].extra.voiceJoined)})
        console.log(this.state.voicePeers)
    }

    toggleJoinVoice = (bool) => {
        let data = {
            id : this.connection.userid,
            username : this.props.username,
            voice: bool
        }
        this.connection.send(data)
        console.log(bool)
        this.connection.extra.voiceJoined = bool
        this.connection.updateExtraData()
        console.log(this.connection.extra)
        this.getVoiceJoinedPeers()
        this.setState({voiceStreaming: bool})
    }

    toggleMuteVoice = (b) => {
        this.setState({voiceMuted: b})
    }

    setVoiceSession = (session) => {
        this.setState({voiceSession: session})
        if (!session) {
            this.setState({voiceMuted: false})
        }
    }

    componentDidMount() {
        this.setRoomID()
        window.addEventListener("load", () => {
            // this.setState({videosContainer : document.getElementById('videos-container')})
            this.connection.videosContainer = document.getElementById('videos-container');
            console.log(this.connection.videosContainer)
            this.setState({videosContainer : this.connection.videosContainer})
        })
        this.connection.audiosContainer = document.getElementById('audios-container');
        console.log(this.props.username)
        this.getVoiceJoinedPeers()
    }

    render() {
        console.log(this.connection.extra)
        console.log(this.state.voicePeers)
        return (
            <React.Fragment>
                <div className="display-stream-container">
                    <div id='videos-container'>
                        <video controls></video>
                    </div>
                    <div id='audios-container'>
                        {/*<video id='audio-only'></video>*/}
                    </div>

                    <div className="room-buttons-desktop">
                        <button
                            onClick={() => {
                                this.toggleScreenShare()
                            }}
                        >Share Screen
                        </button>
                        <button onClick={this.exitRoom}>Exit</button>
                    </div>

                </div>

                <Card className="message-container">
                    <SessionAppBar exitRoom={this.exitRoom} changeContent={this.changeContent} {...this.state}/>

                    {(this.state.contentDisplay === "Stream Chat") &&
                        <React.Fragment>
                            <MessageList {...this.props} {...this.state}/>
                            <Card className="message-submit">
                                <form onSubmit={this.sendMessage}>
                                    <input type='text' id='message-input' placeholder="Send a message" autoComplete="off"/>
                                    <input type="submit" value="Send"/>
                                </form>
                            </Card>
                        </React.Fragment>
                    }

                    {(this.state.contentDisplay === "Voice Call") &&
                        <VoiceCall {...this.state}
                                   joinVoice={() => this.toggleJoinVoice(true)}
                                   endVoice={() => this.toggleJoinVoice(false)}
                                   toggleMuteVoice={(b) => this.toggleMuteVoice(b)}
                                   setVoiceSession={(s) => this.setVoiceSession(s)}
                                   {...this.props}
                        />
                    }

                </Card>
            </React.Fragment>
        )
    }

}

export default ScreenShareSession;
