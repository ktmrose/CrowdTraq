const app = Vue.createApp({
    data() {
        return {
            roomCodes: [
                { id: 0, name: 'Default', numUsers: 0} //add time of creation
            ],
            userId: 0,
            selectedRoomId: 0,
            hasSubmitted: false,
            connection: null
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
            this.clientHello('A new user has joined room')
        },
        clientHello(message) {
            // console.log(this.connection)
            this.connection.send(message)
        }
    },
    created: function () {
        console.log("Starting connection to WebSocket Server")
        this.connection = new WebSocket('ws://localhost:8081')
        this.connection.onmessage = function(event) {
            console.log(event)
        }
        this.connection.onopen = function(event) {
            console.log(event)
            console.log('Fontend connection to CrowdTraQ Server successful')
        }

        this.connection.onmessage = function(event) {
            console.log("Your assigned userID: " + event.data);
            this.userId = event.data
          }
    }
})
