// ============================================================
//  MOTOR: lee proveedores, calcula kits y arma el catálogo
// ============================================================
import { CONFIG } from "./config.js";
import { PRODUCTOS } from "./productos.js";
import { KITS } from "./kits.js";

const UA = "Mozilla/5.0 (compatible; TuCentroDeCompras-precios/1.0)";
const SEIVA = "https://seiva.com.py";

// ---------- Lectura de proveedores ----------

async function conTiempo(fetchFn, url, ms = 15000, accept = "text/html,application/json;q=0.9,*/*;q=0.8") {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    return await fetchFn(url, { signal: ctl.signal, headers: { "User-Agent": UA, Accept: accept, "Accept-Language": "es-PY,es;q=0.9" } });
  } finally {
    clearTimeout(t);
  }
}

// Lee el precio, el stock y la foto que la página publica con el estándar schema.org.
export function leerSchemaOrg(html) {
  const bloques = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const candidatos = [];
  const recorrer = (o) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) return o.forEach(recorrer);
    const tipo = [].concat(o["@type"] || []);
    if (tipo.includes("Product")) candidatos.push(o);
    // Productos con variantes (colores, tamaños): el precio está en cada variante.
    if (o.hasVariant) [].concat(o.hasVariant).forEach((v) => recorrer({ ...v, image: v.image || o.image }));
    if (o["@graph"]) recorrer(o["@graph"]);
  };
  for (const b of bloques) {
    try { recorrer(JSON.parse(b)); } catch { /* bloque roto: se ignora */ }
  }
  const leidos = [];
  for (const p of candidatos) {
    const oferta = [].concat(p.offers || [])[0];
    if (!oferta) continue;
    const precio = Math.round(parseFloat(String(oferta.price ?? oferta.lowPrice ?? "").replace(/[^\d.]/g, "")));
    if (!precio) continue;
    const disp = String(oferta.availability || "");
    const stock = disp ? /InStock|LimitedAvailability|PreOrder/i.test(disp) : true;
    const imagen = [].concat(p.image || [])[0];
    leidos.push({ precio, stock, imagen: typeof imagen === "object" ? imagen.url : imagen || null });
  }
  // Si hay variantes, se toma la primera con stock (o la primera, si ninguna tiene).
  if (leidos.length) return leidos.find((l) => l.stock) || leidos[0];
  // Respaldo: meta product:price:amount
  const meta = html.match(/product:price:amount"\s+content="([\d.]+)"/i);
  if (meta) return { precio: Math.round(parseFloat(meta[1])), stock: !/Sin stock|Agotado|OutOfStock/i.test(html), imagen: null };
  return null;
}

async function leerSeiva(fetchFn) {
  let r = await conTiempo(fetchFn, SEIVA + "/api/productos", 15000, "application/json");
  if (r.status >= 500) r = await conTiempo(fetchFn, SEIVA + "/api/productos", 15000, "application/json"); // un reintento
  if (!r.ok) throw new Error("Seiva respondió " + r.status);
  const datos = await r.json();
  const lista = Array.isArray(datos) ? datos : datos.productos || datos.data || [];
  const porId = new Map(lista.map((p) => [Number(p.id), p]));
  return (id) => {
    const p = porId.get(Number(id));
    if (!p) return { error: "no está en el catálogo de Seiva" };
    const img = p.imagen ? (p.imagen.startsWith("/") ? SEIVA + p.imagen : SEIVA + "/img/productos/" + p.imagen) : null;
    return { precio: Math.round(Number(p.precio)), stock: p.activo !== false && Number(p.stock) > 0, imagen: img };
  };
}

async function enTandas(lista, tam, fn) {
  const out = [];
  for (let i = 0; i < lista.length; i += tam) out.push(...(await Promise.all(lista.slice(i, i + tam).map(fn))));
  return out;
}

