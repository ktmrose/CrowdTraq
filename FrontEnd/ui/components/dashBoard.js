app.component('dash-board', {
    data () {
        return {
            userId: 0,
            tokens: 10,
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
    <button
        class="button">Add song</button>`,
    methods: {

        //handle button clicks
    }
})