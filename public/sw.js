/**
 * MANOLIT∞ FORESTAL — Service Worker (sw.js)
 * ------------------------------------------
 * Estrategia de caché offline-first para uso en campo:
 *
 *   - 'manolito-tiles-v1'  → tiles del mapa (CartoDB dark, Esri satélite,
 *                            OpenTopoMap). Cache-first: en campo sin cobertura
 *                            los tiles cacheados se sirven al instante.
 *   - 'manolito-static-v1' → assets propios del mismo origen (.js/.css/.html/
 *                            imágenes/manifest). Stale-while-revalidate.
 *   - 'manolito-datos-v1'  → APIs de datos (mismo origen: /getFires, /senal…).
 *                            Network-first con fallback a caché.
 *
 * Mensajes aceptados (postMessage desde la página):
 *   { type: 'PRECARGA_ZONA', bbox: [w, s, e, n], zoomMin, zoomMax }
 *     Descarga los tiles OSM/Carto de la zona visible para uso offline.
 *     Tope de seguridad: MAX_TILES_PRECARGA. Progreso por postMessage:
 *       { type: 'PRECARGA_PROGRESO', hechas, total }
 *       { type: 'PRECARGA_COMPLETA', tiles }   (al terminar, éxitos reales)
 *
 * Licencia: AGPL-3.0 (igual que el resto del proyecto).
 */
'use strict';

/* ================= CONFIGURACIÓN ================= */

const CACHE_TILES  = 'manolito-tiles-v1';
const CACHE_STATIC = 'manolito-static-v1';
const CACHE_DATOS  = 'manolito-datos-v1';

const CACHES_CONOCIDOS = [CACHE_TILES, CACHE_STATIC, CACHE_DATOS];

// Hostnames de tiles tal y como aparecen en motor-cuantico.js:
//   https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png  (a/b/c/d)
//   https://server.arcgisonline.com/.../tile/{z}/{y}/{x}
//   https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png               (a/b/c)
const TILE_HOSTS = [
    'basemaps.cartocdn.com',       // cubre a. b. c. d. por endsWith
    'server.arcgisonline.com',
    'tile.opentopomap.org'
];

// Rutas del propio worker que sirven datos (network-first).
const RUTAS_DATOS = ['/getFires', '/senal'];

const MAX_TILES_PRECARGA = 500;   // tope de seguridad anti-descargas masivas
const TTL_TILES_MS = 30 * 24 * 3600 * 1000; // 30 días: los tiles caducan

/* ================= CICLO DE VIDA ================= */

self.addEventListener('install', (event) => {
    // Activación inmediata: no esperamos a que se cierren pestañas viejas.
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        // Limpieza de cachés de versiones anteriores.
        const nombres = await caches.keys();
        await Promise.all(
            nombres
                .filter((n) => n.startsWith('manolito-') && !CACHES_CONOCIDOS.includes(n))
                .map((n) => caches.delete(n))
        );
        await self.clients.claim();
    })());
});

/* ================= CLASIFICACIÓN DE PETICIONES ================= */

function esTile(url) {
    return TILE_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith('.' + host));
}

function esDato(url) {
    if (url.origin !== self.location.origin) return false;
    return RUTAS_DATOS.some((r) => url.pathname.startsWith(r));
}

function esAssetEstatico(url) {
    if (url.origin !== self.location.origin) return false;
    return url.pathname === '/' ||
        /\.(js|css|html|webmanifest|png|jpg|jpeg|svg|webp|ico|woff2?|ttf|json)$/.test(url.pathname);
}

/* ================= ESTRATEGIAS ================= */

// Tiles: cache-first (con TTL blando; un tile viejo es mejor que ninguno
// en campo, pero si hay red y supera el TTL lo revalidamos en segundo plano).
async function cacheFirstTiles(request) {
    const cache = await caches.open(CACHE_TILES);
    const cached = await cache.match(request);
    if (cached) {
        const fecha = Date.parse(cached.headers.get('date') || '');
        if (isNaN(fecha) || Date.now() - fecha < TTL_TILES_MS) return cached;
        // Caducado: revalidar en segundo plano, servir lo cacheado ya.
        fetch(request).then((resp) => {
            if (resp && resp.ok) cache.put(request, resp.clone());
        }).catch(() => {});
        return cached;
    }
    const resp = await fetch(request);
    if (resp && (resp.ok || resp.type === 'opaque')) {
        cache.put(request, resp.clone()).catch(() => {});
    }
    return resp;
}

