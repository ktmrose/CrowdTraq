const spotifyClient = require('../public/client');

let q = [];
let users = [];
let costModifier = 0;

const User = {

    userId: null,
    socket: null,
    tokens: 0,
}

let Song = {

    trackId: null, //string
    requestingUser: null, //User
    numLikes: 0,
    numDislikes: 0,
}

function getQLength() {
    return q.length;
}

function addUser(userID, websocket){

    let newUser = {
        userId: userID,
        socket: websocket
    }
    users.push(newUser);
}

function addSongToQ(trackID, user) {

    if (q.length < 1) { //free addition to q
        let newSong =
        {
            trackId: trackID,
            requestingUser: user
        }
        q.push(newSong)
        spotifyClient.pushSongToQ(newSong.trackId)
    } else {

        let cost = q.length + costModifier;
        if (user.tokens >= cost) {

        }
    }
}



