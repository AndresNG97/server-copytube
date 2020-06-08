const express = require("express");
const UserController = require("../controllers/usuario");
const fileUpload = require("express-fileupload");
const api = express.Router();

const {
  verificaToken,
  verificaRefreshToken,
} = require("../middlewares/autenticacion");
const file = fileUpload({ useTempFiles: true });

api.use(express.urlencoded({ extended: false }));

// parse application/json
api.use(express.json());

api.post("/register", UserController.register);
api.post("/login", UserController.login);
api.put(
  "/updateAvatar/:idUser",
  verificaToken,
  [file],
  UserController.updateAvatar
);
api.get("/getAvatar/:idUser", UserController.getAvatar);
api.put("/updateAccount/:idUser", verificaToken, UserController.updateAccount);
api.get(
  "/getNewAccessToken",
  verificaRefreshToken,
  UserController.getNewAccessToken
);
api.get("/getUserInfo/:idUser", UserController.getUserInfo);

module.exports = api;
