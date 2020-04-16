const express = require("express");
const AdminController = require("../controllers/admin");
const api = express.Router();

const { verificaRole } = require("../middlewares/autenticacion");

api.use(express.urlencoded({ extended: false }));
// parse application/json
api.use(express.json());

api.post("/validateAdmin", verificaRole, AdminController.validateAdmin);
api.get("/getDashboardStats", verificaRole, AdminController.getDashboardStats);
api.get("/getAllUsers", verificaRole, AdminController.getAllUsers);
api.get(
  "/getSpecificUser/:idUser",
  verificaRole,
  AdminController.getSpecificUser
);
api.delete(
  "/deleteVideoUser/:idVideo",
  verificaRole,
  AdminController.deleteVideoUser
);

module.exports = api;
