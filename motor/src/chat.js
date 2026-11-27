// ============================================================
//  KARRITO: la mascota que responde a los clientes en la tienda
// ============================================================
//  POST /chat  { mensajes: [{ rol: "cliente" | "karrito", texto }], ciudad? }
//  → { texto, kits: [ids recomendados] }
//
//  Responde con Claude (Anthropic) si está cargado el secreto ANTHROPIC_API_KEY.
//  Si no hay clave, o Claude no responde, usa la IA de Cloudflare (binding AI).
//  Si ninguna responde, manda al cliente al WhatsApp.

const MODELO_CLAUDE = "claude-haiku-5-5";
const MODELO_CF = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const WHATSAPP = "0992 500 100";

const CATEGORIAS = {
  longevidad: "Salud y vitaminas", fitness: "Fitness y gym (proteínas, suplementos, accesorios)", gym: "Hombre",
  piel: "Belleza y cuidado de la piel", cabello: "Cabello", perfumes: "Perfumes", tecno: "Tecnología",
  hogar: "Hogar y tereré", mascotas: "Mascotas", bebe: "Bebé", regalos: "Regalos",
};
const CERCA = ["Ciudad del Este", "Presidente Franco", "Hernandarias", "Minga Guazú"];
const LEJOS = ["Asunción", "Luque", "San Lorenzo", "Capiatá", "Lambaré", "Fernando de la Mora", "Limpio", "Ñemby",
  "Mariano Roque Alonso", "Villa Elisa", "San Antonio", "Itauguá", "Areguá", "Ypacaraí", "Caacupé", "Encarnación",
  "Coronel Oviedo", "Caaguazú", "Villarrica", "Pedro Juan Caballero", "Concepción", "Salto del Guairá", "Santa Rita",
  "San Estanislao (Santaní)", "Curuguaty", "Pilar", "San Juan Bautista", "Paraguarí", "Ayolas", "San Pedro de Ycuamandiyú",
  "Hohenau", "Obligado", "Bella Vista", "Katueté", "Juan E. O'Leary", "Santa Rosa del Monday", "Los Cedrales", "Naranjal", "Filadelfia"];

const gs = (n) => n.toLocaleString("es-PY") + " Gs";

// Catálogo en texto, solo lo que hoy está a la venta (con precio y stock).
export function catalogoTexto(catalogo, corto = false) {
  return catalogo
    .filter((k) => k.activo && k.precio)
    .map((k) => {
      const base = `#${k.id} | ${k.nombre} | ${CATEGORIAS[k.categoria] || k.categoria}${k.suelto ? " | producto suelto" : ""} | ${gs(k.precio)}`;
      return corto ? base : `${base} | trae: ${(k.productos || []).join("; ")}`;
    })
    .join("\n");
}

function instrucciones(catalogo, corto) {
  return `Sos Karrito, la mascota de "Tu Centro de Compras" (TCC): un carrito de compras simpático que atiende a los clientes en la tienda web.

QUÉ VENDE TCC
Kits armados (y algunos productos sueltos) con productos originales comprados en tiendas de Ciudad del Este (Seiva, Mega Eletrônicos, Nissei, Visão VIP) y entregados sellados. Categorías: ${Object.values(CATEGORIAS).join(", ")}.

CÓMO SE PIDE
El cliente toca "Lo quiero" en los kits, completa sus datos y la ubicación GPS, y el pedido se manda por WhatsApp al ${WHATSAPP}. Ahí se confirma todo.

ENVÍOS Y PAGOS
- Cerca de Ciudad del Este (hasta 20 km: ${CERCA.join(", ")}): envío incluido en el precio. Paga en efectivo al recibir o por transferencia.
- Resto del país (${LEJOS.join(", ")} y otras ciudades): paga los productos por transferencia ANTES del envío, y el envío lo paga al recibir. Solo transferencia.
- No inventes plazos de entrega, costos de envío exactos ni promociones: decí que se coordinan por WhatsApp al ${WHATSAPP}.

TU TRABAJO
- Ayudá SIEMPRE a elegir. Si piden un regalo, algo de belleza, fitness, salud, tecnología, hogar, mascotas, bebé o lo que sea, recomendá de 1 a 3 opciones del catálogo que de verdad sirvan, explicando en pocas palabras por qué cada una (para quién es, qué trae).
- Si falta un dato clave (para quién es, presupuesto, ocasión), recomendá igual algo y hacé UNA pregunta corta para afinar.
- Si piden algo que no está en el catálogo, decilo con honestidad y ofrecé lo más parecido que sí haya.
- Usá los precios EXACTOS del catálogo. Nunca inventes kits, productos ni precios.
- Cada vez que recomiendes un kit, escribí su código entre corchetes así: [#123]. La tienda lo convierte en una tarjeta con el botón "Lo quiero".
- No des consejos médicos: para salud o suplementos, sugerí consultar con un profesional si tiene alguna condición.

CÓMO HABLÁS
Español de Paraguay, con voseo ("vos querés", "fijate"), cálido y alegre, con algún toque en guaraní de vez en cuando (¡Mba'éichapa!, ¡Iporã!, ¡Aguyje!). Respuestas cortas: máximo 70 palabras más los códigos. Texto simple, sin listas largas ni títulos.

CATÁLOGO DE HOY (código | nombre | categoría | precio${corto ? "" : " | qué trae"})
${catalogoTexto(catalogo, corto)}`;
}

