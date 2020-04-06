const Usuario = require("../models/usuario");
const Video = require("../models/video");
const Comments = require("../models/comments");

function validateAdmin(req, res) {
  res.json({
    ok: true,
  });
}

async function getDashboardStats(req, res) {
  let data = {
    users: null,
    videos: null,
    comments: null,
  };

  await Usuario.countDocuments({}, (err, countUsers) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    data.users = countUsers;
  });

  await Comments.countDocuments({}, (err, countComments) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    data.comments = countComments;
  });

  await Video.countDocuments({}, (err, countVideos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    data.videos = countVideos;
  });

  res.json({
    ok: true,
    data,
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
