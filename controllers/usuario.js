const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const _ = require("underscore");
var mime = require("mime-types");
const awsUploadImage = require("../middlewares/awsUploadImage");
const sharp = require("sharp");

// Registro usuario
function register(req, res) {
  let body = req.body;

  let usuario = new Usuario({
    name: body.name,
    lastname: body.lastname,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
  });

  usuario.save((err, userStored) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      message: "Te has registrado correctamente",
    });
  });
}

// Login

function login(req, res) {
  let body = req.body;

  Usuario.findOne(
    { email: { $regex: new RegExp("^" + body.email, "i") } },
    (err, userStored) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!userStored) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "(Email) o Contraseña incorrectos",
          },
        });
      }

      if (!bcrypt.compareSync(body.password, userStored.password)) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Email o (Contraseña) incorrectos",
          },
        });
      }

      let accessToken = jwt.sign(
        { userStored },
        process.env.SEED_ACCESS_TOKEN,
        {
          expiresIn: process.env.CADUCIDAD_ACCESS_TOKEN,
        }
      );

      let refreshToken = jwt.sign(
        { userStored },
        process.env.SEED_REFRESH_TOKEN,
        {
          expiresIn: process.env.CADUCIDAD_REFRESH_TOKEN,
        }
      );

      res.json({
        ok: true,
        accessToken,
        refreshToken,
      });
    }
  );
}

// Update Avatar

async function updateAvatar(req, res) {
  let idUser = req.params.idUser;
  let body = req.body;

  Usuario.findById(idUser, (err, userStored) => {});

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado ninguna imagen",
      },
    });
  }

  const avatar = req.files.avatar;
  const extension = mime.extension(avatar.mimetype);
  const extensionValidas = ["png", "jpg", "jpeg"];

  Usuario.findById(idUser, async (err, userStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!userStored) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!body.actualPassword) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "La contraseña actual es obligatoria",
        },
      });
    }

    if (!bcrypt.compareSync(body.actualPassword, userStored.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Las contraseñas no coinciden",
        },
      });
    }

    if (extensionValidas.indexOf(extension) < 0) {
      return res.status(400).json({
        ok: false,
        err: {
          message:
            "La extension de la imagen no es valida. (Extensiones permitidas: png, jpg, jpeg",
        },
      });
    }

    const filePath = `uploads/avatars/${idUser}.${extension}`;

    sharp(avatar.tempFilePath)
      .resize(720, 405, {
        fit: sharp.fit.fill,
      })
      .toBuffer(function (err, buffer) {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        awsUploadImage(buffer, filePath, function (result) {
          body.img = result;
          let usuarioParams = _.pick(req.body, ["img"]);

          Usuario.findByIdAndUpdate(idUser, usuarioParams, async () => {
            res.json({
              ok: true,
              message: "Avatar subido correctamente",
            });
          });
        });
      });
  });
}

// Update Account

function updateAccount(req, res) {
  let idUser = req.params.idUser;
  let body = req.body;

  if (body.password) {
    body.password = bcrypt.hashSync(body.password, 10);
  }

  let usuarioParams = _.pick(req.body, [
    "name",
    "lastname",
    "email",
    "password",
  ]);

  Usuario.findById(idUser, (err, userStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!userStored) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No se ha encontrado el usuario",
        },
      });
    }

    if (!body.actualPassword) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No se ha introducido la contraseña actual",
        },
      });
    }

    if (!bcrypt.compareSync(body.actualPassword, userStored.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Las contraseñas no coinciden",
        },
      });
    }

    Usuario.findByIdAndUpdate(idUser, usuarioParams, {
      new: true,
    }).exec((err) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
      });
    });
  });
}

function getAvatar(req, res) {
  const idUser = req.params.idUser;

  Usuario.findById(idUser, (err, userStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "Error del servidor",
        },
      });
    }
    if (!userStored) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado",
        },
      });
    }

    const { img } = userStored;

    if (!img) {
      return res.json({
        ok: true,
        img: null,
      });
    }

    return res.json({
      ok: true,
      img,
    });
  });
}

function getUserInfo(req, res) {
  const idUser = req.params.idUser;

  Usuario.findById(idUser, (err, userStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "Error del servidor",
        },
      });
    }

    return res.json({
      ok: true,
      userStored,
    });
  });
}

function getNewAccessToken(req, res) {
  const idUser = req.usuario._id;

  Usuario.findById(idUser, (err, userStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "Error del servidor",
        },
      });
    }

    let accessToken = jwt.sign({ userStored }, process.env.SEED_ACCESS_TOKEN, {
      expiresIn: process.env.CADUCIDAD_ACCESS_TOKEN,
    });

    return res.json({
      ok: true,
      accessToken,
    });
  });
}

module.exports = {
  register,
  login,
  updateAccount,
  updateAvatar,
  getAvatar,
  getNewAccessToken,
  getUserInfo,
};
