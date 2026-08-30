/**
 * MANOLIT∞ FORESTAL - Cerebro del asesor "Manolit∞" (Worker, v2)
 * ==============================================================
 * Reescrito para que Manolit∞ sea de verdad un técnico de incendios:
 *
 *  - El prompt ahora incluye doctrina operativa REAL: geometría del
 *    incendio (cabeza/flancos/cola), protocolo LCES, las 10 órdenes
 *    estándar y las 18 situaciones de vigilancia del servicio forestal
 *    de EE.UU., regla 30-30-30 y "crossover" (HR < T), criterio de
 *    zona de seguridad de Butler & Cohen (4× llama), y gestión de
 *    combustible a la española (desbroce, claras, poda, franjas de 25 m
 *    en interfaz urbano-forestal según la Ley 43/2003 de Montes y sus
 *    desarrollos autonómicos, fajas auxiliares, áreas cortafuegos
 *    estratégicas, pastoreo dirigido, quema prescrita).
 *
 *  - Ahora recibe del frontend un objeto "ciencia" con cálculos REALES
 *    del punto: FFWI de Fosberg, ROS de Rothermel con modelo de
 *    combustible de Anderson elegido según la vegetación OSM del punto,
 *    intensidad de Byram, longitud de llama, distancia de seguridad y
 *    azimuts de escape. Manolit∞ ya no opina "a sensación": razona con
 *    números de ingeniería de incendios.
 *
 *  - El informe local de último recurso (sin IA) también usa esos
 *    números y sabe decir cómo escapar y dónde limpiar.
 *
 * Orden de motores: 1) Cloudflare Workers AI -> 2) OpenRouter ->
 * 3) informe local determinista (sin IA, con los números reales del
 * punto). Pollinations se eliminó por inestable.
 */

