// Motor de kits – Tu Centro de Compras (archivo único generado desde src/)

// ===== config.js =====
// ============================================================
//  CONFIGURACIÓN DEL MOTOR – lo único que hace falta tocar seguido
// ============================================================

const CONFIG = {
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
  precioMaximo: 300000,   // si el kit pasa este precio, se oculta
  alertaSubida: 0.2,      // si un producto sube más de 20 % de un día a otro, el kit se oculta ese día

  // Redondeo: los precios terminan en 9.000 (139.000, 149.000…)
  terminacion: 9000,

  // Páginas de tiendas que se leen por corrida (el plan gratis de Cloudflare permite ~50 consultas).
  lecturasPorCorrida: 40,

  // Fotos: si un kit no tiene fotos propias, usa las fotos de los productos de cada tienda.
  fotosDeProveedores: true,
};

// ===== productos.js =====
// ============================================================
//  PRODUCTOS: de dónde sale el precio y el stock de cada uno
// ============================================================
//  fuente "seiva":  id del producto en la API de seiva.com.py
//  fuente "web":    link de la página del producto (Mega, Nissei o cualquier
//                   tienda que publique precio con el estándar schema.org)
//  fuente "manual": precio fijo que cargás vos (mayoristas, Mercado 4, etc.)
//  "muestra" es el nombre que ve el cliente en la tienda.

const MEGA = "https://www.megaeletronicos.com/producto/";
const NISSEI = "https://nissei.com/py/";

