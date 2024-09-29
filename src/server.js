import express from "express";
import cors from "cors";
import { appPort } from "./env/envoriment.js";
import mongoConfig from "./config/mongo.config.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "../swagger.json" assert { type: "json" };
import authRouter from "./auth/auth.router.js";
import userRouter from "./users/user.router.js";
import adminRouter from "./admin/admin.router.js";
import productRouter from "./products/product.router.js";
import cartRouter from "./cart/cart.router.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/carts", cartRouter);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

mongoConfig();

app.listen(appPort, () =>
  console.log(`Server running at http://localhost:${appPort}/api`),
);
