//guardian-api.test.js
import request from "supertest";
import { app } from "../app.js";

describe("🧪 Pruebas de Fuego - El Guardián de la API", () => {
  // ============ PRUEBA 1: SANITIZACIÓN ============
  describe("1️⃣ Sanitización - Prevención de XSS", () => {
    test("Debe sanitizar un intento de inyección HTML/JS", async () => {
      const payload = {
        puntuacion: 5,
        texto: '<script>alert("hack")</script> Hola mundo',
        nombre: '<img src=x onerror=alert(1)>',
      };

      const response = await request(app).post("/api/v1/commentarios").send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      // Verificar que el texto fue sanitizado
      expect(response.body.data.texto).not.toContain("<script>");
      expect(response.body.data.texto).toContain("&lt;script&gt;");
    });

    test("Debe rechazar texto que exceda los 200 caracteres", async () => {
      const textoLargo = "a".repeat(201);
      const payload = {
        puntuacion: 4,
        texto: textoLargo,
      };

      const response = await request(app).post("/api/v1/commentarios").send(payload);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Error de validación");
      expect(response.body.detalles[0].msg).toContain("200 caracteres");
    });
  });

  // ============ PRUEBA 2: RATE LIMITING ============
  describe("2️⃣ Rate Limiting - 10 peticiones por minuto", () => {
    test("Debe permitir las primeras 10 peticiones y bloquear la 11ª", async () => {
      const payload = {
        puntuacion: 3,
        texto: "Comentario de prueba",
      };

      // Hacer 10 peticiones que deberían funcionar
      for (let i = 0; i < 10; i++) {
        const response = await request(app).post("/api/v1/commentarios").send(payload);
        expect(response.status).toBe(201);
      }

      // La petición número 11 debería ser bloqueada
      const responseBloqueada = await request(app).post("/api/v1/commentarios").send(payload);
      expect(responseBloqueada.status).toBe(429);
    }, 30000);
  });

  // ============ PRUEBA 3: VALIDACIONES ============
  describe("3️⃣ Validaciones - Datos correctos", () => {
    test("Debe rechazar puntuación que no sea entero", async () => {
      const payload = {
        puntuacion: 4.5,
        texto: "Texto válido",
      };

      const response = await request(app).post("/api/v1/commentarios").send(payload);
      expect(response.status).toBe(400);
      expect(response.body.detalles[0].msg).toContain("número entero");
    });

    test("Debe rechazar puntuación fuera del rango 1-5", async () => {
      const payload = {
        puntuacion: 10,
        texto: "Texto válido",
      };

      const response = await request(app).post("/api/v1/commentarios").send(payload);
      expect(response.status).toBe(400);
    });

    test("Debe aceptar un comentario válido", async () => {
      const payload = {
        puntuacion: 5,
        texto: "Excelente servicio, muy recomendado!",
        nombre: "Cliente Feliz",
        email: "cliente@example.com",
      };

      const response = await request(app).post("/api/v1/commentarios").send(payload);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.puntuacion).toBe(5);
    });
  });
});