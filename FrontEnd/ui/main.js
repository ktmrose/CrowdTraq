const app = Vue.createApp({
    data() {
        return {
            roomCodes: [
                { id: 0, name: 'Default', numUsers: 0} //add time of creation
            ],
            selectedRoomId: 0,
            hasSubmitted: false
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

            let roomCodeDisplay = document.getElementById("room_code_display")
            this.selectedRoomId = index
            this.hasSubmitted = true
            this.roomCodes[index].numUsers += 1
            // if (roomCodeDisplay.style.display !== "none") {
            //     roomCodeDisplay.style.display = "none"
            // }

        }
    },
    computed: {
        getHasSubmitted() {
            return hasSubmitted;
        }
    }
})
