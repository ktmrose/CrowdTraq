/**
 * Returns an instance of the user if the user exists. Otherwise throws error
 * @param usersArr the array of users as defines in gatekeeper.js
 * @param userId the hexadecimal userId that was assigned by the server upon establishment of WebSocket
 */

function getUser(usersArr, userId) {
    //a user has a websocket, userid, and tokens
    for (const user in usersArr) {
        if (user.userId === userId) {
            return user
        } else {
            console.log("Unidentified user: user not found in array")
        }
    }
}