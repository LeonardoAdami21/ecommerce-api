import express from "express";
import { CartController } from "./cart.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
const cartRouter = express.Router();

cartRouter.get(
  "/",
  AuthMiddleware.protectedRoutes,
  CartController.getCartProducts,
);
cartRouter.post("/", AuthMiddleware.protectedRoutes, CartController.createCart);
cartRouter.put(
  "/:id",
  AuthMiddleware.protectedRoutes,
  CartController.updateCart,
);
cartRouter.delete(
  "/:id",
  AuthMiddleware.protectedRoutes,
  CartController.removeFromCart,
);

export default cartRouter;
