const express = require("express");
const UserController = require("../controllers/usuario");
const fileUpload = require("express-fileupload");
const api = express.Router();

const { verificaToken } = require("../middlewares/autenticacion");
const upload_avatar = fileUpload({ useTempFiles: true });

api.use(express.urlencoded({ extended: false }));

// parse application/json
api.use(express.json());

api.post("/register", UserController.register);
api.post("/login", UserController.login);
api.put(
  "/updateAvatar",
  verificaToken,
  [upload_avatar],
  UserController.updateAvatar
);
api.put("/updateAccount/:id", verificaToken, UserController.updateAccount);

module.exports = api;
