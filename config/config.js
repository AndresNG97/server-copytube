// Puerto
process.env.PORT = process.env.PORT || 3100;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

let urlDB =
  "mongodb+srv://admin_copytube:KfmQYq1G9L70JiqG@cluster0-qz4op.mongodb.net/copytube?retryWrites=true&w=majority";

process.env.NODE_ENV = urlDB;

process.env.SEED_ACCESS_TOKEN =
  "yu8F!4BXANxcb_c-$W&5j2Es@_HPKe^e_6v736Y-?mqs#ebKttQ45Ls$M6*UL+T+";

process.env.SEED_REFRESH_TOKEN =
  "@FFV7^&cksSC=U9^rQ!K@N6$dxV&p4dbsLPXNzq4kyCer5d@$&pBb^5RUs*_u7Hw";

process.env.CADUCIDAD_ACCESS_TOKEN = "1m";
process.env.CADUCIDAD_REFRESH_TOKEN = "1w";
