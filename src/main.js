import express from "express";
const app = express();
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };
import { appPort } from "./env/envoriment.js";
import connectDB from "./config/mongo.config.js";
import authRouter from "./auth/auth.router.js";
import cookieParser from "cookie-parser";
import productRouter from "./products/product.router.js";
import cartRouter from "./cart/cart.router.js";
import cupomRouter from "./cupons/cupom.router.js";
import paymentRouter from "./orders/payment.router.js";
import analysisRouter from "./analysis/analysis.router.js";

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/cupons", cupomRouter);
app.use("/payments", paymentRouter);
app.use("/analytics", analysisRouter);

app.use(
  "/api",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
    ],
    customCssUrl: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
    ],
  }),
);

app.get("/", (req, res) => {
  return res.status(200).json("Hello World!");
});

app.listen(appPort, () => {
  connectDB();
  console.log(`Server running on port http://localhost:${appPort}/api`);
});
