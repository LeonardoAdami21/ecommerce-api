import express from "express";
import { userController } from "./user.controller.js";
const userRouter = express.Router();

userRouter.get("/", userController.findAll);
userRouter.get("/:id", userController.findUserById);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;