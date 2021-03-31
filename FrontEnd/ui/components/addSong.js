app.component('add-song-form', {
    data () {
        return {
            trackId: null
        }
    },
    template:
    /*html*/
    `<p>Enter Spotify track Id:</p>
    <label for="track">Track Id:</label>
    <input id="track-id" v-model="trackId">
    <button 
        class="button"
        v-on:click="submitSongRequest">
        Put in Q</button>`,
    methods: {
        submitSongRequest() {

        }
    }
})