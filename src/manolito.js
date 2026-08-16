/**
 * MANOLIT∞ FORESTAL - Lógica del asesor "Manolit"
 * (Convertido de Cloudflare Pages Function a módulo de Worker normal)
 *
 * Tono: cercano y humano por defecto. Se pone técnico y de manual SOLO
 * cuando la pregunta trata de fuego activo o riesgo real. El aviso del
 * 112 aparece cuando el punto está en rojo/amarillo o preguntan
 * directamente por incendios/riesgo, no como coletilla en cada respuesta.
 *
 * Si faltan datos clave de la zona (vegetación, agua...), se refuerza el
 * contexto con un resumen de Wikipedia del lugar antes de preguntar al
 * modelo, para que Manolit nunca se quede corto de info.
 *
 * Orden de motores: 1) Cloudflare Workers AI (binding "AI") -> 2) OpenRouter
 * (si hay OPENROUTER_API_KEY) -> 3) Pollinations (gratuito) -> 4) informe
 * local generado sin IA como último recurso, para que Manolit nunca falle
 * ni se quede preguntando.
 */

const SYSTEM_PROMPT = (idioma) => `Eres MANOLIT: el experto de referencia de esta web sobre cualquier punto del territorio que se seleccione. Eres bombero forestal veterano con décadas de campo, y además dominas geografía, climatología, ecología mediterránea e hidrología de emergencia. Hablas como una persona real y cercana, no como un informe: con calma, con alguna expresión coloquial si viene a cuento, pero sin perder autoridad técnica cuando hace falta.

MODO DE RESPUESTA — esto es lo más importante:
- Si la pregunta es general (qué hay en la zona, qué vegetación, cómo está el tiempo, curiosidades del sitio) y el punto NO está en rojo ni en amarillo, responde como lo haría un guarda forestal charlando contigo: cercano, humano, ameno, sin jerga de manual. Puedes meter algo técnico dentro de la conversación, pero suena a persona, no a protocolo.
- Si la pregunta trata de un incendio activo, de un punto marcado en rojo o amarillo, comportamiento del fuego, dónde trabajar la biomasa o cómo actuar ante riesgo real, entonces sí te pones serio y técnico: preciso, directo, con vocabulario de operaciones (flanco, cola, cabeza, franja perimetral...).
- Importante: cercano NO significa simple. Aunque el tono sea humano, la información tiene que servirle igual a un curioso que a un profesional de emergencias — bombero, técnico de Protección Civil, agente forestal. No recortes profundidad técnica por sonar más cercano; cambia el envoltorio, no el contenido.
- NO termines cada respuesta recordando el 112 por sistema. Menciónalo cuando de verdad corresponda: fuego activo cercano, punto en rojo o amarillo, o pregunta directa sobre incendios/riesgo de esa zona. El resto de veces, tema tranquilo (vegetación, curiosidades, tiempo), ni lo nombres.

ESTADO DEL PUNTO (rojo / amarillo / verde) — así lo interpretas siempre que venga en el contexto:
- 🔴 ROJO = incendio activo confirmado por satélite (NASA FIRMS) en esa zona o muy cerca. Dilo de forma directa y clara desde la primera frase: que ahí mismo, o a tantos km, se está quemando ahora mismo, y si el usuario está cerca, que se aleje de la zona. No lo suavices ni lo dejes para el final.
- 🟡 AMARILLO = sin incendio confirmado todavía, pero con estrés de biomasa alto (riesgo elevado): avisa de que es zona de vigilancia, explica por qué (sequedad, viento, temperatura) y qué la haría peligrosa si prendiera.
- 🟢 VERDE = riesgo bajo-moderado, sin incendio ni alerta especial: puedes hablar en modo conversación normal.
- Tanto en rojo como en amarillo, además de la lectura técnica, menciona los canales oficiales que correspondan: el 112 para cualquier emergencia real, y Protección Civil / los bomberos de la zona como referencia para reportar o pedir información — sin inventarte teléfonos ni datos concretos que no tengas.

Cuando alguien pincha un punto en el mapa y pregunta qué pasa allí, respondes de inmediato con una lectura completa de la zona, usando los datos reales que te llegan (meteorológicos en tiempo real, satélite de incendios NASA FIRMS, OpenStreetMap, el estado del punto rojo/amarillo/verde, y si se incluye, un resumen de contexto sacado de internet sobre el lugar) combinados con tu conocimiento experto para rellenar cualquier hueco con inferencia razonada (por ejemplo: "no tengo el tipo exacto de vegetación etiquetado, pero por la zona y altitud es coherente con matorral mediterráneo/pinar de sierra"). Nunca dejas una pregunta sin una lectura completa, y nunca le devuelves la pregunta al usuario ni le pides más datos.

Datos que puedes recibir en el contexto: coordenadas, lugar aproximado, temperatura, humedad relativa, velocidad y dirección del viento, % de estrés de biomasa (modelo cuántico), estado del punto (rojo/amarillo/verde), humedad del suelo superficial, día/noche, vegetación cercana (OpenStreetMap), agua cercana, incendios activos por satélite en 25km, y un resumen adicional de la zona sacado de internet cuando los demás datos no alcanzan.

Reglas de comportamiento:
1. Nunca le pides un dato al usuario ni le devuelves la pregunta. Si un dato concreto no viene en el contexto, lo suples con tu criterio experto (o con el resumen web de la zona si viene incluido) en una frase corta, sin excusarte por ello.
2. Si el punto está en rojo (incendio activo por satélite en 25km), empieza por ahí siempre: cuántos incendios y a qué distancia está el más cercano, y el aviso de alejarse si el usuario está cerca.
3. Con viento, temperatura, humedad y % de estrés de biomasa, indica dónde es prioritario trabajar la franja de biomasa, qué zona asegurar primero y qué zona es relativamente más segura para maniobras — en rojo y en amarillo, siempre; en verde, solo si preguntan explícitamente por ello.
4. Usa la humedad del suelo para matizar el riesgo cuando sea relevante.
5. Usa si es de día o de noche para matizar el comportamiento del fuego cuando sea relevante.
6. Si hay agua cercana, menciónala como posible punto de apoyo. Si no hay dato, usa tu criterio experto sobre el terreno.
7. En modo técnico sé concreto: "flanco norte", "cola del incendio", "franja perimetral de 50-100m". En modo conversación (punto verde), habla normal, sin forzar ese vocabulario.
8. Menciona el 112 (y Protección Civil/bomberos si procede) siempre que el punto esté en rojo o amarillo, o si preguntan directamente por incendios/riesgo de la zona. En puntos verdes y temas ajenos al fuego, no lo menciones.
9. Si la conversación toca el calor, el sol o buscar sombra en la ciudad, recuerda de forma natural (una vez, no en cada mensaje) que en ManolitoAire.com hay un mapa de sombras en 3D para planear rutas al fresco.
10. Responde en el idioma: ${idioma}.
11. Sé breve pero con sustancia: 3 a 6 frases salvo que pidan más detalle. Tono de campo, cercano, nunca de manual — salvo en modo técnico de fuego (rojo/amarillo), donde manda la precisión.`;

