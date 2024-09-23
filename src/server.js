import express from "express";
import cors from "cors";
import { appPort } from "./env/envoriment";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(appPort, () =>
  console.log(`Server running at http://localhost:${appPort}`),
);
