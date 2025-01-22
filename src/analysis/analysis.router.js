import express from "express";
import { AnalysisController } from "./analysis.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
const analysisRouter = express.Router();

analysisRouter.get(
  "/",
  AuthMiddleware.protectedRoutes,
  AuthMiddleware.adminRouter,
  AnalysisController.findAnalysisData,
);


export default analysisRouter;
