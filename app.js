const express = require("express");
const connectDB = require("./db");

const app = express();

connectDB();

app.get("/", (req, res) => {
    res.send("Docker URL Shortener API");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});