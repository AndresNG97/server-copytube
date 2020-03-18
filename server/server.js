const express = require("express");
const mongoose = require("mongoose");


// Enviroment Variables
require("./config/config");

const app = express();

// Configure Header HTTP
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

// Configuracion de rutas
app.use(require("./routes/usuario"));



// Mongoose configuracion basica requerida
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);

// Conexion a moongose
mongoose.connect(process.env.NODE_ENV, (err, res) => {
  if(err) throw err;

  console.log("Base de datos ONLINE");
});

// Puerto que escucha el servidor
app.listen(process.env.PORT, () => {
  console.log("Escuchando el puerto: ", process.env.PORT);
});