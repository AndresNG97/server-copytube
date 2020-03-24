const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const _ = require("underscore");
var mime = require("mime-types");

// Registro usuario
function register(req, res) {
  let body = req.body;

  let usuario = new Usuario({
    name: body.name,
    lastname: body.lastname,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10)
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
}

function login(req, res) {
  let body = req.body;

  Usuario.findOne(
    { email: { $regex: new RegExp("^" + body.email, "i") } },
    (err, usuarioDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!usuarioDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "(Email) o Contraseña incorrectos"
          }
        });
      }
      console.log(usuarioDB);
      if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Email o (Contraseña) incorrectos"
          }
        });
      }
      let Authorization = jwt.sign({ usuarioDB }, process.env.SEED_TOKEN, {
        expiresIn: process.env.CADUCIDAD_TOKEN
      });

      res.json({
        ok: true,
        usuarioDB,
        Authorization
      });
    }
  );
}

function updateAvatar(req, res) {
  let idUser = req.params.idUser;
  let body = req.body;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado ninguna imagen"
      }
    });
  }

  const avatar = req.files.avatar;
  const extension = mime.extension(avatar.mimetype);
  const extensionValidas = ["png", "jpg", "jpeg"];

  if (extensionValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          "La extension de la imagen no es valida. (Extensiones permitidas: png, jpg, jpeg"
      }
    });
  }

  body.img = `${idUser}.${extension}`;
  let usuarioParams = _.pick(req.body, ["img"]);

  Usuario.findByIdAndUpdate(idUser, usuarioParams).exec((err, userStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!userStored) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    let filePath = `uploads/avatars/${userStored.img}`;

    fs.exists(filePath, exists => {
      if (exists) {
        console.log("existe");
        fs.unlink(filePath, err => {
          if (err) {
            return res.status(400).json({
              ok: false,
              err
            });
          }
        });
      }
    });

    avatar.mv(`uploads/avatars/${idUser}.${extension}`, err => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        message: "Imagen subida correctamente"
      });
    });
  });
}

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
    "password"
  ]);

  Usuario.findByIdAndUpdate(idUser, usuarioParams, {
    new: true
  }).exec((err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No se ha encontrado el usuario"
        }
      });
    }

    usuario.password = bcrypt.hashSync(usuario.password, 10);

    res.json({
      ok: true,
      usuario
    });
  });
}

function getImageEditAccount(req, res) {
  const idUser = req.params.idUser;

  Usuario.findById(idUser, (err, userStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "Error del servidor"
        }
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
    const { img } = userStored;

    if (!img) {
      return res.sendFile(path.resolve("uploads/default/default.png"));
    }

    const filePath = "uploads/avatars/" + img;
    fs.exists(filePath, exists => {
      if (!exists) {
        return res
          .status(404)
          .send({ message: "El avatar que buscas no existe." });
      } else {
        return res.sendFile(path.resolve(filePath));
      }
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
          message: "Error del servidor"
        }
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
    const { img } = userStored;

    if (!img) {
      return res.sendFile(path.resolve("uploads/default/defaultAvatar.png"));
    }

    const filePath = "uploads/avatars/" + img;
    fs.exists(filePath, exists => {
      if (!exists) {
        return res
          .status(404)
          .send({ message: "El avatar que buscas no existe." });
      } else {
        return res.sendFile(path.resolve(filePath));
      }
    });
  });
}

function confirmUpdateAccount(req, res) {
  const idUser = req.params.idUser;
  const body = req.body;

  if (!body.actualPassword) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha enviado la contraseña actual"
      }
    });
  }

  Usuario.findById(idUser, (err, userStored) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "Error del servidor"
        }
      });
    }

    if (!userStored) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No se ha encontrado al usuario"
        }
      });
    }

    if (!bcrypt.compareSync(body.actualPassword, userStored.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Las contraseñas no coinciden"
        }
      });
    }

    res.json({
      ok: true,
      userStored
    });
  });
}

module.exports = {
  register,
  login,
  updateAccount,
  updateAvatar,
  getImageEditAccount,
  getAvatar,
  confirmUpdateAccount
};
