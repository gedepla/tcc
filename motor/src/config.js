// ============================================================
//  CONFIGURACIÓN DEL MOTOR – lo único que hace falta tocar seguido
// ============================================================

export const CONFIG = {
  // Ganancia sobre el costo de los productos (0.3 = 30 %).
  margenPorDefecto: 0.3,

  // Ganancia distinta por categoría, si algún día la querés (ej. perfumes: 0.5).
  // Si una categoría no está acá, usa la de por defecto.
  margenPorCategoria: {},

  // Montos fijos que se suman al precio de cada kit (en guaraníes).
  costoDelivery: 30000,   // delivery incluido en el precio
  costoCaja: 0,           // caja, cinta, tarjeta (poné un monto si querés cobrarla aparte)
  costoPublicidad: 0,     // publicidad promedio por venta

  // Frenos automáticos
  // Productos sueltos: se venden solos si cuestan desde este monto (por el costo del envío).
  minimoSuelto: 120000,

  precioMaximo: 0,        // 0 = sin tope. Si ponés un monto (ej. 300000), los kits más caros se ocultan
  alertaSubida: 0.2,      // si un producto sube más de 20 % de un día a otro, el kit se oculta ese día

  // Redondeo: los precios terminan en 9.000 (139.000, 149.000…)
  terminacion: 9000,

  // Páginas de tiendas que se leen por corrida (el plan gratis de Cloudflare permite ~50 consultas).
  lecturasPorCorrida: 40,

  // Fotos: si un kit no tiene fotos propias, usa las fotos de los productos de cada tienda.
  fotosDeProveedores: true,
};
