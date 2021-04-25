const spotify = require("./client")
const notifier = require('./notifier')

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

    getUser(userId) {
        if (this.users === undefined ) {
            // array empty or does not exist
            console.log("user array undefined")
        }
        if (this.users.length === 0) {
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
    }

    addUser(userID){

        this.users.push(userID);
    }

    /**
     *
     * @param Spotify trackID
     * @param userId
     * @param userTokens
     * @returns Number of tokens remaining to user
     */
    addSongToQ(trackID, userId, userTokens) {

        let cost = this.q.length + this.costModifier;
        if (userTokens === undefined) {
            console.log("user.tokens is undefined")
            return userTokens;
        } else if (userTokens < cost) {
            console.log("too few tokens to add to q")
            return userTokens;
        } else {
            let newSong =
                {
                    trackId: trackID,
                    requestingUser: userId,
                    numLikes: 0,
                    numDislikes: 0
                }
            this.q.push(newSong)
            spotify.pushSongToQ(trackID)
            console.log(this.q)
            return userTokens-cost;
        }
    }
}

const instance = new GateKeeper();
module.exports =  instance;