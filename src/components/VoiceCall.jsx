import React from "react";
import Fab from '@material-ui/core/Fab';
import CallIcon from '@material-ui/icons/Call';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import {makeOrJoinRoom} from "../methods";
import RTCMultiConnection from "rtcmulticonnection";

class VoiceCall extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.connection =
            this.props.voiceSession
            ? this.props.voiceSession
            : new RTCMultiConnection



        this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

        this.connection.session = {
            audio: true, // merely audio will be two-way, rest of the streams will be oneway
            video: false
        };

        this.connection.mediaConstraints = {
            audio: true,
            video: false
        }

        this.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false
        };

        this.connection.onopen = (event) => {
            console.log('WebRTC app opened!');
        };

        this.connection.onmessage = (event) => {
            // console.log(`${event.userid}: ${event.data}`)
            this.collectMessage(event.data)
        }

        this.connection.onstream = (event) => {
            console.log('onstream')
            this.setState({streaming: true})
            this.props.joinVoice()
        };

        this.connection.onstreamended = (event) => {
            // this.setState({streaming: false})
            console.log(event)
            var mediaElement = document.getElementById(event.streamid);
            if(mediaElement) {
                mediaElement.parentNode.removeChild(mediaElement);
            }
        };

        this.connection.onmute = (event) => {
            if (event.type === "local") {
                // console.log(event)
                event.mediaElement.muted = true
                this.props.toggleMuteVoice(true)
            } else {
                event.mediaElement.muted = true
            }
        }

        this.connection.onunmute = (event) => {
            if (event.type === "local") {
                // console.log(event)
                event.mediaElement.muted = true
                this.props.toggleMuteVoice(false)
            } else {
                event.mediaElement.muted = false
            }
        }

    }

    // handleJoinCall = () => {
    //     navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    //     var displayMediaStreamConstraints = {
    //         audio: {
    //             mandatory: {
    //                 echoCancellation: false, // disabling audio processing
    //                 googAutoGainControl: true,
    //                 googNoiseSuppression: true,
    //                 googHighpassFilter: true,
    //                 googTypingNoiseDetection: true,
    //             }
    //         }
    //     };
    //
    //     if (navigator.mediaDevices.getUserMedia(displayMediaStreamConstraints)) {
    //         navigator.mediaDevices.getUserMedia(displayMediaStreamConstraints)
    //             .then((stream1) => {
    //                 console.log(this.connection)
    //                 this.connection.addStream(stream1)
    //                 // this.connection.attachStreams.push(stream1)
    //                 console.log(this.connection.videosContainer)
    //                 console.log(stream1)
    //                 console.log(stream1.getVideoTracks())
    //                 console.log(stream1.getAudioTracks())
    //
    //                 // var audio = document.querySelector('audio')
    //                 // console.log(audio)
    //                 // audio.srcObject = stream1
    //                 // audio.play()
    //                 // audio.muted = 0
    //                 // audio.volume = 0
    //
    //                 console.log(this.connection)
    //                 return;
    //             })
    //     } else {
    //         alert("Only Chrome browser is supported at this time! :( ")
    //     }
    // }

    handleJoinCall = () => {
        if (!this.props.voiceSession) {
            makeOrJoinRoom(this.props.roomid + "-audio", this.connection, {audio: true})
            this.connection.addStream({
                audio: true,
                video: false
            })
            this.props.setVoiceSession(this.connection)
        }
    }

    handleEndCall = () => {
        //diconnect with all peers
        this.connection.getAllParticipants().forEach((pid) => {
            this.connection.disconnectWith(pid);
        });

        // stop all local cameras
        this.connection.attachStreams.forEach((localStream) => {
            console.log(localStream)
            localStream.stop();
        });

        // close socket.io connection
        this.connection.closeSocket();

        this.props.endVoice()
        this.props.setVoiceSession(null)
    }

    handleMute = () => {
        let localStream = this.connection.attachStreams[0]
        localStream.mute("audio")
        // this.props.toggleMuteVoice()
    }

    handleUnmute = () => {
        let localStream = this.connection.attachStreams[0]
        console.log(localStream)
        localStream.unmute("audio")
        // localStream.getAudioTracks()[0].enabled = false
        // this.connection.renegotiate()
        // console.log(this.connection.attachStreams)
        // console.log(this.connection.streamEvents.selectAll())
        // this.props.toggleMuteVoice()
    }

    render() {
        console.log(this.props)
        console.log(this.connection)
        console.log(this.connection.getAllParticipants())
        return (
            <React.Fragment>
                {!this.props.voiceStreaming
                    ?
                    <Fab variant="extended"
                         color="primary"
                         className="call-fab"
                         onClick={this.handleJoinCall}
                    >
                        <CallIcon/>
                        Join Call
                    </Fab>

                    :
                    <div>
                        <Fab variant="extended"
                             color="primary"
                             className="call-fab"
                             onClick={this.handleEndCall}
                        >
                            <CallEndIcon/>
                            End Call
                        </Fab>
                        {!this.props.voiceMuted
                            ?
                            <Fab
                                color="primary"
                                className="call-fab"
                                onClick={this.handleMute}
                            >
                                <MicIcon/>
                            </Fab>
                            :
                            <Fab
                                color="primary"
                                className="call-fab"
                                onClick={this.handleUnmute}
                            >
                                <MicOffIcon/>
                            </Fab>
                        }
                    </div>
                }

            </React.Fragment>
        )
    }
}

export default VoiceCall
