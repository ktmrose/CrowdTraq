const express = require("express");
const app = express();
const ws = require('ws');
const crypto = require('crypto');
const gk = require("./public/scripts/gatekeeper");
const spotify = require("./public/scripts/client");

const webSockets = {};
let displayClientSocket = "";

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
        console.log("User id: " + clientData.userId)
        const currentUser = gk.getUser(clientData.userId);

        //if client is display dashboard, property "displaySuccess indicates state of display
        if (clientData.hasOwnProperty("displaySuccess")){
            const successCode = clientData.displaySuccess;
            switch (successCode) {
                case 0:
                    // const url = spotify.requestAuthorization();
                    // socket.send(JSON.stringify({"authUrl": url}))
                    // break;
                case 1: //Spotify auth success;
                    console.log("authorization success")
            }
            // const url = spotify.requestAuthorization();
        }
        if (clientData.hasOwnProperty("Access_Token") && clientData.hasOwnProperty("Refresh_Token")) {

            console.log(clientData)
            displayClientSocket = clientData.UserId
            const accessToken = clientData.Access_Token
            const refreshToken = clientData.Refresh_Token
            spotify.setTokens(accessToken, refreshToken, clientData.Client_ID)
        }

        //determine if message is song request or song reaction
        if (clientData.hasOwnProperty("tokens")) {
            // user sends {"userId" : userId, "tokens" : tokens, "trackID" : trackId}
            const remainingTokens = gk.addSongToQ(clientData.trackID, currentUser, clientData.tokens)
            console.log("Remaining tokens: " + remainingTokens);
            socket.send(JSON.stringify({"Tokens": remainingTokens}));

        } else if (clientData.hasOwnProperty("likesSong")) {
            // user sends {"userID" : userID, "likesSong" : reaction}
            console.log("inside song reaction section...")
        }
    });
})

// start express server on port 8081
const server = app.listen(8081, () => {
    console.log("initializing Spotify client");
    console.log("server started on port 8081");
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
        console.log("connection upgraded")
    });
});