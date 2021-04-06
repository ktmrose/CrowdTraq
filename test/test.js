/**
 * This is a dummy client to test CrowdTraQ server's ability to upgrade connection to WebSocket connection
 * @type {WebSocket}
 */
const ws = require('ws');
const client = new ws('ws://localhost:8081');

client.on('open', () => {
  client.send('hElLo');
})