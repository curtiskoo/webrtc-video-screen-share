import React from "react";
import RTCMultiConnection from "rtcmulticonnection"
import io from "socket.io-client"

window.io = io;

class ScreenShareSession extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            videosContainer: null,
            roomid: null,
            screenCaptureStream: null,
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

        // Using getScreenId.js to capture screen from any domain
        // You do NOT need to deploy Chrome Extension YOUR-Self!!
        // this.connection.getScreenConstraints = (error, screen_constraints) => {
        //     // if (error) {
        //     //     return alert(error);
        //     // }
        //
        //     // this.getScreenStream(function(screen) {
        //     //     var isLiveSession = this.connection.getAllParticipants().length > 0;
        //     //     if (isLiveSession) {
        //     //         this.replaceTrack(RMCMediaTrack.screen);
        //     //     }
        //     //     // now remove old video track from "attachStreams" array
        //     //     // so that newcomers can see screen as well
        //     //     this.connection.attachStreams.forEach(function(stream) {
        //     //         stream.getVideoTracks().forEach(function(track) {
        //     //             stream.removeTrack(track);
        //     //         });
        //     //         // now add screen track into that stream object
        //     //         stream.addTrack(RMCMediaTrack.screen);
        //     //     });
        //     // });
        //
        //     navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        //     var displayMediaStreamConstraints = {
        //         video: true, // currently you need to set {true} on Chrome
        //         audio: true,
        //         screen: true,
        //     };
        //
        //     // this.connection.session.audio = true;
        //     // this.connection.session.video = true;
        //     if (navigator.mediaDevices.getDisplayMedia) {
        //         navigator.mediaDevices.getDisplayMedia(displayMediaStreamConstraints)
        //             .then((stream1) => {
        //                 console.log(this.connection)
        //                 // console.log(stream1)
        //                 // this.connection.addStream(stream1)
        //                 // // this.connection.attachStreams.forEach((stream) => {
        //                 // //     stream.addStream(stream1)
        //                 // // })
        //                 // console.log(this.connection)
        //                 // // console.log(this.state.videosContainer)
        //                 // // this.state.videosContainer.srcObject = stream1;
        //                 // // // this.state.videosContainer.appendChild(stream1);
        //                 // // console.log(this.state.videosContainer)
        //                 // var video = document.querySelector('video')
        //                 // video.src = stream1
        //                 // video.onloadedmetadata = () => {
        //                 //     video.play()
        //                 // }
        //                 // console.log(this.connection)
        //                 // console.log(this.connection)
        //
        //
        //                 this.connection.addStream(stream1)
        //                 // this.connection.attachStreams.push(stream1)
        //                 console.log(this.connection.videosContainer)
        //                 console.log(stream1)
        //                 console.log(stream1.getVideoTracks())
        //
        //                 var video = document.querySelector('video')
        //                 console.log(video)
        //                 video.srcObject = stream1
        //                 video.play()
        //
        //
        //
        //                 // this.connection.videosContainer.appendChild(stream1.getVideoTracks()[0]);
        //
        //                 // this.connection.addStream({
        //                 //     // screen: true,
        //                 //     // audio: true,
        //                 //     video: true,
        //                 //     // oneway: true,
        //                 // })
        //                 console.log(this.connection)
        //                 return;
        //             })
        //     } else {
        //         navigator.getDisplayMedia(displayMediaStreamConstraints)
        //             .then(stream => {
        //                 this.connection.session.audio = true;
        //                 this.connection.session.video = true;
        //
        //                 this.connection.addStream({
        //                     audio: true, // because session.audio==true, now it works
        //                     video: true, // because session.video==true, now it works
        //                     oneway: true
        //                 });
        //             })
        //     }
        // }


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
            navigator.getDisplayMedia(displayMediaStreamConstraints)
                .then(stream => {
                    this.connection.session.audio = true;
                    this.connection.session.video = true;

                    this.connection.addStream({
                        audio: true, // because session.audio==true, now it works
                        video: true, // because session.video==true, now it works
                        oneway: true
                    });
                })
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

        connection.onopen = function(event) {
            console.log('WebRTC app opened!');
        };
    }


    setRoomID = () => {
        let input = document.getElementById('roomid-input').value
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

    exitRoom = () => {
        console.log(this.state.screenCaptureStream)
        // this.connection.removeStream(this.state.screenCaptureStream.id)
        this.removePeerStreams(this.state.screenCaptureStream.id)
        this.state.screenCaptureStream.stop()
        this.connection.closeSocket()
        this.setState({roomid: null})
    }

    componentDidMount() {
        window.addEventListener("load", () => {
            // this.setState({videosContainer : document.getElementById('videos-container')})
            this.connection.videosContainer = document.getElementById('videos-container');
            console.log(this.connection.videosContainer)
            this.setState({videosContainer : this.connection.videosContainer})
        })
        this.connection.audiosContainer = document.getElementById('audios-container');
    }

    render() {

        return (
            <React.Fragment>
                {this.state.roomid
                    ?
                    <div>
                        This is the screen share feed
                        <div id='videos-container'>
                            <video controls></video>
                        </div>
                        <div id='audios-container'></div>
                        <button
                            onClick={() => {
                                this.toggleScreenShare()
                            }}
                        >Share Screen
                        </button>
                        <button onClick={this.exitRoom}>Exit</button>
                    </div>
                    :
                    <div>
                        <form onSubmit={this.setRoomID}>
                            <input type='text' id='roomid-input' placeholder="Enter a Room ID"/>
                            <input type="submit" value="Join Room" />
                        </form>
                    </div>
                }
            </React.Fragment>
        )
    }

}

export default ScreenShareSession;
