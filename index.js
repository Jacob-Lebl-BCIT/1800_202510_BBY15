// Express app - Snotes web application server

const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;

// File system for reading HTML files
const fs = require("fs");

// Static file serving
app.use("/", express.static("./public"));
app.use("/scripts", express.static("./scripts"));
app.use("/land", express.static("./public/pages/landingpage.html"));

// Route handler for login page
app.get("/login", (req, res) => {
    let doc = fs.readFileSync("./public/pages/login.html", "utf8");
    res.send(doc);
})

// Start server on port 8000
app.listen(PORT);