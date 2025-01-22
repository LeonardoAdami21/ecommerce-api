import express from "express";
import { AuthController } from "./auth.controller.js";
const authRouter = express.Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthController.logout);
authRouter.post("/refresh-token", AuthController.refreshToken);

export default authRouter;
