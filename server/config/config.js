// Puerto
process.env.PORT = process.env.PORT || 3100;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB =
    "mongodb+srv://admin_copytube:KfmQYq1G9L70JiqG@cluster0-qz4op.mongodb.net/copytube?retryWrites=true&w=majority";
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.NODE_ENV = urlDB;

process.env.SEED_TOKEN = "SEED_TOKEN_LOGIN-AUTH-CRITOWEN-SECRET";

// Vencimiento del Token
// 60 Segundos
// 60 Minutos
// 24 Horas
// 30 Dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
