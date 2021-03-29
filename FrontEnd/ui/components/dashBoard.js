app.component('dashboard', {
    data () {
        return {
            userId: 0,
            tokens: 10,
        }
    },
    template: 
    /*html*/
    `<div class="dashBoard">DashBoard</div>`,
    methods: {
        dashBoardInit(index) {
            console.log("dashboardInit accessed")
            console.log(index)
        }
    }
})