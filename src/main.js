import express from "express";
const app = express();
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };
import { appPort } from "./env/envoriment.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  return res.status(200).json("Hello World!");
});

app.listen(appPort, () => {
  console.log(`Server running on port http://localhost:${appPort}/docs`);
});
