let q = [];
let users = [];
let costModifier = 0;

function getQLength() {

    document.getElementById("qLength").innerText = q.length;
}

function getCost() {
    document.getElementById("addSongCost").innerText = (q.length + costModifier);
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
            requestingUser: user,
            numLikes: 0,
            numDislikes: 0
        }
        q.push(newSong)
        // pushSongToQ(newSong.trackId)
    } else {

        let cost = q.length + costModifier;
        if (user.tokens >= cost) {

        }
    }
}