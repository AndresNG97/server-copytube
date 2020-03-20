const express = require("express");
const UserController = require("../controllers/usuario");

const api = express.Router();
api.use(express.urlencoded({ extended: false }));

// parse application/json
api.use(express.json());

api.post("/register", UserController.register);
api.post("/login", UserController.login);

module.exports = api;