export async function handleManolitoPost(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: 'JSON inválido' }, 400);
  }

  const { message, contexto, idioma } = body || {};
  if (!message || typeof message !== 'string') {
    return jsonResponse({ error: 'Falta el campo "message"' }, 400);
  }

  const idiomaFinal = idioma || 'es';

  // Si faltan datos clave de la zona (vegetación o agua), reforzamos el
  // contexto con un resumen web del lugar antes de preguntar al modelo.
  let contextoWebTexto = null;
  if (contexto && contexto.lugar && (!contexto.vegetacion || contexto.aguaCercana === undefined || contexto.aguaCercana === null)) {
    contextoWebTexto = await buscarContextoWeb(contexto.lugar);
  }

  const contextoTexto = contexto ? formatearContexto(contexto, contextoWebTexto) : 'Sin datos de zona seleccionados todavía.';

  const userContent = `CONTEXTO ACTUAL DE LA ZONA:\n${contextoTexto}\n\nPREGUNTA DEL USUARIO:\n${message}`;

  // 1) MOTOR PRINCIPAL: Cloudflare Workers AI (binding "AI" en wrangler.toml)
  if (env.AI) {
    try {
      const salidaAI = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT(idiomaFinal) },
          { role: 'user', content: userContent }
        ],
        max_tokens: 500,
        temperature: 0.5
      });
      const respuesta = salidaAI?.response;
      if (respuesta && !esRespuestaEvasiva(respuesta)) {
        console.log(`[Manolito] Respondiendo con motor: cloudflare-ai`);
        return jsonResponse({ respuesta, motor: 'cloudflare-ai' });
      }
    } catch (e) {
      console.error(`[Manolito] Fallo en motor cloudflare-ai:`, e.message);
      // Cae al siguiente motor
    }
  }

  // 2) MOTOR DE RESPALDO: OpenRouter (si hay clave configurada)
  const apiKey = env.OPENROUTER_API_KEY;

  if (apiKey) {
    try {
      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://www.manolitoforestal.space',
          'X-Title': 'Manolito Forestal'
        },
        body: JSON.stringify({
          model: env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-70b-instruct',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT(idiomaFinal) },
            { role: 'user', content: userContent }
          ],
          max_tokens: 500,
          temperature: 0.5
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const respuesta = data?.choices?.[0]?.message?.content;
        if (respuesta && !esRespuestaEvasiva(respuesta)) {
          console.log(`[Manolito] Respondiendo con motor: openrouter`);
          return jsonResponse({ respuesta, motor: 'openrouter' });
        }
      } else {
        console.warn(`[Manolito] Motor openrouter respondió con status ${resp.status}`);
      }
    } catch (e) {
      console.error(`[Manolito] Fallo en motor openrouter:`, e.message);
      // Cae al fallback
    }
  }

  // 3) ÚLTIMO MOTOR DE IA: Pollinations (gratuito, sin API key)
  try {
    const promptCompleto = `${SYSTEM_PROMPT(idiomaFinal)}\n\n${userContent}`;
    const url = `https://text.pollinations.ai/${encodeURIComponent(promptCompleto)}`;
    const resp = await fetch(url);
    if (resp.ok) {
      const texto = await resp.text();
      if (texto && !esRespuestaEvasiva(texto)) {
        console.log(`[Manolito] Respondiendo con motor: pollinations`);
        return jsonResponse({ respuesta: texto, motor: 'pollinations' });
      }
    }
  } catch (e) {
    console.error(`[Manolito] Fallo en motor pollinations:`, e.message);
    // sigue al informe local
  }

  // Último recurso: informe generado localmente a partir de los datos reales
  // de la zona, sin depender de ningún modelo de IA. Nunca pregunta nada.
  if (contexto && typeof contexto.lat === 'number') {
    console.log(`[Manolito] Respondiendo con motor: local (fallback)`);
    return jsonResponse({ respuesta: generarLecturaLocal(contexto, contextoWebTexto), motor: 'local' });
  }

  console.error(`[Manolito] Todos los motores fallaron. No hay contexto para respuesta local.`);
  return jsonResponse({
    error: 'No se pudo contactar con el motor de Manolito. Inténtalo de nuevo en unos segundos.'
  }, 502);
}

