/**
 * MANOLIT∞ FORESTAL - Proxy de geocodificación inversa (Nominatim)
 * El frontend llama a /reverse?lat=..&lon=.. (mismo origen: el navegador
 * jamás hace una petición cross-origin, así que no puede haber errores
 * CORS en consola). Desde aquí se consulta Nominatim servidor-a-servidor,
 * con el User-Agent que exige su política de uso y con caché de edge
 * para respetar su límite de 1 req/s.
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
const USER_AGENT = 'manolito-forestal/1.0 (https://manolitoforestal.space)';
const CACHE_TTL_S = 60 * 60 * 24 * 30; // 30 días: los nombres de lugar no cambian

export async function handleReverseGeocode(request, env, ctx) {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat'));
    const lon = parseFloat(url.searchParams.get('lon'));

    if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
        return Response.json({ error: 'parametros lat/lon invalidos' }, { status: 400 });
    }

    // Redondeo a ~1 km: para "el pueblo más cercano" sobra precisión y
    // multiplica los aciertos de caché (clave para el límite de Nominatim).
    const latR = lat.toFixed(2);
    const lonR = lon.toFixed(2);

    const cacheKey = new Request(`https://cache-interna.manolito/reverse?lat=${latR}&lon=${lonR}`);
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    try {
        const resp = await fetch(
            `${NOMINATIM_URL}?format=jsonv2&lat=${latR}&lon=${lonR}&accept-language=es&zoom=10`,
            { headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' } }
        );
        if (!resp.ok) {
            return Response.json({ error: 'geocodificador no disponible' }, { status: 502 });
        }
        const cuerpo = await resp.text();
        const respuesta = new Response(cuerpo, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': `public, max-age=${CACHE_TTL_S}`
            }
        });
        ctx.waitUntil(cache.put(cacheKey, respuesta.clone()));
        return respuesta;
    } catch (e) {
        return Response.json({ error: 'geocodificador no disponible' }, { status: 502 });
    }
}
