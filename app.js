const express = require("express");
const app = express();


// add middleware
app.use(express.static("public"));

// start express server on port 5000
app.listen(8081, () => {
    console.log("server started on port 8081");

});