const PRODUCTOS = {
  // ---------- SEIVA: suplementos ----------
  nadres: { fuente: "seiva", id: 51, muestra: "NAD+ 120 cápsulas + resveratrol 120 cápsulas" },
  nadage: { fuente: "seiva", id: 122, muestra: "NAD-Age 120 cápsulas" },
  nadresv: { fuente: "seiva", id: 37, muestra: "NAD + resveratrol 120 cápsulas" },
  resv: { fuente: "seiva", id: 132, muestra: "Resveratrol 120 cápsulas" },
  resv25: { fuente: "seiva", id: 214, muestra: "Resveratrol 2,5 g 120 cápsulas" },
  colageno: { fuente: "seiva", id: 219, muestra: "Colágeno hidrolizado 120 cápsulas" },
  colII: { fuente: "seiva", id: 143, muestra: "Mega colágeno tipo II + vitaminas E y C" },
  colcurc: { fuente: "seiva", id: 109, muestra: "Colágeno tipo II + cúrcuma 120 cápsulas" },
  matcha: { fuente: "seiva", id: 168, muestra: "Matcha con colágeno y vitamina C" },
  vitczinc: { fuente: "seiva", id: 226, muestra: "Vitamina C y zinc" },
  vitclipo: { fuente: "seiva", id: 31, muestra: "Vitamina C liposomal 120 cápsulas" },
  d3k2: { fuente: "seiva", id: 228, muestra: "Vitamina D3 + K2 60 cápsulas" },
  d3k2g: { fuente: "seiva", id: 32, muestra: "Vitamina D3 + K2 120 cápsulas" },
  d3: { fuente: "seiva", id: 115, muestra: "Vitamina D3 5000 UI 120 cápsulas" },
  multi: { fuente: "seiva", id: 172, muestra: "Multivitamínico de la A a la Z" },
  compb: { fuente: "seiva", id: 18, muestra: "Complejo B 120 cápsulas" },
  b12: { fuente: "seiva", id: 162, muestra: "Vitamina B12 60 cápsulas" },
  mag7: { fuente: "seiva", id: 11, muestra: "7 magnesios 120 cápsulas" },
  glicinato: { fuente: "seiva", id: 137, muestra: "Glicinato de magnesio 120 cápsulas" },
  treonato: { fuente: "seiva", id: 135, muestra: "L-treonato de magnesio 120 cápsulas" },
  magcit: { fuente: "seiva", id: 184, muestra: "Citrato de magnesio 120 cápsulas" },
  magbistreo: { fuente: "seiva", id: 21, muestra: "Bisglicinato + treonato de magnesio (2 frascos)" },
  magpot: { fuente: "seiva", id: 26, muestra: "Citrato de magnesio + potasio (2 frascos)" },
  omega3: { fuente: "seiva", id: 111, muestra: "Omega 3 120 cápsulas" },
  omega369: { fuente: "seiva", id: 147, muestra: "Omega 3-6-9 120 cápsulas" },
  omegakt: { fuente: "seiva", id: 36, muestra: "Omega 3 Katigua 1400 mg 120 cápsulas" },
  omegamag: { fuente: "seiva", id: 15, muestra: "Omega 3 + citrato de magnesio (2 frascos)" },
  ashwa: { fuente: "seiva", id: 43, muestra: "Ashwagandha 120 cápsulas" },
  teanina: { fuente: "seiva", id: 206, muestra: "L-teanina 60 cápsulas" },
  maca: { fuente: "seiva", id: 22, muestra: "Maca peruana negra 120 cápsulas" },
  shilajit: { fuente: "seiva", id: 7, muestra: "Shilajit 120 cápsulas" },
  tongkat: { fuente: "seiva", id: 120, muestra: "Shilajit + tongkat ali 120 cápsulas" },
  testo: { fuente: "seiva", id: 139, muestra: "Testosterona Power 120 cápsulas" },
  testo600: { fuente: "seiva", id: 186, muestra: "+Testo 600 mg 60 cápsulas" },
  creatina: { fuente: "seiva", id: 209, muestra: "Creatina monohidratada 300 g" },
  creacaps: { fuente: "seiva", id: 215, muestra: "Creatina 60 cápsulas" },
  glutamina: { fuente: "seiva", id: 218, muestra: "L-glutamina 120 cápsulas" },
  colostro: { fuente: "seiva", id: 188, muestra: "Colostro bovino 60 cápsulas" },
  q10: { fuente: "seiva", id: 225, muestra: "Coenzima Q10 + vitamina E 60 cápsulas" },
  nac: { fuente: "seiva", id: 207, muestra: "NAC 120 cápsulas" },
  luteina: { fuente: "seiva", id: 204, muestra: "Luteína + zeaxantina 60 cápsulas" },
  curcuma: { fuente: "seiva", id: 4, muestra: "Cúrcuma con pimienta negra 120 cápsulas" },
  curcumina: { fuente: "seiva", id: 12, muestra: "Curcumina pura 60 cápsulas" },
  glucosamina: { fuente: "seiva", id: 216, muestra: "Glucosamina 120 cápsulas" },
  berberina: { fuente: "seiva", id: 48, muestra: "Berberina 120 cápsulas" },
  cromo: { fuente: "seiva", id: 5, muestra: "Picolinato de cromo 60 cápsulas" },
  psyllium: { fuente: "seiva", id: 25, muestra: "Psyllium 60 cápsulas" },
  zeolita: { fuente: "seiva", id: 58, muestra: "Zeolita 120 cápsulas" },
  espirulina: { fuente: "seiva", id: 29, muestra: "Espirulina 150 cápsulas" },
  oregano: { fuente: "seiva", id: 17, muestra: "Aceite de orégano 120 cápsulas" },
  zinc: { fuente: "seiva", id: 9, muestra: "Zinc 60 cápsulas" },
  selenio: { fuente: "seiva", id: 145, muestra: "Selenio quelado 60 cápsulas" },
  silicio: { fuente: "seiva", id: 69, muestra: "Silicio orgánico 30 cápsulas" },
  acoco: { fuente: "seiva", id: 150, muestra: "Aceite de coco 60 cápsulas" },
  ajo: { fuente: "seiva", id: 151, muestra: "Aceite de ajo 60 cápsulas" },
  // ---------- MEGA: piel ----------
  cxgelm: { fuente: "web", url: MEGA + "1603835/kit", muestra: "Gel de limpieza COSRX Good Morning 50 ml" },
  cxgalac: { fuente: "web", url: MEGA + "1514049/kit", muestra: "Esencia COSRX Galactomyces 100 ml" },
  cxsali: { fuente: "web", url: MEGA + "1514056/kit", muestra: "Limpiador COSRX ácido salicílico" },
  cxmucin: { fuente: "web", url: MEGA + "1518801/kit", muestra: "Esencia COSRX Snail 96 Mucin 100 ml" },
  cxaha: { fuente: "web", url: MEGA + "1518825/kit", muestra: "Exfoliante COSRX AHA 7 100 ml" },
  cxhialu: { fuente: "web", url: MEGA + "1520699/kit", muestra: "Sérum COSRX ácido hialurónico 20 ml" },
  cxparche: { fuente: "web", url: MEGA + "1603811/kit", muestra: "Parches para granitos COSRX Pimple Master" },
  anuatonm: { fuente: "web", url: MEGA + "1503449/kit", muestra: "Tónico Anua Heartleaf 77 (40 ml)" },
  anuamask: { fuente: "web", url: MEGA + "1518412/kit", muestra: "Mascarilla Anua Heartleaf panthenol" },
  anuapeachm: { fuente: "web", url: MEGA + "1628098/kit", muestra: "Mascarilla Anua Peach niacinamida" },
  anuapeachs: { fuente: "web", url: MEGA + "1518467/kit", muestra: "Sérum Anua Peach niacinamida 30 ml" },
  anuacrema: { fuente: "web", url: MEGA + "1503470/kit", muestra: "Crema Anua 3 ceramidas 100 ml" },
  s1004cremam: { fuente: "web", url: MEGA + "1625066/kit", muestra: "Crema SKIN1004 Centella 30 ml" },
  s1004ton: { fuente: "web", url: MEGA + "1625059/kit", muestra: "Tónico SKIN1004 Centella 30 ml" },
  s1004pads: { fuente: "web", url: MEGA + "1505054/kit", muestra: "Almohadillas calmantes SKIN1004 Centella" },
  s1004parche: { fuente: "web", url: MEGA + "1526820/kit", muestra: "Parches para granitos SKIN1004" },
  s1004limp: { fuente: "web", url: MEGA + "1604658/kit", muestra: "Limpiador SKIN1004 BHA" },
  rlimp: { fuente: "web", url: MEGA + "1504965/kit", muestra: "Limpiador Round Lab Dokdo 150 ml" },
  rton: { fuente: "web", url: MEGA + "1504972/kit", muestra: "Tónico Round Lab Dokdo 200 ml" },
  rsol: { fuente: "web", url: MEGA + "1603958/kit", muestra: "Protector solar Round Lab Birch" },
  ragua: { fuente: "web", url: MEGA + "1638967/kit", muestra: "Agua de limpieza Round Lab 400 ml" },
  banila: { fuente: "web", url: MEGA + "1504378/kit", muestra: "Bálsamo desmaquillante Banila Co 100 ml" },
  bojexf: { fuente: "web", url: MEGA + "1513790/kit", muestra: "Exfoliante Beauty of Joseon damasco 100 ml" },
  mmojos: { fuente: "web", url: MEGA + "1504552/kit", muestra: "Crema de ojos Mary&May 30 g" },
  hhojos: { fuente: "web", url: MEGA + "1514513/kit", muestra: "Crema de ojos Haruharu arroz negro" },
  mcmask: { fuente: "web", url: MEGA + "1518399/kit", muestra: "Mascarilla Medicube colágeno lifting" },
  mcpdrnm: { fuente: "web", url: MEGA + "1534139/kit", muestra: "Mascarilla Medicube PDRN Pink" },
  mcgluta: { fuente: "web", url: MEGA + "1518429/kit", muestra: "Sérum Medicube glutatión 30 g" },
  mcretinol: { fuente: "web", url: MEGA + "1518504/kit", muestra: "Sérum Medicube retinol 30 ml" },
  mccolser: { fuente: "web", url: MEGA + "1503289/kit", muestra: "Sérum Medicube triple colágeno 55 ml" },
  mccolton: { fuente: "web", url: MEGA + "1518436/kit", muestra: "Tónico Medicube triple colágeno 140 ml" },
  mcporeton: { fuente: "web", url: MEGA + "1590692/kit", muestra: "Tónico Medicube Zero Pore 250 ml" },
  mcporepad: { fuente: "web", url: MEGA + "1591682/kit", muestra: "Almohadillas Medicube Zero Pore" },
  mclabios: { fuente: "web", url: MEGA + "1518535/kit", muestra: "Mascarilla de labios Medicube PDRN 10 g" },
  numbuzin: { fuente: "web", url: MEGA + "1600919/kit", muestra: "Mascarilla Numbuzin No. 4 hidratante" },
  alth15: { fuente: "web", url: MEGA + "1611915/kit", muestra: "Crema Dr. Althea 345 Relief 15 ml" },
  altserm: { fuente: "web", url: MEGA + "1664195/kit", muestra: "Sérum Dr. Althea 345 Relief 15 ml" },
  altmask: { fuente: "web", url: MEGA + "1650495/kit", muestra: "Mascarilla Dr. Althea Vita Glow" },
  retinal20: { fuente: "web", url: MEGA + "1690781/kit", muestra: "Sérum Meditherapy retinal 20 ml" },
  dexenegra: { fuente: "web", url: MEGA + "1683189/kit", muestra: "Mascarilla Dexe negra 120 g" },
  dexeoro: { fuente: "web", url: MEGA + "1683202/kit", muestra: "Mascarilla Dexe dorada 120 g" },
  missha: { fuente: "web", url: MEGA + "1526240/kit", muestra: "BB cream Missha SPF 42" },
  nvsolfac: { fuente: "web", url: MEGA + "1434934/kit", muestra: "Protector solar facial NIVEA SPF 50" },
  nvsol: { fuente: "web", url: MEGA + "1434958/kit", muestra: "Protector solar NIVEA SPF 50 200 ml" },
  nvsolkids: { fuente: "web", url: MEGA + "1434965/kit", muestra: "Protector solar NIVEA Kids SPF 60" },
  nvcrema30: { fuente: "web", url: MEGA + "1504163/kit", muestra: "Crema NIVEA 30 ml" },
  nvlata: { fuente: "web", url: MEGA + "969031/kit", muestra: "Crema NIVEA lata 400 ml" },
  nvlabial: { fuente: "web", url: MEGA + "1648546/kit", muestra: "Bálsamo labial NIVEA vainilla" },
  nvexpress: { fuente: "web", url: MEGA + "1648652/kit", muestra: "Crema corporal NIVEA Express 100 ml" },
  nvsoft: { fuente: "web", url: MEGA + "1648676/kit", muestra: "Crema NIVEA Soft Milk 220 ml" },
  nvq10: { fuente: "web", url: MEGA + "1648690/kit", muestra: "Crema reafirmante NIVEA Q10 250 ml" },
  nvmen: { fuente: "web", url: MEGA + "1648478/kit", muestra: "Crema NIVEA Men 150 ml" },
  nvafter: { fuente: "web", url: MEGA + "1648997/kit", muestra: "Bálsamo after shave NIVEA Men 100 ml" },
  nvtoall: { fuente: "web", url: MEGA + "1669145/kit", muestra: "Toallitas desmaquillantes NIVEA" },
  lipkit: { fuente: "web", url: MEGA + "1498486/kit", muestra: "Kit aceite de labios + mascarilla labial de miel" },
  vtlabios: { fuente: "web", url: MEGA + "1612370/kit", muestra: "Voluminizador de labios VT Reedle Shot" },
  s1004corp: { fuente: "web", url: MEGA + "1597400/kit", muestra: "Exfoliante corporal SKIN1004 Centella" },
  cremayara: { fuente: "web", url: MEGA + "1605013/kit", muestra: "Crema corporal Lattafa Yara 310 g" },
  cremakham: { fuente: "web", url: MEGA + "1605020/kit", muestra: "Crema corporal Lattafa Khamrah 300 g" },
  // ---------- MEGA: cabello ----------
  kshamp: { fuente: "web", url: MEGA + "1633214/kit", muestra: "Shampoo Karseell Maca 500 ml" },
  kacond: { fuente: "web", url: MEGA + "1633221/kit", muestra: "Acondicionador Karseell Maca 500 ml" },
  kmascol: { fuente: "web", url: MEGA + "1493412/kit", muestra: "Máscara Karseell colágeno 500 ml" },
  kmasvio: { fuente: "web", url: MEGA + "1493405/kit", muestra: "Máscara matizadora Karseell violeta 500 ml" },
  kaceite: { fuente: "web", url: MEGA + "1495010/kit", muestra: "Aceite Karseell Maca 50 ml" },
  kargan: { fuente: "web", url: MEGA + "1633382/kit", muestra: "Aceite de argán Karseell 60 ml" },
  kmasargan: { fuente: "web", url: MEGA + "1633450/kit", muestra: "Máscara Karseell argán y colágeno 160 ml" },
  kleavein: { fuente: "web", url: MEGA + "1532029/kit", muestra: "Leave-in Karseell en crema 200 ml" },
  kspray: { fuente: "web", url: MEGA + "1496895/kit", muestra: "Leave-in Karseell en spray 200 ml" },
  smcoco: { fuente: "web", url: MEGA + "1509557/kit", muestra: "Shampoo Silicon Mix coco 473 ml" },
  smperla: { fuente: "web", url: MEGA + "1509564/kit", muestra: "Shampoo Silicon Mix perla 473 ml" },
  smbrillo: { fuente: "web", url: MEGA + "1642278/kit", muestra: "Gotas de brillo Silicon Mix 118 ml" },
  smrizosm: { fuente: "web", url: MEGA + "1642414/kit", muestra: "Máscara Silicon Mix rizos 295 g" },
  smrizosl: { fuente: "web", url: MEGA + "1642391/kit", muestra: "Leave-in Silicon Mix rizos 251 ml" },
  smrizosg: { fuente: "web", url: MEGA + "1644203/kit", muestra: "Gel Silicon Mix rizos 295 g" },
  smperlal: { fuente: "web", url: MEGA + "1642810/kit", muestra: "Leave-in Silicon Mix perla 236 ml" },
  tsushamp: { fuente: "web", url: MEGA + "1578058/kit", muestra: "Shampoo Tsubaki Premium 450 ml" },
  tsuacond: { fuente: "web", url: MEGA + "1578072/kit", muestra: "Acondicionador Tsubaki Premium 450 ml" },
  tsumasc: { fuente: "web", url: MEGA + "1537512/kit", muestra: "Máscara Tsubaki Premium 180 g" },
  finoshamp: { fuente: "web", url: MEGA + "1537499/kit", muestra: "Shampoo Fino Premium Touch 550 ml" },
  finoacond: { fuente: "web", url: MEGA + "1537505/kit", muestra: "Acondicionador Fino Premium Touch 550 ml" },
  finomasc: { fuente: "web", url: MEGA + "1584813/kit", muestra: "Máscara Fino Premium Touch 230 g" },
  finoaceite: { fuente: "web", url: MEGA + "1537482/kit", muestra: "Aceite Fino Premium Touch 70 ml" },
  dexeacond: { fuente: "web", url: MEGA + "1683158/kit", muestra: "Acondicionador Dexe argán 400 ml" },
  dexemasc: { fuente: "web", url: MEGA + "1683165/kit", muestra: "Máscara Dexe argán" },
  dexeaceite: { fuente: "web", url: MEGA + "1683141/kit", muestra: "Aceite Dexe argán 50 ml" },
  moevshamp: { fuente: "web", url: MEGA + "1604214/kit", muestra: "Shampoo Moev anticaída 300 ml" },
  moevaceite: { fuente: "web", url: MEGA + "1604368/kit", muestra: "Aceite Moev Annurcatin 80 ml" },
  moevguasha: { fuente: "web", url: MEGA + "1644807/kit", muestra: "Cepillo masajeador gua sha para cuero cabelludo" },
  moevcepillo: { fuente: "web", url: MEGA + "1644760/kit", muestra: "Cepillo masajeador de cuero cabelludo Moev" },
  mcsoyx: { fuente: "web", url: MEGA + "1603613/kit", muestra: "Shampoo anticaída Medicube Soyxidil 490 ml" },
  mcromacond: { fuente: "web", url: MEGA + "1607789/kit", muestra: "Acondicionador Medicube romero 250 ml" },
  gkacond: { fuente: "web", url: MEGA + "1633702/kit", muestra: "Acondicionador GKhair Gold 250 ml" },
  secador: { fuente: "web", url: MEGA + "1329629/kit", muestra: "Secador de pelo MegaStar 1000 W" },
  secadorq: { fuente: "web", url: MEGA + "1423990/kit", muestra: "Secador de pelo Quanta compacto" },
  secviaje: { fuente: "web", url: MEGA + "1546507/kit", muestra: "Secador de viaje Britania" },
  plancha: { fuente: "web", url: MEGA + "655316/kit", muestra: "Planchita para cabello Mondial" },
  planchams: { fuente: "web", url: MEGA + "1569803/kit", muestra: "Planchita MegaStar 230 °C" },
  rizador: { fuente: "web", url: MEGA + "1360097/kit", muestra: "Rizador Quanta 19 mm" },
  rizadorsp: { fuente: "web", url: MEGA + "655521/kit", muestra: "Rizador espiral Mondial" },
  cepelec: { fuente: "web", url: MEGA + "1355925/kit", muestra: "Cepillo eléctrico alisador Prosper" },
  // ---------- MEGA: perfumes ----------
  pameerat: { fuente: "web", url: MEGA + "1473858/kit", muestra: "Perfume Lattafa Ameerat Al Arab 100 ml" },
  padeeb: { fuente: "web", url: MEGA + "1527209/kit", muestra: "Perfume Lattafa Adeeb 80 ml" },
  pasad: { fuente: "web", url: MEGA + "1399974/kit", muestra: "Perfume Lattafa Asad 100 ml" },
  pyara: { fuente: "web", url: MEGA + "1399967/kit", muestra: "Perfume Lattafa Yara 100 ml" },
  pfakhar: { fuente: "web", url: MEGA + "1416435/kit", muestra: "Perfume Lattafa Fakhar 100 ml" },
  pmaahir: { fuente: "web", url: MEGA + "1441307/kit", muestra: "Perfume Lattafa Maahir 100 ml" },
  pjouri: { fuente: "web", url: MEGA + "1637663/kit", muestra: "Perfume Lattafa Jouri 100 ml" },
  pbellis: { fuente: "web", url: MEGA + "1646108/kit", muestra: "Perfume Nasma Bellissima 100 ml" },
  paline: { fuente: "web", url: MEGA + "1646115/kit", muestra: "Perfume Nasma Aline 100 ml" },
  psalma: { fuente: "web", url: MEGA + "1688221/kit", muestra: "Perfume Nasma Salma 100 ml" },
  psherif: { fuente: "web", url: MEGA + "1646122/kit", muestra: "Perfume Nasma Sherif 100 ml" },
  psalem: { fuente: "web", url: MEGA + "1668841/kit", muestra: "Perfume Nasma Salem 100 ml" },
  pfiras: { fuente: "web", url: MEGA + "1690705/kit", muestra: "Perfume Nasma Firas 100 ml" },
  pfaraon: { fuente: "web", url: MEGA + "1668858/kit", muestra: "Perfume Nasma Faraón 100 ml" },
  ppharaoh: { fuente: "web", url: MEGA + "1636352/kit", muestra: "Perfume Rayhaan Pharaoh 100 ml" },
  punbeat: { fuente: "web", url: MEGA + "1646153/kit", muestra: "Perfume Arqus Unbeatable 100 ml" },
  pshouq: { fuente: "web", url: MEGA + "1532128/kit", muestra: "Perfume Al Wataniah Shouq 100 ml" },
  ppistacho: { fuente: "web", url: MEGA + "1662528/kit", muestra: "Perfume Maison Alhambra Pistacho Chocolate 100 ml" },
  pchocolat: { fuente: "web", url: MEGA + "1502565/kit", muestra: "Perfume Armaf Dubai Chocolat 100 ml" },
  ptubbes: { fuente: "web", url: MEGA + "1558661/kit", muestra: "Perfume infantil Tubbes chocolate 50 ml" },
  mangham: { fuente: "web", url: MEGA + "1622881/kit", muestra: "Body mist Lattafa Angham 250 ml" },
  msehr: { fuente: "web", url: MEGA + "1622966/kit", muestra: "Body mist Lattafa Sehr 250 ml" },
  mteriaq: { fuente: "web", url: MEGA + "1622973/kit", muestra: "Body mist Lattafa Teriaq 250 ml" },
  mclub: { fuente: "web", url: MEGA + "1652291/kit", muestra: "Body mist Armaf Club de Nuit Woman 250 ml" },
  mceles: { fuente: "web", url: MEGA + "1625295/kit", muestra: "Body mist Armaf Celestial 250 ml" },
  mhoney: { fuente: "web", url: MEGA + "1359381/kit", muestra: "Body mist Stella Dustin Honey Dream 250 ml" },
  mvsgelato: { fuente: "web", url: MEGA + "1635966/kit", muestra: "Body mist Victoria's Secret Gelato Oasis" },
  mvspitaya: { fuente: "web", url: MEGA + "1641288/kit", muestra: "Body mist Victoria's Secret Pitaya Paradise" },
  mariana: { fuente: "web", url: MEGA + "1686289/kit", muestra: "Body mist Ariana Grande Cloud 236 ml" },
  dameerat: { fuente: "web", url: MEGA + "1662153/kit", muestra: "Desodorante Lattafa Ameerat Al Arab 200 ml" },
  dcandid: { fuente: "web", url: MEGA + "1662177/kit", muestra: "Desodorante Maison Alhambra So Candid 200 ml" },
  dlavoie: { fuente: "web", url: MEGA + "1662191/kit", muestra: "Desodorante Maison Alhambra La Voie 200 ml" },
  dnvmen: { fuente: "web", url: MEGA + "1404418/kit", muestra: "Desodorante NIVEA Men Black & White" },
  dnvpearl: { fuente: "web", url: MEGA + "1404708/kit", muestra: "Desodorante NIVEA Pearl & Beauty" },
  dnvrollm: { fuente: "web", url: MEGA + "1648782/kit", muestra: "Desodorante roll-on NIVEA Men" },
  dnvrollw: { fuente: "web", url: MEGA + "1648904/kit", muestra: "Desodorante roll-on NIVEA Pearl" },
  ambhaya: { fuente: "web", url: MEGA + "1662078/kit", muestra: "Aromatizante de ambiente Lattafa Haya 300 ml" },
  aceiteyara: { fuente: "web", url: MEGA + "1507218/kit", muestra: "Aceite corporal perfumado Lattafa Yara 20 ml" },
  cfrozen: { fuente: "web", url: MEGA + "1631692/kit", muestra: "Colonia infantil Frozen 200 ml" },
  cmickey: { fuente: "web", url: MEGA + "1631708/kit", muestra: "Colonia infantil Mickey 200 ml" },
  cstitch: { fuente: "web", url: MEGA + "1631739/kit", muestra: "Colonia infantil Stitch 200 ml" },
  cprincess: { fuente: "web", url: MEGA + "1631722/kit", muestra: "Colonia infantil Princesas 200 ml" },
  // ---------- MEGA: tecno ----------
  cablec: { fuente: "web", url: MEGA + "1659047/kit", muestra: "Cable USB-C 1 m" },
  cablel: { fuente: "web", url: MEGA + "1659030/kit", muestra: "Cable USB-C a Lightning (iPhone) 1 m" },
  cable2m: { fuente: "web", url: MEGA + "1354218/kit", muestra: "Cable USB-C 2 m reforzado" },
  cargador20: { fuente: "web", url: MEGA + "1676051/kit", muestra: "Cargador 20 W + cable" },
  cargador30: { fuente: "web", url: MEGA + "1237832/kit", muestra: "Cargador rápido 30 W doble" },
  cargadorhye: { fuente: "web", url: MEGA + "1340204/kit", muestra: "Cargador 22,5 W + cable USB-C" },
  aurbt: { fuente: "web", url: MEGA + "1347425/kit", muestra: "Auriculares bluetooth Prosper" },
  mibro: { fuente: "web", url: MEGA + "1485073/kit", muestra: "Auriculares inalámbricos Mibro 5" },
  mibrorosa: { fuente: "web", url: MEGA + "1485080/kit", muestra: "Auriculares inalámbricos Mibro 5 rosa" },
  hyeh2: { fuente: "web", url: MEGA + "1623413/kit", muestra: "Auriculares inalámbricos HYE H2 Pro" },
  gtide: { fuente: "web", url: MEGA + "1487732/kit", muestra: "Auriculares G-TiDE Clip con cancelación de ruido" },
  qcy: { fuente: "web", url: MEGA + "1517798/kit", muestra: "Auriculares inalámbricos QCY Buds" },
  aurcable: { fuente: "web", url: MEGA + "1668759/kit", muestra: "Auriculares con micrófono G-TiDE" },
  parlante: { fuente: "web", url: MEGA + "1569728/kit", muestra: "Parlante bluetooth con radio Quanta" },
  parlantemox: { fuente: "web", url: MEGA + "1590043/kit", muestra: "Parlante bluetooth MOX 10 W" },
  relojx5: { fuente: "web", url: MEGA + "1490701/kit", muestra: "Reloj inteligente Audisat X5 Pro" },
  relojx6: { fuente: "web", url: MEGA + "1674187/kit", muestra: "Reloj inteligente Audisat X6 Pro" },
  mouse: { fuente: "web", url: MEGA + "1290417/kit", muestra: "Mouse USB" },
  mouseinal: { fuente: "web", url: MEGA + "1351910/kit", muestra: "Mouse inalámbrico" },
  teclado: { fuente: "web", url: MEGA + "1106701/kit", muestra: "Teclado USB en español" },
  logik120: { fuente: "web", url: MEGA + "424103/kit", muestra: "Teclado Logitech K120" },
  hub: { fuente: "web", url: MEGA + "1337556/kit", muestra: "Hub USB 3 puertos" },
  pendrive64: { fuente: "web", url: MEGA + "1289916/kit", muestra: "Pendrive 64 GB Kingston" },
  pendrive32: { fuente: "web", url: MEGA + "1171310/kit", muestra: "Pendrive 32 GB SanDisk" },
  microsd: { fuente: "web", url: MEGA + "1129649/kit", muestra: "Memoria micro SD 32 GB SanDisk" },
  luzrgb: { fuente: "web", url: MEGA + "1669428/kit", muestra: "Luz LED portátil RGB" },
  luztri: { fuente: "web", url: MEGA + "1669497/kit", muestra: "Luz LED portátil 3 tonos" },
  tripode: { fuente: "web", url: MEGA + "1669459/kit", muestra: "Trípode para celular con luz y micrófono" },
  micro: { fuente: "web", url: MEGA + "1590982/kit", muestra: "Micrófono MegaStar" },
  microdeh: { fuente: "web", url: MEGA + "664127/kit", muestra: "Micrófono MegaStar con soporte" },
  camip: { fuente: "web", url: MEGA + "1341683/kit", muestra: "Cámara Wi-Fi Satellite" },
  camip2: { fuente: "web", url: MEGA + "1381191/kit", muestra: "Cámara Wi-Fi con micrófono" },
  lampled: { fuente: "web", url: MEGA + "906173/kit", muestra: "Lámpara LED giratoria" },
  powerbank: { fuente: "web", url: MEGA + "1434354/kit", muestra: "Power bank Xiaomi 10.000 mAh" },
  // ---------- MEGA: hombre ----------
  cortadora: { fuente: "web", url: MEGA + "1112306/kit", muestra: "Máquina de cortar cabello Quanta" },
  cortadora2130: { fuente: "web", url: MEGA + "1453522/kit", muestra: "Máquina de cortar cabello Prosper P-2130" },
  cortadorab: { fuente: "web", url: MEGA + "1253702/kit", muestra: "Máquina de cortar cabello Britania" },
  recortador: { fuente: "web", url: MEGA + "1057348/kit", muestra: "Recortador portátil Mondial" },
  recortador5: { fuente: "web", url: MEGA + "1366372/kit", muestra: "Recortador 5 en 1 Prosper" },
  afeitadora: { fuente: "web", url: MEGA + "1649529/kit", muestra: "Afeitadora portátil Krab" },
  mochila: { fuente: "web", url: MEGA + "1315653/kit", muestra: "Mochila Xiaomi" },
  // ---------- MEGA: regalos y hogar ----------
  whorse: { fuente: "web", url: MEGA + "1431537/kit", muestra: "Whisky White Horse 1 L" },
  redlabel: { fuente: "web", url: MEGA + "1431704/kit", muestra: "Whisky Johnnie Walker Red Label 1 L" },
  blonde: { fuente: "web", url: MEGA + "1479546/kit", muestra: "Whisky Johnnie Walker Blonde 750 ml" },
  freixenet: { fuente: "web", url: MEGA + "970990/kit", muestra: "Espumante Freixenet Mía Moscato" },
  freixfruit: { fuente: "web", url: MEGA + "1034783/kit", muestra: "Espumante Freixenet Mía Fruity" },
  pava: { fuente: "web", url: MEGA + "1495485/kit", muestra: "Pava eléctrica MOX 2 L" },
  // ---------- NISSEI: hogar, mate y cocina ----------
  guampatram: { fuente: "web", url: NISSEI + "guampa-tramontina-exata-240ml", muestra: "Guampa Tramontina 240 ml" },
  guampainox: { fuente: "web", url: NISSEI + "guampa-tramontina-acero-inoxidable-240ml", muestra: "Guampa de acero inoxidable 240 ml" },
  kitterere: { fuente: "web", url: NISSEI + "kit-de-terere-guampa-bombilla-plata", muestra: "Guampa + bombilla para tereré Indio" },
  kitmate: { fuente: "web", url: NISSEI + "kit-de-mate-indio-guampa-bombilla-plata", muestra: "Guampa + bombilla para mate Indio" },
  bombalpaca: { fuente: "web", url: NISSEI + "bombilla-de-alpaca-para-terere-plateado", muestra: "Bombilla de alpaca para tereré" },
  bombyerba: { fuente: "web", url: NISSEI + "bombilla-indio-yerba-temate-150gr", muestra: "Bombilla Indio + yerba Temate 150 g" },
  portatermo: { fuente: "web", url: NISSEI + "porta-termo-fiore-f8167", muestra: "Porta termo Fiore" },
  vasomelitta: { fuente: "web", url: NISSEI + "vaso-termico-de-cafe-melitta-250ml", muestra: "Vaso térmico para café Melitta 250 ml" },
  cuchtram6: { fuente: "web", url: NISSEI + "set-de-cuchillos-tramontina-dynamic-inox-6-piezas", muestra: "Set de 6 cuchillos Tramontina" },
  cuchasado: { fuente: "web", url: NISSEI + "set-de-cuchillos-para-asado-tramontina-tradicional-12-piezas", muestra: "Set de 12 cuchillos para asado Tramontina" },
  cuchchurr: { fuente: "web", url: NISSEI + "set-de-cuchillos-tramontina-churrasco-21198915-6-piezas", muestra: "Set de 6 cuchillos para churrasco Tramontina" },
  tablateca: { fuente: "web", url: NISSEI + "tabla-para-servir-tramontina-con-mango-teca-13367-051-70-x-15-cm", muestra: "Tabla para servir Tramontina de teca" },
  sarten: { fuente: "web", url: NISSEI + "sarten-tramontina-loreto-203800-negro", muestra: "Sartén antiadherente Tramontina" },
  sartenes3: { fuente: "web", url: NISSEI + "set-de-sartenes-tramontina-loreto-3-piezas", muestra: "Set de 3 sartenes Tramontina" },
  taper3: { fuente: "web", url: NISSEI + "set-de-taperes-rubbermaid-twist-seal-2165291-apilable-3-x-473ml", muestra: "Set de 3 táperes Rubbermaid" },
  tuppers10: { fuente: "web", url: NISSEI + "juego-de-tuppers-para-cocina-10-piezas-decakila-ele-134692", muestra: "Juego de 10 tuppers" },
  cubiertos: { fuente: "web", url: NISSEI + "juego-de-cubiertos-25-pzas-tramontina-leme-bandeja-azul", muestra: "Juego de 25 cubiertos Tramontina" },
  tazas2: { fuente: "web", url: NISSEI + "set-de-tazas-tramontina-t647604-200ml-2-piezas", muestra: "Set de 2 tazas Tramontina" },
  tetera: { fuente: "web", url: NISSEI + "tetera-danny-home-miscelaneo-bw22-16-con-relieve-1000ml", muestra: "Tetera Danny Home 1 L" },
  tazasplat: { fuente: "web", url: NISSEI + "set-de-tazas-platillos-danny-home-cpk-070-blanco-6-piezas", muestra: "Set de tazas con platillos Danny Home" },
  organizador3: { fuente: "web", url: NISSEI + "juego-de-organizadores-transparentes-3-pzs-wadfow-ele-126283", muestra: "3 organizadores transparentes" },
  lamparas4: { fuente: "web", url: NISSEI + "pack-de-4-lamparas-led-bulbo-vce-12w-e27-3000k", muestra: "Pack de 4 lámparas LED luz cálida" },
  lamparargb: { fuente: "web", url: NISSEI + "lampara-philips-smart-a60-e27-rgb", muestra: "Lámpara inteligente Philips de colores" },
  fundaterc: { fuente: "web", url: NISSEI + "funda-para-almohada-danny-home-terciopelo-50-x-50-cm", muestra: "Funda de almohadón de terciopelo" },
  humidif: { fuente: "web", url: NISSEI + "humidificador-nappo-nev-277-ultrasonico-difusor-de-aromas", muestra: "Humidificador y difusor de aromas Nappo" },
  antimosq: { fuente: "web", url: NISSEI + "lampara-antimosquitos-20-w-decakila-ele-134703", muestra: "Lámpara antimosquitos" },
  // ---------- NISSEI: mascotas ----------
  comedero: { fuente: "web", url: NISSEI + "comedero-p-mascotas-21cm-s000305", muestra: "Comedero para mascotas 21 cm" },
  collar2: { fuente: "web", url: NISSEI + "collar-p-perro-2-5x51cm-s000415", muestra: "Collar para perro 51 cm" },
  collar1: { fuente: "web", url: NISSEI + "collar-p-perro-1-5x38cm-s000413", muestra: "Collar para perro 38 cm" },
  correa: { fuente: "web", url: NISSEI + "correa-p-perro-2-5x120cm-s000640", muestra: "Correa para perro 120 cm" },
  correach: { fuente: "web", url: NISSEI + "correa-p-perro-1-5x110cm-s000928", muestra: "Correa para perro chico 110 cm" },
  cama: { fuente: "web", url: NISSEI + "cama-oval-para-mascota-k49026-4-52-x-39-x-11-cm", muestra: "Cama oval para mascota" },
  pelota: { fuente: "web", url: NISSEI + "juguete-pelota-p-perro-duraball-grande-ref-11504-arg-7898652692536", muestra: "Pelota para perro Duraball" },
  snackbacon: { fuente: "web", url: NISSEI + "snack-monello-diversion-perros-bacon-300gr", muestra: "Snack Monello sabor bacon 300 g" },
  patitas: { fuente: "web", url: NISSEI + "patitas-de-pollo-deshidratadas-petchef-para-perro", muestra: "Patitas de pollo deshidratadas PetChef" },
  pechuga: { fuente: "web", url: NISSEI + "pechuga-de-pollo-deshidratadas-petchef-para-perros-y-gatos", muestra: "Pechuga de pollo deshidratada PetChef" },
  cuero: { fuente: "web", url: NISSEI + "cuero-de-pescado-petchef-para-perros-y-gatos", muestra: "Cuero de pescado PetChef" },
  shampooperro: { fuente: "web", url: NISSEI + "shampoo-antiparasitario-agrofield-pulgafin-020-695-300-300ml", muestra: "Shampoo antipulgas Pulgafin 300 ml" },
  shampooseco: { fuente: "web", url: NISSEI + "shampoo-seco-pispas-tropical-scent-200ml", muestra: "Shampoo en seco PisPás 200 ml" },
  shampoogato: { fuente: "web", url: NISSEI + "beeps-cat-care-shampoo-502-ml-arg-7898574023814", muestra: "Shampoo para gatos Beeps 502 ml" },
  arenagato: { fuente: "web", url: NISSEI + "arena-sanitaria-biokitty-para-gato-lavanda", muestra: "Arena sanitaria BioKitty lavanda" },
  monellogato: { fuente: "web", url: NISSEI + "alimento-balanceado-monello-gatos-adultos-salmon-y-pollo", muestra: "Alimento Monello gatos salmón y pollo" },
  monelloperro: { fuente: "web", url: NISSEI + "alimento-balanceado-monello-tradicional-perros-adultos-pollo", muestra: "Alimento Monello perros adultos pollo" },
  monellocach: { fuente: "web", url: NISSEI + "alimento-balanceado-monello-perros-cachorros-pollo", muestra: "Alimento Monello cachorros pollo" },
  bites: { fuente: "web", url: NISSEI + "alimento-balanceado-monello-bites-gatos-castrados-80gr", muestra: "Snack Monello Bites para gatos 80 g" },
  rascador: { fuente: "web", url: NISSEI + "juguete-rascador-durapets-azul-ref-44938-arg-7898652690716", muestra: "Juguete rascador para gatos" },
  // ---------- NISSEI: bebé ----------
  chupbuba: { fuente: "web", url: NISSEI + "chupete-buba-comfort-6-18m", muestra: "Chupete Buba Comfort" },
  chupalim: { fuente: "web", url: NISSEI + "chupete-alimentador-munchkin-mu43124-azul", muestra: "Chupete alimentador Munchkin" },
  cucharadent: { fuente: "web", url: NISSEI + "cuchara-de-denticion-munchkin-the-baby-toon-2-en-1", muestra: "Cuchara de dentición Munchkin" },
  termoaspen: { fuente: "web", url: NISSEI + "termometro-digital-aspen-dmt-2031", muestra: "Termómetro digital Aspen" },
  biberon120: { fuente: "web", url: NISSEI + "biberon-anticolico-dr-brown-s-natural-flow-options-sb43005-0m-120ml", muestra: "Biberón anticólico Dr. Brown's 120 ml" },
  biberon250: { fuente: "web", url: NISSEI + "biberon-anticolico-dr-brown-s-natural-flow-options-sb81005-0m-250ml", muestra: "Biberón anticólico Dr. Brown's 250 ml" },
  babero: { fuente: "web", url: NISSEI + "babero-para-bebe-buba-gumy-con-bolsillo-3m", muestra: "Babero Buba con bolsillo" },
  portachup: { fuente: "web", url: NISSEI + "porta-chupete-petu-petu-7-x-20-cm", muestra: "Porta chupete Petú Petú" },
  tijera: { fuente: "web", url: NISSEI + "tijera-de-unas-para-bebe-dr-brown-s-safe-squeeze-hg087-gris", muestra: "Tijera de uñas para bebé Dr. Brown's" },
  compresa: { fuente: "web", url: NISSEI + "set-de-compresa-fria-dr-brown-s-hg082-2-piezas", muestra: "Mordillo frío para dentición Dr. Brown's" },
  sonajero: { fuente: "web", url: NISSEI + "sonajero-mordedor-bright-starts-rattle-teethe-wrist-pals-kd12092", muestra: "Sonajero mordedor Bright Starts" },
  jirafa: { fuente: "web", url: NISSEI + "peluche-bright-starts-jirafa-con-mordillo-snuggle-n-teethe", muestra: "Peluche jirafa con mordillo" },
  lalaboom: { fuente: "web", url: NISSEI + "set-de-juguetes-educativos-para-bebe-lalaboom-bl690-10-piezas", muestra: "Juguetes educativos Lalaboom 10 piezas" },
  patitos: { fuente: "web", url: NISSEI + "juego-de-bano-2273-3-patitos-cjx-008-2273", muestra: "Juego de baño 3 patitos" },
  cucharababero: { fuente: "web", url: NISSEI + "juego-infantil-cuchara-y-babero-silicona-tramontina-le-petit-rosado", muestra: "Cuchara y babero de silicona" },
  mordedor: { fuente: "web", url: NISSEI + "juguete-mordedor-bright-starts-juicy-chews-multicolor", muestra: "Mordedor Bright Starts" },
  botellabuba: { fuente: "web", url: NISSEI + "botella-buba-animal-fun-12085-con-pajita-12m-unicornio-320ml", muestra: "Botella Buba con pajita (unicornio)" },
  botellaleon: { fuente: "web", url: NISSEI + "botella-buba-animal-fun-12088-con-pajita-12m-leon-320ml", muestra: "Botella Buba con pajita (león)" },
};

