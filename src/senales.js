/**
 * MANOLIT∞ FORESTAL - Señalización de emergencia (WebRTC)
 *
 * Qué resuelve: dos móviles que se detectan por ultrasonido necesitan
 * intercambiar un "papeleo" técnico (SDP/ICE) para que WebRTC arranque.
 * Ese papeleo no cabe en el sonido, así que viaja aquí: un buzón mínimo
 * en Cloudflare KV. Un móvil deja el mensaje, el otro lo recoge en
 * cuanto pregunta. Nadie tiene que copiar ni pegar nada a mano.
 *
 * Requiere un KV namespace enlazado como "SENALES" en wrangler.toml
 * (instrucciones abajo del todo de este archivo).
 */

export async function handleSenalPost(request, env) {
    let cuerpo;
    try {
        cuerpo = await request.json();
    } catch (e) {
        return cors(new Response('JSON inválido', { status: 400 }));
    }

    const { de, para, datos } = cuerpo;
    if (!de || !para || !datos) {
        return cors(new Response('Faltan campos: de, para, datos', { status: 400 }));
    }

    // Clave única por destinatario + momento, para que varios mensajes
    // en cola no se pisen entre sí.
    const clave = `senal:${para}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    await env.SENALES.put(clave, JSON.stringify({ de, datos }), { expirationTtl: 60 });

    return cors(new Response('OK'));
}

export async function handleSenalGet(request, env) {
    const url = new URL(request.url);
    const para = url.searchParams.get('para');
    if (!para) return cors(new Response('Falta el parámetro "para"', { status: 400 }));

    const prefijo = `senal:${para}:`;
    const lista = await env.SENALES.list({ prefix: prefijo });

    const mensajes = [];
    for (const clave of lista.keys) {
        const valor = await env.SENALES.get(clave.name);
        if (valor) mensajes.push(JSON.parse(valor));
        await env.SENALES.delete(clave.name); // se consume al leerlo, no se acumula
    }

    return cors(new Response(JSON.stringify(mensajes), {
        headers: { 'Content-Type': 'application/json' }
    }));
}

export function handleSenalOptions() {
    return cors(new Response(null, { status: 204 }));
}

function cors(resp) {
    resp.headers.set('Access-Control-Allow-Origin', '*');
    resp.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    resp.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return resp;
}