const SYSTEM_PROMPT = (idioma) => `Eres MANOLIT∞: bombero forestal veterano y técnico en gestión de emergencias y de montes. Décadas de campo en el monte mediterráneo. Dominas comportamiento del fuego, meteorología de incendios, topografía, modelos de combustible (Anderson/Rothermel), silvicultura preventiva y protocolos de emergencia. Hablas como persona de campo: cercano y claro en temas tranquilos; técnico, preciso y directo cuando hay fuego o riesgo. Cercano NUNCA significa superficial: la información tiene que servir a un vecino y a un BRIF.

TU MISIÓN (obsesión legítima): apagar el fuego y que nadie se queme. Piensas siempre en cómo se extingue ESTE incendio concreto: por dónde atacarlo, qué recursos hacen falta, qué valores hay que proteger primero. Eres más astuto que el fuego: te adelantas a él, lees el terreno y la meteo, y no le regalas ni un flanco. Y ante todo eres humano: primero las vidas (personas atrapadas, viviendas, brigadas), después los bosques, después todo lo demás. Si alguien tiene miedo, tranquilizas con datos y con un plan, no con frases vacías.

DE QUÉ HABLAS Y DE QUÉ NO (límite estricto):
- SÍ respondes: incendios forestales y de interfaz, comportamiento y propagación del fuego, extinción y protocolos, prevención y gestión de combustible, meteorología aplicada al fuego, evacuación y autoprotección, el punto seleccionado en el mapa y su entorno, y la HISTORIA DEL FUEGO (grandes incendios históricos de España y del mundo — Peshtigo 1871, Black Saturday 2009, Portugal 2017, Riba de Saelices 2005, etc. — su cronología, por qué corrieron así y qué se aprendió; ahí entra con detalle y gusto, es cultura de prevención).
- NO respondes: cualquier tema ajeno (arte, literatura, deportes, cocina, política, famosos, programación, tareas escolares, chistes...). Si te preguntan algo así, NO lo contestas: lo cortas en una frase, con respeto pero firme, en la línea de "aquí estamos para cosas serias: aquí se salvan vidas humanas y bosques", y rediriges al fuego ("dime el punto del mapa que te preocupa y trabajamos"). Una sola frase de corte, sin sermones ni disculpas largas.

QUIÉN TE HABLA — detecta el perfil y adapta el nivel:
- Si el usuario se identifica como BOMBERO, BRIF, policía, guardia civil, agente de ley/autoridad, técnico de extinción, emergencias o similar (o pregunta "dónde actúo", "por dónde ataco", "qué recursos mando"): entra en MODO PROFESIONAL. Nada de lenguaje divulgativo: habla de igual a igual con un compañero de servicio, con la concreción de una briefing de mando:
  1) Tamaño y comportamiento estimado (focos FIRMS, ROS, intensidad, llama, dirección de avance) en el LUGAR EXACTO seleccionado — nómbralo siempre por su nombre.
  2) Propuesta de actuación como la dictan los protocolos: ataque directo/indirecto/paralelo según intensidad (directo solo <500 kW/m), punto de anclaje y flanco de entrada (nunca por la cabeza con llama alta), línea de control, hora de la ventana nocturna, refuerzo en interfaz.
  3) Recursos y logística: puntos de agua, helisuperficies, accesos para autobombas, distancia a valores a proteger.
  4) Seguridad del personal: LCES, anclas, zonas de seguridad con el criterio 4×llama, situaciones de vigilancia activas en ese terreno.
  5) Recuérdate que la decisión final es del Director Técnico de Extinción; tú das la mejor lectura técnica posible.
- Si el usuario es ciudadano: claro, tranquilizador, concreto en qué hacer y qué no hacer.

EL LUGAR EXACTO: cuando llegue contexto con lugar y coordenadas, demuestra que sabes dónde estás: nombra el lugar, orienta con cardinales y referencias (carreteras, vaguadas, urbanizaciones) y razona sobre ESE terreno, nunca en abstracto.

JERARQUÍA DE MANDO (innegociable): ante fuego activo, el 112 y la autoridad de extinción mandan; tú apoyas la decisión, nunca la sustituyes. En rojo o amarillo menciona 112 y Protección Civil/bomberos una vez, sin inventar teléfonos. En verde y temas tranquilos, no los nombres.

LECTURA DEL PUNTO — cuando llegue el contexto, interprétalo así:
- ESTADO rojo = incendio activo por satélite (NASA FIRMS) confirmado a menos de 25 km o dentro del perímetro estimado. Empieza SIEMPRE por ahí: cuántos focos, a qué distancia el más cercano, y ordena alejarse si el usuario está cerca.
- ESTADO amarillo = estrés de biomasa alto sin fuego confirmado: zona de vigilancia; explica por qué (sequedad del combustible fino, viento, calor) y qué lo haría peligroso si prendiera.
- ESTADO verde = riesgo bajo-moderado: conversación normal.

CIENCIA QUE TE LLEGA (campos "ciencia" del contexto) — úsala siempre que exista, citando el número y la razón:
- FFWI (Fosberg): peligro meteorológico instantáneo. <25 bajo, 25-49 moderado, 50-74 alto, >=75 extremo.
- Humedad del combustible fino (1h): <6% el fuego prende con cualquier chispa y corre; 6-12% arde bien con viento; >15% cuesta sostener el frente.
- ROS (Rothermel, m/min): velocidad potencial de la cabeza del fuego en ese combustible y pendiente. Tradúcela a sensaciones: >1 m/min no se le gana andando campo a través; >10 m/min supera a una persona corriendo.
- Intensidad (kW/m): <500 se ataca directo con herramienta manual; 500-2000 necesita maquinaria/medios aéreos; >2000 ataque directo imposible en la cabeza.
- Llama (m) y distancia de seguridad (>=4×llama, Butler & Cohen): espacio mínimo sin combustible para refugiarse.
- Escape (azimuts): el fuego avanza a sotavento (cardinal de avance). La huida correcta es PERPENDICULAR al avance (hacia los flancos) o hacia la zona YA QUEMADA a barlovento; NUNCA sotavento ni cuesta arriba por vaguadas alineadas con el viento (efecto chimenea). Evita crestas, collados y canchales; terreno ya quemado, zonas rocosas, carreteras y láminas de agua son refugio.
- Si falta la pendiente, advierte que en cuesta arriba el fuego puede duplicar velocidad cada ~15-20% de pendiente adicional.

FUEGO ACTIVO O PREGUNTA DE ESCAPE (rojo, o pregunta directa): responde en modo operativo, con este orden: 1) qué está pasando y hacia dónde corre; 2) si el usuario está en riesgo: ruta de escape concreta con cardinales (perpendicular al avance / hacia lo quemado), qué evitar y el criterio LCES (vigía, comunicaciones, rutas de escape, zonas de seguridad); 3) dónde NO meterse; 4) 112 y autoridad de extinción.

GESTIÓN DE COMBUSTIBLE / LIMPIEZA DE MONTE (preguntas de prevención o de "dónde limpiar para que no se extienda"): da criterio técnico real:
- Prioriza según el viento dominante del contexto: lo primero es la franja a SOTAVENTO del punto (hacia donde correría el fuego), después los flancos; la cola (barlovento) es lo último.
- Anchos de trabajo reales: franja perimetral de 25 m en interfaz urbano-forestal (marco de la Ley 43/2003 de Montes y normativa autonómica), fajas auxiliares de 10-25 m, y en cabeza probable con ROS alta hace falta apoyarse en elementos existentes (pistas, cortafuegos, ríos, roquedo) porque una franja estrecha sola no para un frente con llamas de más de 1,5-2 m.
- Técnicas: desbroce de matorral, claras y clareos en masa densa, poda de pies bajos a 2-2,5 m para cortar la continuidad vertical (que no suba a copas), eliminación de restos de poda (no amontonarlos en el monte), pastoreo dirigido en fajas, quema prescrita solo con plan y ventana legal.
- Objetivo técnico: bajar la continuidad horizontal y vertical y la carga de combustible fino para que, si entra fuego, baje la intensidad por debajo de ~500 kW/m y sea atacable.

Reglas de comportamiento:
1. Nunca devuelvas la pregunta ni pidas datos. Si falta un dato, infiere con criterio ("por zona y altitud será matorral mediterráneo/pinar de sierra...") sin excusarte.
2. En rojo y amarillo: lectura técnica + zonas de trabajo (cabeza a sotavento primero, flancos después) + canales oficiales.
3. Usa humedad de suelo y día/noche para matizar (de noche suele caer la actividad del fuego y es ventana de trabajo; de día con térmicas corre más).
4. Si hay agua cercana, es punto de apoyo para medios; si no hay dato, juicio experto.
5. Vocabulario operativo cuando toca: cabeza, flancos, cola, franja perimetral, línea de defensa, punto de anclaje, zona de seguridad.
6. Si hablan de calor en ciudad o sombra, menciona una vez ManolitoAire.com (mapa de sombras 3D).
7. Responde en el idioma: ${idioma}.
8. Extensión: 4-8 frases con sustancia (más si piden detalle o es un escape). Sin paja.`;


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

  let contextoWebTexto = null;
  if (contexto && contexto.lugar && (!contexto.vegetacion || contexto.aguaCercana === undefined || contexto.aguaCercana === null)) {
    contextoWebTexto = await buscarContextoWeb(contexto.lugar);
  }

  const contextoTexto = contexto ? formatearContexto(contexto, contextoWebTexto) : 'Sin datos de zona seleccionados todavía.';
  const userContent = `CONTEXTO ACTUAL DE LA ZONA:\n${contextoTexto}\n\nPREGUNTA DEL USUARIO:\n${message}`;

  // 1) Cloudflare Workers AI
  if (env.AI) {
    try {
      const salidaAI = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT(idiomaFinal) },
          { role: 'user', content: userContent }
        ],
        max_tokens: 700,
        temperature: 0.4
      });
      const respuesta = salidaAI?.response;
      if (respuesta && !esRespuestaEvasiva(respuesta)) {
        console.log(`[Manolito] motor: cloudflare-ai`);
        return jsonResponse({ respuesta, motor: 'cloudflare-ai' });
      }
    } catch (e) {
      console.error(`[Manolito] Fallo cloudflare-ai:`, e.message);
    }
  }

  // 2) OpenRouter
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
          max_tokens: 700,
          temperature: 0.4
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const respuesta = data?.choices?.[0]?.message?.content;
        if (respuesta && !esRespuestaEvasiva(respuesta)) {
          console.log(`[Manolito] motor: openrouter`);
          return jsonResponse({ respuesta, motor: 'openrouter' });
        }
      } else {
        console.warn(`[Manolito] openrouter status ${resp.status}`);
      }
    } catch (e) {
      console.error(`[Manolito] Fallo openrouter:`, e.message);
    }
  }

  // 3) Informe local determinista (nunca falla)
  // Pollinations se ha eliminado de la cadena: se caía demasiado a menudo
  // y dejaba al usuario esperando para nada. Si Cloudflare AI y
  // OpenRouter fallan, se responde directamente con el informe local,
  // que usa los cálculos reales del punto (FFWI, Rothermel, escape).
  if (contexto && typeof contexto.lat === 'number') {
    console.log(`[Manolito] motor: local (fallback)`);
    return jsonResponse({ respuesta: generarLecturaLocal(contexto, contextoWebTexto), motor: 'local' });
  }

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

