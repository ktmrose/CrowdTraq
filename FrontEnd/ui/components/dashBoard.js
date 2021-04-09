app.component('dash-board', {
    props: {
        connection: {
            type: WebSocket,
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            tokens: 10,
            requestingSong: false,
            submittedFeedback: false
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
            <img src="./assets/vaporWaveNot.png"
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
            sendSongRequest(this.connection, this.userId, this.tokens, trackId)
        },

        hotBtnClick() {
            console.log("Hot button clicked")
            sendReaction(this.connection, this.userId, true)
        },

        notBtnClick() {
            console.log("Not button clicked")
            sendReaction(this.connection, this.userId, false)
        }
    }
})

function sendSongRequest (connection, userId, tokens, trackId) {

    let message = JSON.stringify({"userId" : userId, "tokens" : tokens, "trackID" : trackId})
    connection.send(message)
    console.log("Message sent: " + message)
}

function sendReaction (connection, userID, reaction) {
    let message = JSON.stringify({"userID" : userID, "likesSong" : reaction})
    console.log(connection)
    connection.send(message)
    console.log("Reaction sent: " + message)
}