export async function leerProductos(fetchFn, claves) {
  const res = {};
  const deSeiva = claves.filter((c) => PRODUCTOS[c]?.fuente === "seiva");
  const deWeb = claves.filter((c) => PRODUCTOS[c]?.fuente === "web");

  for (const c of claves) {
    const p = PRODUCTOS[c];
    if (!p) res[c] = { error: "producto no definido en productos.js" };
    else if (p.fuente === "manual") res[c] = p.precio ? { precio: p.precio, stock: p.stock !== false, imagen: p.imagen || null } : { error: "falta cargar el precio manual" };
  }

  if (deSeiva.length) {
    try {
      const buscar = await leerSeiva(fetchFn);
      for (const c of deSeiva) res[c] = buscar(PRODUCTOS[c].id);
    } catch (e) {
      for (const c of deSeiva) res[c] = { error: "no se pudo leer Seiva: " + e.message };
    }
  }

  await enTandas(deWeb, 4, async (c) => {
    try {
      const r = await conTiempo(fetchFn, PRODUCTOS[c].url);
      if (r.status === 404) return (res[c] = { error: "la página ya no existe", stock: false });
      if (!r.ok) return (res[c] = { error: "la tienda respondió " + r.status });
      const d = leerSchemaOrg(await r.text());
      res[c] = d || { error: "la página no publica el precio" };
    } catch (e) {
      res[c] = { error: e.name === "AbortError" ? "la tienda tardó demasiado" : e.message };
    }
  });
  return res;
}

// ---------- Cálculo de precios ----------

export function redondear(n, terminacion = CONFIG.terminacion) {
  const paso = 10000;
  return Math.ceil((n - terminacion) / paso) * paso + terminacion;
}

const fijos = () => (CONFIG.costoDelivery || 0) + (CONFIG.costoCaja || 0) + (CONFIG.costoPublicidad || 0);

export function precioDeVenta(costo, categoria) {
  const m = CONFIG.margenPorCategoria[categoria] ?? CONFIG.margenPorDefecto;
  return redondear(costo * (1 + m) + fijos());
}

function nombreItem(clave, cant) {
  const n = PRODUCTOS[clave]?.muestra || clave;
  return cant > 1 ? `${cant} x ${n}` : n;
}

export function calcularKits(lecturas, anteriores = {}) {
  const alertas = [];
  const kits = KITS.map((kit) => {
    const motivos = [];
    let costo = 0;
    const fotos = [];
    for (const [clave, cant] of kit.items) {
      const l = lecturas[clave] || {};
      const nombre = PRODUCTOS[clave]?.muestra || clave;
      if (l.error && !l.precio) { motivos.push(`${nombre}: ${l.error}`); continue; }
      if (l.stock === false) motivos.push(`${nombre}: sin stock`);
      const antes = anteriores[clave];
      if (antes && l.precio > antes * (1 + CONFIG.alertaSubida)) {
        motivos.push(`${nombre}: subió de ${antes} a ${l.precio}`);
      }
      costo += l.precio * cant;
      if (l.imagen && !fotos.includes(l.imagen)) fotos.push(l.imagen);
    }
    const precio = motivos.some((m) => /no se pudo|no está|no definido|falta|no existe|no publica|respondió|tardó|todavía|subrequests/.test(m)) ? null : precioDeVenta(costo, kit.categoria);
    if (precio && precio > CONFIG.precioMaximo) motivos.push(`precio ${precio} supera el máximo de ${CONFIG.precioMaximo}`);
    const activo = motivos.length === 0;
    if (!activo) alertas.push({ kit: kit.id, nombre: kit.nombre, motivos });
    const ganancia = precio ? precio - costo - fijos() : null;
    const misFotos = kit.fotos.length ? kit.fotos : CONFIG.fotosDeProveedores ? fotos : [];
    return {
      id: kit.id, destacado: kit.destacado, categoria: kit.categoria, nombre: kit.nombre,
      productos: kit.items.map(([c, n]) => nombreItem(c, n)),
      costo, precio, ganancia, etiqueta: kit.etiqueta, fotos: misFotos.slice(0, 4), activo, motivos,
    };
  });
  return { kits, alertas };
}

// ---------- Salida para la tienda ----------

const celda = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

