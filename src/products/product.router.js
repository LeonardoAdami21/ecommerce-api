import express from "express";
import { ProductController } from "./product.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
const productRouter = express.Router();

productRouter.get(
  "/",
  AuthMiddleware.protectedRoutes,
  AuthMiddleware.adminRouter,
  ProductController.findAll,
);
productRouter.get("/featured", ProductController.findAllFeatured);
productRouter.get("/recommendations", ProductController.findAllRecommendedProducts);
productRouter.get(
  "/category/:category",
  AuthMiddleware.protectedRoutes,
  ProductController.findAllProductsByCategory,
)
productRouter.post(
  "/",
  AuthMiddleware.protectedRoutes,
  AuthMiddleware.adminRouter,
  ProductController.create,
);
productRouter.patch(
  "/:id",
  AuthMiddleware.protectedRoutes,
  AuthMiddleware.adminRouter,
  ProductController.toggleFeatured,
)
productRouter.delete(
  "/:id",
  AuthMiddleware.protectedRoutes,
  AuthMiddleware.adminRouter,
  ProductController.deleteProductById,
);

export default productRouter;
