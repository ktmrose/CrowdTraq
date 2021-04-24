const clientCreds = require("../../SpotifyAPIClientCredentials.json")

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
    }

    setTokens(accessToken, refreshToken, clientId) {
        this.access_token = accessToken;
        this.refresh_token = refreshToken;
        this.clientId = clientId
    }

    /**
     * Callback from requesting access and refresh tokens from Spotify.
     */
    handleAuthorizationResponse() {
        if (this.status === 200) {
            let data = JSON.parse(this.responseText);

            if (data.access_token !== undefined) {
                this.access_token = data.access_token;
            }
            if (data.refresh_token !== undefined) {
                this.refresh_token = data.refresh_token;
            }

        } else if (this.status === 401) {
            this.refreshAccessToken();

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
     * Refreshes access token
     */
    refreshAccessToken() {
        let body = "grant_type=refresh_token";
        body += "&refresh_token=" + this.refresh_token;
        body += "&client_id=" + this.clientId;
        this.callAuthorizationApi(body);
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
     * Callback verifying song addition.
     */
    handleSongAddition() {
        if (this.status === 204) {
            console.log("Check your queue to see if your song was added.");

        } else if (this.status === 404) {
            console.log("Device not found");

        } else if (this.status === 401) {
            this.refreshAccessToken();

        } else {
            console.log(this.responseText);
        }
    }

    /**
     * Adds a song with a valid Spotify track ID to the queue.
     * @param trackID unique Spotify track ID
     */
   pushSongToQ(trackID) {
        if (trackID !== undefined) {
            this.callSpotifyApi("POST", this.QUEUE + "?uri=spotify%3Atrack%3A" + trackID, null, this.handleSongAddition);
        }
    }

    /**
     * Developer message to check if Spotify successfully received a request when otherwise not expecting a response.
     */
    verifyRequestHandled() {
        if (this.status === 204) {
            console.log("ReQuEsT fUlLfIlLeD");
        } else if (this.status === 401) {
            this.refreshAccessToken();
        } else {
            console.log(this.responseText);
        }
    }

    /**
     * Parses JSON response from Spotify and verifies current player state
     */
    handleCurrentlyPlayingResponse() {
        if (this.status === 200) {
            let data = JSON.parse(this.responseText);
            console.log(data);
            if (data.item !== null) {
                //send this info to display
                // document.getElementById("albumImage").src = data.item.album.images[0].url
                // document.getElementById("trackTitle").innerHTML = data.item.name
                // document.getElementById("trackArtist").innerText = data.item.artists[0].name

                this.songDuration = data.item.duration_ms
                this.songProgression = data.progress_ms
                this.checkSongDuration();
            }

        } else if (this.status === 401) {
            this.refreshAccessToken();

        } else {
            console.log(this.responseText);
        }
    }

    /**
     * Plays if playback state is paused, otherwise pauses playback state
     */
    playPause() {
        this.callSpotifyApi("GET", this.PLAYBACKSTATE + "?market=US", null, this.handleCurrentlyPlayingResponse);
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
        this.callSpotifyApi("GET", this.PLAYBACKSTATE + "?market=US", null, this.handleCurrentlyPlayingResponse)
    }

    /**
     * Sets the song duration and resets timer
     */
    checkSongDuration() {
        let songEnd = new Date().getTime() + (this.songDuration - this.songProgression)
        this.songTimer = setInterval(function () {
            let now = new Date().getTime();
            let remainingTime = songEnd - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            var hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            // Display the result
            console.log(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

            if (remainingTime < 0) {
                clearInterval(this.songTimer);
                console.log("Song ended")
                this.callSpotifyApi("GET", this.PLAYBACKSTATE + "?market=US", null, this.handleCurrentlyPlayingResponse);
            }
        }, 1000);
    }
}

const instance = new SpotifyClient();
module.exports = instance;