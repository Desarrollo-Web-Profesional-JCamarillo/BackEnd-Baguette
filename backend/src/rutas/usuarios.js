
// rutas/usuarios.js

//JWT
import {
  createUsuario,
  loginUsuario,
  getUsuarioInfoById,
} from "../servicios/usuarios.js";

/**
 * Define las rutas REST para el recurso usuarios.
 * @param {*} app - Instancia de Express
 */
export function usuarioRoutes(app) {
  // POST /api/v1/usuario/signup - Registrar un nuevo usuario
  app.post("/api/v1/usuario/signup", async (req, res) => {
    try {
      const usuario = await createUsuario(req.body);
      return res.status(201).json({ username: usuario.username });
    } catch (err) {
      return res.status(400).json({
        error: "Falló al crear el usuario, El usuario ya existe?",
      });
    }
  });

  // POST /api/v1/usuario/login - Iniciar sesión y obtener JWT
  app.post("/api/v1/usuario/login", async (req, res) => {
    try {
      const token = await loginUsuario(req.body);
      return res.status(200).send({ token });
    } catch (err) {
      return res.status(400).send({
        error: "Login Falló, Ingresas el Usuario/Contraseña correcta?",
      });
    }
  });

  // GET /api/v1/usuarios/:id - Obtener info de un usuario por ID
  app.get("/api/v1/usuarios/:id", async (req, res) => {
    const userInfo = await getUsuarioInfoById(req.params.id);
    return res.status(200).send(userInfo);
  });
}