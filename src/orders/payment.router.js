import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { PaymentController } from "./payment.controller.js";
const paymentRouter = express.Router();

paymentRouter.post(
  "/create-checkout-session",
  AuthMiddleware.protectedRoutes,
  PaymentController.create,
);

paymentRouter.post(
  "/checkout-success",
  AuthMiddleware.protectedRoutes,
  PaymentController.checkoutSuccess,
);

export default paymentRouter;
