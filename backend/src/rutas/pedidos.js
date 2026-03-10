// rutas/pedidos.js
//JWT

import {
  creaPedido,
  listaAllPedidos,
  listaPedidosByNombre,
  listPedidosByPagado,
  getPedidoById,
  modificaPedido,
  eliminaPedido,
} from "../servicios/pedidos.js";

/**
 * Define las rutas REST para el recurso pedidos.
 * @param {*} app - Instancia de Express
 */
export function pedidosRoutes(app) {
  // GET /api/v1/pedidos - Listar pedidos con filtros opcionales
  app.get("/api/v1/pedidos", async (req, res) => {
    const { sortBy, sortOrder, nombre, pagado } = req.query;
    const opciones = { sortBy, sortOrder };
    try {
      if (nombre && pagado) {
        return res
          .status(400)
          .json({ error: "Consulta por nombre o status, No Ambos" });
      } else if (nombre) {
        return res.json(await listaPedidosByNombre(nombre, opciones));
      } else if (pagado) {
        return res.json(await listPedidosByPagado(pagado, opciones));
      } else {
        return res.json(await listaAllPedidos(opciones));
      }
    } catch (err) {
      console.error("Error listando Pedidos", err);
      return res.status(500).end();
    }
  });

  // GET /api/v1/pedidos/:id - Obtener un pedido por ID
  app.get("/api/v1/pedidos/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const pedido = await getPedidoById(id);
      if (pedido === null) return res.status(404).end();
      return res.json(pedido);
    } catch (err) {
      console.error("Error Obteniendo un Pedido", err);
      return res.status(500).end();
    }
  });

  // POST /api/v1/pedidos - Crear un nuevo pedido
  app.post("/api/v1/pedidos", async (req, res) => {
    try {
      const pedido = await creaPedido(req.body);
      return res.json(pedido);
    } catch (err) {
      console.error("Error creando un pedido", err);
      return res.status(500).end();
    }
  });

  // PATCH /api/v1/pedidos/:id - Modificar un pedido existente
  app.patch("/api/v1/pedidos/:id", async (req, res) => {
    try {
      const pedido = await modificaPedido(req.params.id, req.body);
      return res.json(pedido);
    } catch (err) {
      console.error("Error modificando Pedido", err);
      return res.status(500).end();
    }
  });

  // DELETE /api/v1/pedidos/:id - Eliminar un pedido por ID
  app.delete("/api/v1/pedidos/:id", async (req, res) => {
    try {
      const { deletedCount } = await eliminaPedido(req.params.id);
      if (deletedCount === 0) return res.sendStatus(404);
      return res.status(204).end();
    } catch (err) {
      console.error("Error Eliminando un Pedido", err);
      return res.status(500).end();
    }
  });
}