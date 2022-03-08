const express = require("express");
const app = express();
const ws = require('ws');
const gk = require("./public/scripts/gatekeeper");
const spotify = require("./public/scripts/client");
const notifier = require("./public/scripts/notifier")

const webSockets = [];
let displaySocketIndex; //undefined until identified by client message

function updateDisplay(albumCover, trackName, artistName, qLength, qCost) {
    if (displaySocketIndex !== undefined) {
        webSockets[displaySocketIndex].send(JSON.stringify({
            "Q_length": qLength,
            "Cost": qCost,
            "Album_Cover": albumCover,
            "Track_Name": trackName,
            "Artist_Name": artistName
        }))
    }
}

//Responding to client events
const wsServer = new ws.Server({noServer: true});
wsServer.on('connection', socket => {

    //maps client ID per socket
    const connectionId = webSockets.length
    webSockets[connectionId] = socket;

    //send server generated client ID to client
    webSockets[connectionId].send(JSON.stringify({"UserId": connectionId}));
    socket.on('message', message => {
        if (message == null) return;

        //parse incoming message data
        let clientData;
        try {
            clientData = JSON.parse(message);
        } catch (e) {
            console.log(e);
        }

        //get the user's information currently on server
        console.log("User id: " + clientData.UserId)
        const currentUser = gk.getUser(clientData.UserId);

        //this comes from display
        if (clientData.hasOwnProperty("Access_Token") && clientData.hasOwnProperty("Refresh_Token")) {

            displaySocketIndex = clientData.UserId
            const accessToken = clientData.Access_Token
            const refreshToken = clientData.Refresh_Token
            spotify.setTokens(accessToken, refreshToken)
            notifier.emit("get-current-playback")
        }

        //determine if message is song request or song reaction
        if (clientData.hasOwnProperty("tokens")) {
            // user sends {"userId" : userId, "tokens" : tokens, "trackID" : trackId}
            const remainingTokens = gk.addSongToQ(clientData.trackID, currentUser, clientData.tokens)
            console.log("Remaining tokens: " + remainingTokens);
            updateDisplay(spotify.albumCover, spotify.songTitle, spotify.artistName, gk.getQLength(), gk.getCost())
            socket.send(JSON.stringify({"Tokens": remainingTokens}));

        } else if (clientData.hasOwnProperty("likesSong")) {
            gk.addReaction(clientData.likesSong)
        }
    });
})

//Responding to server events
notifier.on("song-update", (albumCover, songTitle, artistName) => {
    updateDisplay(albumCover, songTitle, artistName, gk.getQLength(), gk.getCost())
})

notifier.on("q-update", () => {
    updateDisplay(spotify.albumCover, spotify.songTitle, spotify.artistName, gk.getQLength(), gk.getCost())
})

notifier.on("reset-reactions", () => {
    //sends message to all clients
    wsServer.broadcast(JSON.stringify({"Push_State": 0})) //push state == 0; reset reactions
})

notifier.on("hot", (userId) => {
    console.log("This song was hot!" + userId)
    webSockets[userId].send(JSON.stringify({"Push_State": 1}))
})

/**
 * Error codes:
 * 0 - not enough tokens to add to queue
 * 1 - song already in queue
 */
notifier.on("error", (userId, code) => {
    console.log("Error " + code + ": Song already in q")
    webSockets[userId].send(JSON.stringify({"Error": code}))
})

wsServer.broadcast = function (message) {
    console.log(message)
    for (let i = 0; i < webSockets.length; i++) {
        webSockets[i].send(message)
    }
}

// start express server on port 8081
const server = app.listen(8081, () => {
    console.log("server started on port 8081");
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
        console.log("connection upgraded")
    });
});