const express = require("express");
const app = express();
const ws = require('ws');

const wsServer = new ws.Server({noServer: true});
wsServer.on('connection', socket => {
    socket.on('message', message => console.log(message));
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