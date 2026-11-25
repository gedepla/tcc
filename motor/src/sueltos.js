// ============================================================
//  PRODUCTOS SUELTOS: cada producto también se vende solo
// ============================================================
//  Solo se muestra si su costo es de CONFIG.minimoSuelto para arriba (el envío
//  tiene que entrar en el precio). Código: 1001, 1002… en el orden de productos.js,
//  por eso los productos nuevos se agregan siempre al final de esa lista.
import { KITS } from "./kits.js";
import { PRODUCTOS } from "./productos.js";

const categoriaDe = (clave) => PRODUCTOS[clave].cat || KITS.find((k) => k.items.some(([c]) => c === clave))?.categoria || "regalos";

export const SUELTOS = Object.keys(PRODUCTOS).map((clave, i) => ({
  id: 1001 + i, categoria: categoriaDe(clave), nombre: PRODUCTOS[clave].muestra, items: [[clave, 1]],
  destacado: false, etiqueta: "Producto", fotos: [], suelto: true,
}));

// Todo lo que se vende: kits + productos sueltos
export const TODOS = [...KITS, ...SUELTOS];
