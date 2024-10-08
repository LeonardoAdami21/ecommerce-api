import express from "express";
import cors from "cors";
import { appPort } from "./env/envoriment.js";
import mongoConfig from "./config/mongo.config.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "../swagger.json" assert { type: "json" };
import authRouter from "./auth/auth.router.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRouter);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

mongoConfig();

app.listen(appPort, () =>
  console.log(`Server running at http://localhost:${appPort}/api`),
);
