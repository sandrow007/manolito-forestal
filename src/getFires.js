/**
 * MANOLIT∞ FORESTAL - Proxy seguro a NASA FIRMS
 * El frontend llama a /getFires?bounds=oeste,sur,este,norte (sin API key).
 * Este módulo añade la MAP_KEY desde el secret del Worker y reenvía el CSV.
 */

export async function handleGetFires(request, env) {
    const url = new URL(request.url);
    const bounds = url.searchParams.get('bounds');

    if (!bounds) {
        return new Response('Falta el parámetro "bounds"', { status: 400 });
    }

    const mapKey = env.FIRMS_MAP_KEY;
    if (!mapKey) {
        return new Response('FIRMS_MAP_KEY no está configurada en el Worker (usa: npx wrangler secret put FIRMS_MAP_KEY)', { status: 500 });
    }

    const fuente = 'VIIRS_SNPP_NRT'; // satélite VIIRS, casi-tiempo-real
    const diasAtras = 1;             // solo detecciones del último día
    const firmsUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${fuente}/${bounds}/${diasAtras}`;

    try {
        const resp = await fetch(firmsUrl);
        if (!resp.ok) {
            console.error(`[getFires] FIRMS respondió ${resp.status}`);
            return new Response('NASA FIRMS no respondió correctamente', { status: 502 });
        }
        const csv = await resp.text();

        // FIRMS a veces devuelve un cuerpo de texto de error (p.ej. clave
        // inválida o cuota agotada) con status 200 pero sin cabecera CSV real.
        if (!csv.toLowerCase().includes('latitude')) {
            console.error('[getFires] Respuesta inesperada de FIRMS:', csv.slice(0, 200));
            return new Response('Respuesta inesperada de NASA FIRMS (revisa la MAP_KEY o la cuota)', { status: 502 });
        }

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=300' // 5 min, FIRMS no cambia más rápido que eso
            }
        });
    } catch (e) {
        console.error('[getFires] Error de red contra FIRMS:', e.message);
        return new Response('Error al contactar con NASA FIRMS', { status: 502 });
    }
}