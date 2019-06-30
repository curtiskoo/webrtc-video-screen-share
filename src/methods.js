//This is a methods file for multi-purpose re-use

export function scrollToBottom(id) {
    let elem = document.getElementById(id)
    elem.scrollTop = elem.scrollHeight
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function waitForElement(id, callback){
    var poops = setInterval(function(){
        if(document.getElementById(id)){
            clearInterval(poops);
            callback();
        }
    }, 100);
}

// RTC related functions

export function makeOrJoinRoom(roomid, connection, sessionParams) {
    connection.session = sessionParams

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