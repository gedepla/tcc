// ============================================================
//  COMPRAS: de un pedido de WhatsApp → qué comprar y a qué proveedor
// ============================================================
//  GET /compras?clave=TU_CLAVE                → pantalla para pegar el pedido
//  GET /compras?clave=TU_CLAVE&pedido=...     → lista de compras por proveedor
//  El pedido se pega tal cual llega por WhatsApp. Cada línea de kit trae su
//  código (#46) y la cantidad (x2). Si falta el código, se busca por el nombre.
import { KITS } from "./kits.js";
import { PRODUCTOS } from "./productos.js";
import { NOMBRES_SEIVA } from "./nombres-seiva.js";

const gs = (n) => (n == null ? "–" : Math.round(n).toLocaleString("es-PY") + " Gs");
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export function proveedorDe(clave) {
  const p = PRODUCTOS[clave] || {};
  if (p.fuente === "seiva") return { proveedor: "Seiva", ref: `Código ${p.id} · ${NOMBRES_SEIVA[p.id] || p.muestra}`, link: "https://seiva.com.py" };
  if (p.fuente === "web") {
    const host = new URL(p.url).hostname;
    const proveedor = /mega/.test(host) ? "Mega Eletrônicos" : /nissei/.test(host) ? "Nissei" : host.replace(/^www\./, "");
    const ref = /mega/.test(host) ? "Código " + (p.url.match(/producto\/(\d+)/) || [])[1] : decodeURIComponent(p.url.split("/").pop());
    return { proveedor, ref, link: p.url };
  }
  return { proveedor: p.proveedor || "Manual", ref: p.ref || "", link: p.url || "" };
}

