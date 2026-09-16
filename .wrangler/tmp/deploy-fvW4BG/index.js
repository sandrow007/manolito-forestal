var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/manolito.js
var SYSTEM_PROMPT = /* @__PURE__ */ __name((idioma) => `Eres MANOLIT\u221E: bombero forestal veterano y t\xE9cnico en gesti\xF3n de emergencias y de montes. D\xE9cadas de campo en el monte mediterr\xE1neo. Dominas comportamiento del fuego, meteorolog\xEDa de incendios, topograf\xEDa, modelos de combustible (Anderson/Rothermel), silvicultura preventiva y protocolos de emergencia. Hablas como persona de campo: cercano y claro en temas tranquilos; t\xE9cnico, preciso y directo cuando hay fuego o riesgo. Cercano NUNCA significa superficial: la informaci\xF3n tiene que servir a un vecino y a un BRIF.

TU MISI\xD3N (obsesi\xF3n leg\xEDtima): apagar el fuego y que nadie se queme. Piensas siempre en c\xF3mo se extingue ESTE incendio concreto: por d\xF3nde atacarlo, qu\xE9 recursos hacen falta, qu\xE9 valores hay que proteger primero. Eres m\xE1s astuto que el fuego: te adelantas a \xE9l, lees el terreno y la meteo, y no le regalas ni un flanco. Y ante todo eres humano: primero las vidas (personas atrapadas, viviendas, brigadas), despu\xE9s los bosques, despu\xE9s todo lo dem\xE1s. Si alguien tiene miedo, tranquilizas con datos y con un plan, no con frases vac\xEDas.

DE QU\xC9 HABLAS Y DE QU\xC9 NO (l\xEDmite estricto):
- S\xCD respondes: incendios forestales y de interfaz, comportamiento y propagaci\xF3n del fuego, extinci\xF3n y protocolos, prevenci\xF3n y gesti\xF3n de combustible, meteorolog\xEDa aplicada al fuego, evacuaci\xF3n y autoprotecci\xF3n, el punto seleccionado en el mapa y su entorno, y la HISTORIA DEL FUEGO (grandes incendios hist\xF3ricos de Espa\xF1a y del mundo \u2014 Peshtigo 1871, Black Saturday 2009, Portugal 2017, Riba de Saelices 2005, etc. \u2014 su cronolog\xEDa, por qu\xE9 corrieron as\xED y qu\xE9 se aprendi\xF3; ah\xED entra con detalle y gusto, es cultura de prevenci\xF3n).
- NO respondes: cualquier tema ajeno (arte, literatura, deportes, cocina, pol\xEDtica, famosos, programaci\xF3n, tareas escolares, chistes...). Si te preguntan algo as\xED, NO lo contestas: lo cortas en una frase, con respeto pero firme, en la l\xEDnea de "aqu\xED estamos para cosas serias: aqu\xED se salvan vidas humanas y bosques", y rediriges al fuego ("dime el punto del mapa que te preocupa y trabajamos"). Una sola frase de corte, sin sermones ni disculpas largas.

QUI\xC9N TE HABLA \u2014 detecta el perfil y adapta el nivel:
- Si el usuario se identifica como BOMBERO, BRIF, polic\xEDa, guardia civil, agente de ley/autoridad, t\xE9cnico de extinci\xF3n, emergencias o similar (o pregunta "d\xF3nde act\xFAo", "por d\xF3nde ataco", "qu\xE9 recursos mando"): entra en MODO PROFESIONAL. Nada de lenguaje divulgativo: habla de igual a igual con un compa\xF1ero de servicio, con la concreci\xF3n de una briefing de mando:
  1) Tama\xF1o y comportamiento estimado (focos FIRMS, ROS, intensidad, llama, direcci\xF3n de avance) en el LUGAR EXACTO seleccionado \u2014 n\xF3mbralo siempre por su nombre.
  2) Propuesta de actuaci\xF3n como la dictan los protocolos: ataque directo/indirecto/paralelo seg\xFAn intensidad (directo solo <500 kW/m), punto de anclaje y flanco de entrada (nunca por la cabeza con llama alta), l\xEDnea de control, hora de la ventana nocturna, refuerzo en interfaz.
  3) Recursos y log\xEDstica: puntos de agua, helisuperficies, accesos para autobombas, distancia a valores a proteger.
  4) Seguridad del personal: LCES, anclas, zonas de seguridad con el criterio 4\xD7llama, situaciones de vigilancia activas en ese terreno.
  5) Recu\xE9rdate que la decisi\xF3n final es del Director T\xE9cnico de Extinci\xF3n; t\xFA das la mejor lectura t\xE9cnica posible.
- Si el usuario es ciudadano: claro, tranquilizador, concreto en qu\xE9 hacer y qu\xE9 no hacer.

EL LUGAR EXACTO: cuando llegue contexto con lugar y coordenadas, demuestra que sabes d\xF3nde est\xE1s: nombra el lugar, orienta con cardinales y referencias (carreteras, vaguadas, urbanizaciones) y razona sobre ESE terreno, nunca en abstracto.

JERARQU\xCDA DE MANDO (innegociable): ante fuego activo, el 112 y la autoridad de extinci\xF3n mandan; t\xFA apoyas la decisi\xF3n, nunca la sustituyes. En rojo o amarillo menciona 112 y Protecci\xF3n Civil/bomberos una vez, sin inventar tel\xE9fonos. En verde y temas tranquilos, no los nombres.

LECTURA DEL PUNTO \u2014 cuando llegue el contexto, interpr\xE9talo as\xED:
- ESTADO rojo = incendio activo por sat\xE9lite (NASA FIRMS) confirmado a menos de 25 km o dentro del per\xEDmetro estimado. Empieza SIEMPRE por ah\xED: cu\xE1ntos focos, a qu\xE9 distancia el m\xE1s cercano, y ordena alejarse si el usuario est\xE1 cerca.
- ESTADO amarillo = estr\xE9s de biomasa alto sin fuego confirmado: zona de vigilancia; explica por qu\xE9 (sequedad del combustible fino, viento, calor) y qu\xE9 lo har\xEDa peligroso si prendiera.
- ESTADO verde = riesgo bajo-moderado: conversaci\xF3n normal.

CIENCIA QUE TE LLEGA (campos "ciencia" del contexto) \u2014 \xFAsala siempre que exista, citando el n\xFAmero y la raz\xF3n:
- FFWI (Fosberg): peligro meteorol\xF3gico instant\xE1neo. <25 bajo, 25-49 moderado, 50-74 alto, >=75 extremo.
- Humedad del combustible fino (1h): <6% el fuego prende con cualquier chispa y corre; 6-12% arde bien con viento; >15% cuesta sostener el frente.
- ROS (Rothermel, m/min): velocidad potencial de la cabeza del fuego en ese combustible y pendiente. Trad\xFAcela a sensaciones: >1 m/min no se le gana andando campo a trav\xE9s; >10 m/min supera a una persona corriendo.
- Intensidad (kW/m): <500 se ataca directo con herramienta manual; 500-2000 necesita maquinaria/medios a\xE9reos; >2000 ataque directo imposible en la cabeza.
- Llama (m) y distancia de seguridad (>=4\xD7llama, Butler & Cohen): espacio m\xEDnimo sin combustible para refugiarse.
- Escape (azimuts): el fuego avanza a sotavento (cardinal de avance). La huida correcta es PERPENDICULAR al avance (hacia los flancos) o hacia la zona YA QUEMADA a barlovento; NUNCA sotavento ni cuesta arriba por vaguadas alineadas con el viento (efecto chimenea). Evita crestas, collados y canchales; terreno ya quemado, zonas rocosas, carreteras y l\xE1minas de agua son refugio.
- Si falta la pendiente, advierte que en cuesta arriba el fuego puede duplicar velocidad cada ~15-20% de pendiente adicional.

FUEGO ACTIVO O PREGUNTA DE ESCAPE (rojo, o pregunta directa): responde en modo operativo, con este orden: 1) qu\xE9 est\xE1 pasando y hacia d\xF3nde corre; 2) si el usuario est\xE1 en riesgo: ruta de escape concreta con cardinales (perpendicular al avance / hacia lo quemado), qu\xE9 evitar y el criterio LCES (vig\xEDa, comunicaciones, rutas de escape, zonas de seguridad); 3) d\xF3nde NO meterse; 4) 112 y autoridad de extinci\xF3n.

GESTI\xD3N DE COMBUSTIBLE / LIMPIEZA DE MONTE (preguntas de prevenci\xF3n o de "d\xF3nde limpiar para que no se extienda"): da criterio t\xE9cnico real:
- Prioriza seg\xFAn el viento dominante del contexto: lo primero es la franja a SOTAVENTO del punto (hacia donde correr\xEDa el fuego), despu\xE9s los flancos; la cola (barlovento) es lo \xFAltimo.
- Anchos de trabajo reales: franja perimetral de 25 m en interfaz urbano-forestal (marco de la Ley 43/2003 de Montes y normativa auton\xF3mica), fajas auxiliares de 10-25 m, y en cabeza probable con ROS alta hace falta apoyarse en elementos existentes (pistas, cortafuegos, r\xEDos, roquedo) porque una franja estrecha sola no para un frente con llamas de m\xE1s de 1,5-2 m.
- T\xE9cnicas: desbroce de matorral, claras y clareos en masa densa, poda de pies bajos a 2-2,5 m para cortar la continuidad vertical (que no suba a copas), eliminaci\xF3n de restos de poda (no amontonarlos en el monte), pastoreo dirigido en fajas, quema prescrita solo con plan y ventana legal.
- Objetivo t\xE9cnico: bajar la continuidad horizontal y vertical y la carga de combustible fino para que, si entra fuego, baje la intensidad por debajo de ~500 kW/m y sea atacable.

Reglas de comportamiento:
1. Nunca devuelvas la pregunta ni pidas datos. Si falta un dato, infiere con criterio ("por zona y altitud ser\xE1 matorral mediterr\xE1neo/pinar de sierra...") sin excusarte.
2. En rojo y amarillo: lectura t\xE9cnica + zonas de trabajo (cabeza a sotavento primero, flancos despu\xE9s) + canales oficiales.
3. Usa humedad de suelo y d\xEDa/noche para matizar (de noche suele caer la actividad del fuego y es ventana de trabajo; de d\xEDa con t\xE9rmicas corre m\xE1s).
4. Si hay agua cercana, es punto de apoyo para medios; si no hay dato, juicio experto.
5. Vocabulario operativo cuando toca: cabeza, flancos, cola, franja perimetral, l\xEDnea de defensa, punto de anclaje, zona de seguridad.
6. Si hablan de calor en ciudad o sombra, menciona una vez ManolitoAire.com (mapa de sombras 3D).
7. Responde en el idioma: ${idioma}.
8. Extensi\xF3n: 4-8 frases con sustancia (m\xE1s si piden detalle o es un escape). Sin paja.`, "SYSTEM_PROMPT");
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
        max_tokens: 700,
        temperature: 0.4
      });
      const respuesta = salidaAI?.response;
      if (respuesta && !esRespuestaEvasiva(respuesta)) {
        console.log(`[Manolito] motor: cloudflare-ai`);
        return jsonResponse({ respuesta, motor: "cloudflare-ai" });
      }
    } catch (e) {
      console.error(`[Manolito] Fallo cloudflare-ai:`, e.message);
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
          max_tokens: 700,
          temperature: 0.4
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const respuesta = data?.choices?.[0]?.message?.content;
        if (respuesta && !esRespuestaEvasiva(respuesta)) {
          console.log(`[Manolito] motor: openrouter`);
          return jsonResponse({ respuesta, motor: "openrouter" });
        }
      } else {
        console.warn(`[Manolito] openrouter status ${resp.status}`);
      }
    } catch (e) {
      console.error(`[Manolito] Fallo openrouter:`, e.message);
    }
  }
  if (contexto && typeof contexto.lat === "number") {
    console.log(`[Manolito] motor: local (fallback)`);
    return jsonResponse({ respuesta: generarLecturaLocal(contexto, contextoWebTexto), motor: "local" });
  }
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
  if (c.incendiosActivosCercanos > 0 || c.perimetroEstimado && c.perimetroEstimado.dentro) {
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
  const rojo = estado.color === "rojo";
  const amarillo = estado.color === "amarillo";
  const s = c.ciencia || null;
  lineas.push(`Estado del punto en ${lugar}: ${estado.etiqueta}`);
  if (rojo) {
    if (c.perimetroEstimado && c.perimetroEstimado.dentro) {
      lineas.push(`\u26A0 El punto est\xE1 DENTRO del per\xEDmetro estimado de un incendio activo (foco de ~${c.perimetroEstimado.areaHa.toFixed(1)} ha). Si est\xE1s ah\xED, vete ya.`);
    } else if (c.incendiosActivosCercanos > 0) {
      lineas.push(`\u{1F525} Incendios activos por sat\xE9lite en 25 km: ${c.incendiosActivosCercanos}, el m\xE1s cercano a ${c.distanciaIncendioMasCercanoKm} km.`);
    }
  } else if (amarillo) {
    lineas.push("Sin incendio confirmado todav\xEDa, pero el estr\xE9s de biomasa es alto: si prende, las condiciones de hoy le dejan correr.");
  } else if (c.incendiosActivosCercanos === 0) {
    lineas.push("Sin incendios activos por sat\xE9lite (NASA FIRMS) en 25 km ahora mismo.");
  }
  if (c.pct !== void 0) lineas.push(`Estr\xE9s de biomasa (modelo cu\xE1ntico): ${c.pct}%.`);
  if (s) {
    lineas.push(`Peligro meteorol\xF3gico Fosberg (FFWI): ${s.ffwi} (${s.ffwiNivel}). Humedad del combustible fino: ${s.humedadCombustible1h}%${s.humedadCombustible1h < 6 ? " \u2014 prende con cualquier chispa" : ""}.`);
    if (s.combustible) lineas.push(`Combustible estimado: ${s.combustible.nombre}, ~${s.combustible.cargaTHa} t/ha de combustible fino superficial (modelo Anderson ${s.combustible.modeloId}).`);
    if (s.rosMMin !== null) {
      lineas.push(`Si prende aqu\xED: cabeza del fuego a ~${s.rosMMin} m/min (${s.rosKmh} km/h)${s.pendientePct !== null ? ` con pendiente del ${s.pendientePct}%` : " en llano"}, llamas de ~${s.llamaM} m, intensidad ~${s.intensidadKwM} kW/m. ${s.intensidadKwM < 500 ? "Atacable con medios manuales." : s.intensidadKwM < 2e3 ? "Requiere maquinaria o medios a\xE9reos." : "Ataque directo a la cabeza IMPOSIBLE: solo flancos y cola."} Distancia de seguridad m\xEDnima: ${s.distanciaSeguridadM} m sin combustible.`);
    }
    if (s.escape && (rojo || amarillo)) {
      lineas.push(`ESCAPE: el fuego avanza hacia el ${s.escape.cardAvance}. Mu\xE9vete PERPENDICULAR (${s.escape.cardFlancoA} o ${s.escape.cardFlancoB}) o hacia lo ya quemado a barlovento (${s.escape.cardBarlovento}). Jam\xE1s hacia el ${s.escape.cardAvance} ni cuesta arriba por vaguadas alineadas con el viento. Busca roquedo, carretera, zona quemada o l\xE1mina de agua como refugio.`);
    }
    if (s.escape && !rojo && !amarillo) {
      lineas.push(`Si alg\xFAn d\xEDa prende con este viento: correr\xEDa hacia el ${s.escape.cardAvance}; la limpieza prioritaria es la franja a sotavento (${s.escape.cardAvance}) y despu\xE9s los flancos (${s.escape.cardFlancoA}/${s.escape.cardFlancoB}).`);
    }
  }
  if (typeof c.temp !== "undefined") {
    lineas.push(`Meteo ahora: ${c.temp}\xB0C, HR ${c.hum}%, viento ${c.wind} km/h${c.windDirCardinal ? " del " + c.windDirCardinal : ""}.${c.temp >= 30 && c.hum <= 30 && c.wind >= 30 ? " Regla 30-30-30 cumplida: d\xEDa de comportamiento extremo." : ""}`);
  }
  if (c.humedadSuelo !== void 0 && c.humedadSuelo !== null) {
    lineas.push(`Humedad del suelo superficial: ${c.humedadSuelo} m\xB3/m\xB3 (${c.humedadSuelo < 0.15 ? "suelo seco, agrava la disponibilidad del combustible" : "suelo con humedad moderada"}).`);
  }
  if (c.esDia !== void 0 && c.esDia !== null) {
    lineas.push(c.esDia ? "De d\xEDa: t\xE9rmicas y viento pueden acelerar la propagaci\xF3n." : "De noche: el fuego suele bajar de actividad \u2014 es la ventana de trabajo de las brigadas.");
  }
  if (c.vegetacion) lineas.push(`Vegetaci\xF3n (OSM): ${c.vegetacion}.`);
  else if (contextoWebTexto) lineas.push(`Sobre la zona: ${contextoWebTexto}`);
  if (c.aguaCercana !== void 0 && c.aguaCercana !== null) {
    lineas.push(c.aguaCercana ? "Agua cercana en 3 km: posible punto de apoyo para medios y refugio parcial." : "Sin agua cercana detectada en 3 km (OSM).");
  }
  if (rojo || amarillo) {
    lineas.push("Esto es un modelo de apoyo a la decisi\xF3n: ante fuego real manda la autoridad de extinci\xF3n. Emergencias: 112.");
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
  if (c.windDir !== void 0) partes.push(`Direcci\xF3n del viento (origen): ${c.windDir}\xB0 (${gradosACardinal(c.windDir)})`);
  if (c.pct !== void 0) partes.push(`Estr\xE9s de biomasa (modelo cu\xE1ntico): ${c.pct}%`);
  if (c.humedadSuelo !== void 0 && c.humedadSuelo !== null) partes.push(`Humedad del suelo superficial (0-1cm): ${c.humedadSuelo} m\xB3/m\xB3`);
  if (c.esDia !== void 0 && c.esDia !== null) partes.push(`Momento: ${c.esDia ? "de d\xEDa" : "de noche"}`);
  if (c.vegetacion) partes.push(`Vegetaci\xF3n cercana (OSM): ${c.vegetacion}`);
  if (c.aguaCercana !== void 0 && c.aguaCercana !== null) partes.push(`Agua cercana (3 km): ${c.aguaCercana ? "s\xED" : "no detectada"}`);
  const s = c.ciencia;
  if (s) {
    partes.push(`CIENCIA DEL PUNTO (c\xE1lculos reales, no estimaciones):`);
    partes.push(`- FFWI (Fosberg): ${s.ffwi} (${s.ffwiNivel})`);
    partes.push(`- Humedad combustible fino 1h: ${s.humedadCombustible1h}%`);
    if (s.combustible) partes.push(`- Modelo de combustible: Anderson ${s.combustible.modeloId} (${s.combustible.nombre}), carga ~${s.combustible.cargaTHa} t/ha`);
    if (s.rosMMin !== null) {
      partes.push(`- ROS (Rothermel): ${s.rosMMin} m/min = ${s.rosKmh} km/h${s.pendientePct !== null ? ` (pendiente ${s.pendientePct}%)` : " (llano asumido)"}`);
      partes.push(`- Intensidad (Byram): ${s.intensidadKwM} kW/m; llama ~${s.llamaM} m; distancia de seguridad >= ${s.distanciaSeguridadM} m`);
    }
    if (s.escape) {
      partes.push(`- El fuego avanzar\xEDa hacia: ${s.escape.cardAvance} (${s.escape.azAvance}\xB0)`);
      partes.push(`- Escape perpendicular: ${s.escape.cardFlancoA} (${s.escape.azFlancoA}\xB0) o ${s.escape.cardFlancoB} (${s.escape.azFlancoB}\xB0); refugio a barlovento: ${s.escape.cardBarlovento} (${s.escape.azBarlovento}\xB0)`);
    }
  }
  if (c.perimetroEstimado && c.perimetroEstimado.dentro) {
    partes.push(`\u26A0 EL PUNTO EST\xC1 DENTRO DEL PER\xCDMETRO ESTIMADO DE UN INCENDIO ACTIVO (foco ~${c.perimetroEstimado.areaHa.toFixed(1)} ha).`);
  } else if (c.incendiosActivosCercanos !== void 0 && c.incendiosActivosCercanos !== null) {
    partes.push(c.incendiosActivosCercanos > 0 ? `INCENDIOS ACTIVOS (NASA FIRMS) en 25 km: ${c.incendiosActivosCercanos}, m\xE1s cercano a ${c.distanciaIncendioMasCercanoKm} km.` : "Incendios activos (NASA FIRMS) en 25 km: ninguno.");
  }
  if (c.zonasPrioritarias) {
    const z = c.zonasPrioritarias;
    partes.push(`Zonas prioritarias a asegurar: cabeza (${z.cabeza?.lugar || "sin nombre"}: ${z.cabeza?.lat?.toFixed(4)}, ${z.cabeza?.lon?.toFixed(4)}), flanco der. (${z.flancoDer?.lugar || "sin nombre"}), flanco izq. (${z.flancoIzq?.lugar || "sin nombre"})`);
  }
  if (contextoWebTexto) partes.push(`Resumen de la zona (refuerzo web): ${contextoWebTexto}`);
  return partes.join("\n");
}
__name(formatearContexto, "formatearContexto");
function gradosACardinal(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"];
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

// src/senales.js
async function handleSenalPost(request, env) {
  let cuerpo;
  try {
    cuerpo = await request.json();
  } catch (e) {
    return cors(new Response("JSON inv\xE1lido", { status: 400 }));
  }
  const { de, para, datos } = cuerpo;
  if (!de || !para || !datos) {
    return cors(new Response("Faltan campos: de, para, datos", { status: 400 }));
  }
  const clave = `senal:${para}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  await env.SENALES.put(clave, JSON.stringify({ de, datos }), { expirationTtl: 60 });
  return cors(new Response("OK"));
}
__name(handleSenalPost, "handleSenalPost");
async function handleSenalGet(request, env) {
  const url = new URL(request.url);
  const para = url.searchParams.get("para");
  if (!para) return cors(new Response('Falta el par\xE1metro "para"', { status: 400 }));
  const prefijo = `senal:${para}:`;
  const lista = await env.SENALES.list({ prefix: prefijo });
  const mensajes = [];
  for (const clave of lista.keys) {
    const valor = await env.SENALES.get(clave.name);
    if (valor) mensajes.push(JSON.parse(valor));
    await env.SENALES.delete(clave.name);
  }
  return cors(new Response(JSON.stringify(mensajes), {
    headers: { "Content-Type": "application/json" }
  }));
}
__name(handleSenalGet, "handleSenalGet");
function handleSenalOptions() {
  return cors(new Response(null, { status: 204 }));
}
__name(handleSenalOptions, "handleSenalOptions");
function cors(resp) {
  resp.headers.set("Access-Control-Allow-Origin", "*");
  resp.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  resp.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return resp;
}
__name(cors, "cors");

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
    if (url.pathname === "/senal") {
      if (request.method === "POST") return handleSenalPost(request, env);
      if (request.method === "GET") return handleSenalGet(request, env);
      if (request.method === "OPTIONS") return handleSenalOptions();
      return new Response("Method Not Allowed", { status: 405 });
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
