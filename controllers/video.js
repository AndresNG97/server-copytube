const fs = require("fs");
const path = require("path");
const Video = require("../models/video");
const Usuario = require("../models/usuario");
const _ = require("underscore");
var mime = require("mime-types");
const sharp = require("sharp");

// Get Videos
function getVideos(req, res) {
  Video.find({})
    .skip(0)
    .limit(5)
    .exec((err, videoStored) => {
      Usuario.populate(videoStored, { path: "idUser" }, (err, videoStored) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }

        if (!videoStored) {
          return res.status(40).json({
            ok: false,
            err: {
              message: "No se ha encontrado ningun video"
            }
          });
        }

        res.json({
          ok: true,
          videoStored
        });
      });
    });
}

// Upload Videos
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
  }).exec(async (err, userStored) => {
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

      let thumbnailPath = `uploads/thumbnail/${idVideo}.${extensionThumbnail}`;
      let thumbnailPathResized = `uploads/thumbnail/resize/${idVideo}.${extensionThumbnail}`;
      let videoPath = `uploads/videos/${idVideo}.${extensionVideo}`;

      thumbnailFile.mv(thumbnailPath, err => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
      });

      sharp(thumbnailPath)
        .resize(720, 405, {
          fit: sharp.fit.fill
        })
        .toFile(thumbnailPathResized)
        .then(data => {
          fs.exists(thumbnailPath, exists => {
            if (exists) {
              fs.unlink(thumbnailPath, err => {
                if (err) {
                  return res.status(400).json({
                    ok: false,
                    err
                  });
                }
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });

      videoFile.mv(videoPath, err => {
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

function getThumbnail(req, res) {
  let idVideo = req.params.idVideo;

  Video.findById(idVideo, (err, videoStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "Error del servidor"
        }
      });
    }

    if (!videoStored) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Video no encontrado"
        }
      });
    }

    const { thumbnail } = videoStored;

    if (!thumbnail) {
      return res.sendFile(path.resolve("uploads/default/defaultAvatar.png"));
    }
    const filePath = "uploads/thumbnail/resize/" + thumbnail;
    fs.exists(filePath, exists => {
      if (!exists) {
        return res
          .status(404)
          .send({ message: "El thumbnail que buscas no existe." });
      } else {
        return res.sendFile(path.resolve(filePath));
      }
    });
  });
}

function getVideo(req, res) {
  let idVideo = req.params.idVideo;

  Video.findById(idVideo, (err, videoStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "Error del servidor"
        }
      });
    }

    if (!videoStored) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Video no encontrado"
        }
      });
    }

    const { videoname } = videoStored;

    const filePath = "uploads/videos/" + videoname;
    fs.exists(filePath, exists => {
      if (!exists) {
        return res
          .status(404)
          .send({ message: "El video que buscas no existe." });
      } else {
        return res.sendFile(path.resolve(filePath));
      }
    });
  });
}

function getVideoInfo(req, res) {
  let idVideo = req.params.idVideo;

  Video.findById(idVideo, (err, videoStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "Error del servidor"
        }
      });
    }

    if (!videoStored) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Video no encontrado"
        }
      });
    }

    res.json({
      ok: true,
      videoStored
    });
  });
}

module.exports = {
  getVideos,
  uploadVideo,
  getThumbnail,
  getVideo,
  getVideoInfo
};
