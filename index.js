// Express ap

const express = require("express");
const app = express();
app.use(express.json());

// File system
const fs = require("fs");

// Proxy paths
app.use("/", express.static("./public"));

app.listen(8000);