// ===== kits.js =====
// ============================================================
//  KITS: qué productos lleva cada kit (260 kits)
// ============================================================
//  items: [clave del producto en productos.js, cantidad]
//  MV = "Más vendido": sale en la categoría "Más vendidos" de la tienda
//  fotos: dejalo vacío para usar las fotos de los proveedores,
//         o poné tus fotos: ["img/53-1.jpg", "img/53-2.jpg"]

const k = (id, categoria, nombre, items, extra = {}) => ({ id, categoria, nombre, items, destacado: false, etiqueta: "", fotos: [], ...extra });
const MV = { destacado: true, etiqueta: "Más vendido" };

const KITS = [

  // ---------- Vitaminas y suplementos ----------
  k(1, "longevidad", "Kit Longevidad NAD+ y Resveratrol", [["nadres", 1]], MV),
  k(2, "longevidad", "Kit Antiedad Celular", [["nadage", 1], ["resv", 1]]),
  k(3, "longevidad", "Kit NAD Diario", [["nadresv", 1], ["d3k2", 1]]),
  k(4, "longevidad", "Kit Corazón Sano", [["omega3", 1], ["q10", 1]]),
  k(5, "longevidad", "Kit Colágeno Belleza", [["colageno", 1], ["vitczinc", 1]], MV),
  k(6, "longevidad", "Kit Articulaciones", [["colII", 1], ["glucosamina", 1]]),
  k(7, "longevidad", "Kit Articulaciones Plus", [["colcurc", 1], ["curcuma", 1]]),
  k(8, "longevidad", "Kit Defensas", [["vitczinc", 1], ["d3k2", 1]], MV),
  k(9, "longevidad", "Kit Defensas Plus", [["vitclipo", 1], ["zinc", 1]]),
  k(10, "longevidad", "Kit Energía Diaria", [["compb", 1], ["b12", 1]]),
  k(11, "longevidad", "Kit Multivitamínico", [["multi", 1], ["omega369", 1]]),
  k(12, "longevidad", "Kit Sueño Profundo", [["glicinato", 1], ["teanina", 1]]),
  k(13, "longevidad", "Kit Antiestrés", [["ashwa", 1], ["mag7", 1]]),
  k(14, "longevidad", "Kit Calma y Foco", [["teanina", 1], ["treonato", 1]]),
  k(15, "longevidad", "Kit Magnesio Completo", [["magbistreo", 1]]),
  k(16, "longevidad", "Kit Calambres Fuera", [["magpot", 1]]),
  k(17, "longevidad", "Kit Omega + Magnesio", [["omegamag", 1]]),
  k(18, "longevidad", "Kit Hígado y Detox", [["nac", 1], ["zeolita", 1]]),
  k(19, "longevidad", "Kit Digestión", [["psyllium", 1], ["curcuma", 1]]),
  k(20, "longevidad", "Kit Azúcar Controlada", [["berberina", 1], ["cromo", 1]]),
  k(21, "longevidad", "Kit Vista Cansada", [["luteina", 1], ["zinc", 1]]),
  k(22, "longevidad", "Kit Antiinflamatorio", [["curcumina", 1], ["omega3", 1]]),
  k(23, "longevidad", "Kit Huesos Fuertes", [["d3k2g", 1], ["mag7", 1]]),
  k(24, "longevidad", "Kit Piel desde Adentro", [["colageno", 1], ["silicio", 1]]),
  k(25, "longevidad", "Kit Cabello y Uñas Fuertes", [["silicio", 1], ["zinc", 1]]),
  k(26, "longevidad", "Kit Tiroides y Defensas", [["selenio", 1], ["zinc", 1]]),
  k(27, "longevidad", "Kit Matcha Glow", [["matcha", 1], ["vitczinc", 1]]),
  k(28, "longevidad", "Kit Superalimento", [["espirulina", 1]]),
  k(29, "longevidad", "Kit Limpieza Intestinal", [["zeolita", 1], ["psyllium", 1]]),
  k(30, "longevidad", "Kit Corazón Plus", [["omegakt", 1], ["ajo", 1]]),
  k(31, "longevidad", "Kit Inmunidad Natural", [["oregano", 1], ["zinc", 1]]),
  k(32, "longevidad", "Kit Antioxidante", [["q10", 1], ["resv", 1]]),
  k(33, "longevidad", "Kit Memoria y Concentración", [["treonato", 1], ["omega3", 1]]),
  k(34, "longevidad", "Kit Mujer 40+", [["colII", 1], ["d3k2", 1]]),
  k(35, "longevidad", "Kit Mujer Radiante", [["colageno", 1], ["vitclipo", 1]]),
  k(36, "longevidad", "Kit Hombre 40+", [["q10", 1], ["zinc", 1]]),
  k(37, "longevidad", "Kit Longevidad Premium", [["resv25", 1], ["q10", 1]]),
  k(38, "longevidad", "Kit Equilibrio Hormonal", [["maca", 1], ["mag7", 1]]),
  k(39, "longevidad", "Kit Metabolismo Activo", [["cromo", 1], ["acoco", 1]]),
  k(40, "longevidad", "Kit Vitaminas Esenciales", [["d3", 1], ["compb", 1]]),

  // ---------- Gimnasio y hombre ----------
  k(41, "gym", "Kit Fuerza", [["creatina", 1], ["colostro", 1]], MV),
  k(42, "gym", "Kit Recuperación Muscular", [["glutamina", 1], ["colostro", 1]]),
  k(43, "gym", "Kit Creatina Práctica", [["creacaps", 1], ["multi", 1]]),
  k(44, "gym", "Kit Testosterona Natural", [["testo", 1], ["zinc", 1]], MV),
  k(45, "gym", "Kit Vigor Masculino", [["tongkat", 1], ["maca", 1]]),
  k(46, "gym", "Kit Energía Hombre", [["shilajit", 1], ["compb", 1]]),
  k(47, "gym", "Kit Testo Plus", [["testo600", 1], ["d3", 1]]),
  k(48, "gym", "Kit Rendimiento", [["creacaps", 1], ["magcit", 1]]),
  k(49, "gym", "Kit Articulaciones del Deportista", [["glucosamina", 1], ["colcurc", 1]]),
  k(50, "gym", "Kit Barbería en Casa", [["cortadora", 1], ["afeitadora", 1]], MV),
  k(51, "gym", "Kit Barba Perfecta", [["recortador", 1], ["nvafter", 1]]),
  k(52, "gym", "Kit Corte Pro", [["cortadora2130", 1], ["dnvmen", 1]]),
  k(53, "gym", "Kit Hombre Fresco", [["dnvmen", 1], ["dnvrollm", 1], ["nvmen", 1]]),
  k(54, "gym", "Kit Perfume y Desodorante Hombre", [["pfiras", 1], ["dnvmen", 1]]),
  k(55, "gym", "Kit Hombre Elegante", [["pasad", 1], ["dlavoie", 1]]),
  k(56, "gym", "Kit Mochila Deportiva", [["mochila", 1], ["dnvrollm", 1], ["nvmen", 1]]),
  k(57, "gym", "Kit Recortador 5 en 1", [["recortador5", 1], ["dnvmen", 1]]),
  k(58, "gym", "Kit Viaje Hombre", [["afeitadora", 1], ["dnvrollm", 1], ["nvmen", 1]]),
  k(59, "gym", "Kit Cortes en Casa", [["cortadorab", 1], ["dnvmen", 1]]),
  k(60, "gym", "Kit Hombre Activo", [["testo600", 1], ["creacaps", 1]]),
  k(61, "gym", "Kit Pre-Entreno", [["creacaps", 1], ["compb", 1]]),
  k(62, "gym", "Kit Masa Muscular", [["creatina", 1], ["multi", 1]]),
  k(63, "gym", "Kit Defensas del Deportista", [["glutamina", 1], ["vitczinc", 1]]),
  k(64, "gym", "Kit Hombre Saludable", [["omega3", 1], ["zinc", 1]]),
  k(65, "gym", "Kit Afeitado Completo", [["afeitadora", 1], ["nvafter", 1]]),

  // ---------- Piel ----------
  k(66, "piel", "Kit Rutina Coreana Básica", [["cxgelm", 1], ["anuatonm", 1], ["s1004cremam", 1]], MV),
  k(67, "piel", "Kit Glow Coreano", [["cxmucin", 1], ["numbuzin", 2]]),
  k(68, "piel", "Kit Granitos Fuera", [["cxsali", 1], ["cxparche", 1]], MV),
  k(69, "piel", "Kit Acné Control", [["s1004limp", 1], ["s1004parche", 1], ["s1004ton", 1]]),
  k(70, "piel", "Kit Piel Hidratada", [["rlimp", 1], ["rton", 1]]),
  k(71, "piel", "Kit Protección Solar Diaria", [["rsol", 1], ["rlimp", 1]]),
  k(72, "piel", "Kit Doble Limpieza", [["banila", 1], ["cxgelm", 1]]),
  k(73, "piel", "Kit Doble Limpieza Plus", [["banila", 1], ["rlimp", 1]]),
  k(74, "piel", "Kit Ojeras Fuera", [["mmojos", 1], ["mcmask", 3]]),
  k(75, "piel", "Kit Mirada Joven", [["hhojos", 1], ["numbuzin", 2]]),
  k(76, "piel", "Kit Colágeno Medicube", [["mccolser", 1], ["mcmask", 2]], MV),
  k(77, "piel", "Kit Triple Colágeno", [["mccolton", 1], ["mcmask", 3]]),
  k(78, "piel", "Kit Antiarrugas Noche", [["mcretinol", 1], ["alth15", 1]]),
  k(79, "piel", "Kit Manchas Fuera", [["mcgluta", 1], ["anuapeachm", 2]]),
  k(80, "piel", "Kit Poros Cerrados", [["mcporeton", 1], ["mcmask", 2]]),
  k(81, "piel", "Kit Piel Sensible", [["alth15", 1], ["altserm", 1]]),
  k(82, "piel", "Kit Centella Calmante", [["s1004cremam", 1], ["s1004ton", 1], ["s1004parche", 1]]),
  k(83, "piel", "Kit 6 Mascarillas Coreanas", [["mcmask", 2], ["mcpdrnm", 2], ["numbuzin", 2]]),
  k(84, "piel", "Kit Spa Facial", [["dexenegra", 1], ["dexeoro", 1], ["cxgelm", 1]]),
  k(85, "piel", "Kit Puntos Negros", [["dexenegra", 1], ["cxsali", 1]]),
  k(86, "piel", "Kit Labios Perfectos", [["lipkit", 1], ["nvlabial", 1]]),
  k(87, "piel", "Kit Labios Voluminosos", [["vtlabios", 1], ["nvlabial", 1]]),
  k(88, "piel", "Kit Labios PDRN", [["mclabios", 1], ["nvlabial", 1]]),
  k(89, "piel", "Kit Exfoliación Suave", [["bojexf", 1], ["anuatonm", 1]]),
  k(90, "piel", "Kit Peeling en Casa", [["cxaha", 1], ["cxgelm", 1]]),
  k(91, "piel", "Kit Hidratación Profunda", [["cxhialu", 1], ["numbuzin", 2]]),
  k(92, "piel", "Kit Sérum Retinal", [["retinal20", 1], ["nvsolfac", 1]]),
  k(93, "piel", "Kit Sol y Playa", [["nvsol", 1], ["nvlabial", 1]]),
  k(94, "piel", "Kit Sol para Niños", [["nvsolkids", 1], ["nvlabial", 1]]),
  k(95, "piel", "Kit Maquillaje Natural", [["missha", 1], ["nvlabial", 1]]),
  k(96, "piel", "Kit Cuerpo Suave", [["nvsoft", 1], ["nvexpress", 1], ["nvlabial", 1]]),
  k(97, "piel", "Kit Reafirmante", [["nvq10", 1], ["s1004corp", 1]]),
  k(98, "piel", "Kit Crema Clásica", [["nvlata", 1], ["nvlabial", 1], ["nvcrema30", 1]]),
  k(99, "piel", "Kit Desmaquillado Fácil", [["nvtoall", 1], ["ragua", 1]]),
  k(100, "piel", "Kit Cuerpo Perfumado Yara", [["cremayara", 1], ["aceiteyara", 1]]),
  k(101, "piel", "Kit Cuerpo Árabe", [["cremakham", 1], ["mteriaq", 1]]),
  k(102, "piel", "Kit Anua Peach Glow", [["anuapeachs", 1], ["anuapeachm", 1]]),
  k(103, "piel", "Kit Anua Calmante", [["anuamask", 2], ["anuatonm", 1]]),
  k(104, "piel", "Kit Pads Coreanos", [["s1004pads", 1], ["numbuzin", 2]]),
  k(105, "piel", "Kit Vitamina Glow", [["altmask", 1], ["anuatonm", 1]]),
  k(106, "piel", "Kit Barrera Reparadora", [["anuacrema", 1], ["numbuzin", 1]]),
  k(107, "piel", "Kit Piel Grasa", [["mcporepad", 1], ["cxparche", 1]]),
  k(108, "piel", "Kit Belleza de Viaje", [["cxgelm", 1], ["s1004ton", 1], ["nvcrema30", 1], ["nvlabial", 1]]),
  k(109, "piel", "Kit Belleza desde Adentro", [["colageno", 1], ["mccolser", 1]]),
  k(110, "piel", "Kit Glow Total", [["cxgalac", 1], ["mcmask", 2]]),

  // ---------- Cabello ----------
  k(111, "cabello", "Kit Karseell Completo", [["kshamp", 1], ["kacond", 1], ["kmascol", 1]], MV),
  k(112, "cabello", "Kit Reparación Maca", [["kmascol", 1], ["kaceite", 1]]),
  k(113, "cabello", "Kit Rubias Perfectas", [["kmasvio", 1], ["kshamp", 1]]),
  k(114, "cabello", "Kit Argán Nutritivo", [["kargan", 1], ["kmasargan", 1], ["kacond", 1]]),
  k(115, "cabello", "Kit Sin Frizz", [["kleavein", 1], ["kaceite", 1], ["kshamp", 1]]),
  k(116, "cabello", "Kit Leave-in Doble", [["kspray", 1], ["kleavein", 1]]),
  k(117, "cabello", "Kit Silicon Mix Coco", [["smcoco", 1], ["smbrillo", 1]]),
  k(118, "cabello", "Kit Rizos Definidos", [["smrizosm", 1], ["smrizosl", 1], ["smrizosg", 1]], MV),
  k(119, "cabello", "Kit Brillo Perla", [["smperla", 1], ["smperlal", 1]]),
  k(120, "cabello", "Kit Tsubaki Japonés", [["tsushamp", 1], ["tsuacond", 1]]),
  k(121, "cabello", "Kit Tsubaki Reparación", [["tsushamp", 1], ["tsumasc", 1]]),
  k(122, "cabello", "Kit Fino Premium", [["finoshamp", 1], ["finoacond", 1]]),
  k(123, "cabello", "Kit Fino Reparación", [["finomasc", 1], ["finoaceite", 1]]),
  k(124, "cabello", "Kit Argán Dexe", [["dexeacond", 1], ["dexemasc", 1], ["dexeaceite", 1]]),
  k(125, "cabello", "Kit Anticaída Natural", [["moevshamp", 1], ["moevguasha", 1]], MV),
  k(126, "cabello", "Kit Anticaída Pro", [["mcsoyx", 1], ["kaceite", 1]]),
  k(127, "cabello", "Kit Romero Medicube", [["mcromacond", 1], ["moevguasha", 1]]),
  k(128, "cabello", "Kit Cuero Cabelludo Sano", [["moevcepillo", 1], ["moevshamp", 1]]),
  k(129, "cabello", "Kit Aceite Moev", [["moevaceite", 1], ["moevguasha", 1]]),
  k(130, "cabello", "Kit Secado Rápido", [["secador", 1], ["kaceite", 1]]),
  k(131, "cabello", "Kit Lacio Perfecto", [["plancha", 1], ["kaceite", 1]]),
  k(132, "cabello", "Kit Planchita Pro", [["planchams", 1], ["smbrillo", 1]]),
  k(133, "cabello", "Kit Rulos Fáciles", [["rizador", 1], ["kspray", 1]]),
  k(134, "cabello", "Kit Rizos Espiral", [["rizadorsp", 1], ["smrizosg", 1]]),
  k(135, "cabello", "Kit Secador de Viaje", [["secviaje", 1], ["kleavein", 1]]),
  k(136, "cabello", "Kit Cepillo Alisador", [["cepelec", 1], ["kaceite", 1]]),
  k(137, "cabello", "Kit Peinado Completo", [["secadorq", 1], ["plancha", 1]]),
  k(138, "cabello", "Kit Cabello Fuerte desde Adentro", [["silicio", 1], ["kshamp", 1]]),
  k(139, "cabello", "Kit GKhair Gold", [["gkacond", 1], ["kshamp", 1], ["kaceite", 1]]),
  k(140, "cabello", "Kit Máscara Doble", [["kmascol", 1], ["kmasargan", 1]]),
  k(141, "cabello", "Kit Aceites Capilares", [["kaceite", 1], ["kargan", 1], ["dexeaceite", 1]]),
  k(142, "cabello", "Kit Cabello Teñido", [["kmasvio", 1], ["kacond", 1], ["kaceite", 1]]),
  k(143, "cabello", "Kit Salón en Casa", [["secador", 1], ["plancha", 1], ["kmascol", 1]]),
  k(144, "cabello", "Kit Hidratación Extrema", [["finomasc", 1], ["kmascol", 1], ["kaceite", 1]]),
  k(145, "cabello", "Kit Cabello y Uñas", [["colageno", 1], ["kmascol", 1]]),

  // ---------- Perfumes ----------
  k(146, "perfumes", "Kit Yara", [["pyara", 1], ["dnvpearl", 1]]),
  k(147, "perfumes", "Kit Ameerat Al Arab", [["pameerat", 1], ["dameerat", 1]], MV),
  k(148, "perfumes", "Kit Árabe para Él", [["pasad", 1], ["dnvmen", 1]]),
  k(149, "perfumes", "Kit Dúo Árabe Pareja", [["padeeb", 1], ["pameerat", 1]], MV),
  k(150, "perfumes", "Kit Fakhar Hombre", [["pfakhar", 1], ["dlavoie", 1]]),
  k(151, "perfumes", "Kit Maahir Unisex", [["pmaahir", 1], ["dcandid", 1]]),
  k(152, "perfumes", "Kit Jouri Mujer", [["pjouri", 1], ["dcandid", 1]]),
  k(153, "perfumes", "Kit Nasma Bellissima", [["pbellis", 1], ["mclub", 1]]),
  k(154, "perfumes", "Kit Nasma Aline", [["paline", 1], ["mceles", 1]]),
  k(155, "perfumes", "Kit Nasma Salma", [["psalma", 1], ["dnvpearl", 1]]),
  k(156, "perfumes", "Kit Nasma Sherif", [["psherif", 1], ["dnvmen", 1]]),
  k(157, "perfumes", "Kit Salem Hombre", [["psalem", 1], ["dnvrollm", 1]]),
  k(158, "perfumes", "Kit Firas Hombre", [["pfiras", 1], ["dlavoie", 1]]),
  k(159, "perfumes", "Kit Faraón", [["pfaraon", 1], ["dnvmen", 1]]),
  k(160, "perfumes", "Kit Pharaoh", [["ppharaoh", 1], ["dlavoie", 1]]),
  k(161, "perfumes", "Kit Unbeatable", [["punbeat", 1], ["dnvmen", 1]]),
  k(162, "perfumes", "Kit Shouq Mujer", [["pshouq", 1], ["mhoney", 1]]),
  k(163, "perfumes", "Kit Pistacho Gourmand", [["ppistacho", 1], ["mclub", 1]], MV),
  k(164, "perfumes", "Kit Chocolate de Dubái", [["pchocolat", 1], ["msehr", 1]]),
  k(165, "perfumes", "Kit 3 Body Mist Árabes", [["mangham", 1], ["msehr", 1], ["mteriaq", 1]]),
  k(166, "perfumes", "Kit Dúo Body Mist", [["mclub", 1], ["mceles", 1]]),
  k(167, "perfumes", "Kit Victoria's Secret", [["mvsgelato", 1], ["mvspitaya", 1]]),
  k(168, "perfumes", "Kit Ariana Cloud", [["mariana", 1], ["dnvpearl", 1]]),
  k(169, "perfumes", "Kit Body Mist y Crema", [["msehr", 1], ["cremayara", 1]]),
  k(170, "perfumes", "Kit Niña Perfumada", [["cfrozen", 1], ["ptubbes", 1]]),
  k(171, "perfumes", "Kit Colonias Infantiles", [["cmickey", 1], ["cstitch", 1]]),
  k(172, "perfumes", "Kit Princesas", [["cprincess", 1], ["nvlabial", 1]]),
  k(173, "perfumes", "Kit Casa Perfumada", [["ambhaya", 2], ["mclub", 1]]),
  k(174, "perfumes", "Kit 3 Desodorantes Hombre", [["dnvmen", 1], ["dlavoie", 1], ["dnvrollm", 1]]),
  k(175, "perfumes", "Kit 3 Desodorantes Mujer", [["dnvpearl", 1], ["dcandid", 1], ["dnvrollw", 1]]),

  // ---------- Tecnología ----------
  k(176, "tecno", "Kit Carga Rápida", [["cargador30", 1], ["cablec", 2]], MV),
  k(177, "tecno", "Kit Carga iPhone", [["cargador20", 1], ["cablel", 2]]),
  k(178, "tecno", "Kit Carga Total", [["cargadorhye", 1], ["cable2m", 1]]),
  k(179, "tecno", "Kit Power Bank Viajero", [["powerbank", 1], ["cablec", 1]]),
  k(180, "tecno", "Kit Música Bluetooth", [["aurbt", 1], ["parlante", 1]], MV),
  k(181, "tecno", "Kit Auriculares Mibro", [["mibro", 1], ["cablec", 1]]),
  k(182, "tecno", "Kit Auriculares Rosa", [["mibrorosa", 1], ["cablec", 1]]),
  k(183, "tecno", "Kit HYE Pro", [["hyeh2", 1], ["cargador20", 1]]),
  k(184, "tecno", "Kit Silencio Total", [["gtide", 1], ["cablec", 1]]),
  k(185, "tecno", "Kit QCY Buds", [["qcy", 1], ["cargador20", 1]]),
  k(186, "tecno", "Kit Oficina en Casa", [["mouseinal", 1], ["teclado", 1], ["hub", 1]], MV),
  k(187, "tecno", "Kit Oficina Logitech", [["logik120", 1], ["mouseinal", 1]]),
  k(188, "tecno", "Kit Estudiante", [["mouse", 1], ["pendrive64", 1], ["hub", 1]]),
  k(189, "tecno", "Kit Respaldo de Fotos", [["pendrive32", 1], ["microsd", 1]]),
  k(190, "tecno", "Kit Reloj Inteligente", [["relojx5", 1], ["cargador20", 1]]),
  k(191, "tecno", "Kit Reloj X6 Pro", [["relojx6", 1], ["cablec", 1]]),
  k(192, "tecno", "Kit Creador de Contenido", [["tripode", 1], ["micro", 1]]),
  k(193, "tecno", "Kit Streaming", [["luzrgb", 1], ["microdeh", 1]]),
  k(194, "tecno", "Kit Luz para Fotos", [["luztri", 1], ["luzrgb", 1]]),
  k(195, "tecno", "Kit Seguridad Casa", [["camip", 1], ["microsd", 1]]),
  k(196, "tecno", "Kit Seguridad Plus", [["camip2", 1], ["microsd", 1]]),
  k(197, "tecno", "Kit Fiesta", [["parlantemox", 1], ["luzrgb", 1]]),
  k(198, "tecno", "Kit Gamer Inicial", [["aurcable", 1], ["mouse", 1], ["hub", 1]]),
  k(199, "tecno", "Kit Escritorio LED", [["lampled", 1], ["mouseinal", 1], ["hub", 1]]),
  k(200, "tecno", "Kit Llamadas", [["aurcable", 1], ["cargador30", 1]]),
  k(201, "tecno", "Kit Viaje Tech", [["powerbank", 1], ["aurbt", 1]]),
  k(202, "tecno", "Kit Celular Completo", [["cargadorhye", 1], ["aurbt", 1]]),
  k(203, "tecno", "Kit Karaoke", [["micro", 1], ["parlante", 1]]),
  k(204, "tecno", "Kit Dos Cámaras", [["camip", 2]]),
  k(205, "tecno", "Kit Cables de Repuesto", [["cablec", 2], ["cablel", 1], ["cable2m", 1]]),
  k(206, "tecno", "Kit Música y Carga", [["parlante", 1], ["cargador30", 1], ["cablec", 1]]),
  k(207, "tecno", "Kit Teletrabajo", [["aurcable", 1], ["mouseinal", 1], ["teclado", 1]]),
  k(208, "tecno", "Kit Fotos Pro", [["tripode", 1], ["luztri", 1]]),
  k(209, "tecno", "Kit Reloj + Auriculares", [["relojx5", 1], ["mibro", 1]]),
  k(210, "tecno", "Kit Regalo Tech", [["mibro", 1], ["parlante", 1], ["cablec", 1]]),

  // ---------- Regalos ----------
  k(211, "regalos", "Kit Para Él Clásico", [["whorse", 1], ["dnvmen", 1]]),
  k(212, "regalos", "Kit Whisky Red Label", [["redlabel", 1], ["dlavoie", 1]]),
  k(213, "regalos", "Kit Whisky Blonde", [["blonde", 1], ["dnvmen", 1]]),
  k(214, "regalos", "Kit Brindis", [["freixenet", 2]], MV),
  k(215, "regalos", "Kit Brindis Dulce", [["freixenet", 1], ["freixfruit", 1]]),
  k(216, "regalos", "Kit Para Ella", [["pameerat", 1], ["freixenet", 1]]),
  k(217, "regalos", "Kit Perfume y Whisky", [["psherif", 1], ["whorse", 1]]),
  k(218, "regalos", "Kit Día de la Madre", [["nvlata", 1], ["mhoney", 1], ["nvlabial", 1]]),
  k(219, "regalos", "Kit Novios", [["pchocolat", 1], ["freixfruit", 1]]),
  k(220, "regalos", "Kit Amiga Secreta", [["lipkit", 1], ["mclub", 1]]),

  // ---------- Hogar, mate y cocina ----------
  k(221, "hogar", "Kit Tereré Completo", [["kitterere", 1], ["bombyerba", 1]], MV),
  k(222, "hogar", "Kit Mate Completo", [["kitmate", 1], ["bombyerba", 1]]),
  k(223, "hogar", "Kit Guampa y Bombilla", [["guampatram", 1], ["bombalpaca", 1]]),
  k(224, "hogar", "Kit 2 Guampas Inox", [["guampainox", 2]]),
  k(225, "hogar", "Kit Termo y Guampa", [["portatermo", 1], ["guampatram", 1]]),
  k(226, "hogar", "Kit Café para Dos", [["vasomelitta", 1], ["tazas2", 1]]),
  k(227, "hogar", "Kit Asado Completo", [["cuchasado", 1], ["tablateca", 1]], MV),
  k(228, "hogar", "Kit Parrillero", [["cuchchurr", 1], ["tablateca", 1]]),
  k(229, "hogar", "Kit Cocina Básica", [["cuchtram6", 1], ["sarten", 1], ["tuppers10", 1]]),
  k(230, "hogar", "Kit Sartenes y Cuchillos", [["sartenes3", 1], ["cuchtram6", 1]]),
  k(231, "hogar", "Kit Orden en la Cocina", [["taper3", 1], ["tuppers10", 1], ["organizador3", 1]]),
  k(232, "hogar", "Kit Mesa Lista", [["cubiertos", 1], ["tazasplat", 1]]),
  k(233, "hogar", "Kit Té de la Tarde", [["tetera", 1], ["tazas2", 1]]),
  k(234, "hogar", "Kit Casa Iluminada", [["lamparas4", 1], ["lamparargb", 1]]),
  k(235, "hogar", "Kit Living Acogedor", [["fundaterc", 2], ["ambhaya", 1]]),
  k(236, "hogar", "Kit Aromaterapia", [["humidif", 1], ["ambhaya", 1]], MV),
  k(237, "hogar", "Kit Mate Eléctrico", [["pava", 1], ["guampatram", 1]]),
  k(238, "hogar", "Kit Noches de Verano", [["antimosq", 1], ["lamparas4", 1]]),

  // ---------- Mascotas ----------
  k(239, "mascotas", "Kit Perro Feliz", [["collar2", 1], ["correa", 1], ["pelota", 1]], MV),
  k(240, "mascotas", "Kit Paseo Perruno", [["collar1", 1], ["correach", 1], ["snackbacon", 1]]),
  k(241, "mascotas", "Kit Perro Limpio", [["shampooperro", 1], ["shampooseco", 1], ["comedero", 1]]),
  k(242, "mascotas", "Kit Snacks Perrunos", [["patitas", 1], ["cuero", 1], ["snackbacon", 1]]),
  k(243, "mascotas", "Kit Cachorro Nuevo", [["monellocach", 1], ["comedero", 1], ["collar1", 1]], MV),
  k(244, "mascotas", "Kit Descanso Perruno", [["cama", 1], ["pelota", 1]]),
  k(245, "mascotas", "Kit Gato Feliz", [["rascador", 1], ["bites", 2]]),
  k(246, "mascotas", "Kit Gato Limpio", [["arenagato", 1], ["shampoogato", 1]]),
  k(247, "mascotas", "Kit Gato Bien Comido", [["monellogato", 1], ["bites", 2], ["comedero", 1]]),
  k(248, "mascotas", "Kit Perro Gourmet", [["pechuga", 1], ["monelloperro", 1]]),

  // ---------- Bebé ----------
  k(249, "bebe", "Kit Recién Nacido", [["biberon120", 1], ["chupbuba", 1], ["babero", 1]], MV),
  k(250, "bebe", "Kit Dentición", [["compresa", 1], ["cucharadent", 1], ["mordedor", 1]]),
  k(251, "bebe", "Kit Hora de Comer", [["cucharababero", 1], ["biberon250", 1]]),
  k(252, "bebe", "Kit Baño Divertido", [["patitos", 1], ["tijera", 1]]),
  k(253, "bebe", "Kit Chupete Seguro", [["chupbuba", 1], ["portachup", 1]]),
  k(254, "bebe", "Kit Bebé Sano", [["termoaspen", 1], ["tijera", 1], ["compresa", 1]]),
  k(255, "bebe", "Kit Juegos para Bebé", [["lalaboom", 1], ["sonajero", 1]]),
  k(256, "bebe", "Kit Jirafa Mordillo", [["jirafa", 1], ["mordedor", 1]]),
  k(257, "bebe", "Kit Primeros Sorbos", [["botellabuba", 1], ["cucharadent", 1]]),
  k(258, "bebe", "Kit 2 Biberones", [["biberon120", 1], ["biberon250", 1]]),
  k(259, "bebe", "Kit Bebé de Paseo", [["chupalim", 1], ["botellaleon", 1], ["portachup", 1]]),
  k(260, "bebe", "Kit Baby Shower", [["sonajero", 1], ["babero", 1], ["chupbuba", 1]], MV),
];

