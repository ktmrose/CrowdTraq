const spotify = require("./client")
const notifier = require('./notifier')

class GateKeeper {
    constructor() {
        this.q = []
        this.users = []
        this.costModifier = 0;

        this.currentSongLikes = 0;
        this.currentSongDislikes = 0;
        this.currentSongUser = "";

        //TODO: add array with song cooldown timer
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
            return userId
        }
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i] === userId) {
                return this.users[i]
            }
        }
        console.log("Unidentified user: user not found in array")
        this.addUser(userId)
        return userId
    }

    addUser(userID){

        this.users.push(userID);
        console.log("User " + userID + " added")
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
            for (const song of this.q) {
                if (song.trackId === trackID) {
                    console.log("Song already in q")
                    return userTokens
                }
            }
            let newSong =
                {
                    trackId: trackID,
                    requestingUser: userId,
                }
            this.q.push(newSong)
            spotify.pushSongToQ(trackID)
            console.log(this.q)
            return userTokens-cost;
        }
    }
}
const instance = new GateKeeper();
notifier.on("gk-song-update", (trackID) => {
    if ( instance.q[0] !== undefined && instance.q[0].trackId === trackID) {
        const removedSong = instance.q.shift()
        notifier.emit("q-update")
        instance.currentSongUser = removedSong.requestingUser
        console.log("Song Id " + removedSong.trackId + " dequeued")
    } else {
        instance.currentSongUser = ""
    }
    instance.currentSongLikes = 0;
    instance.currentSongDislikes = 0;
})
module.exports =  instance;