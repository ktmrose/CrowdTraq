const express = require("express");
const app = express();
const ws = require('ws');
const crypto = require('crypto');
const gk = require("./public/scripts/gatekeeper");

const webSockets = {};

const wsServer = new ws.Server({noServer: true});
wsServer.on('connection', socket => {

    //maps client ID per socket
    const connectionId = crypto.randomBytes(8).toString('hex');
    webSockets[connectionId] = socket;

    //send server generated client ID to client
    webSockets[connectionId].send(connectionId)
    socket.on('message', message => {
        if (message == null) return;

        //parse incoming message data
        const clientData = JSON.parse(message);

        //get the user's information currently on server
        console.log("User id: " + clientData.userID)
        let users = gk.getUsers();
        let currentUser = gk.getUser(clientData.userID);
        console.log("Current users: " + users);
        console.log("Current user: " + currentUser);

        console.log("Data: " + JSON.stringify(clientData))

        //determine if message is song request or song reaction
        if (clientData.hasOwnProperty("tokens")) {
            // user sends {"userId" : userId, "tokens" : tokens, "trackID" : trackId}
            console.log("inside tokens section...")
        } else if (clientData.hasOwnProperty("likesSong")) {
            // user sends {"userID" : userID, "likesSong" : reaction}
            console.log("inside song reaction section...")
        }
    });
})

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