export function aCSV(kits) {
  const cab = ["id", "destacado", "categoria", "nombre", "productos", "precio", "etiqueta", "foto1", "foto2", "foto3", "foto4", "activo"];
  const filas = kits.map((k) => [
    k.id, k.destacado ? "si" : "no", k.categoria, k.nombre, k.productos.join(" | "), k.precio ?? "",
    k.etiqueta, k.fotos[0], k.fotos[1], k.fotos[2], k.fotos[3], k.activo ? "si" : "no",
  ]);
  return [cab, ...filas].map((f) => f.map(celda).join(",")).join("\n") + "\n";
}

// ---------- Corrida completa ----------

export async function actualizar(env, fetchFn = fetch) {
  const inicio = new Date();
  const estado = JSON.parse((await env.CATALOGO.get("estado")) || "{}");
  const anteriores = estado.precios || {};
  const claves = [...new Set(KITS.flatMap((k) => k.items.map(([c]) => c)))];
  const cache = estado.lecturas || {};

  // El plan gratis de Cloudflare permite ~50 consultas por corrida: se leen las páginas
  // más viejas primero, en tandas, y el resto se toma de la última lectura guardada.
  const web = claves.filter((c) => PRODUCTOS[c]?.fuente === "web").sort((a, b) => (cache[a]?.ts || 0) - (cache[b]?.ts || 0));
  const tanda = new Set(web.slice(0, CONFIG.lecturasPorCorrida || 40));
  const aLeer = claves.filter((c) => PRODUCTOS[c]?.fuente !== "web" || tanda.has(c));
  const nuevas = await leerProductos(fetchFn, aLeer);
  const ahora = Date.now();
  const lecturas = {};
  for (const c of claves) {
    if (nuevas[c]) lecturas[c] = nuevas[c];
    else if (cache[c]) lecturas[c] = cache[c];
    else lecturas[c] = { error: "todavía no se leyó (entra en la próxima corrida)" };
  }

  // Si una tienda no respondió, se usa el último precio conocido para no bajar el kit por un corte.
  for (const c of claves) {
    const l = lecturas[c];
    if (l.error && !l.precio && anteriores[c] && !/no existe|no definido|falta/.test(l.error)) {
      lecturas[c] = { precio: anteriores[c], stock: true, imagen: estado.imagenes?.[c] || null, aviso: "último precio conocido (" + l.error + ")" };
    }
  }

  const { kits, alertas } = calcularKits(lecturas, anteriores);

  const lecturasGuardadas = { ...cache };
  for (const [c, l] of Object.entries(nuevas)) if (l.precio && !l.error) lecturasGuardadas[c] = { precio: l.precio, stock: l.stock, imagen: l.imagen || null, ts: ahora };
  const precios = { ...anteriores };
  const imagenes = { ...(estado.imagenes || {}) };
  for (const [c, l] of Object.entries(nuevas)) {
    if (l.precio && !l.aviso && !l.error) precios[c] = l.precio;
    if (l.imagen) imagenes[c] = l.imagen;
  }

  const reporte = {
    actualizado: inicio.toISOString(),
    segundos: Math.round((Date.now() - inicio.getTime()) / 1000),
    leidosEstaCorrida: Object.keys(nuevas).length,
    kitsActivos: kits.filter((k) => k.activo).length,
    kitsOcultos: kits.filter((k) => !k.activo).length,
    alertas,
    avisos: Object.entries(lecturas).filter(([, l]) => l.aviso).map(([c, l]) => ({ producto: PRODUCTOS[c]?.muestra || c, aviso: l.aviso })),
    productos: Object.fromEntries(Object.entries(lecturas).map(([c, l]) => [c, { nombre: PRODUCTOS[c]?.muestra, ...l }])),
  };

  await env.CATALOGO.put("catalogo.csv", aCSV(kits));
  await env.CATALOGO.put("catalogo.json", JSON.stringify(kits));
  await env.CATALOGO.put("reporte", JSON.stringify(reporte));
  await env.CATALOGO.put("estado", JSON.stringify({ precios, imagenes, lecturas: lecturasGuardadas }));
  return reporte;
}
