const Comments = require("../models/comments");
const Usuario = require("../models/usuario");
const moment = require("moment");

function uploadComment(req, res) {
  const body = req.body;
  let date = moment().format("DD/MM/YYYY HH:mm:ss");
  console.log(date);

  let comments = new Comments({
    comment: body.comment,
    date,
    idUser: body.idUser,
    idVideo: body.idVideo
  });

  Usuario.findById(body.idUser, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
  });

  comments.save((err, commentStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      commentStored
    });
  });
}

function getComment(req, res) {
  const idVideo = req.params.idVideo;
  const { page } = req.query;

  console.log(req.query);

  const options = {
    page,
    limit: 10,
    populate: {
      path: "idUser",
      select: "name lastname"
    },
    sort: {
      date: -1
    }
  };

  Comments.paginate({ idVideo }, options, (err, commentStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    return res.json({
      ok: true,
      commentStored
    });
  });
}

module.exports = {
  uploadComment,
  getComment
};
