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
    videoname: "",
    thumbnail: "",
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
    //Thumbnail info
    const thumbnailFile = req.files.thumbnail;
    const extensionThumbnail = mime.extension(thumbnailFile.mimetype);
    const extensionValidasThumbnail = ["png", "jpeg"];
    video.thumbnail = `${idVideo}.${extensionThumbnail}`;

    if (extensionValidasThumbnail.indexOf(extensionThumbnail) < 0) {
      return res.status(400).json({
        ok: false,
        err: {
          message:
            "La extension del video no es valido. (Extensiones permitidas: png, jpeg)"
        }
      });
    }

    //Video info
    const videoFile = req.files.video;
    const extensionVideo = mime.extension(videoFile.mimetype);
    const extensionValidasVideo = ["mp4", "avi"];
    video.videoname = `${idVideo}.${extensionVideo}`;

    if (extensionValidasVideo.indexOf(extensionVideo) < 0) {
      return res.status(400).json({
        ok: false,
        err: {
          message:
            "La extension del video no es valido. (Extensiones permitidas: mp4, avi)"
        }
      });
    }

    video.save((err, videoStored) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      thumbnailFile.mv(
        `uploads/thumbnail/${idVideo}.${extensionThumbnail}`,
        err => {
          if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
          }
        }
      );

      videoFile.mv(`uploads/videos/${idVideo}.${extensionVideo}`, err => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
      });

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
