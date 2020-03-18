const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const jwt = require("jsonwebtoken");
const app = express();
const Usuario = require("../models/usuario");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Registro usuario
app.post("/registro", (req, res) => {
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
});

app.post("/login", (req, res) => {
  let body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!usuarioBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Email) o Contraseña incorrectos"
        }
      });
    }
    if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Email o (Contraseña) incorrectos"
        }
      });
    }

    let Authorization = jwt.sign(
      { usuario: usuarioBD },
      process.env.SEED_TOKEN,
      {
        expiresIn: process.env.CADUCIDAD_TOKEN
      }
    );

    res.json({
      ok: true,
      usuario: usuarioBD,
      Authorization
    });
  });
});

module.exports = app;
