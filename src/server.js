import express from "express";
import cors from "cors";
import { appPort } from "./env/envoriment.js";
import mongoConfig from "./config/mongo.config.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
mongoConfig();

app.listen(appPort, () =>
  console.log(`Server running at http://localhost:${appPort}`),
);
