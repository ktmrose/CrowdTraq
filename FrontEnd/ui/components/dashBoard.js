app.component('dash-board', {
    data () {
        return {
            userId: 0,
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
        <add-song-form :tokens="tokens" :userId="userId" @song-submitted="unrequestSongForm"></add-song-form>
    </div>`,
    methods: {
        //displays html for song request
        songRequest() {
            this.requestingSong = true
        },

        unrequestSongForm(trackId) {
            //sends user information to server and hides form
            this.requestingSong = false
            sendSongRequest(this.userId, this.tokens, trackId)
        },

        hotBtnClick() {
            console.log("Hot button clicked")
        },

        notBtnClick() {
            console.log("Not button clicked")
        }
    }
})

function sendSongRequest (userId, tokens, trackId) {

    let url = "http://localhost:8081/"
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Content-Type", "application/json")
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(this.responseText)
    }
    var data = JSON.stringify({"UserId" : userId, "Tokens" : tokens, "TrackId" : trackId})
    xhr.send(data)
}

