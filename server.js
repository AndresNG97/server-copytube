const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Enviroment Variables
require("./config/config");

const app = express();

// Configure Header HTTP
app.use(cors());

// Configuracion de rutas
app.use(require("./routes/index"));

// Mongoose configuracion basica requerida
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

// Conexion a moongose
mongoose.connect(process.env.NODE_ENV, (err, res) => {
  if (err) throw err;

  console.log("Base de datos ONLINE");
});

// Puerto que escucha el servidor
app.listen(process.env.PORT, () => {
  console.log("Escuchando el puerto: ", process.env.PORT);
});
