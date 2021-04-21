const app = Vue.createApp({
    data() {
        return {
            roomCodes: [
                { id: 0, name: 'Default', numUsers: 0} //add time of creation
            ],
            userId: 0,
            selectedRoomId: 0,
            hasSubmitted: false,
            connection: null,
            tokens: 10
        }
    },
    methods: {
        addRoom(roomName) {
            roomCodes.push( {
                id: roomCodes.length,
                name: roomName,
                numUsers: 0
            })
        },
        joinRoom(index) {
            this.selectedRoomId = index
            this.hasSubmitted = true
            this.roomCodes[index].numUsers += 1
        }
    },
    created: function () {
        console.log("Starting connection to WebSocket Server")
        this.connection = new WebSocket('ws://localhost:8081')
        
        this.connection.onopen = function(event) {
            console.log('Fontend connection to CrowdTraQ Server successful')
        }

        this.connection.onmessage = function(event) {

            const message = JSON.parse(event.data)
            if (message.UserId !== undefined) {
                this.userId = message.UserId
                console.log("Your assigned userID: " + this.userId);
            } else if (message.Tokens !== undefined){

                this.tokens = message.Tokens
                console.log("Tokens: " + this.tokens)
            } else {
                console.log(message)
            }
          }
    }
})
