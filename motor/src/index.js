// ============================================================
//  WORKER: rutas públicas y tarea programada
// ============================================================
//  GET /kits.csv     → la tienda lee esto (poné este link en PLANILLA_CSV)
//  GET /kits.json    → lo mismo en JSON, con costo y ganancia
//  GET /reporte      → página con lo que pasó en la última actualización
//  GET /actualizar?clave=TU_CLAVE → corre el motor ahora
//  GET /compras?clave=TU_CLAVE    → pegás un pedido y te dice qué comprar a cada proveedor
//  GET /planilla.json?clave=TU_CLAVE → kits, productos y proveedores (para archivar)
//  GET /planilla?clave=TU_CLAVE   → los 260 kits con foto, proveedor y códigos (en vivo)
//  GET /planilla.csv?clave=TU_CLAVE → lo mismo para Excel
//  POST /pedido      → pedido enviado desde la web (sin WhatsApp)
//  GET /pedidos?clave=TU_CLAVE → pedidos que llegaron por la web
//  POST /chat        → Karrito, la mascota que responde a los clientes
import { actualizar } from "./motor.js";
import { paginaCompras, proveedorDe } from "./compras.js";
import { PRODUCTOS } from "./productos.js";
import { TODOS as KITS } from "./sueltos.js";
import { filasPlanilla, paginaPlanilla, planillaCSV } from "./planilla.js";
import { responderChat } from "./chat.js";
import { guardarPedido, paginaPedidos } from "./pedidos.js";

