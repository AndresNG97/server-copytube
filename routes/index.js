const express = require("express");
const app = express();

app.use(require("./usuario"));
app.use(require("./videos"));
app.use(require("./comments"));
app.use(require("./admin"));

module.exports = app;
