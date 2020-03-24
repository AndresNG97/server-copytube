const fs = require("fs");
const path = require("path");
const Video = require("../models/video");
const Usuario = require("../models/usuario");
const _ = require("underscore");
var mime = require("mime-types");

// Registro usuario
function uploadVideo(req, res) {
  let idUser = req.params.idUser;
  let body = req.body;

  let video = new Video({
    title: body.title,
    description: body.description,
    thumbnail: body.thumbnail,
    idUser
  });

  Usuario.findById(idUser, {
    new: true
  }).exec((err, userStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!userStored) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado"
        }
      });
    }

    if (!req.files) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No se ha seleccionado ningun video"
        }
      });
    }
    const idVideo = video._id;
    const videoFile = req.files.video;
    const extension = mime.extension(videoFile.mimetype);
    const extensionValidas = ["mp4", "avi"];
    console.log(extension);
    if (extensionValidas.indexOf(extension) < 0) {
      return res.status(400).json({
        ok: false,
        err: {
          message:
            "La extension del video no es valido. (Extensiones permitidas: mp4, avi)"
        }
      });
    }

    videoFile.mv(`uploads/videos/${idVideo}.${extension}`, err => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
    });

    video.save((err, videoStored) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        videoStored
      });
    });
  });
}

module.exports = {
  uploadVideo
};
