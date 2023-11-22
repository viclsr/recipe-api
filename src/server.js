import express from "express";
import bodyParser from "body-parser";

import routes from "./routes.js";

import cors from "cors";

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));

const PORT = process.env.PORT || 5555;

app.get("/", (req, res) => {
  return res.json("Servidor funcionando com sucesso!");
});

app.use(routes);

app.listen(PORT, () => console.log("Servidor rodando na porta 5555"));
