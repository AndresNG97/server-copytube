// Puerto
process.env.PORT = process.env.PORT || 3100;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

let urlDB =
  "mongodb+srv://admin_copytube:KfmQYq1G9L70JiqG@cluster0-qz4op.mongodb.net/copytube?retryWrites=true&w=majority";

process.env.NODE_ENV = urlDB;

process.env.SEED_TOKEN =
  "xiH3+OLPffcn6mSqCbVNpflAKPwRz+StrkW6yHZUGsgHdfjo5TOIyR2YmF6Jr+1uBldhxVq9BRmwVi4V3wABIA==";

// Vencimiento del Token
// 60 Segundos
// 60 Minutos
// 24 Horas
// 30 Dias
process.env.CADUCIDAD_ACCESS_TOKEN = "1m";
process.env.CADUCIDAD_REFRESH_TOKEN = "1w";
