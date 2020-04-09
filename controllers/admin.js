const Usuario = require("../models/usuario");
const Video = require("../models/video");
const Comments = require("../models/comments");

function validateAdmin(req, res) {
  res.json({
    ok: true,
  });
}

function getDashboardStats(req, res) {
  let data = {
    users: null,
    videos: null,
    comments: null,
  };

  const getUser = Usuario.countDocuments({}, (err, countUsers) => {
    if (err) {
    }
    data.users = countUsers;
    console.log("1 - Users");
  });

  const getComments = Comments.countDocuments({}, (err, countComments) => {
    if (err) {
    }
    data.comments = countComments;
    console.log("2 - Comments");
  });

  const getVideos = Video.countDocuments({}, (err, countVideos) => {
    if (err) {
    }
    data.videos = countVideos;
    console.log("3 - Videos");
  });

  Promise.all([getUser, getComments, getVideos]).then(() => {
    console.log("4 - Send");

    res.json({
      ok: true,
      data,
    });
  });
}

function getAllUsers(req, res) {
  Usuario.find({})
    .sort({ name: 1 })
    .exec((err, userStored) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        userStored,
      });
    });
}

function getSpecificUser(req, res) {
  const idUser = req.params.idUser;

  Usuario.findById(idUser).exec((err, userStored) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      userStored,
    });
  });
}

module.exports = {
  validateAdmin,
  getDashboardStats,
  getAllUsers,
  getSpecificUser,
};

function deleteVideoUser(req, res) {
  let body = req.body;
  let idVideo = req.params.idVideo;
  let idUser = body.idUser;

  Video.findById(idVideo).exec((err, videoStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "Error del servidor",
        },
      });
    }

    if (!videoStored) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Video no encontrado",
        },
      });
    }

    if (videoStored.idUser != idUser) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El video no coincide con el usuario",
        },
      });
    }

    let videoPath = videoStored.video.split("/");
    let thumbnailPath = videoStored.thumbnail.split("/");
    videoPath = `${videoPath[3]}/${videoPath[4]}/${videoPath[5]}`;
    thumbnailPath = `${thumbnailPath[3]}/${thumbnailPath[4]}/${thumbnailPath[5]}`;

    Video.findByIdAndDelete(idVideo, (err) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "Error del servidor",
          },
        });
      }

      awsDeleteItems(videoPath, thumbnailPath);

      res.json({
        ok: true,
        message: "Video borrado",
      });
    });
  });
}
