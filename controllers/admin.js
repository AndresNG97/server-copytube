const Usuario = require("../models/usuario");
const Video = require("../models/video");
const Comments = require("../models/comments");
const awsDeleteItems = require("../middlewares/awsDeleteItems");

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
  });

  const getComments = Comments.countDocuments({}, (err, countComments) => {
    if (err) {
    }
    data.comments = countComments;
  });

  const getVideos = Video.countDocuments({}, (err, countVideos) => {
    if (err) {
    }
    data.videos = countVideos;
  });

  Promise.all([getUser, getComments, getVideos]).then(() => {
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

function deleteVideoUser(req, res) {
  let idVideo = req.params.idVideo;

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

module.exports = {
  validateAdmin,
  getDashboardStats,
  getAllUsers,
  getSpecificUser,
  deleteVideoUser,
};
