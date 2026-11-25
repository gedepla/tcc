// ============================================================
//  PLANILLA EN VIVO: los 260 kits con foto, proveedor y códigos
// ============================================================
//  GET /planilla?clave=TU_CLAVE      → página con todos los kits (se actualiza sola)
//  GET /planilla.csv?clave=TU_CLAVE  → lo mismo para abrir en Excel
import { KITS } from "./kits.js";
import { PRODUCTOS } from "./productos.js";
import { proveedorDe } from "./compras.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const gs = (n) => (n == null ? "–" : Math.round(n).toLocaleString("es-PY") + " Gs");
const CAT = { longevidad: "Salud", gym: "Hombre", piel: "Piel", cabello: "Cabello", perfumes: "Perfume", tecno: "Tecno", hogar: "Hogar", mascotas: "Mascota", bebe: "Bebé", regalos: "Regalos" };
const POR_MOTOR = ["seiva.com.py"];
export const fotoVisible = (origen, f) => (f && POR_MOTOR.some((b) => f.includes(b)) ? origen + "/foto?u=" + encodeURIComponent(f) : f || "");

// Una fila por kit, con lo que hay que pedir a su proveedor.
export function filasPlanilla(catalogo, lecturas, imagenes) {
  const porId = new Map(catalogo.map((k) => [k.id, k]));
  return KITS.map((kit) => {
    const v = porId.get(kit.id) || {};
    const items = kit.items.map(([c, n]) => {
      const p = proveedorDe(c);
      return { cant: n, producto: PRODUCTOS[c]?.muestra || c, ref: p.ref, link: p.link, costo: lecturas[c]?.precio ?? null, stock: lecturas[c]?.stock, foto: lecturas[c]?.imagen || imagenes[c] || null };
    });
    return {
      id: kit.id, nombre: kit.nombre, categoria: CAT[kit.categoria] || kit.categoria, masVendido: kit.destacado,
      proveedor: [...new Set(kit.items.map(([c]) => proveedorDe(c).proveedor))].join(" + "),
      precio: v.precio ?? null, costo: v.costo ?? null, ganancia: v.ganancia ?? null,
      visible: !!v.activo, motivo: (v.motivos || []).join("; "), fotos: v.fotos?.length ? v.fotos : items.map((i) => i.foto).filter(Boolean), items,
    };
  });
}

const celda = (v) => { const s = v == null ? "" : String(v); return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };

export function planillaCSV(filas, origen) {
  const cab = ["Código", "Kit", "Categoría", "Proveedor", "Precio", "Costo", "Ganancia", "Estado", "Cantidad", "Producto", "Código en el proveedor", "Costo unidad", "Link del producto", "Foto"];
  const out = [cab];
  for (const f of filas) for (const i of f.items) out.push([f.id, f.nombre, f.categoria, f.proveedor, f.precio, f.costo, f.ganancia, f.visible ? "Visible" : "Oculto: " + f.motivo, i.cant, i.producto, i.ref, i.costo, i.link, fotoVisible(origen, i.foto)]);
  // punto y coma: Excel en español lo abre directo en columnas
  return "﻿" + out.map((r) => r.map(celda).join(";")).join("\r\n") + "\r\n";
}

