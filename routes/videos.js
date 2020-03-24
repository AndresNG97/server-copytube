const express = require("express");
const VideoController = require("../controllers/video");
const fileUpload = require("express-fileupload");
const api = express.Router();

const { verificaToken } = require("../middlewares/autenticacion");
const upload_thumbnail = fileUpload({ useTempFiles: true });

api.use(express.urlencoded({ extended: false }));

// parse application/json
api.use(express.json());

api.post(
  "/uploadVideo/:idUser",
  verificaToken,
  [upload_thumbnail],
  VideoController.uploadVideo
);

module.exports = api;
