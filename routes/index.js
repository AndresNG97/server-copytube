const express = require("express");
const app = express();

app.use(require("./usuario"));
app.use(require("./videos"));

module.exports = app;
