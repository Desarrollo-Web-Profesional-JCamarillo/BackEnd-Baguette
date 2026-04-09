import rateLimit from "express-rate-limit";

// ============ RATE LIMITING ============
// Configuración: máximo 10 peticiones por minuto desde la misma IP
export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 peticiones
  message: {
    error: "Demasiadas peticiones desde esta IP",
    message: "Has superado el límite de 10 peticiones por minuto",
    retryAfter: "Intenta de nuevo en 60 segundos",
  },
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
});

// ============ SANITIZACIÓN ============
// Función para sanitizar strings (prevenir XSS)
const sanitizeString = (str) => {
  if (typeof str !== "string") return str;

  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;")
    .replace(/\//g, "&#x2F;")
    .replace(/=/g, "&#x3D;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;")
    .replace(/\[/g, "&#91;")
    .replace(/\]/g, "&#93;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
};

// Middleware de sanitización general
export const sanitizadorGeneral = (req, res, next) => {
  if (req.body) {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }

  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === "string") {
        req.query[key] = sanitizeString(req.query[key]);
      }
    }
  }

  if (req.params) {
    for (const key of Object.keys(req.params)) {
      if (typeof req.params[key] === "string") {
        req.params[key] = sanitizeString(req.params[key]);
      }
    }
  }

  next();
};

// Sanitizador específico para comentarios (más agresivo)
export const sanitizarComentario = (texto) => {
  if (!texto) return texto;

  return texto
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/alert\(/gi, "")
    .replace(/eval\(/gi, "")
    .replace(/document\./gi, "")
    .replace(/window\./gi, "")
    .trim();
};