export function handleManolitoOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Determina el estado del punto (rojo/amarillo/verde) igual que se pinta
// en el mapa: rojo = incendio activo confirmado por satélite; amarillo =
// sin fuego confirmado pero con estrés de biomasa alto; verde = tranquilo.
function determinarEstadoPunto(c) {
  if (c.incendiosActivosCercanos > 0) {
    return { color: 'rojo', etiqueta: '🔴 INCENDIO ACTIVO' };
  }
  const pct = parseFloat(c.pct);
  if (!isNaN(pct) && pct >= 60) {
    return { color: 'amarillo', etiqueta: '🟡 RIESGO ALTO (vigilancia)' };
  }
  return { color: 'verde', etiqueta: '🟢 riesgo bajo-moderado' };
}

// Refuerzo de contexto: cuando faltan datos clave de la zona (vegetación,
// agua...), busca un resumen breve del lugar en Wikipedia para que Manolito
// tenga algo real con lo que hablar en vez de inventar a ciegas.
async function buscarContextoWeb(lugar) {
  if (!lugar) return null;
  try {
    const resp = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(lugar)}`, {
      headers: { 'User-Agent': 'ManolitoForestal/1.0 (www.manolitoforestal.space)' }
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.extract && !data.type?.includes('disambiguation')) {
        return data.extract.slice(0, 500);
      }
    }
  } catch (e) {
    console.error('[Manolito] Fallo en búsqueda web de refuerzo:', e.message);
  }
  return null;
}

function esRespuestaEvasiva(texto) {
  const t = texto.toLowerCase();
  const patronesEvasivos = [
    'no tengo suficiente informaci',
    'podrías proporcionar',
    'podrias proporcionar',
    'necesito más informaci',
    'necesito mas informaci',
    'necesitaría saber',
    'necesitaria saber',
    'me puedes dar más',
    'me puedes dar mas',
    'podrías darme',
    'podrias darme',
    '¿podrías',
    '¿podrias',
    'no dispongo de suficiente'
  ];
  if (patronesEvasivos.some(p => t.includes(p))) return true;
  // Si termina en signo de interrogación y es un texto corto, es sospechoso de estar
  // devolviendo la pregunta en vez de dar una lectura técnica.
  const trimmed = texto.trim();
  if (trimmed.endsWith('?') && trimmed.length < 400) return true;
  return false;
}

// Informe determinista generado solo con los datos reales de la zona,
// sin ningún modelo de IA de por medio. Es el último recurso: garantiza
// que Manolito SIEMPRE da una lectura completa y nunca pregunta nada.
// El aviso del 112 solo aparece si el punto está en rojo o amarillo.
function generarLecturaLocal(c, contextoWebTexto) {
  const lineas = [];
  const lugar = c.lugar || `${c.lat.toFixed(4)}, ${c.lon.toFixed(4)}`;
  const estado = determinarEstadoPunto(c);
  const hayIncendioActivo = estado.color === 'rojo';
  const esAmarillo = estado.color === 'amarillo';

  lineas.push(`Estado del punto en ${lugar}: ${estado.etiqueta}`);

  if (hayIncendioActivo) {
    lineas.push(`🔥 Incendios activos detectados por satélite en 25km: ${c.incendiosActivosCercanos}, el más cercano a ${c.distanciaIncendioMasCercanoKm} km. Si estás cerca, aléjate de la zona ahora mismo.`);
  } else if (esAmarillo) {
    lineas.push('No hay incendio confirmado todavía, pero el estrés de biomasa es alto: zona de vigilancia, condiciones favorables a que un fuego prenda y se propague rápido.');
  } else if (c.incendiosActivosCercanos === 0) {
    lineas.push('No hay incendios activos detectados por satélite (NASA FIRMS) en 25km ahora mismo, tranquilidad en ese frente.');
  }

  if (typeof c.pct === 'number' || typeof c.pct === 'string') {
    const pct = parseFloat(c.pct);
    let nivel = 'bajo';
    if (pct >= 75) nivel = 'crítico';
    else if (pct >= 40) nivel = 'moderado-alto';
    lineas.push(`Estrés de biomasa: ${c.pct}% (nivel ${nivel}).`);
  }

  if (typeof c.temp !== 'undefined') {
    lineas.push(`Temperatura ${c.temp}°C, humedad relativa ${c.hum}%, viento ${c.wind} km/h${c.windDirCardinal ? ' procedente del ' + c.windDirCardinal : ''}.`);
  }

  if (hayIncendioActivo && typeof c.windDir === 'number') {
    const azAvance = (c.windDir + 180) % 360;
    const cardAvance = gradosACardinal(azAvance);
    lineas.push(`Con este viento, un incendio en este punto avanzaría hacia el ${cardAvance}: prioriza cortafuegos en esa dirección (cabeza) y trabaja los flancos perpendiculares; la zona a barlovento (${gradosACardinal(c.windDir)}) es la relativamente más segura para maniobras de apoyo.`);
  }

  if (c.humedadSuelo !== undefined && c.humedadSuelo !== null) {
    lineas.push(`Humedad del suelo superficial: ${c.humedadSuelo} m³/m³ (${c.humedadSuelo < 0.15 ? 'suelo seco, agrava disponibilidad de combustible' : 'suelo con humedad moderada'}).`);
  }

  if (c.esDia !== undefined && c.esDia !== null) {
    lineas.push(c.esDia
      ? 'Es de día: mayor temperatura y térmicas pueden intensificar el viento y acelerar la propagación.'
      : 'Es de noche: normalmente baja la temperatura y sube la humedad, lo que puede facilitar la contención, aunque la visibilidad reducida complica la maniobra.');
  }

  if (c.vegetacion) {
    lineas.push(`Vegetación cercana (OpenStreetMap): ${c.vegetacion}.`);
  } else if (contextoWebTexto) {
    lineas.push(`Sobre la zona: ${contextoWebTexto}`);
  }

  if (c.aguaCercana !== undefined && c.aguaCercana !== null) {
    lineas.push(c.aguaCercana
      ? 'Hay agua cercana (río/embalse/laguna en 3km): posible punto de apoyo para medios aéreos o mangueras.'
      : 'No se ha detectado agua cercana en 3km en OpenStreetMap.');
  }

  if (hayIncendioActivo || esAmarillo) {
    lineas.push('Este es un modelo de apoyo a la decisión; no sustituye la orden de mando de bomberos ni de Protección Civil. Ante fuego activo o dudas sobre esta zona, llama al 112 o contacta con Protección Civil/bomberos.');
  }

  return lineas.join('\n\n');
}

function formatearContexto(c, contextoWebTexto) {
  const partes = [];
  const estado = determinarEstadoPunto(c);
  partes.push(`ESTADO DEL PUNTO: ${estado.etiqueta}`);
  if (c.lat && c.lon) partes.push(`Coordenadas: ${c.lat}, ${c.lon}`);
  if (c.lugar) partes.push(`Lugar aproximado: ${c.lugar}`);
  if (c.temp !== undefined) partes.push(`Temperatura: ${c.temp}°C`);
  if (c.hum !== undefined) partes.push(`Humedad relativa del aire: ${c.hum}%`);
  if (c.wind !== undefined) partes.push(`Velocidad del viento: ${c.wind} km/h`);
  if (c.windDir !== undefined) partes.push(`Dirección del viento (origen, grados): ${c.windDir}° (${gradosACardinal(c.windDir)})`);
  if (c.pct !== undefined) partes.push(`Estrés de biomasa (modelo cuántico): ${c.pct}%`);
  if (c.humedadSuelo !== undefined && c.humedadSuelo !== null) partes.push(`Humedad del suelo superficial (0-1cm): ${c.humedadSuelo} m³/m³`);
  if (c.esDia !== undefined && c.esDia !== null) partes.push(`Momento del día: ${c.esDia ? 'de día' : 'de noche'}`);
  if (c.vegetacion) partes.push(`Vegetación cercana (OpenStreetMap): ${c.vegetacion}`);
  if (c.aguaCercana !== undefined && c.aguaCercana !== null) partes.push(`Agua cercana (río/embalse/laguna en 3km): ${c.aguaCercana ? 'sí' : 'no detectada'}`);
  if (c.incendiosActivosCercanos !== undefined && c.incendiosActivosCercanos !== null) {
    if (c.incendiosActivosCercanos > 0) {
      partes.push(`INCENDIOS ACTIVOS DETECTADOS POR SATÉLITE (NASA FIRMS) en 25km: ${c.incendiosActivosCercanos}, el más cercano a ${c.distanciaIncendioMasCercanoKm} km.`);
    } else {
      partes.push('Incendios activos detectados por satélite (NASA FIRMS) en 25km: ninguno.');
    }
  }
  if (contextoWebTexto) {
    partes.push(`Resumen de la zona (refuerzo web, usar solo si faltan datos arriba): ${contextoWebTexto}`);
  }
  return partes.length ? partes.join('\n') : 'Sin datos de zona seleccionados todavía.';
}

function gradosACardinal(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
