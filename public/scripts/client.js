const clientCreds = require("../../SpotifyAPIClientCredentials.json")
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const btoa = require('btoa');
const notifier = require("./notifier")

class SpotifyClient {
    constructor() {
        this.access_token = null;
        this.refresh_token = null;
        this.clientId = clientCreds.ClientID;
        this.clientSec = clientCreds.ClientSec;

        // Spotify API endpoints used in this app
        this.TOKEN = "https://accounts.spotify.com/api/token";
        this.PLAY = "https://api.spotify.com/v1/me/player/play";
        this.QUEUE = "https://api.spotify.com/v1/me/player/queue";
        this.SKIP = "https://api.spotify.com/v1/me/player/next";
        this.PLAYBACKSTATE = "https://api.spotify.com/v1/me/player";
        this.PAUSE = "https://api.spotify.com/v1/me/player/pause";

        // timing variables
        this.isPlaying = false;
        this.songDuration = 0;
        this.songProgression = 0;
        this.songTimer = null;
        this.albumCover = "";
        this.songTitle = "";
        this.artistName = "";

        if (this.isPlaying) {
            this.callSpotifyApi("GET", this.PLAYBACKSTATE + "?market=US", null, handleCurrentlyPlayingResponse);
        }
    }

    setTokens(accessToken, refreshToken) {
        this.access_token = accessToken;
        this.refresh_token = refreshToken;
    }

    /**
     * Callback from requesting access and refresh tokens from Spotify.
     */
    handleAuthorizationResponse() {
        if (this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log(data)

            if (data.access_token !== undefined) {
                this.access_token = data.access_token;
            }
            if (data.refresh_token !== undefined) {
                this.refresh_token = data.refresh_token;
            }

        } else if (this.status === 401) {
            refreshAccessToken();

        } else {
            console.log(this.responseText);
        }
    }

    /**
     * Requests access token from Spotify's authorization endpoint.
     * @param body includes necessary params to get access token from Spotify.
     */
    callAuthorizationApi(body) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.TOKEN, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.clientId + ":" + this.clientSec));
        xhr.send(body);
        xhr.onload = this.handleAuthorizationResponse;
    }


    /**
     * Generic method to handle Spotify API requests
     * @param method "POST", "PUT", "GET"
     * @param url Spotify end point. Don't forget to include any (required) query params here.
     * @param body Nullable stringified JSON object
     * @param callback after Spotify request is completed
     */
    callSpotifyApi(method, url, body, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.access_token);
        xhr.send(body);
        xhr.onload = callback;
    }

    /**
     * Adds a song with a valid Spotify track ID to the queue.
     * @param trackID unique Spotify track ID
     */
   pushSongToQ(trackID) {
        if (trackID !== undefined) {
            this.callSpotifyApi("POST", this.QUEUE + "?uri=spotify%3Atrack%3A" + trackID, null, handleSongAddition);
        }
    }

    /**
     * Developer message to check if Spotify successfully received a request when otherwise not expecting a response.
     */
    verifyRequestHandled() {
        if (this.status === 204) {
            console.log("ReQuEsT fUlLfIlLeD");
        } else if (this.status === 401) {
            refreshAccessToken();
        } else {
            console.log(this.responseText);
        }
    }

    /**
     * Plays if playback state is paused, otherwise pauses playback state
     */
    playPause() {
        this.callSpotifyApi("GET", this.PLAYBACKSTATE + "?market=US", null, handleCurrentlyPlayingResponse);
        if (this.isPlaying) {
            this.callSpotifyApi("PUT", this.PAUSE, null, this.verifyRequestHandled());
            this.isPlaying = false;
        } else {
            this.callSpotifyApi("PUT", this.PLAY, null, this.verifyRequestHandled());
            this.isPlaying = true;
        }
    }

    /**
     * Skips a song if playback state is playing
     */
    skipSong() {
        clearInterval(this.songTimer);
        this.callSpotifyApi("POST", this.SKIP, null, this.verifyRequestHandled)
        this.callSpotifyApi("GET", this.PLAYBACKSTATE + "?market=US", null, handleCurrentlyPlayingResponse)
    }

}

notifier.on("get-current-playback", () => {
    instance.callSpotifyApi("GET", instance.PLAYBACKSTATE + "?market=US", null, handleCurrentlyPlayingResponse);
})

let instance = new SpotifyClient();

/**
 * Refreshes access token
 */
function refreshAccessToken() {
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + instance.refresh_token;
    body += "&client_id=" + instance.clientId;
    instance.callAuthorizationApi(body);
}


/**
 * Callback verifying song addition.
 */
function handleSongAddition() {
    if (this.status === 204) {
        console.log("Check your queue to see if your song was added.");

    } else if (this.status === 404) {
        console.log("Device not found");

    } else if (this.status === 401) {
        refreshAccessToken();

    } else {
        console.log(this.responseText);
    }
}


/**
 * Sets the song duration and resets timer
 */
function checkSongDuration() {
    let songEnd = new Date().getTime() + (instance.songDuration - instance.songProgression)
    instance.songTimer = setInterval(function () {
        let now = new Date().getTime();
        let remainingTime = songEnd - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        var hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        // Display the result
        // console.log(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

        if (remainingTime < 0) {
            clearInterval(instance.songTimer);
            console.log("Song ended")
            instance.callSpotifyApi("GET", instance.PLAYBACKSTATE + "?market=US", null, handleCurrentlyPlayingResponse);
        }
    }, 1000);
}

/**
 * Parses JSON response from Spotify and verifies current player state
 */
function handleCurrentlyPlayingResponse() {
    if (this.status === 200) {
        let data = JSON.parse(this.responseText);
        if (data.item !== null) {
            //send this info to display
            instance.albumCover = data.item.album.images[0].url
            instance.songTitle = data.item.name
            instance.artistName = data.item.artists[0].name
            notifier.emit("song-update", instance.albumCover, instance.songTitle, instance.artistName)

            instance.songDuration = data.item.duration_ms
            instance.songProgression = data.progress_ms
            checkSongDuration();
        }

    } else if (this.status === 401) {
        refreshAccessToken();

    } else {
        console.log(this.responseText);
    }
}

module.exports = instance;