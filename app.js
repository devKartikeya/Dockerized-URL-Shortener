const app = require("express")();
const connectDB = require("./config/db");

app.use(require("express").json());
app.use(require("express").urlencoded({ extended: true }));

/* Mounting Router */
app.use("/url", require("./routes/urlRoutes"));

/* Connection with MongoDB */
connectDB();

/* HEALTHCHECK */
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime()
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});