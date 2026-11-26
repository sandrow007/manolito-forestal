/**
 * MANOLIT∞ FORESTAL - Proxy seguro a NASA FIRMS
 * El frontend llama a /getFires?bounds=oeste,sur,este,norte (sin API key).
 * Este módulo añade la MAP_KEY desde el secret del Worker y reenvía el CSV.
 *
 * IMPORTANTE: NASA apagó Suomi-NPP (fuente VIIRS_SNPP_NRT) el 2-nov-2026.
 * Ahora se consulta NOAA-20 → NOAA-21 → MODIS, en ese orden, hasta que una
 * fuente devuelva datos. Si ninguna responde, se devuelve un CSV vacío con
 * HTTP 200 (0 fuegos), nunca un error al navegador.
 */

// Orden de preferencia: VIIRS NOAA-20 y NOAA-21 son los sucesores de Suomi-NPP.
const FUENTES = ['VIIRS_NOAA20_NRT', 'VIIRS_NOAA21_NRT', 'MODIS_NRT'];

const CABECERA_VACIA = 'latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_ti5,frp,daynight';

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

    const diasAtras = bounds === 'world' ? 1 : 3;

    for (const fuente of FUENTES) {
        const csv = await pedirCsv(mapKey, fuente, bounds, diasAtras);
        if (csv) {
            return new Response(csv, { headers: cabeceras() });
        }
    }

    // Ninguna fuente devolvió datos: CSV vacío (solo cabecera) con HTTP 200
    // para que el navegador muestre 0 fuegos sin error en consola.
    return new Response(CABECERA_VACIA, { headers: cabeceras() });
}

function cabeceras() {
    return {
        'Content-Type': 'text/csv',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // 5 min, FIRMS no cambia más rápido que eso
    };
}

// Devuelve el CSV solo si es una respuesta válida CON filas de datos;
// null en caso contrario (error HTTP, cuerpo de error con status 200, o
// cabecera sola = fuente sin detecciones), para probar la siguiente fuente.
async function pedirCsv(mapKey, fuente, bounds, diasAtras) {
    try {
        const firmsUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${fuente}/${bounds}/${diasAtras}`;
        const resp = await fetch(firmsUrl);
        if (!resp.ok) {
            console.error(`[getFires] ${fuente} respondió ${resp.status}`);
            return null;
        }
        const csv = await resp.text();
        if (!csv.toLowerCase().includes('latitude')) {
            // FIRMS devuelve texto de error (clave inválida, cuota…) con 200.
            console.error(`[getFires] ${fuente} respuesta inesperada:`, csv.slice(0, 200));
            return null;
        }
        const filas = csv.trim().split('\n').length - 1;
        if (filas <= 0) return null; // cabecera sola: fuente viva pero sin datos
        return csv;
    } catch (e) {
        console.error(`[getFires] Error de red con ${fuente}:`, e.message);
        return null;
    }
}
