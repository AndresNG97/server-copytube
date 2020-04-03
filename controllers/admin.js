const Usuario = require("../models/usuario");
const Video = require("../models/video");
const Comments = require("../models/comments");

function validateAdmin(req, res) {
  res.json({
    ok: true
  });
}

async function getDashboardStats(req, res) {
  let data = {
    users: null,
    videos: null,
    comments: null
  };

  await Usuario.countDocuments({}, (err, countUsers) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    data.users = countUsers;
  });

  await Comments.countDocuments({}, (err, countComments) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    data.comments = countComments;
  });

  await Video.countDocuments({}, (err, countVideos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    data.videos = countVideos;
  });

  res.json({
    ok: true,
    data
  });
}

module.exports = {
  validateAdmin,
  getDashboardStats
};