// Assets propios: stale-while-revalidate.
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_STATIC);
    const cached = await cache.match(request);
    const promesaRed = fetch(request).then((resp) => {
        if (resp && resp.ok) cache.put(request, resp.clone()).catch(() => {});
        return resp;
    }).catch(() => null);
    return cached || (await promesaRed) || Response.error();
}

// Datos (FIRMS, señales mesh): network-first con fallback a caché.
async function networkFirstDatos(request) {
    const cache = await caches.open(CACHE_DATOS);
    try {
        const resp = await fetch(request);
        // Solo cacheamos GET con respuesta válida (los POST de /senal no se cachean).
        if (request.method === 'GET' && resp && resp.ok) {
            cache.put(request, resp.clone()).catch(() => {});
        }
        return resp;
    } catch (e) {
        const cached = await cache.match(request);
        if (cached) return cached;
        throw e;
    }
}

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return; // solo GET pasa por caché

    const url = new URL(request.url);

    if (esTile(url)) {
        event.respondWith(cacheFirstTiles(request));
    } else if (esDato(url)) {
        event.respondWith(networkFirstDatos(request));
    } else if (esAssetEstatico(url)) {
        event.respondWith(staleWhileRevalidate(request));
    }
    // El resto (APIs externas: Open-Meteo, Overpass, EFFIS…) va directo a red.
});

/* ================= PRECARGA DE ZONA (offline en campo) ================= */

// Fórmula estándar Web-Mercator (Slippy Map): lon/lat → x/y de tile.
function lonLatATile(lon, lat, z) {
    const n = Math.pow(2, z);
    const x = Math.floor(((lon + 180) / 360) * n);
    const latRad = (lat * Math.PI) / 180;
    const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
    return { x, y };
}

// Genera las URLs de tiles Carto (capa oscura, misma que usa la app) para
// el bbox [w, s, e, n] entre zoomMin y zoomMax, con tope de seguridad.
function generarUrlsZona(bbox, zoomMin, zoomMax, limite) {
    const [w, s, e, n] = bbox;
    const urls = [];
    const subs = ['a', 'b', 'c', 'd']; // subdominios de basemaps.cartocdn.com
    let i = 0;
    for (let z = Math.max(0, zoomMin | 0); z <= Math.min(20, zoomMax | 0); z++) {
        const p1 = lonLatATile(w, n, z); // esquina noroeste
        const p2 = lonLatATile(e, s, z); // esquina sureste
        for (let x = Math.min(p1.x, p2.x); x <= Math.max(p1.x, p2.x); x++) {
            for (let y = Math.min(p1.y, p2.y); y <= Math.max(p1.y, p2.y); y++) {
                if (urls.length >= limite) return urls;
                const sub = subs[i++ % subs.length];
                urls.push(`https://${sub}.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png`);
            }
        }
    }
    return urls;
}

async function precargarZona(cliente, bbox, zoomMin, zoomMax) {
    const urls = generarUrlsZona(bbox, zoomMin, zoomMax, MAX_TILES_PRECARGA);
    const cache = await caches.open(CACHE_TILES);
    const total = urls.length;
    let hechas = 0;

    // Lotes pequeños para no saturar la red del móvil en campo.
    const LOTE = 8;
    for (let i = 0; i < urls.length; i += LOTE) {
        const lote = urls.slice(i, i + LOTE);
        // allSettled: un tile que falla no aborta el resto.
        const resultados = await Promise.allSettled(lote.map(async (url) => {
            const ya = await cache.match(url);
            if (ya) return url;
            const resp = await fetch(url, { mode: 'cors', credentials: 'omit' });
            if (resp && (resp.ok || resp.type === 'opaque')) {
                await cache.put(url, resp.clone());
            }
            return url;
        }));
        hechas += resultados.filter((r) => r.status === 'fulfilled').length;
        if (cliente) {
            cliente.postMessage({ type: 'PRECARGA_PROGRESO', hechas, total });
        }
    }

    if (cliente) {
        cliente.postMessage({ type: 'PRECARGA_COMPLETA', tiles: hechas, total });
    }
}

self.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'PRECARGA_ZONA' && Array.isArray(data.bbox)) {
        const cliente = event.source;
        event.waitUntil(
            precargarZona(cliente, data.bbox, data.zoomMin, data.zoomMax)
                .catch((e) => {
                    if (cliente) {
                        cliente.postMessage({ type: 'PRECARGA_COMPLETA', tiles: 0, total: 0, error: String(e) });
                    }
                })
        );
    }
});
