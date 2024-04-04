import express from "express";
import UserController from "./user.controller.js";

const UserRouter = express.Router();

const userController = new UserController();
UserRouter.post("/signUp", (req, res, next) => {
  userController.signUp(req, res, next);
});

export default UserRouter;