const CORS = { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=300" };
const gs = (n) => (n == null ? "–" : n.toLocaleString("es-PY") + " Gs");
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function paginaReporte(r, kits) {
  if (!r) return "<p>Todavía no corrió ninguna actualización. Abrí /actualizar?clave=… para correrla.</p>";
  const filas = kits
    .map((k) => `<tr class="${k.activo ? "" : "off"}"><td>${k.id}</td><td>${esc(k.nombre)}</td><td>${gs(k.costo)}</td><td>${gs(k.precio)}</td><td>${gs(k.ganancia)}</td><td>${k.activo ? "Visible" : "Oculto: " + esc(k.motivos.join("; "))}</td></tr>`)
    .join("");
  const avisos = (r.avisos || []).map((a) => `<li>${esc(a.producto)}: ${esc(a.aviso)}</li>`).join("");
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Motor de kits</title><style>
body{font-family:system-ui,sans-serif;margin:0;padding:16px;background:#f6f6fb;color:#1d1b2e}
h1{font-size:1.3rem}table{border-collapse:collapse;width:100%;background:#fff;font-size:.9rem}
td,th{padding:6px 8px;border-bottom:1px solid #e5e3ef;text-align:left;vertical-align:top}
tr.off td{color:#9a3412;background:#fff7ed}.box{overflow-x:auto}.res{display:flex;gap:16px;flex-wrap:wrap;margin:12px 0}
.res div{background:#fff;padding:10px 14px;border-radius:10px}</style></head><body>
<h1>Motor de kits · Tu Centro de Compras</h1>
<p>Última actualización: ${new Date(r.actualizado).toLocaleString("es-PY", { timeZone: "America/Asuncion" })} (${r.segundos} s)</p>
<div class="res"><div><b>${r.kitsActivos}</b> kits visibles</div><div><b>${r.kitsOcultos}</b> kits ocultos</div></div>
${avisos ? `<h2>Tiendas que no respondieron (se usó el último precio)</h2><ul>${avisos}</ul>` : ""}
<div class="box"><table><tr><th>#</th><th>Kit</th><th>Costo</th><th>Precio</th><th>Ganancia</th><th>Estado</th></tr>${filas}</table></div>
</body></html>`;
}

// Las fotos de algunos proveedores (Seiva) no se dejan mostrar en otras páginas:
// el motor las trae y las entrega él, guardadas una semana en la caché de Cloudflare.
const FOTOS_PERMITIDAS = ["seiva.com.py", "resource.megaeletronicos.com", "www.megaeletronicos.com", "nissei.com"];
async function foto(url, ctx) {
  let origen;
  try { origen = new URL(url.searchParams.get("u") || ""); } catch { return new Response("Falta la foto", { status: 400 }); }
  if (origen.protocol !== "https:" || !FOTOS_PERMITIDAS.includes(origen.hostname)) return new Response("Proveedor no permitido", { status: 403 });
  const cache = caches.default;
  const clave = new Request(url.toString());
  const guardada = await cache.match(clave);
  if (guardada) return guardada;
  const r = await fetch(origen.toString(), { headers: { "User-Agent": "Mozilla/5.0", Accept: "image/*" }, cf: { cacheTtl: 604800 } });
  const tipo = r.headers.get("Content-Type") || "";
  if (!r.ok || !tipo.startsWith("image/")) return new Response("No se pudo traer la foto", { status: 502 });
  const resp = new Response(r.body, { headers: { "Content-Type": tipo, "Cache-Control": "public, max-age=604800", "Access-Control-Allow-Origin": "*", "Cross-Origin-Resource-Policy": "cross-origin" } });
  ctx.waitUntil(cache.put(clave, resp.clone()));
  return resp;
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (url.pathname === "/pedido") {
      const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
      if (req.method === "OPTIONS") return new Response(null, { headers: cors });
      if (req.method !== "POST") return new Response("Usá POST", { status: 405, headers: cors });
      const r = await guardarPedido(req, env);
      return Response.json(r, { status: r.ok ? 200 : 400, headers: { ...cors, "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/pedidos") {
      if (!env.CLAVE || url.searchParams.get("clave") !== env.CLAVE) return new Response("Clave incorrecta", { status: 401 });
      return new Response(await paginaPedidos(env, env.CLAVE, url.origin), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/chat") {
      const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
      if (req.method === "OPTIONS") return new Response(null, { headers: cors });
      if (req.method !== "POST") return new Response("Usá POST", { status: 405, headers: cors });
      const r = await responderChat(req, env);
      return Response.json(r, { headers: { ...cors, "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/kits.csv") {
      const csv = await env.CATALOGO.get("catalogo.csv");
      return new Response(csv || "", { headers: { ...CORS, "Content-Type": "text/csv; charset=utf-8" } });
    }
    if (url.pathname === "/detalle.json") {
      const j = await env.CATALOGO.get("detalle.json");
      return new Response(j || '{"kits":{},"productos":{}}', { headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } });
    }
    if (url.pathname === "/kits.json") {
      const j = await env.CATALOGO.get("catalogo.json");
      return new Response(j || "[]", { headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } });
    }
    if (url.pathname === "/reporte") {
      const r = JSON.parse((await env.CATALOGO.get("reporte")) || "null");
      const k = JSON.parse((await env.CATALOGO.get("catalogo.json")) || "[]");
      return new Response(paginaReporte(r, k), { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    if (url.pathname === "/foto") return foto(url, ctx);
    if (url.pathname === "/planilla" || url.pathname === "/planilla.csv") {
      if (!env.CLAVE || url.searchParams.get("clave") !== env.CLAVE) return new Response("Clave incorrecta", { status: 401 });
      const estado = JSON.parse((await env.CATALOGO.get("estado")) || "{}");
      const catalogo = JSON.parse((await env.CATALOGO.get("catalogo.json")) || "[]");
      const rep = JSON.parse((await env.CATALOGO.get("reporte")) || "null");
      const filas = filasPlanilla(catalogo, estado.lecturas || {}, estado.imagenes || {});
      if (url.pathname === "/planilla.csv") {
        return new Response(planillaCSV(filas, url.origin), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="kits-tu-centro-de-compras.csv"', "Cache-Control": "no-store" } });
      }
      const cuando = rep ? new Date(rep.actualizado).toLocaleString("es-PY", { timeZone: "America/Asuncion" }) : "–";
      return new Response(paginaPlanilla(filas, env.CLAVE, url.origin, cuando), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/compras" || url.pathname === "/planilla.json") {
      if (!env.CLAVE || url.searchParams.get("clave") !== env.CLAVE) return new Response("Clave incorrecta", { status: 401 });
      const estado = JSON.parse((await env.CATALOGO.get("estado")) || "{}");
      const catalogo = JSON.parse((await env.CATALOGO.get("catalogo.json")) || "[]");
      const lecturas = estado.lecturas || {};
      if (url.pathname === "/compras") {
        return new Response(paginaCompras(env.CLAVE, url.searchParams.get("pedido") || "", lecturas, catalogo), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
      }
      const productos = Object.keys(PRODUCTOS).map((c) => ({ clave: c, producto: PRODUCTOS[c].muestra, ...proveedorDe(c), costo: lecturas[c]?.precio ?? null, stock: lecturas[c]?.stock ?? null, imagen: lecturas[c]?.imagen || estado.imagenes?.[c] || null }));
      const kits = catalogo.map((k) => ({ id: k.id, categoria: k.categoria, nombre: k.nombre, precio: k.precio, costo: k.costo, ganancia: k.ganancia, activo: k.activo, motivos: k.motivos, items: KITS.find((x) => x.id === k.id)?.items || [] }));
      return Response.json({ actualizado: new Date().toISOString(), kits, productos });
    }
    if (url.pathname === "/actualizar") {
      if (!env.CLAVE || url.searchParams.get("clave") !== env.CLAVE) return new Response("Clave incorrecta", { status: 401 });
      const r = await actualizar(env);
      return Response.json({ ok: true, visibles: r.kitsActivos, ocultos: r.kitsOcultos, alertas: r.alertas });
    }
    return new Response("Motor de kits funcionando. Rutas: /kits.csv /kits.json /reporte", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(actualizar(env));
  },
};
