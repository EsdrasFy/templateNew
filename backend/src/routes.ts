// src/routes.ts

import express from "express";
import DefaultController from "./controllers/DefaultController";
import UserController from "./controllers/UserController";
import ProductController from "./controllers/ProductController";
import checkAuthentication from "./middlewares/authMiddlewares";
import { Request, Response } from "express";
import User from "./models/User";
import { Model } from "sequelize";
require("dotenv").config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const routes = express.Router();

interface UserInterface extends Model<any, any> {
  user_id: number;
  fullname: string;
  username: string;
  email: string;
  profile_img: string;
  password_hash: string;
  date_of_birth: Date;
  address: string;
  phone: string;
  shopping: number;
  gender: string;
  cpf: string;
  cards: number;
  created_at: Date;
  messages: number;
}

// Rotas para o usuário
routes.get("/", DefaultController.read);
routes.post("/usuarios/create", UserController.createUser);
routes.put("/usuarios/update", UserController.updateUser);
routes.delete("/usuarios/delete/:id", UserController.deleteUser);
routes.post("/req/login", UserController.login);
routes.get("/auth/:id", checkAuthentication, UserController.authLogin);
routes.get("/show/:id", UserController.showUser);
routes.post("/forgot-password", UserController.forgotPassword);
routes.get("/reset-password/:id/:code", UserController.resetPassword);
routes.post("/new-password/:id/:code", UserController.newPassword);

// Rotas para produtos
routes.post("/product/new", ProductController.createProduct);
routes.put("/product/update", ProductController.updateProduct);
routes.delete("/product/delete/:id", ProductController.deleteProduct);
routes.get("/product/filter", ProductController.filterProducts);

export default routes;
