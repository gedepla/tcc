// ============================================================
//  WORKER: rutas públicas y tarea programada
// ============================================================
//  GET /kits.csv     → la tienda lee esto (poné este link en PLANILLA_CSV)
//  GET /kits.json    → lo mismo en JSON, con costo y ganancia
//  GET /reporte      → página con lo que pasó en la última actualización
//  GET /actualizar?clave=TU_CLAVE → corre el motor ahora
import { actualizar } from "./motor.js";

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

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (url.pathname === "/kits.csv") {
      const csv = await env.CATALOGO.get("catalogo.csv");
      return new Response(csv || "", { headers: { ...CORS, "Content-Type": "text/csv; charset=utf-8" } });
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
