app.component('dash-board', {
    props: {
        hasSubmitted: {
            type: Boolean,
            required: true
        }
    },
    data () {
        return {
            userId: 0,
            tokens: 10,
        }
    },
    template: 
    /*html*/
    `<div 
        :class="[ hasSubmitted ? 'hiddenComponent' : '' ]">
        <p> Tokens: {{this.tokens}}</p>
    </div>`,
    methods: {

    }
})