const jwt = require("jsonwebtoken");

// Verificar Token

let verificaToken = (req, res, next) => {
  let token = req.get("Authorization"); // Obtener header 'token'
  jwt.verify(token, process.env.SEED_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token invalido.",
        },
      });
    }
    req.usuario = decoded.userStored;
    next();
  });
};

let verificaRefreshToken = (req, res, next) => {
  let token = req.get("Authorization"); // Obtener header 'token'
  jwt.verify(token, process.env.SEED_REFRESH_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token invalido.",
        },
      });
    }
    req.usuario = decoded.userStored;
    next();
  });
};

// Verificar ADMIN_ROLE
let verificaRole = (req, res, next) => {
  let token = req.get("Authorization"); // Obtener header 'token'
  jwt.verify(token, process.env.SEED_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token invalido.",
        },
      });
    }

    let usuario = decoded.userStored;

    if (usuario.role !== "ADMIN_ROLE") {
      return res.status(401).json({
        ok: false,
        err: {
          message: "No tienes permisos",
        },
      });
    }
    next();
  });
};

module.exports = {
  verificaToken,
  verificaRefreshToken,
  verificaRole,
};
