import express from "express";
const cartRouter = express.Router();
import { cartController } from "./cart.controller.js";
import jwtMiddleware from "../middleware/jwt.middleware.js";

cartRouter.get(
  "/",
  jwtMiddleware.jwtMiddleware,
  jwtMiddleware.userMiddleware,
  cartController.findAll,
);
cartRouter.post(
  "/",
  jwtMiddleware.jwtMiddleware,
  jwtMiddleware.userMiddleware,
  cartController.addProductToCart,
);

export default cartRouter;
