// backend/src/app.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { pedidosRoutes } from "./rutas/pedidos.js";
import { usuarioRoutes } from "./rutas/usuarios.js";

// Crear la aplicación Express
const app = express();

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());

// Configurar rutas
pedidosRoutes(app);
usuarioRoutes(app);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Hola from Express!");
});

export { app };