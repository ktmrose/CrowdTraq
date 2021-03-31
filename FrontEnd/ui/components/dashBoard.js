app.component('dash-board', {
    data () {
        return {
            userId: 0,
            tokens: 10,
            requestingSong: false
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
                class="img">
            <p>HOT!</p>
        </div>
        <div class="img-col">
            <img src="./assets/vaporWaveNot.png"
                class="img">
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
        <add-song-form></add-song-form>
    </div>`,
    methods: {
        //displays html for song request
        songRequest() {
            this.requestingSong = true
        }
    }
})