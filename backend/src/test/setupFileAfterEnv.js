import mongoose from "mongoose";
import { beforeAll, afterAll } from "@jest/globals";
import { initBaseDeDatos } from "../bd/init.js";

/**
 * Se ejecuta antes de cada suite de pruebas: conecta la BD en memoria.
 */
beforeAll(async () => {
  await initBaseDeDatos();
});

/**
 * Se ejecuta después de cada suite de pruebas: desconecta la BD.
 */
afterAll(async () => {
  await mongoose.disconnect();
});