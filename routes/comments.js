const express = require("express");
const CommentsController = require("../controllers/comments");
const api = express.Router();

const { verificaToken } = require("../middlewares/autenticacion");

api.use(express.urlencoded({ extended: false }));

// parse application/json
api.use(express.json());

api.post("/uploadComment", verificaToken, CommentsController.uploadComment);
api.get("/getComment/:idVideo", CommentsController.getComment);

module.exports = api;
