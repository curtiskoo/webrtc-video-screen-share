import React from "react";
import RTCMultiConnection from "rtcmulticonnection"
import io from "socket.io-client"
import MessageList from "./MessageList";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import {scrollToBottom} from "../methods";
import SessionAppBar from "./SessionAppBar";

window.io = io;

class ScreenShareSession extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            videosContainer: null,
            roomid: null,
            screenCaptureStream: null,
            messages: [],
        }

        this.connection = new RTCMultiConnection


        this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
        // this.connection.socketURL = 'http://localhost:9001/';
        // this.connection.socketURL = 'https://webrtcweb.com:9002/';

        this.connection.socketMessageEvent = 'audio-plus-screen-sharing-demo';
        this.connection.session = {
            audio: 'two-way', // merely audio will be two-way, rest of the streams will be oneway
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
            this.collectMessage(event.data)
        }

        this.connection.onstream = (event) => {
            console.log('onstream')
            if(event.type === 'remote' && !this.connection.session.video) {
                // document.getElementById('btn-add-video').disabled = false;
            }
            console.log(event.mediaElement)
            // var width = event.mediaElement.clientWidth || this.connection.videosContainer.clientWidth;
            // var mediaElement = getMediaElement(event.mediaElement,
            //     {
            //     title: event.userid,
            //     buttons: ['full-screen'],
            //     width: width,
            //     showOnMouseEnter: false
            // }
            // );
            // console.log(mediaElement)
            // console.log(this.connection.videosContainer)
            // console.log(event.stream.isScreen)
            // console.log(event)
            // console.log(this.connection)
            // this.connection.videosContainer.appendChild(event.mediaElement);

            var video = document.querySelector('video')
            console.log(video)
            video.srcObject = event.stream
            video.play()
            video.muted = false

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

     makeOrJoinRoom = (roomid) => {
        var connection = this.connection

        connection.session = {
            data: true
        };

        console.log('checking presence...');
        connection.checkPresence(roomid, function(roomExist, roomid) {
            console.log('Room exists=' + roomExist);
            if (roomExist === true) {
                console.log('I am a participant');
                connection.join(roomid);
            } else {
                console.log('I am the moderator');
                connection.open(roomid);
            }
        });
    }


    setRoomID = () => {
        let input = this.props.match.params.id
        console.log(input)
        this.setState({roomid: input})
        this.makeOrJoinRoom(input)
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
        console.log(peers)
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
    }

    render() {
        console.log(this.props)
        console.log(this.connection)
        console.log(this.state)
        return (
            <React.Fragment>
                <div className="display-stream-container">
                    <div id='videos-container'>
                        <video controls></video>
                    </div>
                    <div id='audios-container'></div>

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
                    <SessionAppBar exitRoom={this.exitRoom}/>
                    <MessageList {...this.props} {...this.state}/>
                    <Card className="message-submit">
                        <form onSubmit={this.sendMessage}>
                            <input type='text' id='message-input' placeholder="Send a message" autoComplete="off"/>
                            <input type="submit" value="Send"/>
                        </form>
                    </Card>
                </Card>
            </React.Fragment>
        )
    }

}

export default ScreenShareSession;
