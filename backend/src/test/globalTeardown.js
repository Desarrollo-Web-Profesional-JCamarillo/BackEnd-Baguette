/**
 * Archivo de configuración global para Jest.
 * Se ejecuta DESPUÉS de todas las pruebas.
 */
export default async function globalTeardown() {
  await global.__MONGOINSTANCE.stop();
}