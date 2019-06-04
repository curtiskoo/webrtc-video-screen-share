import React from "react";
import RTCMultiConnection from "rtcmulticonnection"
import getMediaElement from "getmediaelement"
import getScreenConstraints from "webrtc-screen-capturing"
import io from "socket.io-client"

window.io = io;
// socket.on('initiate', () => {
//     this.getScreenConstraints();
// })

var RMCMediaTrack = {
    cameraStream: null,
    cameraTrack: null,
    screen: null
};

var roomid = "1234"

class ScreenShareSession extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            videosContainer: null,
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

                    var video = document.querySelector('video')
                    console.log(video)
                    video.srcObject = stream1
                    video.play()

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


    getScreenStream = (callback) => {
        var screen_constraints = {
            video: true, // currently you need to set {true} on Chrome
            audio: true,
            screen: true,
        };
        navigator.mediaDevices.getDisplayMedia(screen_constraints).then(function(screen) {
            RMCMediaTrack.screen = screen.getVideoTracks()[0];
            RMCMediaTrack.selfVideo.srcObject = screen;
            // in case if onedned event does not fire
            (function looper() {
                // readyState can be "live" or "ended"
                if (RMCMediaTrack.screen.readyState === 'ended') {
                    RMCMediaTrack.screen.onended();
                    return;
                }
                setTimeout(looper, 1000);
            })();
            var firedOnce = false;
            RMCMediaTrack.screen.onended = RMCMediaTrack.screen.onmute = RMCMediaTrack.screen.oninactive = function() {
                if (firedOnce) return;
                firedOnce = true;
                if (RMCMediaTrack.cameraStream.getVideoTracks()[0].readyState) {
                    RMCMediaTrack.cameraStream.getVideoTracks().forEach(function(track) {
                        RMCMediaTrack.cameraStream.removeTrack(track);
                    });
                    RMCMediaTrack.cameraStream.addTrack(RMCMediaTrack.cameraTrack);
                }
                RMCMediaTrack.selfVideo.srcObject = RMCMediaTrack.cameraStream;
                this.connection.socket && this.connection.socket.emit(this.connection.socketCustomEvent, {
                    justStoppedMyScreen: true,
                    userid: this.connection.userid
                });
                // share camera again
                this.replaceTrack(RMCMediaTrack.cameraTrack);
                // now remove old screen from "attachStreams" array
                this.connection.attachStreams = [this.connection.cameraStream];
                // so that user can share again
            };
            this.connection.socket && this.connection.socket.emit(this.connection.socketCustomEvent, {
                justSharedMyScreen: true,
                userid: this.connection.userid
            });
            callback(screen);
        });
    }


    replaceTrack = (videoTrack) => {
        if (!videoTrack) return;
        if (videoTrack.readyState === 'ended') {
            alert('Can not replace an "ended" track. track.readyState: ' + videoTrack.readyState);
            return;
        }
        this.connection.getAllParticipants().forEach(function(pid) {
            var peer = this.connection.peers[pid].peer;
            if (!peer.getSenders) return;
            var trackToReplace = videoTrack;
            peer.getSenders().forEach(function(sender) {
                if (!sender || !sender.track) return;
                if (sender.track.kind === 'video' && trackToReplace) {
                    sender.replaceTrack(trackToReplace);
                    trackToReplace = null;
                }
            });
        });
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


    componentDidMount() {
        this.makeOrJoinRoom(roomid)
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
        <div>
            This is the screen share feed
            <div id='videos-container'>
                <video></video>
            </div>
            <div id='audios-container'></div>
            <button
                onClick={() => {
                    this.toggleScreenShare()
                    // this.connection.session.audio = true;
                    // this.connection.session.video = true;
                    //
                    // this.connection.addStream({
                    //     audio: true, // because session.audio==true, now it works
                    //     video: true, // because session.video==true, now it works
                    //     oneway: true
                    // });
                    // var roomid = "1234"

                    // this.connection.open(roomid, function(isRoomOpened, roomid, error) {
                    // });
                    // console.log(this.connection)
                    // console.log(this.connection.checkPresence("1234"))


                    // this.connection.openOrJoin(roomid, (isRoomCreated, roomid, error) => {
                    //     if (this.connection.isInitiator === true) {
                    //         console.log("opened room")
                    //     } else {
                    //         console.log("joined room")
                    //     }
                    // });

                    // this.connection.open(roomid)

                    // this.connection.checkPresence(roomid, (isRoomExist, roomid) => {
                    //     if (isRoomExist === true) {
                    //         console.log("joined room")
                    //         this.connection.join(roomid);
                    //     } else {
                    //         console.log("opened room")
                    //         this.connection.open(roomid);
                    //     }
                    // });

                    // this.connection.session.audio = true;
                    // this.connection.session.video = true;
                    //
                    // this.connection.addStream({
                    //     audio: true, // because session.audio==true, now it works
                    //     video: true, // because session.video==true, now it works
                    //     oneway: true
                    // });
                }}
            >Press me!</button>
        </div>
        )
    }

}

export default ScreenShareSession;