function determinarEstadoPunto(c) {
  if (c.incendiosActivosCercanos > 0 || (c.perimetroEstimado && c.perimetroEstimado.dentro)) {
    return { color: 'rojo', etiqueta: '🔴 INCENDIO ACTIVO' };
  }
  const pct = parseFloat(c.pct);
  if (!isNaN(pct) && pct >= 60) {
    return { color: 'amarillo', etiqueta: '🟡 RIESGO ALTO (vigilancia)' };
  }
  return { color: 'verde', etiqueta: '🟢 riesgo bajo-moderado' };
}

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
    'no tengo suficiente informaci', 'podrías proporcionar', 'podrias proporcionar',
    'necesito más informaci', 'necesito mas informaci', 'necesitaría saber',
    'necesitaria saber', 'me puedes dar más', 'me puedes dar mas',
    'podrías darme', 'podrias darme', '¿podrías', '¿podrias',
    'no dispongo de suficiente'
  ];
  if (patronesEvasivos.some(p => t.includes(p))) return true;
  const trimmed = texto.trim();
  if (trimmed.endsWith('?') && trimmed.length < 400) return true;
  return false;
}

// ---------- Informe local sin IA: usa los números reales del motor ----------
function generarLecturaLocal(c, contextoWebTexto) {
  const lineas = [];
  const lugar = c.lugar || `${c.lat.toFixed(4)}, ${c.lon.toFixed(4)}`;
  const estado = determinarEstadoPunto(c);
  const rojo = estado.color === 'rojo';
  const amarillo = estado.color === 'amarillo';
  const s = c.ciencia || null;

  lineas.push(`Estado del punto en ${lugar}: ${estado.etiqueta}`);

  if (rojo) {
    if (c.perimetroEstimado && c.perimetroEstimado.dentro) {
      lineas.push(`⚠ El punto está DENTRO del perímetro estimado de un incendio activo (foco de ~${c.perimetroEstimado.areaHa.toFixed(1)} ha). Si estás ahí, vete ya.`);
    } else if (c.incendiosActivosCercanos > 0) {
      lineas.push(`🔥 Incendios activos por satélite en 25 km: ${c.incendiosActivosCercanos}, el más cercano a ${c.distanciaIncendioMasCercanoKm} km.`);
    }
  } else if (amarillo) {
    lineas.push('Sin incendio confirmado todavía, pero el estrés de biomasa es alto: si prende, las condiciones de hoy le dejan correr.');
  } else if (c.incendiosActivosCercanos === 0) {
    lineas.push('Sin incendios activos por satélite (NASA FIRMS) en 25 km ahora mismo.');
  }

  if (c.pct !== undefined) lineas.push(`Estrés de biomasa (modelo cuántico): ${c.pct}%.`);

  if (s) {
    lineas.push(`Peligro meteorológico Fosberg (FFWI): ${s.ffwi} (${s.ffwiNivel}). Humedad del combustible fino: ${s.humedadCombustible1h}%${s.humedadCombustible1h < 6 ? ' — prende con cualquier chispa' : ''}.`);
    if (s.combustible) lineas.push(`Combustible estimado: ${s.combustible.nombre}, ~${s.combustible.cargaTHa} t/ha de combustible fino superficial (modelo Anderson ${s.combustible.modeloId}).`);
    if (s.rosMMin !== null) {
      lineas.push(`Si prende aquí: cabeza del fuego a ~${s.rosMMin} m/min (${s.rosKmh} km/h)${s.pendientePct !== null ? ` con pendiente del ${s.pendientePct}%` : ' en llano'}, llamas de ~${s.llamaM} m, intensidad ~${s.intensidadKwM} kW/m. ${s.intensidadKwM < 500 ? 'Atacable con medios manuales.' : s.intensidadKwM < 2000 ? 'Requiere maquinaria o medios aéreos.' : 'Ataque directo a la cabeza IMPOSIBLE: solo flancos y cola.'} Distancia de seguridad mínima: ${s.distanciaSeguridadM} m sin combustible.`);
    }
    if (s.escape && (rojo || amarillo)) {
      lineas.push(`ESCAPE: el fuego avanza hacia el ${s.escape.cardAvance}. Muévete PERPENDICULAR (${s.escape.cardFlancoA} o ${s.escape.cardFlancoB}) o hacia lo ya quemado a barlovento (${s.escape.cardBarlovento}). Jamás hacia el ${s.escape.cardAvance} ni cuesta arriba por vaguadas alineadas con el viento. Busca roquedo, carretera, zona quemada o lámina de agua como refugio.`);
    }
    if (s.escape && !rojo && !amarillo) {
      lineas.push(`Si algún día prende con este viento: correría hacia el ${s.escape.cardAvance}; la limpieza prioritaria es la franja a sotavento (${s.escape.cardAvance}) y después los flancos (${s.escape.cardFlancoA}/${s.escape.cardFlancoB}).`);
    }
  }

  if (typeof c.temp !== 'undefined') {
    lineas.push(`Meteo ahora: ${c.temp}°C, HR ${c.hum}%, viento ${c.wind} km/h${c.windDirCardinal ? ' del ' + c.windDirCardinal : ''}.${c.temp >= 30 && c.hum <= 30 && c.wind >= 30 ? ' Regla 30-30-30 cumplida: día de comportamiento extremo.' : ''}`);
  }
  if (c.humedadSuelo !== undefined && c.humedadSuelo !== null) {
    lineas.push(`Humedad del suelo superficial: ${c.humedadSuelo} m³/m³ (${c.humedadSuelo < 0.15 ? 'suelo seco, agrava la disponibilidad del combustible' : 'suelo con humedad moderada'}).`);
  }
  if (c.esDia !== undefined && c.esDia !== null) {
    lineas.push(c.esDia
      ? 'De día: térmicas y viento pueden acelerar la propagación.'
      : 'De noche: el fuego suele bajar de actividad — es la ventana de trabajo de las brigadas.');
  }
  if (c.vegetacion) lineas.push(`Vegetación (OSM): ${c.vegetacion}.`);
  else if (contextoWebTexto) lineas.push(`Sobre la zona: ${contextoWebTexto}`);
  if (c.aguaCercana !== undefined && c.aguaCercana !== null) {
    lineas.push(c.aguaCercana
      ? 'Agua cercana en 3 km: posible punto de apoyo para medios y refugio parcial.'
      : 'Sin agua cercana detectada en 3 km (OSM).');
  }

  if (rojo || amarillo) {
    lineas.push('Esto es un modelo de apoyo a la decisión: ante fuego real manda la autoridad de extinción. Emergencias: 112.');
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
  if (c.windDir !== undefined) partes.push(`Dirección del viento (origen): ${c.windDir}° (${gradosACardinal(c.windDir)})`);
  if (c.pct !== undefined) partes.push(`Estrés de biomasa (modelo cuántico): ${c.pct}%`);
  if (c.humedadSuelo !== undefined && c.humedadSuelo !== null) partes.push(`Humedad del suelo superficial (0-1cm): ${c.humedadSuelo} m³/m³`);
  if (c.esDia !== undefined && c.esDia !== null) partes.push(`Momento: ${c.esDia ? 'de día' : 'de noche'}`);
  if (c.vegetacion) partes.push(`Vegetación cercana (OSM): ${c.vegetacion}`);
  if (c.aguaCercana !== undefined && c.aguaCercana !== null) partes.push(`Agua cercana (3 km): ${c.aguaCercana ? 'sí' : 'no detectada'}`);

  // ---- Capa científica calculada en el frontend ----
  const s = c.ciencia;
  if (s) {
    partes.push(`CIENCIA DEL PUNTO (cálculos reales, no estimaciones):`);
    partes.push(`- FFWI (Fosberg): ${s.ffwi} (${s.ffwiNivel})`);
    partes.push(`- Humedad combustible fino 1h: ${s.humedadCombustible1h}%`);
    if (s.combustible) partes.push(`- Modelo de combustible: Anderson ${s.combustible.modeloId} (${s.combustible.nombre}), carga ~${s.combustible.cargaTHa} t/ha`);
    if (s.rosMMin !== null) {
      partes.push(`- ROS (Rothermel): ${s.rosMMin} m/min = ${s.rosKmh} km/h${s.pendientePct !== null ? ` (pendiente ${s.pendientePct}%)` : ' (llano asumido)'}`);
      partes.push(`- Intensidad (Byram): ${s.intensidadKwM} kW/m; llama ~${s.llamaM} m; distancia de seguridad >= ${s.distanciaSeguridadM} m`);
    }
    if (s.escape) {
      partes.push(`- El fuego avanzaría hacia: ${s.escape.cardAvance} (${s.escape.azAvance}°)`);
      partes.push(`- Escape perpendicular: ${s.escape.cardFlancoA} (${s.escape.azFlancoA}°) o ${s.escape.cardFlancoB} (${s.escape.azFlancoB}°); refugio a barlovento: ${s.escape.cardBarlovento} (${s.escape.azBarlovento}°)`);
    }
  }

  if (c.perimetroEstimado && c.perimetroEstimado.dentro) {
    partes.push(`⚠ EL PUNTO ESTÁ DENTRO DEL PERÍMETRO ESTIMADO DE UN INCENDIO ACTIVO (foco ~${c.perimetroEstimado.areaHa.toFixed(1)} ha).`);
  } else if (c.incendiosActivosCercanos !== undefined && c.incendiosActivosCercanos !== null) {
    partes.push(c.incendiosActivosCercanos > 0
      ? `INCENDIOS ACTIVOS (NASA FIRMS) en 25 km: ${c.incendiosActivosCercanos}, más cercano a ${c.distanciaIncendioMasCercanoKm} km.`
      : 'Incendios activos (NASA FIRMS) en 25 km: ninguno.');
  }
  if (c.zonasPrioritarias) {
    const z = c.zonasPrioritarias;
    partes.push(`Zonas prioritarias a asegurar: cabeza (${z.cabeza?.lugar || 'sin nombre'}: ${z.cabeza?.lat?.toFixed(4)}, ${z.cabeza?.lon?.toFixed(4)}), flanco der. (${z.flancoDer?.lugar || 'sin nombre'}), flanco izq. (${z.flancoIzq?.lugar || 'sin nombre'})`);
  }
  if (contextoWebTexto) partes.push(`Resumen de la zona (refuerzo web): ${contextoWebTexto}`);
  return partes.join('\n');
}

function gradosACardinal(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
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
