const app = require("express")();

app.use(require("express").json());
app.use(require("express").urlencoded({ extended: true }));

/* Mounting Router */
app.use("/url", require("./routes/urlRoutes"));

/* Connection with MongoDB */
require("./config/db").connectDB();

app.listen(3000, () => {
    console.log("Server running on port 3000");
});