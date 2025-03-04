// Express ap

const express = require("express");
const app = express();
app.use(express.json());

// File system
const fs = require("fs");

// Proxy paths
app.use("/", express.static("./public"));

app.get("/login", (req, res) => {
    let doc = fs.readFileSync("./public/pages/login.html", "utf8");
    res.send(doc);
})

app.listen(8000);