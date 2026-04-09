import { body, validationResult } from "express-validator";
import { limiter, sanitizarComentario } from "../middleware/seguridad.js";

// Simulación de almacenamiento (en producción usarías MongoDB)
let comentariosDB = [];

/**
 * Define las rutas REST para el recurso comentarios.
 * @param {*} app - Instancia de Express
 */
export function comentariosRoutes(app) {
  
  // ============ REGLAS DE VALIDACIÓN ============
  const validarComentario = [
    body("puntuacion")
      .isInt({ min: 1, max: 5 })
      .withMessage("La puntuación debe ser un número entero entre 1 y 5")
      .toInt(),
    
    body("texto")
      .isString()
      .withMessage("El texto debe ser una cadena de texto")
      .isLength({ max: 200 })
      .withMessage("El texto no puede superar los 200 caracteres")
      .trim(),
    
    body("nombre")
      .optional()
      .isString()
      .withMessage("El nombre debe ser texto")
      .isLength({ max: 50 })
      .withMessage("El nombre no puede superar los 50 caracteres")
      .trim(),
    
    body("email")
      .optional()
      .isEmail()
      .withMessage("El email debe ser válido")
      .normalizeEmail(),
  ];

  // ============ POST /api/v1/commentarios ============
  // Aplicar rate limiting + validaciones
  app.post("/api/v1/commentarios", limiter, validarComentario, async (req, res) => {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Error de validación",
          detalles: errors.array(),
        });
      }

      // Extraer datos
      let { puntuacion, texto, nombre = "Anónimo", email = null } = req.body;

      // Sanitización extra para el texto (previene XSS)
      texto = sanitizarComentario(texto);
      nombre = sanitizarComentario(nombre);

      // Crear comentario
      const nuevoComentario = {
        id: comentariosDB.length + 1,
        puntuacion,
        texto,
        nombre,
        email,
        fecha: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
      };

      // Guardar (en memoria para demo)
      comentariosDB.push(nuevoComentario);
      
      console.log("📝 Nuevo comentario:", nuevoComentario);

      return res.status(201).json({
        success: true,
        message: "Comentario creado exitosamente",
        data: nuevoComentario,
      });
      
    } catch (err) {
      console.error("Error creando comentario:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // ============ GET /api/v1/commentarios ============
  app.get("/api/v1/commentarios", async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      
      const resultados = comentariosDB
        .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
        .reverse(); // Más recientes primero
      
      return res.json({
        success: true,
        total: comentariosDB.length,
        data: resultados,
      });
      
    } catch (err) {
      console.error("Error listando comentarios:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // ============ GET /api/v1/commentarios/:id ============
  app.get("/api/v1/commentarios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const comentario = comentariosDB.find(c => c.id === parseInt(id));
      
      if (!comentario) {
        return res.status(404).json({ error: "Comentario no encontrado" });
      }
      
      return res.json({
        success: true,
        data: comentario,
      });
      
    } catch (err) {
      console.error("Error obteniendo comentario:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // ============ DELETE /api/v1/commentarios/:id ============
  app.delete("/api/v1/commentarios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const index = comentariosDB.findIndex(c => c.id === parseInt(id));
      
      if (index === -1) {
        return res.status(404).json({ error: "Comentario no encontrado" });
      }
      
      comentariosDB.splice(index, 1);
      return res.status(204).end();
      
    } catch (err) {
      console.error("Error eliminando comentario:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });
}