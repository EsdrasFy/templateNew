import express from "express";
import cookieParser from "cookie-parser";
require("dotenv").config();
import routes from "./routes";
import cors from "cors";
const PORT = process.env.PORT;
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.json());
app.use(cookieParser());
app.use(routes);

try {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
  });
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}
