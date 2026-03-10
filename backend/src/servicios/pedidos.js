// servicios/pedidos.js
import { Pedido } from "../bd/modelos/pedido.js";

/**
 * Función para crear un nuevo pedido en la base de datos.
 * @param {*} pedido - Objeto con los detalles del pedido
 * @returns {Promise<Pedido>} - El pedido creado en la base de datos.
 */
export async function creaPedido({
  nombre,
  telefono,
  direccion,
  fecha_solicitud,
  fecha_envio,
  total,
  pagado,
  abono,
  comentario,
}) {
  const pedido = new Pedido({
    nombre,
    telefono,
    direccion,
    fecha_solicitud,
    fecha_envio,
    total,
    pagado,
    abono,
    comentario,
  });
  return await pedido.save();
}

/**
 * Función base para obtener pedidos con filtro y ordenamiento.
 * @param {*} query Tipo de consulta
 * @param {*} param1 Opciones de ordenamiento
 * @returns {Promise<Array>}
 */
export async function listaPedidos(
  query = {},
  { sortBy = "createdAt", sortOrder = "descending" } = {},
) {
  return await Pedido.find(query).sort({ [sortBy]: sortOrder });
}

/**
 * Función para obtener todos los pedidos.
 * @param {*} opciones
 * @returns {Promise<Array>}
 */
export async function listaAllPedidos(opciones) {
  return await listaPedidos({}, opciones);
}

/**
 * Función para obtener pedidos filtrados por nombre del cliente.
 * @param {*} nombre
 * @param {*} opciones
 * @returns {Promise<Array>}
 */
export async function listaPedidosByNombre(nombre, opciones) {
  return await listaPedidos({ nombre }, opciones);
}

/**
 * Función para obtener pedidos filtrados por estado de pago.
 * @param {*} pagado
 * @param {*} opciones
 * @returns {Promise<Array>}
 */
export async function listPedidosByPagado(pagado, opciones) {
  return await listaPedidos({ pagado }, opciones);
}

/**
 * Función para obtener un pedido específico por su ID.
 * @param {*} pedidoId
 * @returns {Promise<Pedido>}
 */
export async function getPedidoById(pedidoId) {
  return await Pedido.findById(pedidoId);
}

/**
 * Función para modificar un pedido existente por su ID.
 * @param {*} pedidoId
 * @param {*} datos
 * @returns {Promise<Pedido>}
 */
export async function modificaPedido(
  pedidoId,
  {
    nombre,
    telefono,
    direccion,
    fecha_solicitud,
    fecha_envio,
    total,
    pagado,
    abono,
    comentario,
  },
) {
  return await Pedido.findOneAndUpdate(
    { _id: pedidoId },
    {
      $set: {
        nombre,
        telefono,
        direccion,
        fecha_solicitud,
        fecha_envio,
        total,
        pagado,
        abono,
        comentario,
      },
    },
    { new: true },
  );
}

/**
 * Elimina un pedido de la base de datos por su ID.
 * @param {*} pedidoId
 * @returns {Promise<Object>}
 */
export async function eliminaPedido(pedidoId) {
  return await Pedido.deleteOne({ _id: pedidoId });
}