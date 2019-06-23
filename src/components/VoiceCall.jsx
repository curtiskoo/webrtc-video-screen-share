import React from "react";
import Fab from '@material-ui/core/Fab';
import CallIcon from '@material-ui/icons/Call';
import {makeOrJoinRoom} from "../methods";
import RTCMultiConnection from "rtcmulticonnection";

class VoiceCall extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.connection = new RTCMultiConnection


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
        };

        this.connection.onstreamended = function(event) {
            var mediaElement = document.getElementById(event.streamid);
            if(mediaElement) {
                mediaElement.parentNode.removeChild(mediaElement);
            }
        };    }

    handleJoinCall = () => {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        var displayMediaStreamConstraints = {
            audio: {
                mandatory: {
                    echoCancellation: false, // disabling audio processing
                    googAutoGainControl: true,
                    googNoiseSuppression: true,
                    googHighpassFilter: true,
                    googTypingNoiseDetection: true,
                }
            }
        };

        if (navigator.mediaDevices.getUserMedia(displayMediaStreamConstraints)) {
            navigator.mediaDevices.getUserMedia(displayMediaStreamConstraints)
                .then((stream1) => {
                    console.log(this.connection)
                    this.connection.addStream(stream1)
                    // this.connection.attachStreams.push(stream1)
                    console.log(this.connection.videosContainer)
                    console.log(stream1)
                    console.log(stream1.getVideoTracks())
                    console.log(stream1.getAudioTracks())

                    // var audio = document.querySelector('audio')
                    // console.log(audio)
                    // audio.srcObject = stream1
                    // audio.play()
                    // audio.muted = 0
                    // audio.volume = 0

                    console.log(this.connection)
                    return;
                })
        } else {
            alert("Only Chrome browser is supported at this time! :( ")
        }
    }

    render() {
        return (
            <React.Fragment>
                <Fab variant="extended"
                     color="primary"
                     className="call-fab"
                     onClick={() => {
                         makeOrJoinRoom(this.props.roomid + "-audio", this.connection, {audio: true})
                         this.connection.addStream({
                             audio: true,
                             video: false
                         })
                     }}
                >
                    <CallIcon />
                    Join Call
                </Fab>
            </React.Fragment>
        )
    }
}

export default VoiceCall
