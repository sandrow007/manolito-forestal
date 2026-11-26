/**
 * MANOLIT∞ FORESTAL - Proxies servidor-a-servidor de las APIs externas
 * (Nominatim, Overpass, Open-Meteo).
 *
 * El navegador SOLO habla con este mismo origen. Si una API externa falla
 * (502, timeout, caída), se responde siempre HTTP 200 con un marcador
 * {"error": ...}: así el navegador no imprime NUNCA líneas de error
 * automáticas en consola ("Failed to load resource", CORS…), que no
 * pueden ocultarse desde JavaScript. Los fallos se gestionan en la UI.
 *
 * Todo resultado se cachea en el edge de Cloudflare (incluidos los
 * errores, 60 s, para no martillear una API caída).
 */

const UA = 'manolito-forestal/1.0 (https://manolitoforestal.space)';

const OVERPASS_MIRRORS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter'
];

const TTL_ERROR_S = 60;

async function conCache(ctx, clave, ttlS, producir) {
    const cache = caches.default;
    const key = new Request('https://cache-interna.manolito/' + clave);
    const hit = await cache.match(key);
    if (hit) return hit;
    const { cuerpo, esError } = await producir();
    const ttl = esError ? TTL_ERROR_S : ttlS;
    const resp = new Response(cuerpo, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': `public, max-age=${ttl}`
        }
    });
    ctx.waitUntil(cache.put(key, resp.clone()));
    return resp;
}

function validarCoord(lat, lon) {
    return isFinite(lat) && isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}

// Consulta Overpass probando espejos en silencio (sin console.warn:
// los avisos de espejo fallido eran ruido; aquí solo importa el resultado).
async function consultarOverpass(query, timeoutMs) {
    for (const mirror of OVERPASS_MIRRORS) {
        try {
            const resp = await fetch(mirror, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': UA
                },
                body: 'data=' + encodeURIComponent(query),
                signal: AbortSignal.timeout(timeoutMs)
            });
            if (resp.ok) return await resp.text();
        } catch (e) { /* espejo caído: se prueba el siguiente, en silencio */ }
    }
    return null;
}

/* ================= /reverse — geocodificación inversa (Nominatim) ================= */

