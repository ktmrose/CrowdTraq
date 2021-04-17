app.component('add-song-form', {
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
            this.$emit('song-submitted', this.trackId)
        }
    }
})