export function paginaPlanilla(filas, clave, origen, actualizado) {
  const provs = [...new Set(filas.map((f) => f.proveedor))].sort();
  const visibles = filas.filter((f) => f.visible).length;
  const tarjetas = filas.map((f) => `
<article data-prov="${esc(f.proveedor)}" data-vis="${f.visible ? 1 : 0}" data-txt="${esc((f.id + " " + f.nombre + " " + f.categoria + " " + f.items.map((i) => i.producto + " " + i.ref).join(" ")).toLowerCase())}" class="${f.visible ? "" : "off"}">
  <div class="fotos">${f.fotos.slice(0, 4).map((u) => `<img loading="lazy" src="${esc(fotoVisible(origen, u))}" alt="" referrerpolicy="no-referrer">`).join("") || '<div class="sinfoto">Sin foto</div>'}</div>
  <div class="info">
    <h2><span class="cod">#${f.id}</span> ${esc(f.nombre)}${f.masVendido ? ' <span class="mv">Más vendido</span>' : ""}</h2>
    <p class="meta"><b class="prov">${esc(f.proveedor)}</b> · ${esc(f.categoria)} · ${f.visible ? '<span class="ok">Visible</span>' : '<span class="no">Oculto: ' + esc(f.motivo) + "</span>"}</p>
    <p class="plata">Precio <b>${gs(f.precio)}</b> · Costo ${gs(f.costo)} · Ganancia <b>${gs(f.ganancia)}</b></p>
    <ul>${f.items.map((i) => `<li><b>${i.cant} ×</b> ${esc(i.producto)} <small>— ${esc(i.ref)} · ${gs(i.costo)}${i.stock === false ? ' · <span class="no">sin stock</span>' : ""}</small>${i.link && !/^https:\/\/seiva\.com\.py$/.test(i.link) ? ` <a href="${esc(i.link)}" target="_blank" rel="noopener">ver ↗</a>` : ""}</li>`).join("")}</ul>
  </div>
</article>`).join("");
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Planilla de kits · Tu Centro de Compras</title><style>
body{font-family:system-ui,sans-serif;margin:0;background:#f6f6fb;color:#1d1b2e}
header{position:sticky;top:0;background:#fff;padding:12px 14px;box-shadow:0 1px 4px #0002;z-index:2}
h1{font-size:1.15rem;margin:0 0 4px}.res{margin:0 0 8px;color:#475569;font-size:.9rem}
.filtros{display:flex;gap:8px;flex-wrap:wrap}.filtros input,.filtros select{font:inherit;padding:9px 10px;border:2px solid #cbd5e1;border-radius:10px;min-width:0;flex:1 1 160px}
.filtros a{font-weight:700;background:#16a34a;color:#fff;text-decoration:none;padding:10px 14px;border-radius:10px;white-space:nowrap}
main{padding:12px;display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(min(100%,460px),1fr))}
article{background:#fff;border-radius:14px;padding:12px;display:flex;gap:12px;box-shadow:0 1px 3px #0001}
article.off{background:#fff7ed}.fotos{display:grid;grid-template-columns:1fr 1fr;gap:4px;width:120px;flex:none;align-content:start}
.fotos img{width:100%;aspect-ratio:1;object-fit:contain;background:#fff;border:1px solid #eee;border-radius:8px}.fotos img:only-child{grid-column:span 2}
.sinfoto{grid-column:span 2;aspect-ratio:1;display:grid;place-items:center;background:#fee2e2;border-radius:8px;color:#b91c1c;font-weight:700}
.info{min-width:0}h2{font-size:1rem;margin:0 0 4px}.cod{color:#7c3aed}.mv{font-size:.7rem;background:#fde68a;padding:2px 6px;border-radius:6px;vertical-align:middle}
.meta,.plata{margin:2px 0;font-size:.85rem}.prov{color:#1d4ed8}.ok{color:#15803d;font-weight:700}.no{color:#b45309;font-weight:700}
ul{margin:6px 0 0;padding-left:1.1em;font-size:.88rem}li{margin:3px 0}small{color:#64748b}a{color:#2563eb}
</style></head><body>
<header><h1>📋 Planilla de kits</h1>
<p class="res">${filas.length} kits · ${visibles} visibles · ${filas.length - visibles} ocultos por stock · actualizado ${esc(actualizado)}</p>
<div class="filtros"><input id="q" placeholder="Buscar código, kit o producto"><select id="p"><option value="">Todos los proveedores</option>${provs.map((p) => `<option>${esc(p)}</option>`).join("")}</select>
<select id="v"><option value="">Visibles y ocultos</option><option value="1">Solo visibles</option><option value="0">Solo ocultos</option></select>
<a href="/planilla.csv?clave=${encodeURIComponent(clave)}">⬇️ Bajar Excel</a></div></header>
<main id="lista">${tarjetas}</main>
<script>
const q=document.getElementById('q'),p=document.getElementById('p'),v=document.getElementById('v');
function filtrar(){const t=q.value.trim().toLowerCase();document.querySelectorAll('article').forEach(a=>{a.hidden=(t&&!a.dataset.txt.includes(t))||(p.value&&a.dataset.prov!==p.value)||(v.value&&a.dataset.vis!==v.value)})}
[q,p,v].forEach(e=>e.addEventListener('input',filtrar));
document.querySelectorAll('.fotos img').forEach(i=>i.addEventListener('error',()=>{i.remove()}));
</script></body></html>`;
}
