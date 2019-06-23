import React from "react";
import Fab from '@material-ui/core/Fab';
import CallIcon from '@material-ui/icons/Call';

class VoiceCall extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.connection = this.props.connection
    }

    handleJoinCall = () => {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        var displayMediaStreamConstraints = {
            audio: true,
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

                    var audio = document.querySelector('audio')
                    console.log(audio)
                    // video.srcObject = stream1
                    // video.play()
                    // video.muted = true

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
                     onClick={this.handleJoinCall}
                >
                    <CallIcon />
                    Join Call
                </Fab>
            </React.Fragment>
        )
    }
}

export default VoiceCall
