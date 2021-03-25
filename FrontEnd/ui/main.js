const app = Vue.createApp({
    data() {
        return {
            roomCodes: [
                { id: 0, name: 'Default', numUsers: 0} //add time of creation
            ],
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

            console.log("you've joined the " + this.roomCodes[index].name + " room")
        }
    }
})
