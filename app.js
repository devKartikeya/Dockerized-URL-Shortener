const express = require("express");
const connectDB = require("./config/db");
const urlRouter = require("./routes/urlRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/url", urlRouter);

connectDB();

app.get("/", (req, res) => {
    res.send("Docker URL Shortener API");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});