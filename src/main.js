import express from "express";
const app = express();
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };
import { appPort } from "./env/envoriment.js";
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
    customCssUrl: CSS_URL,
  }),
);

app.get("/", (req, res) => {
  return res.status(200).json("Hello World!");
});

app.listen(appPort, () => {
  console.log(`Server running on port http://localhost:${appPort}/docs`);
});
