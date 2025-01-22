import express from "express";
import { CupomController } from "./cupom.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
const cupomRouter = express.Router();

cupomRouter.get("/", AuthMiddleware.protectedRoutes, CupomController.findCupom);
cupomRouter.get(
  "/validate",
  AuthMiddleware.protectedRoutes,
  CupomController.validateCupom,
);

export default cupomRouter;