// Lee el texto del pedido y devuelve [{kit, cant}]
export function leerPedido(texto) {
  const porNombre = [...KITS].sort((a, b) => b.nombre.length - a.nombre.length);
  const res = [];
  for (const linea of String(texto || "").split(/\n/)) {
    const cod = linea.match(/#(\d{1,4})\b/);
    const lin = linea.toLowerCase();
    const porCod = cod ? KITS.find((k) => k.id === Number(cod[1])) : null;
    const porNom = porNombre.find((k) => lin.includes(k.nombre.toLowerCase()));
    // si el código y el nombre no coinciden, manda el nombre (lo que leyó el cliente)
    const kit = porNom && porCod && porNom.id !== porCod.id ? porNom : porCod || porNom;
    if (!kit) continue;
    const c = linea.match(/\bx\s*(\d{1,3})\b/i);
    const cant = c ? Number(c[1]) : 1;
    const ya = res.find((r) => r.kit.id === kit.id);
    if (ya) ya.cant += cant; else res.push({ kit, cant });
  }
  return res;
}

export function listaDeCompras(pedido, lecturas = {}) {
  const porProv = {};
  for (const { kit, cant } of pedido) {
    for (const [clave, n] of kit.items) {
      const { proveedor, ref, link } = proveedorDe(clave);
      const g = (porProv[proveedor] ||= { proveedor, items: {}, total: 0 });
      const it = (g.items[clave] ||= { clave, producto: PRODUCTOS[clave]?.muestra || clave, ref, link, cant: 0, kits: [] });
      it.cant += n * cant;
      if (!it.kits.includes("#" + kit.id)) it.kits.push("#" + kit.id);
      const l = lecturas[clave] || {};
      it.costo = l.precio ?? null;
      it.stock = l.stock;
    }
  }
  const grupos = Object.values(porProv).map((g) => {
    const items = Object.values(g.items);
    g.items = items;
    g.total = items.reduce((s, i) => s + (i.costo || 0) * i.cant, 0);
    return g;
  });
  return grupos.sort((a, b) => b.total - a.total);
}

export function paginaCompras(clave, texto, lecturas, catalogo) {
  const pedido = leerPedido(texto);
  const grupos = pedido.length ? listaDeCompras(pedido, lecturas) : [];
  const precioKit = Object.fromEntries((catalogo || []).map((k) => [k.id, k.precio]));
  const cobro = pedido.reduce((s, p) => s + (precioKit[p.kit.id] || 0) * p.cant, 0);
  const costo = grupos.reduce((s, g) => s + g.total, 0);

  const kitsHtml = pedido.map((p) => `<li><b>#${p.kit.id}</b> ${esc(p.kit.nombre)} × ${p.cant}</li>`).join("");
  const gruposHtml = grupos.map((g, gi) => {
    const textoCopiar = [`Pedido para ${g.proveedor}:`, ...g.items.map((i) => `- ${i.cant} x ${i.producto}${i.ref ? " (" + i.ref + ")" : ""}`)].join("\n");
    const filas = g.items.map((i) => `<tr${i.stock === false ? ' class="off"' : ""}>
      <td class="n">${i.cant}</td>
      <td><b>${esc(i.producto)}</b><br><small>${esc(i.ref)}</small>${i.link && !/^https:\/\/seiva\.com\.py$/.test(i.link) ? `<br><a href="${esc(i.link)}" target="_blank" rel="noopener">Ver en la tienda ↗</a>` : ""}${i.stock === false ? '<br><b class="alerta">⚠️ Sin stock en la última lectura</b>' : ""}</td>
      <td class="d">${gs(i.costo)}<br><small>${esc(i.kits.join(" "))}</small></td></tr>`).join("");
    return `<section><h2>${esc(g.proveedor)} <span>${gs(g.total)}</span></h2>
      <table>${filas}</table>
      <textarea id="t${gi}" readonly>${esc(textoCopiar)}</textarea>
      <button onclick="copiar(${gi})">📋 Copiar lista para ${esc(g.proveedor)}</button></section>`;
  }).join("");

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Compras · Tu Centro de Compras</title><style>
body{font-family:system-ui,sans-serif;margin:0;padding:14px;background:#f6f6fb;color:#1d1b2e;max-width:720px;margin-inline:auto}
h1{font-size:1.25rem;margin:.2em 0 .6em}h2{font-size:1.1rem;display:flex;justify-content:space-between;margin:0 0 8px}h2 span{color:#15803d}
textarea{width:100%;box-sizing:border-box;font:inherit;padding:10px;border:2px solid #cbd5e1;border-radius:10px}
#pedido{min-height:150px}button{font:inherit;font-weight:700;border:0;border-radius:10px;padding:12px 16px;background:#16a34a;color:#fff;width:100%;margin-top:8px}
section{background:#fff;border-radius:14px;padding:14px;margin:14px 0;box-shadow:0 1px 3px #0001}
table{width:100%;border-collapse:collapse}td{padding:8px 6px;border-bottom:1px solid #eee;vertical-align:top}
td.n{font-size:1.3rem;font-weight:800;width:2.2em;text-align:center}td.d{text-align:right;white-space:nowrap}small{color:#64748b}
tr.off td{background:#fff7ed}.alerta{color:#b45309}section textarea{height:5.5em;margin-top:10px;font-size:.85rem;background:#f8fafc}
.res{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.res div{background:#fff;border-radius:12px;padding:10px;text-align:center}.res b{display:block;font-size:1.05rem}
a{color:#2563eb}ul{padding-left:1.2em}.vacio{background:#fff7ed;padding:12px;border-radius:10px}</style></head><body>
<h1>🧾 ¿Qué comprar y a quién?</h1>
<form method="get"><input type="hidden" name="clave" value="${esc(clave)}">
<textarea id="pedido" name="pedido" placeholder="Pegá acá el pedido completo como llegó por WhatsApp">${esc(texto || "")}</textarea>
<button>Ver qué comprar</button></form>
${texto && !pedido.length ? '<p class="vacio">No encontré kits en ese texto. Fijate que esté el código (#46) o el nombre del kit.</p>' : ""}
${pedido.length ? `<section><h2>Pedido</h2><ul>${kitsHtml}</ul>
<div class="res"><div>Cobrás<b>${gs(cobro)}</b></div><div>Comprás<b>${gs(costo)}</b></div><div>Te queda<b>${gs(cobro - costo)}</b></div></div>
<small>“Te queda” incluye el delivery que ya está sumado en el precio. Costos según la última lectura de cada tienda.</small></section>${gruposHtml}` : ""}
<script>function copiar(i){const t=document.getElementById('t'+i);const ok=()=>{event.target.textContent='✅ Copiado'};navigator.clipboard?navigator.clipboard.writeText(t.value).then(ok,()=>{t.select();document.execCommand('copy');ok()}):(t.select(),document.execCommand('copy'),ok())}</script>
</body></html>`;
}
