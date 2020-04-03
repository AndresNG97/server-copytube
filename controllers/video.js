const Video = require("../models/video");
const Usuario = require("../models/usuario");
const _ = require("underscore");
var mime = require("mime-types");
const sharp = require("sharp");
const awsUploadImage = require("../middlewares/awsUploadImage");
const awsUploadVideo = require("../middlewares/awsUploadVideo");
const awsDeleteItems = require("../middlewares/awsDeleteItems");

function getVideos(req, res) {
  const { page, search } = req.query;

  const options = {
    page,
    limit: 10,
    populate: {
      path: "idUser",
      select: "name lastname"
    }
  };

  Video.paginate(
    { title: { $regex: search, $options: "i" } },
    options,
    (err, videoStored) => {
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
        ...videoStored
      });
    }
  );
}

function getVideosUser(req, res) {
  const { page } = req.query;
  const idUser = req.params.idUser;

  const options = {
    page,
    limit: 10,
    populate: {
      path: "idUser",
      select: "name lastname"
    }
  };

  Video.paginate({ idUser }, options, (err, videoStored) => {
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
      ...videoStored
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
    video: "",
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
    // video.thumbnail = `${idVideo}.${extensionThumbnail}`;

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
    // video.video = `${idVideo}.${extensionVideo}`;

    if (extensionValidasVideo.indexOf(extensionVideo) < 0) {
      return res.status(400).json({
        ok: false,
        err: {
          message:
            "La extension del video no es valido. (Extensiones permitidas: mp4, avi)"
        }
      });
    }

    sharp(thumbnailFile.tempFilePath)
      .resize(720, 405, {
        fit: sharp.fit.fill
      })
      .toBuffer(function(err, buffer) {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }

        let thumbnailPath = `uploads/thumbnail/${idVideo}.${extensionThumbnail}`;
        awsUploadImage(buffer, thumbnailPath, function(resultImg) {
          video.thumbnail = resultImg;

          let videoPath = `uploads/videos/${idVideo}.${extensionVideo}`;
          awsUploadVideo(videoFile, videoPath, function(resultVideo) {
            video.video = resultVideo;

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

    res.json({
      ok: true,
      thumbnail
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

    const { video, title, description } = videoStored;

    res.json({
      ok: true,
      title,
      video,
      description
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

function deleteVideo(req, res) {
  let body = req.body;
  let idVideo = req.params.idVideo;
  let idUser = body.idUser;

  Video.findById(idVideo).exec((err, videoStored) => {
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

    if (videoStored.idUser != idUser) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El video no coincide con el usuario"
        }
      });
    }

    let videoPath = videoStored.video.split("/");
    let thumbnailPath = videoStored.thumbnail.split("/");
    videoPath = `${videoPath[3]}/${videoPath[4]}/${videoPath[5]}`;
    thumbnailPath = `${thumbnailPath[3]}/${thumbnailPath[4]}/${thumbnailPath[5]}`;

    console.log(videoStored.video);

    Video.findByIdAndDelete(idVideo, err => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "Error del servidor"
          }
        });
      }

      awsDeleteItems(videoPath, thumbnailPath);

      res.json({
        ok: true,
        message: "Video borrado"
      });
    });
  });
}

module.exports = {
  getVideos,
  uploadVideo,
  getThumbnail,
  getVideo,
  getVideoInfo,
  getVideosUser,
  deleteVideo
};
