var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/manolito.js
var SYSTEM_PROMPT = /* @__PURE__ */ __name((idioma) => `Eres MANOLIT\u221E: el experto de referencia de esta web sobre cualquier punto del territorio que se seleccione. Eres bombero forestal veterano con d\xE9cadas de campo, y adem\xE1s dominas geograf\xEDa, climatolog\xEDa, ecolog\xEDa mediterr\xE1nea e hidrolog\xEDa de emergencia. Hablas como una persona real y cercana, no como un informe: con calma, con alguna expresi\xF3n coloquial si viene a cuento, pero sin perder autoridad t\xE9cnica cuando hace falta.

MODO DE RESPUESTA \u2014 esto es lo m\xE1s importante:
- Si la pregunta es general (qu\xE9 hay en la zona, qu\xE9 vegetaci\xF3n, c\xF3mo est\xE1 el tiempo, curiosidades del sitio) y el punto NO est\xE1 en rojo ni en amarillo, responde como lo har\xEDa un guarda forestal charlando contigo: cercano, humano, ameno, sin jerga de manual. Puedes meter algo t\xE9cnico dentro de la conversaci\xF3n, pero suena a persona, no a protocolo.
- Si la pregunta trata de un incendio activo, de un punto marcado en rojo o amarillo, comportamiento del fuego, d\xF3nde trabajar la biomasa o c\xF3mo actuar ante riesgo real, entonces s\xED te pones serio y t\xE9cnico: preciso, directo, con vocabulario de operaciones (flanco, cola, cabeza, franja perimetral...).
- Importante: cercano NO significa simple. Aunque el tono sea humano, la informaci\xF3n tiene que servirle igual a un curioso que a un profesional de emergencias \u2014 bombero, t\xE9cnico de Protecci\xF3n Civil, agente forestal. No recortes profundidad t\xE9cnica por sonar m\xE1s cercano; cambia el envoltorio, no el contenido.
- NO termines cada respuesta recordando el 112 por sistema. Menci\xF3nalo cuando de verdad corresponda: fuego activo cercano, punto en rojo o amarillo, o pregunta directa sobre incendios/riesgo de esa zona. El resto de veces, tema tranquilo (vegetaci\xF3n, curiosidades, tiempo), ni lo nombres.

ESTADO DEL PUNTO (rojo / amarillo / verde) \u2014 as\xED lo interpretas siempre que venga en el contexto:
- \u{1F534} ROJO = incendio activo confirmado por sat\xE9lite (NASA FIRMS) en esa zona o muy cerca. Dilo de forma directa y clara desde la primera frase: que ah\xED mismo, o a tantos km, se est\xE1 quemando ahora mismo, y si el usuario est\xE1 cerca, que se aleje de la zona. No lo suavices ni lo dejes para el final.
- \u{1F7E1} AMARILLO = sin incendio confirmado todav\xEDa, pero con estr\xE9s de biomasa alto (riesgo elevado): avisa de que es zona de vigilancia, explica por qu\xE9 (sequedad, viento, temperatura) y qu\xE9 la har\xEDa peligrosa si prendiera.
- \u{1F7E2} VERDE = riesgo bajo-moderado, sin incendio ni alerta especial: puedes hablar en modo conversaci\xF3n normal.
- Tanto en rojo como en amarillo, adem\xE1s de la lectura t\xE9cnica, menciona los canales oficiales que correspondan: el 112 para cualquier emergencia real, y Protecci\xF3n Civil / los bomberos de la zona como referencia para reportar o pedir informaci\xF3n \u2014 sin inventarte tel\xE9fonos ni datos concretos que no tengas.

Cuando alguien pincha un punto en el mapa y pregunta qu\xE9 pasa all\xED, respondes de inmediato con una lectura completa de la zona, usando los datos reales que te llegan (meteorol\xF3gicos en tiempo real, sat\xE9lite de incendios NASA FIRMS, OpenStreetMap, el estado del punto rojo/amarillo/verde, y si se incluye, un resumen de contexto sacado de internet sobre el lugar) combinados con tu conocimiento experto para rellenar cualquier hueco con inferencia razonada (por ejemplo: "no tengo el tipo exacto de vegetaci\xF3n etiquetado, pero por la zona y altitud es coherente con matorral mediterr\xE1neo/pinar de sierra"). Nunca dejas una pregunta sin una lectura completa, y nunca le devuelves la pregunta al usuario ni le pides m\xE1s datos.

Datos que puedes recibir en el contexto: coordenadas, lugar aproximado, temperatura, humedad relativa, velocidad y direcci\xF3n del viento, % de estr\xE9s de biomasa (modelo cu\xE1ntico), estado del punto (rojo/amarillo/verde), humedad del suelo superficial, d\xEDa/noche, vegetaci\xF3n cercana (OpenStreetMap), agua cercana, incendios activos por sat\xE9lite en 25km, y un resumen adicional de la zona sacado de internet cuando los dem\xE1s datos no alcanzan.

Reglas de comportamiento:
1. Nunca le pides un dato al usuario ni le devuelves la pregunta. Si un dato concreto no viene en el contexto, lo suples con tu criterio experto (o con el resumen web de la zona si viene incluido) en una frase corta, sin excusarte por ello.
2. Si el punto est\xE1 en rojo (incendio activo por sat\xE9lite en 25km), empieza por ah\xED siempre: cu\xE1ntos incendios y a qu\xE9 distancia est\xE1 el m\xE1s cercano, y el aviso de alejarse si el usuario est\xE1 cerca.
3. Con viento, temperatura, humedad y % de estr\xE9s de biomasa, indica d\xF3nde es prioritario trabajar la franja de biomasa, qu\xE9 zona asegurar primero y qu\xE9 zona es relativamente m\xE1s segura para maniobras \u2014 en rojo y en amarillo, siempre; en verde, solo si preguntan expl\xEDcitamente por ello.
4. Usa la humedad del suelo para matizar el riesgo cuando sea relevante.
5. Usa si es de d\xEDa o de noche para matizar el comportamiento del fuego cuando sea relevante.
6. Si hay agua cercana, menci\xF3nala como posible punto de apoyo. Si no hay dato, usa tu criterio experto sobre el terreno.
7. En modo t\xE9cnico s\xE9 concreto: "flanco norte", "cola del incendio", "franja perimetral de 50-100m". En modo conversaci\xF3n (punto verde), habla normal, sin forzar ese vocabulario.
8. Menciona el 112 (y Protecci\xF3n Civil/bomberos si procede) siempre que el punto est\xE9 en rojo o amarillo, o si preguntan directamente por incendios/riesgo de la zona. En puntos verdes y temas ajenos al fuego, no lo menciones.
9. Si la conversaci\xF3n toca el calor, el sol o buscar sombra en la ciudad, recuerda de forma natural (una vez, no en cada mensaje) que en ManolitoAire.com hay un mapa de sombras en 3D para planear rutas al fresco.
10. Responde en el idioma: ${idioma}.
11. S\xE9 breve pero con sustancia: 3 a 6 frases salvo que pidan m\xE1s detalle. Tono de campo, cercano, nunca de manual \u2014 salvo en modo t\xE9cnico de fuego (rojo/amarillo), donde manda la precisi\xF3n.`, "SYSTEM_PROMPT");
async function handleManolitoPost(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "JSON inv\xE1lido" }, 400);
  }
  const { message, contexto, idioma } = body || {};
  if (!message || typeof message !== "string") {
    return jsonResponse({ error: 'Falta el campo "message"' }, 400);
  }
  const idiomaFinal = idioma || "es";
  let contextoWebTexto = null;
  if (contexto && contexto.lugar && (!contexto.vegetacion || contexto.aguaCercana === void 0 || contexto.aguaCercana === null)) {
    contextoWebTexto = await buscarContextoWeb(contexto.lugar);
  }
  const contextoTexto = contexto ? formatearContexto(contexto, contextoWebTexto) : "Sin datos de zona seleccionados todav\xEDa.";
  const userContent = `CONTEXTO ACTUAL DE LA ZONA:
${contextoTexto}

PREGUNTA DEL USUARIO:
${message}`;
  if (env.AI) {
    try {
      const salidaAI = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          { role: "system", content: SYSTEM_PROMPT(idiomaFinal) },
          { role: "user", content: userContent }
        ],
        max_tokens: 500,
        temperature: 0.5
      });
      const respuesta = salidaAI?.response;
      if (respuesta && !esRespuestaEvasiva(respuesta)) {
        console.log(`[Manolito] Respondiendo con motor: cloudflare-ai`);
        return jsonResponse({ respuesta, motor: "cloudflare-ai" });
      }
    } catch (e) {
      console.error(`[Manolito] Fallo en motor cloudflare-ai:`, e.message);
    }
  }
  const apiKey = env.OPENROUTER_API_KEY;
  if (apiKey) {
    try {
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://www.manolitoforestal.space",
          "X-Title": "Manolito Forestal"
        },
        body: JSON.stringify({
          model: env.OPENROUTER_MODEL || "meta-llama/llama-3.1-70b-instruct",
          messages: [
            { role: "system", content: SYSTEM_PROMPT(idiomaFinal) },
            { role: "user", content: userContent }
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
          return jsonResponse({ respuesta, motor: "openrouter" });
        }
      } else {
        console.warn(`[Manolito] Motor openrouter respondi\xF3 con status ${resp.status}`);
      }
    } catch (e) {
      console.error(`[Manolito] Fallo en motor openrouter:`, e.message);
    }
  }
  try {
    const promptCompleto = `${SYSTEM_PROMPT(idiomaFinal)}

${userContent}`;
    const url = `https://text.pollinations.ai/${encodeURIComponent(promptCompleto)}`;
    const resp = await fetch(url);
    if (resp.ok) {
      const texto = await resp.text();
      if (texto && !esRespuestaEvasiva(texto)) {
        console.log(`[Manolito] Respondiendo con motor: pollinations`);
        return jsonResponse({ respuesta: texto, motor: "pollinations" });
      }
    }
  } catch (e) {
    console.error(`[Manolito] Fallo en motor pollinations:`, e.message);
  }
  if (contexto && typeof contexto.lat === "number") {
    console.log(`[Manolito] Respondiendo con motor: local (fallback)`);
    return jsonResponse({ respuesta: generarLecturaLocal(contexto, contextoWebTexto), motor: "local" });
  }
  console.error(`[Manolito] Todos los motores fallaron. No hay contexto para respuesta local.`);
  return jsonResponse({
    error: "No se pudo contactar con el motor de Manolito. Int\xE9ntalo de nuevo en unos segundos."
  }, 502);
}
__name(handleManolitoPost, "handleManolitoPost");
function handleManolitoOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
__name(handleManolitoOptions, "handleManolitoOptions");
function determinarEstadoPunto(c) {
  if (c.incendiosActivosCercanos > 0) {
    return { color: "rojo", etiqueta: "\u{1F534} INCENDIO ACTIVO" };
  }
  const pct = parseFloat(c.pct);
  if (!isNaN(pct) && pct >= 60) {
    return { color: "amarillo", etiqueta: "\u{1F7E1} RIESGO ALTO (vigilancia)" };
  }
  return { color: "verde", etiqueta: "\u{1F7E2} riesgo bajo-moderado" };
}
__name(determinarEstadoPunto, "determinarEstadoPunto");
async function buscarContextoWeb(lugar) {
  if (!lugar) return null;
  try {
    const resp = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(lugar)}`, {
      headers: { "User-Agent": "ManolitoForestal/1.0 (www.manolitoforestal.space)" }
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.extract && !data.type?.includes("disambiguation")) {
        return data.extract.slice(0, 500);
      }
    }
  } catch (e) {
    console.error("[Manolito] Fallo en b\xFAsqueda web de refuerzo:", e.message);
  }
  return null;
}
__name(buscarContextoWeb, "buscarContextoWeb");
function esRespuestaEvasiva(texto) {
  const t = texto.toLowerCase();
  const patronesEvasivos = [
    "no tengo suficiente informaci",
    "podr\xEDas proporcionar",
    "podrias proporcionar",
    "necesito m\xE1s informaci",
    "necesito mas informaci",
    "necesitar\xEDa saber",
    "necesitaria saber",
    "me puedes dar m\xE1s",
    "me puedes dar mas",
    "podr\xEDas darme",
    "podrias darme",
    "\xBFpodr\xEDas",
    "\xBFpodrias",
    "no dispongo de suficiente"
  ];
  if (patronesEvasivos.some((p) => t.includes(p))) return true;
  const trimmed = texto.trim();
  if (trimmed.endsWith("?") && trimmed.length < 400) return true;
  return false;
}
__name(esRespuestaEvasiva, "esRespuestaEvasiva");
function generarLecturaLocal(c, contextoWebTexto) {
  const lineas = [];
  const lugar = c.lugar || `${c.lat.toFixed(4)}, ${c.lon.toFixed(4)}`;
  const estado = determinarEstadoPunto(c);
  const hayIncendioActivo = estado.color === "rojo";
  const esAmarillo = estado.color === "amarillo";
  lineas.push(`Estado del punto en ${lugar}: ${estado.etiqueta}`);
  if (hayIncendioActivo) {
    lineas.push(`\u{1F525} Incendios activos detectados por sat\xE9lite en 25km: ${c.incendiosActivosCercanos}, el m\xE1s cercano a ${c.distanciaIncendioMasCercanoKm} km. Si est\xE1s cerca, al\xE9jate de la zona ahora mismo.`);
  } else if (esAmarillo) {
    lineas.push("No hay incendio confirmado todav\xEDa, pero el estr\xE9s de biomasa es alto: zona de vigilancia, condiciones favorables a que un fuego prenda y se propague r\xE1pido.");
  } else if (c.incendiosActivosCercanos === 0) {
    lineas.push("No hay incendios activos detectados por sat\xE9lite (NASA FIRMS) en 25km ahora mismo, tranquilidad en ese frente.");
  }
  if (typeof c.pct === "number" || typeof c.pct === "string") {
    const pct = parseFloat(c.pct);
    let nivel = "bajo";
    if (pct >= 75) nivel = "cr\xEDtico";
    else if (pct >= 40) nivel = "moderado-alto";
    lineas.push(`Estr\xE9s de biomasa: ${c.pct}% (nivel ${nivel}).`);
  }
  if (typeof c.temp !== "undefined") {
    lineas.push(`Temperatura ${c.temp}\xB0C, humedad relativa ${c.hum}%, viento ${c.wind} km/h${c.windDirCardinal ? " procedente del " + c.windDirCardinal : ""}.`);
  }
  if (hayIncendioActivo && typeof c.windDir === "number") {
    const azAvance = (c.windDir + 180) % 360;
    const cardAvance = gradosACardinal(azAvance);
    lineas.push(`Con este viento, un incendio en este punto avanzar\xEDa hacia el ${cardAvance}: prioriza cortafuegos en esa direcci\xF3n (cabeza) y trabaja los flancos perpendiculares; la zona a barlovento (${gradosACardinal(c.windDir)}) es la relativamente m\xE1s segura para maniobras de apoyo.`);
  }
  if (c.humedadSuelo !== void 0 && c.humedadSuelo !== null) {
    lineas.push(`Humedad del suelo superficial: ${c.humedadSuelo} m\xB3/m\xB3 (${c.humedadSuelo < 0.15 ? "suelo seco, agrava disponibilidad de combustible" : "suelo con humedad moderada"}).`);
  }
  if (c.esDia !== void 0 && c.esDia !== null) {
    lineas.push(c.esDia ? "Es de d\xEDa: mayor temperatura y t\xE9rmicas pueden intensificar el viento y acelerar la propagaci\xF3n." : "Es de noche: normalmente baja la temperatura y sube la humedad, lo que puede facilitar la contenci\xF3n, aunque la visibilidad reducida complica la maniobra.");
  }
  if (c.vegetacion) {
    lineas.push(`Vegetaci\xF3n cercana (OpenStreetMap): ${c.vegetacion}.`);
  } else if (contextoWebTexto) {
    lineas.push(`Sobre la zona: ${contextoWebTexto}`);
  }
  if (c.aguaCercana !== void 0 && c.aguaCercana !== null) {
    lineas.push(c.aguaCercana ? "Hay agua cercana (r\xEDo/embalse/laguna en 3km): posible punto de apoyo para medios a\xE9reos o mangueras." : "No se ha detectado agua cercana en 3km en OpenStreetMap.");
  }
  if (hayIncendioActivo || esAmarillo) {
    lineas.push("Este es un modelo de apoyo a la decisi\xF3n; no sustituye la orden de mando de bomberos ni de Protecci\xF3n Civil. Ante fuego activo o dudas sobre esta zona, llama al 112 o contacta con Protecci\xF3n Civil/bomberos.");
  }
  return lineas.join("\n\n");
}
__name(generarLecturaLocal, "generarLecturaLocal");
function formatearContexto(c, contextoWebTexto) {
  const partes = [];
  const estado = determinarEstadoPunto(c);
  partes.push(`ESTADO DEL PUNTO: ${estado.etiqueta}`);
  if (c.lat && c.lon) partes.push(`Coordenadas: ${c.lat}, ${c.lon}`);
  if (c.lugar) partes.push(`Lugar aproximado: ${c.lugar}`);
  if (c.temp !== void 0) partes.push(`Temperatura: ${c.temp}\xB0C`);
  if (c.hum !== void 0) partes.push(`Humedad relativa del aire: ${c.hum}%`);
  if (c.wind !== void 0) partes.push(`Velocidad del viento: ${c.wind} km/h`);
  if (c.windDir !== void 0) partes.push(`Direcci\xF3n del viento (origen, grados): ${c.windDir}\xB0 (${gradosACardinal(c.windDir)})`);
  if (c.pct !== void 0) partes.push(`Estr\xE9s de biomasa (modelo cu\xE1ntico): ${c.pct}%`);
  if (c.humedadSuelo !== void 0 && c.humedadSuelo !== null) partes.push(`Humedad del suelo superficial (0-1cm): ${c.humedadSuelo} m\xB3/m\xB3`);
  if (c.esDia !== void 0 && c.esDia !== null) partes.push(`Momento del d\xEDa: ${c.esDia ? "de d\xEDa" : "de noche"}`);
  if (c.vegetacion) partes.push(`Vegetaci\xF3n cercana (OpenStreetMap): ${c.vegetacion}`);
  if (c.aguaCercana !== void 0 && c.aguaCercana !== null) partes.push(`Agua cercana (r\xEDo/embalse/laguna en 3km): ${c.aguaCercana ? "s\xED" : "no detectada"}`);
  if (c.incendiosActivosCercanos !== void 0 && c.incendiosActivosCercanos !== null) {
    if (c.incendiosActivosCercanos > 0) {
      partes.push(`INCENDIOS ACTIVOS DETECTADOS POR SAT\xC9LITE (NASA FIRMS) en 25km: ${c.incendiosActivosCercanos}, el m\xE1s cercano a ${c.distanciaIncendioMasCercanoKm} km.`);
    } else {
      partes.push("Incendios activos detectados por sat\xE9lite (NASA FIRMS) en 25km: ninguno.");
    }
  }
  if (contextoWebTexto) {
    partes.push(`Resumen de la zona (refuerzo web, usar solo si faltan datos arriba): ${contextoWebTexto}`);
  }
  return partes.length ? partes.join("\n") : "Sin datos de zona seleccionados todav\xEDa.";
}
__name(formatearContexto, "formatearContexto");
function gradosACardinal(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}
__name(gradosACardinal, "gradosACardinal");
function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(jsonResponse, "jsonResponse");

// src/getFires.js
async function handleGetFires(request, env) {
  const url = new URL(request.url);
  const bounds = url.searchParams.get("bounds");
  if (!bounds) {
    return new Response('Falta el par\xE1metro "bounds"', { status: 400 });
  }
  const mapKey = env.FIRMS_MAP_KEY;
  if (!mapKey) {
    return new Response("FIRMS_MAP_KEY no est\xE1 configurada en el Worker (usa: npx wrangler secret put FIRMS_MAP_KEY)", { status: 500 });
  }
  const fuente = "VIIRS_SNPP_NRT";
  const diasAtras = 3;
  const firmsUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${fuente}/${bounds}/${diasAtras}`;
  try {
    const resp = await fetch(firmsUrl);
    if (!resp.ok) {
      console.error(`[getFires] FIRMS respondi\xF3 ${resp.status}`);
      return new Response("NASA FIRMS no respondi\xF3 correctamente", { status: 502 });
    }
    const csv = await resp.text();
    if (!csv.toLowerCase().includes("latitude")) {
      console.error("[getFires] Respuesta inesperada de FIRMS:", csv.slice(0, 200));
      return new Response("Respuesta inesperada de NASA FIRMS (revisa la MAP_KEY o la cuota)", { status: 502 });
    }
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300"
        // 5 min, FIRMS no cambia más rápido que eso
      }
    });
  } catch (e) {
    console.error("[getFires] Error de red contra FIRMS:", e.message);
    return new Response("Error al contactar con NASA FIRMS", { status: 502 });
  }
}
__name(handleGetFires, "handleGetFires");

// src/index.js
var index_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/manolito") {
      if (request.method === "POST") return handleManolitoPost(request, env);
      if (request.method === "OPTIONS") return handleManolitoOptions();
      return new Response("Method Not Allowed", { status: 405 });
    }
    if (url.pathname === "/getFires") {
      return handleGetFires(request, env);
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
