// Prueba sin internet: simula Seiva, Mega y Nissei con su formato real y los 260 kits.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { actualizar, leerSchemaOrg, redondear, precioDeVenta } from "../src/motor.js";
import { PRODUCTOS } from "../src/productos.js";
import { KITS } from "../src/kits.js";
import { CONFIG } from "../src/config.js";

// costos de referencia tomados de las tiendas (24/11/2026)
const costo = {};
for (const f of ["productos.txt", "productos2.txt"]) {
  const ruta = new URL(`../datos/${f}`, import.meta.url);
  for (const l of readFileSync(ruta, "utf8").split("\n")) {
    if (!l.trim() || l.startsWith("#")) continue;
    const [clave, , , , miles] = l.split("|"); costo[clave] = Number(miles) * 1000;
  }
}
const seiva = Object.entries(PRODUCTOS).filter(([, p]) => p.fuente === "seiva")
  .map(([c, p]) => ({ id: p.id, nombre: c, precio: costo[c], stock: 3, activo: true, imagen: "x.png" }));
const html = (precio, disp = "InStock") => `<script type="application/ld+json">{"@type":"Product","image":"https://img/x.jpg","offers":{"@type":"Offer","price":"${precio}","availability":"https://schema.org/${disp}"}}</script>`;
const porUrl = Object.fromEntries(Object.entries(PRODUCTOS).filter(([, p]) => p.fuente === "web").map(([c, p]) => [p.url, c]));
function crearFetch({ sinStock = [], subida = {} } = {}) {
  return async (url) => {
    if (url.startsWith("https://seiva.com.py/api/productos")) return new Response(JSON.stringify(seiva), { status: 200 });
    const c = porUrl[url]; if (!c) return new Response("no", { status: 404 });
    return new Response(html(costo[c] * (subida[c] || 1), sinStock.includes(c) ? "OutOfStock" : "InStock"), { status: 200 });
  };
}
const kv = () => { const m = new Map(); return { get: async (k) => m.get(k) ?? null, put: async (k, v) => m.set(k, v), m }; };

// 1. Cálculos y datos
assert.equal(redondear(141000), 149000);
assert.equal(precioDeVenta(150000, "longevidad"), redondear(150000 * 1.3 + 30000));
assert.equal(leerSchemaOrg(html(94144)).precio, 94144);
assert.equal(KITS.length, 260);
assert.equal(new Set(KITS.map((k) => k.id)).size, 260, "ids únicos");
for (const k of KITS) for (const [c] of k.items) assert.ok(PRODUCTOS[c], `kit ${k.id}: producto ${c} no existe`);
for (const c of Object.keys(PRODUCTOS)) assert.ok(costo[c], `sin costo de referencia: ${c}`);

// 2. Lectura en tandas: nunca más de 45 consultas por corrida y en pocas corridas se lee todo
const env = { CATALOGO: kv() };
let corridas = 0, max = 0;
for (;;) {
  let n = 0; const f = crearFetch();
  const r = await actualizar(env, (u, o) => { n++; return f(u, o); });
  corridas++; max = Math.max(max, n);
  const pend = JSON.parse(env.CATALOGO.m.get("catalogo.json")).filter((k) => k.motivos.some((m) => /todavía/.test(m))).length;
  if (!pend) { console.log(`Todo leído en ${corridas} corridas · máximo ${max} consultas por corrida · visibles ${r.kitsActivos} de 260`); break; }
  assert.ok(corridas < 12, "demasiadas corridas para leer todo");
}
assert.ok(max <= 45, `consultas por corrida: ${max}`);
const kits = JSON.parse(env.CATALOGO.m.get("catalogo.json"));
assert.equal(kits.filter((k) => k.activo).length, 260, "con todo en stock se ven los 260");
assert.ok(kits.every((k) => k.precio <= CONFIG.precioMaximo));

// 3. Un producto sin stock oculta solo sus kits
const unoWeb = "kshamp";
for (let i = 0; i < 8; i++) await actualizar(env, crearFetch({ sinStock: [unoWeb] }));
const k3 = JSON.parse(env.CATALOGO.m.get("catalogo.json"));
const afectados = KITS.filter((k) => k.items.some(([c]) => c === unoWeb)).map((k) => k.id);
assert.ok(afectados.every((id) => !k3.find((k) => k.id === id).activo), "kits con el producto sin stock quedan ocultos");
assert.equal(k3.filter((k) => k.activo).length, 260 - afectados.length);
console.log(`Sin stock "${unoWeb}": se ocultan ${afectados.length} kits, el resto sigue visible.`);
console.log("Todas las pruebas pasaron.");
