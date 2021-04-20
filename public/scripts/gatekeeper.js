class GateKeeper {
    constructor() {
        this.q = []
        this.users = []
        this.costModifier = 0;
    }

    getQLength() {
        if (this.q === undefined || this.q.length === 0) {
            //array empty or does not exist
            return 0;
        }
        return this.q.length;
    }

    getCost() {
        if (this.q === undefined || this.q.length === 0) {
            // array empty or does not exist
            return 0;
        }
        return (this.q.length + this.costModifier);
    }

    getUsers() {
        return this.users;
    }

    getUser(userId) {
        //a user has a websocket, userid, and tokens
        if (this.users === undefined ) {
            // array empty or does not exist
            console.log("user array undefined")
        }
        if (this.users.length === 0) {
            console.log("Adding first user")
            this.addUser(userId)
            console.log("User array after addition: " + this.users)
        }
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i] === userId) {
                return this.users[i]
            }
        }
        console.log("Unidentified user: user not found in array")
        this.addUser(userId)
        return userId;
    }

    addUser(userID){

        this.users.push(userID);
    }

    addSongToQ(trackID, user) {

        if (this.q.length < 1) { //free addition to q
            let newSong =
                {
                    trackId: trackID,
                    requestingUser: user,
                    numLikes: 0,
                    numDislikes: 0
                }
            this.q.push(newSong)
        } else {

            let cost = this.q.length + this.costModifier;
            if (user.tokens === undefined) {
                console.log("user.tokens is undefined")
            }
            if (user.tokens >= cost) {
                alert("cannot add song to queue")
            }
        }
    }
}

const instance = new GateKeeper();
module.exports =  instance;