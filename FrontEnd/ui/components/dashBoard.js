app.component('dash-board', {
    props: {
        connection: {
            type: WebSocket,
            required: true
        },
        tokens: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            // tokens: 10,
            requestingSong: false,
            submittedFeedback: false,
        }
    },
    template: 
    /*html*/
    `<p> Tokens: {{this.tokens}}</p>
    <div
        class="img-row">
        <p>How do you like the currently playing song?</p>
        <div class="img-col">
            <img src="./assets/vaporwaveFlameClear.png" 
                class="img"
                v-on:click="hotBtnClick">
            <p>HOT!</p>
        </div>
        <div class="img-col">
            <img src="./assets/VaporWaveNot.png"
                class="img"
                v-on:click="notBtnClick">
            <p>NOT!</p>
        </div>
        
    </div>
    <div
        v-if="!requestingSong">
        <button
        class="button"
        v-on:click="songRequest">Add song
    </button>
    </div>
    <div 
        class="addSongForm"
        v-else>
        <add-song-form @song-submitted="unrequestSongForm"></add-song-form>
    </div>`,
    methods: {
        //displays html for song request
        songRequest() {
            this.requestingSong = true
        },

        unrequestSongForm(trackId) {
            //sends user information to server and hides form
            this.requestingSong = false
            sendSongRequest(this.connection, this.tokens, trackId)
        },

        hotBtnClick() {
            console.log("Hot button clicked")
            sendReaction(this.connection,  true)
        },

        notBtnClick() {
            console.log("Not button clicked")
            sendReaction(this.connection, false)
        }
    }
})

function sendSongRequest (connection, tokens, trackId) {

    let message = JSON.stringify({"userId" : connection.userId, "tokens" : tokens, "trackID" : trackId})
    // console.log("userId: " + userId);
    connection.send(message)
    console.log("Message sent: " + message)
}

function sendReaction (connection, reaction) {
    let message = JSON.stringify({"userID" : connection.userId, "likesSong" : reaction})
    // console.log(connection)
    connection.send(message)
    console.log("Reaction sent: " + message)
}



