const express = require("express");
const app = express();
const ws = require('ws');
const crypto = require('crypto');
const gk = require("./public/scripts/gatekeeper");
const spotify = require("./public/scripts/client");
const notifier = require("./public/scripts/notifier")

const webSockets = {};
let displayClientSocket = "";

function updateDisplay(albumCover, trackName, artistName, qLength, qCost) {
    if (displayClientSocket !== undefined) {
        webSockets[displayClientSocket].send(JSON.stringify({
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
    const connectionId = crypto.randomBytes(8).toString('hex');
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

            displayClientSocket = clientData.UserId
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
            // user sends {"userID" : userID, "likesSong" : reaction}
            console.log("inside song reaction section...")
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

wsServer.broadcast = function (message) {
    console.log(message)
    for (const client of webSockets) {
        client.send(message)
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