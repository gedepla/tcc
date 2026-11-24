# Tu Centro de Compras

Tienda de kits: https://tucentrodecompras.gedepla.workers.dev

- `publico/index.html` es toda la tienda (un solo archivo).
- Los precios y el stock los pone solo el motor: https://motor-kits.gedepla.workers.dev/kits.csv
- Cada cambio que se sube a este repositorio se publica solo en Cloudflare (Workers Builds).

Cómo funciona para el cliente:
1. Elige una categoría (arranca en "Más vendidos") y ve 3 kits por pantalla; "Siguientes" o deslizar para ver más.
2. Toca "Quiero este kit", pone nombre, ciudad, ubicación y forma de pago (transferencia o QR).
3. El pedido llega armado al WhatsApp 0992 500 100.

## Cómo publicar un cambio
Se edita `publico/index.html` y se sube a la rama `main`: Cloudflare la publica sola en 1 o 2 minutos.

## Motor de precios (carpeta `motor/`)
- 260 kits (`motor/src/kits.js`) con 308 productos de Seiva, Mega y Nissei (`motor/src/productos.js`).
- Corre solo cada 10 minutos en https://motor-kits.gedepla.workers.dev y publica `/kits.csv`, `/kits.json` y `/reporte`.
- Cada cambio en `motor/` que se sube a GitHub se publica solo.