function limpiarMensajes(mensajes, ciudad) {
  const lista = (Array.isArray(mensajes) ? mensajes : [])
    .slice(-10)
    .map((m) => ({ role: m.rol === "karrito" ? "assistant" : "user", content: String(m.texto || "").slice(0, 600).trim() }))
    .filter((m) => m.content);
  while (lista.length && lista[0].role !== "user") lista.shift();
  if (ciudad && lista.length) lista[lista.length - 1].content += `\n(El cliente eligió la ciudad: ${String(ciudad).slice(0, 60)})`;
  return lista;
}

async function conClaude(env, catalogo, mensajes) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: env.MODELO_KARRITO || MODELO_CLAUDE,
      max_tokens: 400,
      system: [{ type: "text", text: instrucciones(catalogo, false), cache_control: { type: "ephemeral" } }],
      messages: mensajes,
    }),
  });
  if (!r.ok) throw new Error("Claude " + r.status + ": " + (await r.text()).slice(0, 200));
  const j = await r.json();
  return (j.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
}

async function conCloudflare(env, catalogo, mensajes) {
  const r = await env.AI.run(MODELO_CF, {
    messages: [{ role: "system", content: instrucciones(catalogo, true) }, ...mensajes],
    max_tokens: 400,
  });
  return String(r?.response || "").trim();
}

// Saca los [#123] del texto: la tienda los muestra como tarjetas.
export function separarKits(texto, catalogo) {
  const visibles = new Set(catalogo.filter((k) => k.activo && k.precio).map((k) => String(k.id)));
  const kits = [];
  for (const m of texto.matchAll(/\[#?(\d{1,5})\]/g)) if (visibles.has(m[1]) && !kits.includes(m[1])) kits.push(m[1]);
  const limpio = texto.replace(/\s*\[#?\d{1,5}\]/g, "").replace(/\*\*/g, "").replace(/[ \t]+\n/g, "\n").trim();
  return { texto: limpio, kits: kits.slice(0, 3) };
}

export async function responderChat(req, env) {
  let cuerpo;
  try { cuerpo = await req.json(); } catch { return { texto: "No te entendí, ¿me escribís de nuevo?", kits: [] }; }
  const mensajes = limpiarMensajes(cuerpo.mensajes, cuerpo.ciudad);
  if (!mensajes.length) return { texto: "¡Mba'éichapa! Contame qué buscás y te ayudo a elegir.", kits: [] };
  const catalogo = JSON.parse((await env.CATALOGO.get("catalogo.json")) || "[]");

  let texto = "", motor = "";
  if (env.ANTHROPIC_API_KEY) {
    try { texto = await conClaude(env, catalogo, mensajes); motor = "claude"; } catch (e) { console.log(String(e)); }
  }
  if (!texto && env.AI) {
    try { texto = await conCloudflare(env, catalogo, mensajes); motor = "cloudflare"; } catch (e) { console.log(String(e)); }
  }
  if (!texto) return { texto: `Uy, ahora no puedo responder. Escribinos al WhatsApp ${WHATSAPP} y te atendemos al toque.`, kits: [], whatsapp: true };
  return { ...separarKits(texto, catalogo), motor };
}
