import express from "express";
import cors from "cors";
import helmet from "helmet";
import os from "os";
import fs from "fs";

// Importar middlewares de seguridad
import { limiter, sanitizadorGeneral } from "./middleware/seguridad.js";

// Importar rutas
import { pedidosRoutes } from "./rutas/pedidos.js";
import { usuarioRoutes } from "./rutas/usuarios.js";
import { comentariosRoutes } from "./rutas/comentarios.js"; // <-- NUEVA

// Crear la aplicación Express
const app = express();

// ============ MIDDLEWARES DE SEGURIDAD ============
// Helmet - Cabeceras HTTP seguras
app.use(helmet());

// CORS
app.use(cors());

// Rate Limiting GLOBAL (opcional)
app.use(limiter);

// Sanitización general para todas las rutas
app.use(sanitizadorGeneral);

// Parseo de JSON con límite para evitar ataques
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ============ RUTAS ============

// Ruta de salud para health checks
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Hola from Express!");
});


// Rutas de la API (todas con el mismo estilo)
pedidosRoutes(app);
usuarioRoutes(app);
comentariosRoutes(app);  // <-- NUEVA RUTA

// ============ MANEJO DE ERRORES ============

// Ruta 404 - No encontrada
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// Middleware de errores global
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
  });
});

export { app };