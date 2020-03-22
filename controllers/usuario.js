const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const _ = require("underscore");

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
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado ninguna imagen"
      }
    });
  }

  let avatar = req.files.avatar;

  avatar.mv("uploads/filename.jpg", err => {
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
}

function updateAccount(req, res) {
  let id = req.params.id;
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

  Usuario.findByIdAndUpdate(id, usuarioParams, {
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

module.exports = {
  register,
  login,
  updateAvatar,
  updateAccount
};
