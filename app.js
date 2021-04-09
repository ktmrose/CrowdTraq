const express = require("express");
const app = express();
const ws = require('ws');
const crypto = require('crypto');

let webSockets = {};

const wsServer = new ws.Server({noServer: true});
wsServer.on('connection', socket => {

    //maps client ID per socket
    const connectionId = crypto.randomBytes(8).toString('hex');
    webSockets[connectionId] = socket;

    //send server generated client ID to client
    webSockets[connectionId].send(connectionId)
    socket.on('message', message => {
        // console.log(message)

        //parse incoming message data
        const clientData = JSON.parse(message);
        console.log(clientData)

        //determine if message is song request or song reaction
        if (clientData.hasOwnProperty("tokens")) {
            //check token number and add to Q
            console.log("inside tokens section...")
        } else if (clientData.hasOwnProperty("likesSong")) {
            //functions to increase likes or dislikes of a song
            console.log("inside song reaction section...")
        }
    });
})

// add middleware
app.use(express.static("public"));

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