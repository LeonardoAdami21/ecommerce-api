import express from "express";
import { productController } from "./product.controller.js";
import jwtMiddleware from "../middleware/jwt.middleware.js";
const productRouter = express.Router();

productRouter.get("/", jwtMiddleware.jwtMiddleware, productController.findAll);
productRouter.post(
  "/",
  jwtMiddleware.jwtMiddleware,
  jwtMiddleware.adminMiddleware,
  productController.create,
);
productRouter.get("/:id", productController.findProductById);
productRouter.put(
  "/:id",
  jwtMiddleware.jwtMiddleware,
  jwtMiddleware.adminMiddleware,
  productController.updateProduct,
);
productRouter.delete(
  "/:id",
  jwtMiddleware.jwtMiddleware,
  jwtMiddleware.adminMiddleware,
  productController.deleteProduct,
);

export default productRouter;