// ===== motor.js =====
// ============================================================
//  MOTOR: lee proveedores, calcula kits y arma el catálogo
// ============================================================



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
function leerSchemaOrg(html) {
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

async function leerProductos(fetchFn, claves) {
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

function redondear(n, terminacion = CONFIG.terminacion) {
  const paso = 10000;
  return Math.ceil((n - terminacion) / paso) * paso + terminacion;
}

const fijos = () => (CONFIG.costoDelivery || 0) + (CONFIG.costoCaja || 0) + (CONFIG.costoPublicidad || 0);

function precioDeVenta(costo, categoria) {
  const m = CONFIG.margenPorCategoria[categoria] ?? CONFIG.margenPorDefecto;
  return redondear(costo * (1 + m) + fijos());
}

function nombreItem(clave, cant) {
  const n = PRODUCTOS[clave]?.muestra || clave;
  return cant > 1 ? `${cant} x ${n}` : n;
}

function calcularKits(lecturas, anteriores = {}) {
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

function aCSV(kits) {
  const cab = ["id", "destacado", "categoria", "nombre", "productos", "precio", "etiqueta", "foto1", "foto2", "foto3", "foto4", "activo"];
  const filas = kits.map((k) => [
    k.id, k.destacado ? "si" : "no", k.categoria, k.nombre, k.productos.join(" | "), k.precio ?? "",
    k.etiqueta, k.fotos[0], k.fotos[1], k.fotos[2], k.fotos[3], k.activo ? "si" : "no",
  ]);
  return [cab, ...filas].map((f) => f.map(celda).join(",")).join("\n") + "\n";
}

// ---------- Corrida completa ----------

async function actualizar(env, fetchFn = fetch) {
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

// ===== index.js =====
// ============================================================
//  WORKER: rutas públicas y tarea programada
// ============================================================
//  GET /kits.csv     → la tienda lee esto (poné este link en PLANILLA_CSV)
//  GET /kits.json    → lo mismo en JSON, con costo y ganancia
//  GET /reporte      → página con lo que pasó en la última actualización
//  GET /actualizar?clave=TU_CLAVE → corre el motor ahora

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
