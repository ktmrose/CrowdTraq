const express = require("express");
const app = express();

// app.get("/", (req, res) => {
//     res.send("This is from express.js");
// });

// add middleware
app.use(express.static("public"));

// start express server on port 5000
app.listen(8081, () => {
    console.log("server started on port 8081");
});