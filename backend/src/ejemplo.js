// Archivo de ejemplo para probar la conexión y operaciones básicas con MongoDB
// Ejecutar con: node src/ejemplo.js

import dotenv from "dotenv";
dotenv.config();

import { initBaseDeDatos } from "./bd/init.js";
import { Pedido } from "./bd/modelos/pedido.js";

await initBaseDeDatos();

/**
 * Ejemplo de creación, actualización y consulta de pedidos utilizando Mongoose.
 */
const pedido = new Pedido({
  nombre: "Juan Gabriel Lopez Perez",
  telefono: "4181231234",
  direccion: "Calle Tamaulipas, Colonia Centro Casa Guinda",
  fecha_solicitud: "09/03/2026",
  fecha_envio: "09/03/2026",
  total: 40.0,
  pagado: ["PAGADO"],
  comentario: "Ha sido pagado y entregado el pedido",
});

// Guardar el nuevo pedido en la base de datos
const createdPedido = await pedido.save();
console.log("Pedido creado:", createdPedido);

// Actualizar el nombre del cliente para el pedido creado
await Pedido.findByIdAndUpdate(createdPedido._id, {
  $set: { nombre: "Juan Gabriel Lopez Beltran" },
});

// Consultar y mostrar todos los pedidos en la base de datos
const pedidos = await Pedido.find();
console.log("Todos los pedidos:", pedidos);

process.exit(0);