export async function handleReverse(request, env, ctx) {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat'));
    const lon = parseFloat(url.searchParams.get('lon'));

    if (!validarCoord(lat, lon)) {
        return Response.json({ error: 'parametros lat/lon invalidos' }, { status: 400 });
    }

    // Redondeo a ~1 km: para "el pueblo más cercano" sobra precisión y
    // multiplica los aciertos de caché (Nominatim limita a 1 req/s).
    const latR = lat.toFixed(2);
    const lonR = lon.toFixed(2);

    return conCache(ctx, `reverse?lat=${latR}&lon=${lonR}`, 60 * 60 * 24 * 30, async () => {
        try {
            const resp = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latR}&lon=${lonR}&accept-language=es&zoom=10`,
                { headers: { 'User-Agent': UA, 'Accept': 'application/json' } }
            );
            if (!resp.ok) return { cuerpo: JSON.stringify({ error: 'geocodificador no disponible' }), esError: true };
            return { cuerpo: await resp.text(), esError: false };
        } catch (e) {
            return { cuerpo: JSON.stringify({ error: 'geocodificador no disponible' }), esError: true };
        }
    });
}

/* ============ /terreno — contexto vegetación/agua de un punto (Overpass) ============ */

export async function handleTerreno(request, env, ctx) {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat'));
    const lon = parseFloat(url.searchParams.get('lon'));

    if (!validarCoord(lat, lon)) {
        return Response.json({ error: 'parametros lat/lon invalidos' }, { status: 400 });
    }

    const latR = lat.toFixed(2);
    const lonR = lon.toFixed(2);
    const radioMetros = 3000;

    return conCache(ctx, `terreno?lat=${latR}&lon=${lonR}`, 60 * 60 * 24, async () => {
        const query = `
            [out:json][timeout:10];
            (
              nwr["natural"="wood"](around:${radioMetros},${lat},${lon});
              nwr["landuse"="forest"](around:${radioMetros},${lat},${lon});
              nwr["natural"="scrub"](around:${radioMetros},${lat},${lon});
              nwr["natural"="heath"](around:${radioMetros},${lat},${lon});
              nwr["natural"="grassland"](around:${radioMetros},${lat},${lon});
              nwr["landuse"="meadow"](around:${radioMetros},${lat},${lon});
              nwr["natural"="water"](around:${radioMetros},${lat},${lon});
              nwr["waterway"="river"](around:${radioMetros},${lat},${lon});
              nwr["landuse"="reservoir"](around:${radioMetros},${lat},${lon});
            );
            out tags 10;
        `;
        const cuerpo = await consultarOverpass(query, 10000);
        if (cuerpo === null) {
            return { cuerpo: JSON.stringify({ error: 'overpass no disponible', elements: [] }), esError: true };
        }
        return { cuerpo, esError: false };
    });
}

/* ============ /recursos — hidrantes/balsas/… del bbox visible (Overpass) ============ */

const FRAGMENTOS_RECURSOS = [
    'node["emergency"="fire_hydrant"]({{bbox}});',
    'way["emergency"="fire_hydrant"]({{bbox}});',
    'node["emergency"="water_tank"]({{bbox}});',
    'way["emergency"="water_tank"]({{bbox}});',
    'node["aeroway"="helipad"]({{bbox}});',
    'way["aeroway"="helipad"]({{bbox}});',
    'node["natural"="water"]["water"~"^(reservoir|basin)$"]({{bbox}});',
    'way["natural"="water"]["water"~"^(reservoir|basin)$"]({{bbox}});',
    'way["landuse"="reservoir"]({{bbox}});',
    'node["emergency"="fire_station"]({{bbox}});',
    'way["emergency"="fire_station"]({{bbox}});'
];

export async function handleRecursos(request, env, ctx) {
    const url = new URL(request.url);
    const sur = parseFloat(url.searchParams.get('sur'));
    const oeste = parseFloat(url.searchParams.get('oeste'));
    const norte = parseFloat(url.searchParams.get('norte'));
    const este = parseFloat(url.searchParams.get('este'));

    if (![sur, oeste, norte, este].every(isFinite) ||
        Math.abs(sur) > 90 || Math.abs(norte) > 90 ||
        Math.abs(oeste) > 180 || Math.abs(este) > 180 ||
        sur >= norte || oeste >= este) {
        return Response.json({ error: 'bbox invalido' }, { status: 400 });
    }
    // Mismo guard que el frontend: bbox de más de 0.5° de lado = pedir zoom.
    if ((norte - sur) > 0.5 || (este - oeste) > 0.5) {
        return Response.json({ error: 'bbox demasiado grande', elements: [] });
    }

    const r2 = (n) => Math.round(n * 100) / 100;
    const clave = `recursos?bbox=${r2(sur)},${r2(oeste)},${r2(norte)},${r2(este)}`;

    return conCache(ctx, clave, 10 * 60, async () => {
        const bboxStr = `${sur},${oeste},${norte},${este}`;
        const query = '[out:json][timeout:25];(' +
            FRAGMENTOS_RECURSOS.map((f) => f.split('{{bbox}}').join(bboxStr)).join('') +
            ');out center;';
        const cuerpo = await consultarOverpass(query, 20000);
        if (cuerpo === null) {
            return { cuerpo: JSON.stringify({ error: 'overpass no disponible', elements: [] }), esError: true };
        }
        return { cuerpo, esError: false };
    });
}

/* ================= /weather — pronóstico actual (Open-Meteo) ================= */

export async function handleWeather(request, env, ctx) {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat'));
    const lon = parseFloat(url.searchParams.get('lon'));

    if (!validarCoord(lat, lon)) {
        return Response.json({ error: 'parametros lat/lon invalidos' }, { status: 400 });
    }

    const latR = lat.toFixed(2);
    const lonR = lon.toFixed(2);
    const upstream = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,soil_moisture_0_to_1cm,is_day&daily=precipitation_sum&timezone=auto`;

    return conCache(ctx, `weather?lat=${latR}&lon=${lonR}`, 10 * 60, async () => {
        try {
            const resp = await fetch(upstream, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) });
            if (!resp.ok) return { cuerpo: JSON.stringify({ error: 'meteo no disponible' }), esError: true };
            return { cuerpo: await resp.text(), esError: false };
        } catch (e) {
            return { cuerpo: JSON.stringify({ error: 'meteo no disponible' }), esError: true };
        }
    });
}

/* ================= /elevation — modelo de elevación (Open-Meteo) ================= */

export async function handleElevation(request, env, ctx) {
    const url = new URL(request.url);
    const lats = (url.searchParams.get('lats') || '').split(',').map(parseFloat);
    const lons = (url.searchParams.get('lons') || '').split(',').map(parseFloat);

    if (!lats.length || lats.length !== lons.length || !lats.every(validarLat) || !lons.every((n) => isFinite(n) && Math.abs(n) <= 180)) {
        return Response.json({ error: 'parametros lats/lons invalidos' }, { status: 400 });
    }

    return conCache(ctx, `elevation?lats=${lats.join(',')}&lons=${lons.join(',')}`, 60 * 60 * 24 * 30, async () => {
        try {
            const upstream = `https://api.open-meteo.com/v1/elevation?latitude=${lats.join(',')}&longitude=${lons.join(',')}`;
            const resp = await fetch(upstream, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) });
            if (!resp.ok) return { cuerpo: JSON.stringify({ error: 'elevacion no disponible' }), esError: true };
            return { cuerpo: await resp.text(), esError: false };
        } catch (e) {
            return { cuerpo: JSON.stringify({ error: 'elevacion no disponible' }), esError: true };
        }
    });
}

function validarLat(n) {
    return isFinite(n) && Math.abs(n) <= 90;
}
