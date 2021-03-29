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
            console.log("Room ID: " + this.roomCodes[index].id)
            this.$emit("to-dashboard", this.roomCodes[index].id)
            let roomCodeDisplay = document.getElementById("room_code_display")
            if (roomCodeDisplay.style.display !== "none") {
                roomCodeDisplay.style.display = "none"
            }
        }
    }
})
