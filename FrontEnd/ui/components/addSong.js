app.component('add-song-form', {
    props: {
        tokens: {
            type: Number,
            required: true
        }

    },
    data () {
        return {
            trackId: ""
        }
    },
    template:
    /*html*/
    `<p>Enter Spotify track Id:</p>
    <label for="track">Track Id:</label>
    <input id="trackId" v-model="trackId">
    <button 
        class="button"
        v-on:click="submitSongRequest">
        Put in Q</button>`,
    methods: {
        submitSongRequest() {

            if (this.trackId === "") {
                alert("Please enter Spotify track Id.")
                return
            }
            console.log(this.trackId)
            this.$emit('song-submitted')
        }
    }
})

function postXML(userId, tokens, trackId) {

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