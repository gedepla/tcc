// ============================================================
//  PEDIDOS DESDE LA WEB (para quien no tiene WhatsApp abierto, por ejemplo en la PC)
// ============================================================
//  POST /pedido  { texto, celular, correo } → guarda el pedido y devuelve su número
//  GET  /pedidos?clave=TU_CLAVE → lista de pedidos recibidos por la web
//  El aviso por correo a gedepla@gmail.com lo manda la tienda (FormSubmit) apenas se envía.

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export async function guardarPedido(req, env) {
  let p;
  try { p = await req.json(); } catch { return { ok: false, error: "Pedido ilegible" }; }
  const texto = String(p.texto || "").slice(0, 4000).trim();
  const celular = String(p.celular || "").replace(/[^\d+ ]/g, "").slice(0, 20).trim();
  const correo = String(p.correo || "").slice(0, 120).trim();
  if (!texto || celular.replace(/\D/g, "").length < 6) return { ok: false, error: "Falta el pedido o el celular" };
  const ultimo = parseInt((await env.CATALOGO.get("pedidos:ultimo")) || "0", 10);
  const numero = ultimo + 1;
  const pedido = { numero, fecha: new Date().toISOString(), texto, celular, correo, ip: req.headers.get("CF-Connecting-IP") || "" };
  await env.CATALOGO.put("pedidos:ultimo", String(numero));
  await env.CATALOGO.put("pedido:" + String(numero).padStart(6, "0"), JSON.stringify(pedido), { expirationTtl: 60 * 60 * 24 * 180 });
  return { ok: true, numero };
}

export async function paginaPedidos(env, clave, origen) {
  const lista = await env.CATALOGO.list({ prefix: "pedido:" });
  const claves = lista.keys.map((k) => k.name).sort().reverse().slice(0, 100);
  const pedidos = (await Promise.all(claves.map((k) => env.CATALOGO.get(k)))).filter(Boolean).map((j) => JSON.parse(j));
  const wa = (cel) => { const d = cel.replace(/\D/g, ""); return d.startsWith("595") ? d : "595" + d.replace(/^0/, ""); };
  const filas = pedidos.map((p) => {
    const codigos = [...p.texto.matchAll(/#(\d+)[^\n]*?x(\d+)/g)].map((m) => `#${m[1]} x${m[2]}`).join("\n");
    return `<article><header><b>Pedido N° ${p.numero}</b><span>${new Date(p.fecha).toLocaleString("es-PY", { timeZone: "America/Asuncion" })}</span></header>
<pre>${esc(p.texto)}</pre>
<p>📱 ${esc(p.celular)}${p.correo ? ` · ✉️ ${esc(p.correo)}` : ""}</p>
<p class="acciones"><a href="https://wa.me/${wa(p.celular)}?text=${encodeURIComponent(`¡Hola! Te escribimos de Tu Centro de Compras por tu pedido N° ${p.numero}.`)}" target="_blank">Escribirle por WhatsApp</a>
<a href="${origen}/compras?clave=${encodeURIComponent(clave)}&pedido=${encodeURIComponent(codigos)}" target="_blank">Qué comprar y dónde</a></p></article>`;
  }).join("") || "<p>Todavía no llegó ningún pedido por la web.</p>";
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pedidos web · TCC</title>
<style>body{font-family:system-ui,sans-serif;margin:0;padding:16px;background:#eef2f8;color:#14213d;max-width:760px;margin:auto}h1{font-size:1.3rem}
article{background:#fff;border:1px solid #d9e0ec;border-radius:12px;padding:12px 14px;margin:0 0 12px}header{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}
header span{color:#55617a;font-size:.9rem}pre{white-space:pre-wrap;font:inherit;font-size:.95rem;background:#f6f8fc;border-radius:8px;padding:10px;margin:8px 0}
.acciones{display:flex;gap:8px;flex-wrap:wrap}.acciones a{background:#1f4fd1;color:#fff;text-decoration:none;font-weight:700;padding:8px 12px;border-radius:999px}.acciones a:first-child{background:#25d366;color:#0b2e17}</style></head>
<body><h1>Pedidos que llegaron por la web</h1><p>Los últimos 100, el más nuevo arriba. También te llegan al correo.</p>${filas}</body></html>`;
}
