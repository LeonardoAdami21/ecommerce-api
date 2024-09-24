import express from "express";
import { userController } from "./user.controller.js";
import jwtMiddleware from "../middleware/jwt.middleware.js";
const userRouter = express.Router();

userRouter.get(
  "/",
  jwtMiddleware.jwtMiddleware,
  jwtMiddleware.adminMiddleware,
  userController.findAll,
);
userRouter.get(
  "/:id",
  jwtMiddleware.jwtMiddleware,
  jwtMiddleware.adminMiddleware,
  userController.findUserById,
);
userRouter.put(
  "/:id",
  jwtMiddleware.userMiddleware,
  jwtMiddleware.userMiddleware,
  userController.updateUser,
);
userRouter.delete(
  "/:id",
  jwtMiddleware.jwtMiddleware,
  jwtMiddleware.adminMiddleware,
  userController.deleteUser,
);

export default userRouter;
