import express from "express";
import { AuthController } from "./auth.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
const authRouter = express.Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthController.logout);
authRouter.post("/refresh-token", AuthController.refreshToken);
authRouter.get(
  "/profile",
  AuthMiddleware.protectedRoutes,
  AuthController.findUserProfile,
);

export default authRouter;
