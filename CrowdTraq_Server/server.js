var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
    clientId: '527edd7fd9f84312adbbb2dbc4824e0c',
    clientSecret: 'c20f36a94444414d9b7ea33fd9a9b73c',
    redirectURL: 'http://localhost:8888/callback'
  });