/**
 * MANOLIT∞ FORESTAL - SIMULADOR CUÁNTICO DE ESTRÉS DE BIOMASA
 * Regla 30-30-30 con entrelazamiento, capas de fuego real (NASA FIRMS),
 * áreas quemadas reales (EFFIS), predicción de propagación por viento
 * y asesor Manolito.
 */

// 0. CONSTANTES Y CONFIGURACIÓN
const DOM = {
    map: 'map',
    dashboard: document.getElementById('dashboard'),
    toggleDashboardBtn: document.getElementById('toggle-dashboard'),
    toggleModeBtn: document.getElementById('toggle-mode'),
    quantumLogSection: document.getElementById('quantum-log-section'),
    logRY: document.getElementById('log-ry'),
    logCNOT: document.getElementById('log-cnot'),
    logMedicion: document.getElementById('log-medicion'),
    logDetalles: document.getElementById('log-detalles'),
    uiCoords: document.getElementById('ui-coords'),
    uiPercent: document.getElementById('ui-percent'),
    uiAlert: document.getElementById('ui-alert'),
    uiAction: document.getElementById('ui-action'),
    uiTemp: document.getElementById('ui-temp'),
    uiHum: document.getElementById('ui-hum'),
    uiWind: document.getElementById('ui-wind'),
    uiWindDir: document.getElementById('ui-wind-dir'),
    uiPropagacion: document.getElementById('ui-propagacion-texto'),
    contadorFuegos: document.getElementById('contador-fuegos'),
    reopenDashboardBtn: document.getElementById('reopen-dashboard-btn'),
    legalModal: document.getElementById('legal-modal'),
    legalContentContainer: document.getElementById('legal-content-container'),
    acceptLegalBtn: document.getElementById('accept-legal-btn'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    openLegalLink: document.getElementById('open-legal-link')
};

// Contexto compartido con Manolito (chat) y el generador de PDF
window.ultimoContextoManolito = null;

// Datos de ejemplo para la capa de fuegos. Se usan como fallback si la API
// de FIRMS no está disponible (ej. al ejecutar sin 'wrangler dev').
const CSV_EJEMPLO_FUEGOS = `latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_ti5,frp,daynight
40.4,-4.0,345.1,0.45,0.6,2024-07-25,14:30,NPP,VIIRS,h,2.0NRT,301.2,12.5,D
40.2,-4.3,338.7,0.5,0.65,2024-07-25,14:31,NPP,VIIRS,n,2.0NRT,298.0,8.1,D
40.1,-4.5,352.9,0.4,0.55,2024-07-25,14:32,NPP,VIIRS,h,2.0NRT,305.4,15.0,D`;

/**
 * Utilidad para retrasar la ejecución de una función (debounce).
 * Evita que se llame a la API de Overpass en cada clic rápido.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 1. INICIALIZACIÓN DEL MAPA
const map = L.map('map', {
    center: [40.0, -3.0],
    zoom: 6,
    zoomControl: true
});

// Capas base
const baseDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CartoDB',
    subdomains: 'abcd',
    maxZoom: 20
});

const baseSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri, Maxar, Earthstar Geographics',
    maxZoom: 19
});

const baseTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenTopoMap contributors',
    maxZoom: 17
});

baseSat.addTo(map); // capa por defecto (satélite, como en la imagen de referencia)

// Grupo de incendios (puntos FIRMS)
const grupoFuegos = L.layerGroup().addTo(map);

// Grupo del perímetro estimado de incendios activos (se dibuja a partir
// de los propios puntos FIRMS agrupados, y crece/cambia según llegan
// detecciones nuevas del satélite)
const grupoPerimetroFuegos = L.layerGroup().addTo(map);

// Capa de áreas quemadas reales (EFFIS - Copernicus, gratis, sin API key)
// ARREGLADO: el nombre correcto de la capa es "effis.nrt.ba.poly" (verificado
// contra el servidor). "EFFIS:BurntAreasAll" no existe y por eso no cargaba.
const SLD_CONTORNO_AMARILLO = '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"><NamedLayer><Name>effis.nrt.ba.poly</Name><UserStyle><FeatureTypeStyle><Rule><PolygonSymbolizer><Stroke><CssParameter name="stroke">#FFD500</CssParameter><CssParameter name="stroke-width">2</CssParameter></Stroke></PolygonSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

const capasEffis = L.tileLayer.wms('https://maps.effis.emergency.copernicus.eu/effis', {
    layers: 'effis.nrt.ba.poly',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    opacity: 0.95,
    sld_body: SLD_CONTORNO_AMARILLO,
    attribution: 'EFFIS - Copernicus (actualizado por paso de satélite VIIRS, casi en tiempo real)'
});

// Control de capas en bottomright para que no tape el dashboard
const capasBase = {
    "Oscura (Dark Matter)": baseDark,
    "Satélite (ESRI)": baseSat,
    "Topográfica": baseTopo
};

const capasOverlay = {
    "Incendios activos - puntos (FIRMS)": grupoFuegos,
    "Perímetro estimado - incendios activos": grupoPerimetroFuegos,
    "Áreas quemadas reales (EFFIS)": capasEffis
};

L.control.layers(capasBase, capasOverlay, {
    position: 'bottomright',
    collapsed: false
}).addTo(map);

let marcadorActivo = null;      // marcador de evaluación cuántica
let flechaViento = null;        // flecha de dirección de viento
let conoPropagacion = null;     // polígono/cono de propagación estimada

// 2. SIMULADOR CUÁNTICO (3 Qubits)
class QuantumSimulator {
    constructor() {
        this.estado = [1, 0, 0, 0, 0, 0, 0, 0];
    }

    aplicarRY(qubitIndex, theta) {
        const cos = Math.cos(theta / 2);
        const sin = Math.sin(theta / 2);

        for (let i = 0; i < 8; i++) {
            if ((i & (1 << (2 - qubitIndex))) === 0) {
                const i0 = i;
                const i1 = i | (1 << (2 - qubitIndex));
                const a = this.estado[i0];
                const b = this.estado[i1];
                this.estado[i0] = a * cos - b * sin;
                this.estado[i1] = a * sin + b * cos;
            }
        }
    }

    aplicarCNOT(controlIndex, targetIndex) {
        for (let i = 0; i < 8; i++) {
            const isControl1 = (i & (1 << (2 - controlIndex))) !== 0;
            const isTarget0 = (i & (1 << (2 - targetIndex))) === 0;
            if (isControl1 && isTarget0) {
                const i0 = i;
                const i1 = i | (1 << (2 - targetIndex));
                [this.estado[i0], this.estado[i1]] = [this.estado[i1], this.estado[i0]];
            }
        }
    }

    medirRiesgoIgnicion() {
        const pesos = { 3: 0.5, 5: 0.7, 6: 0.7, 7: 1.0 };
        let riesgo = 0;
        for (let idx of [3, 5, 6, 7]) {
            riesgo += pesos[idx] * Math.pow(this.estado[idx], 2);
        }
        return (riesgo * 100).toFixed(2);
    }

    obtenerDetalles() {
        const probs = {};
        for (let idx of [3, 5, 6, 7]) {
            probs[idx] = (Math.pow(this.estado[idx], 2) * 100).toFixed(2);
        }
        return probs;
    }
}

// 3. NORMALIZACIÓN
function normalizarVariables(temp, hum, wind) {
    const pTemp = Math.min(1, Math.max(0, (temp - 25) / 20));
    const pHum = Math.min(1, Math.max(0, (40 - hum) / 30));
    const pWind = Math.min(1, Math.max(0, (wind - 15) / 35));
    return { pTemp, pHum, pWind };
}

// 3b. UTILIDADES DE VIENTO Y PROPAGACIÓN
function gradosACardinal(deg) {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirs[Math.round(deg / 22.5) % 16];
}

function azimutPropagacion(windDirOrigenDeg) {
    return (windDirOrigenDeg + 180) % 360;
}

function destinoDesdeAzimut(lat, lon, azimutDeg, distanciaKm) {
    const R = 6371;
    const brng = azimutDeg * Math.PI / 180;
    const lat1 = lat * Math.PI / 180;
    const lon1 = lon * Math.PI / 180;
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanciaKm / R) +
        Math.cos(lat1) * Math.sin(distanciaKm / R) * Math.cos(brng));
    const lon2 = lon1 + Math.atan2(
        Math.sin(brng) * Math.sin(distanciaKm / R) * Math.cos(lat1),
        Math.cos(distanciaKm / R) - Math.sin(lat1) * Math.sin(lat2)
    );
    return [lat2 * 180 / Math.PI, lon2 * 180 / Math.PI];
}

function calcularZonasDeTrabajo(windDirOrigen, windSpeed, pct) {
    const azAvance = azimutPropagacion(windDirOrigen);
    const azFlancoDer = (azAvance + 90) % 360;
    const azFlancoIzq = (azAvance + 270) % 360;
    const azCola = windDirOrigen;

    const cardAvance = gradosACardinal(azAvance);
    const cardFlancoDer = gradosACardinal(azFlancoDer);
    const cardFlancoIzq = gradosACardinal(azFlancoIzq);
    const cardCola = gradosACardinal(azCola);

    let urgencia;
    if (pct < 40) urgencia = t('trabajoUrgenciaBaja');
    else if (pct < 75) urgencia = t('trabajoUrgenciaMedia');
    else urgencia = t('trabajoUrgenciaAlta');

    let intensidadViento;
    if (windSpeed < 15) intensidadViento = t('trabajoVientoFlojo');
    else if (windSpeed < 35) intensidadViento = t('trabajoVientoModerado');
    else intensidadViento = t('trabajoVientoFuerte');

    const texto = t('trabajoTexto', {
        cardCola, windDirOrigen, windSpeed, cardAvance, intensidadViento,
        cardFlancoIzq, cardFlancoDer, urgencia
    });

    return { texto, azAvance, azFlancoDer, azFlancoIzq, azCola, cardAvance, cardFlancoDer, cardFlancoIzq, cardCola };
}

function dibujarPropagacion(lat, lon, windDirOrigen, windSpeed, colorHex) {
    if (flechaViento) map.removeLayer(flechaViento);
    if (conoPropagacion) map.removeLayer(conoPropagacion);

    const azAvance = azimutPropagacion(windDirOrigen);
    const distanciaKm = Math.min(8, 1.5 + windSpeed / 8);

    const puntoLejano = destinoDesdeAzimut(lat, lon, azAvance, distanciaKm);
    const puntoIzq = destinoDesdeAzimut(lat, lon, (azAvance + 25) % 360, distanciaKm * 0.7);
    const puntoDer = destinoDesdeAzimut(lat, lon, (azAvance - 25 + 360) % 360, distanciaKm * 0.7);

    conoPropagacion = L.polygon([[lat, lon], puntoIzq, puntoLejano, puntoDer], {
        color: colorHex,
        weight: 1.5,
        fillColor: colorHex,
        fillOpacity: 0.12,
        dashArray: '4 4'
    }).addTo(map).bindTooltip(t('tooltipPropagacion'));

    flechaViento = L.polyline([[lat, lon], puntoLejano], {
        color: colorHex,
        weight: 2,
        opacity: 0.8
    }).addTo(map);
}

// 4. EJECUCIÓN DEL MOTOR CUÁNTICO
function ejecutarMotorCuantico(lat, lon, temp, hum, wind, windDir, lugar, humedadSuelo, esDia) {
    const { pTemp, pHum, pWind } = normalizarVariables(temp, hum, wind);

    const thetaQ0 = 2 * Math.asin(Math.sqrt(pTemp));
    const thetaQ1 = 2 * Math.asin(Math.sqrt(pHum));
    const thetaQ2 = 2 * Math.asin(Math.sqrt(pWind));

    const sim = new QuantumSimulator();
    sim.aplicarRY(0, thetaQ0);
    sim.aplicarRY(1, thetaQ1);
    sim.aplicarRY(2, thetaQ2);

    DOM.logRY.innerHTML =
        `${t('logRyAplicadas')}<br> Q0(Temp): ${thetaQ0.toFixed(3)} rad<br> Q1(Hum): ${thetaQ1.toFixed(3)} rad<br> Q2(Wind): ${thetaQ2.toFixed(3)} rad`;

    sim.aplicarCNOT(0, 2);
    sim.aplicarCNOT(2, 1);
    DOM.logCNOT.textContent = t('logCnotEjecutados');

    const porcentajePeligro = sim.medirRiesgoIgnicion();
    const detalles = sim.obtenerDetalles();

    DOM.logMedicion.textContent = t('logMedicionEjecutada');
    DOM.logDetalles.innerHTML =
        `P(|011⟩) = ${detalles[3]}%<br>P(|101⟩) = ${detalles[5]}%<br>P(|110⟩) = ${detalles[6]}%<br>P(|111⟩) = ${detalles[7]}%`;

    actualizarInterfazYMapa(lat, lon, porcentajePeligro, temp, hum, wind, windDir, lugar, humedadSuelo, esDia);
}

// 5. ACTUALIZACIÓN VISUAL
function actualizarInterfazYMapa(lat, lon, pct, temp, hum, wind, windDir, lugar, humedadSuelo, esDia) {
    DOM.uiPercent.textContent = `${pct}%`;
    DOM.dashboard.classList.remove('estado-reposo', 'estado-ambar', 'estado-rojo');
    DOM.uiAlert.dataset.estado = 'evaluado';

    let colorHex = "";
    let alertText = "";
    let actionText = "";
    if (pct < 40) {
        DOM.dashboard.classList.add('estado-reposo');
        alertText = t('zonaSeguro');
        actionText = t('actionOptimo');
        colorHex = "#00f3ff";
    } else if (pct < 75) {
        DOM.dashboard.classList.add('estado-ambar');
        alertText = t('zonaAmbar');
        actionText = t('actionRecomendada');
        colorHex = "#ffaa00";
    } else {
        DOM.dashboard.classList.add('estado-rojo');
        alertText = t('zonaRojo');
        actionText = t('actionUrgente');
        colorHex = "#ff003c";
    }

    if (marcadorActivo) map.removeLayer(marcadorActivo);
    marcadorActivo = L.circleMarker([lat, lon], {
        radius: 14,
        fillColor: colorHex,
        color: colorHex,
        weight: 2.5,
        opacity: 0.9,
        fillOpacity: 0.55
    }).addTo(map).bindPopup(`<b>${t('popupEstresBiomasa')}:</b> ${pct}%<br><small>${alertText}</small>`);
    DOM.uiAlert.textContent = alertText.toUpperCase();
    DOM.uiAction.innerHTML = actionText;

    let recomendacion = null;
    if (typeof windDir === 'number' && !isNaN(windDir)) {
        recomendacion = calcularZonasDeTrabajo(windDir, wind, pct);
        if (DOM.uiPropagacion) DOM.uiPropagacion.innerHTML = recomendacion.texto.replace(/\n/g, '<br><br>');
        dibujarPropagacion(lat, lon, windDir, wind, colorHex);
    }

    window.ultimoContextoManolito = {
        lat, lon, temp, hum, wind,
        windDir: windDir,
        windDirCardinal: (typeof windDir === 'number') ? gradosACardinal(windDir) : null,
        pct,
        lugar: lugar || null,
        humedadSuelo: (typeof humedadSuelo === 'number') ? humedadSuelo : null,
        esDia: (typeof esDia === 'boolean') ? esDia : null,
        vegetacion: null,
        aguaCercana: null,
        recomendacionTexto: recomendacion ? recomendacion.texto : actionText.replace(/<[^>]+>/g, '')
    };
}

// 6a. OVERPASS CON RESPALDO (varios espejos + timeout)
const OVERPASS_MIRRORS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter'
];

async function consultarOverpass(query, timeoutMs = 8000) {
    for (const url of OVERPASS_MIRRORS) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const resp = await fetch(url, {
                method: 'POST',
                body: 'data=' + encodeURIComponent(query),
                signal: controller.signal
            });
            clearTimeout(timer);
            if (resp.ok) return await resp.json();
            console.warn(`[Overpass] ${url} respondió ${resp.status}, probando siguiente espejo`);
        } catch (e) {
            clearTimeout(timer);
            console.warn(`[Overpass] Fallo en ${url}:`, e.message, '— probando siguiente espejo');
        }
    }
    console.error('[Overpass] Todos los espejos fallaron.');
    return null;
}

// 6b. CONTEXTO AMPLIADO: vegetación y agua cercana
async function obtenerContextoTerreno(lat, lon) {
    const radioMetros = 3000;
    const query = `
        [out:json][timeout:10];
        (
          nwr["natural"="wood"](around:${radioMetros},${lat},${lon});
          nwr["landuse"="forest"](around:${radioMetros},${lat},${lon});
          nwr["natural"="water"](around:${radioMetros},${lat},${lon});
          nwr["waterway"="river"](around:${radioMetros},${lat},${lon});
          nwr["landuse"="reservoir"](around:${radioMetros},${lat},${lon});
        );
        out tags 10;
    `;

    const data = await consultarOverpass(query);
    if (!data) {
        return { vegetacion: 'No disponible (fallo de consulta a OpenStreetMap)', aguaCercana: null };
    }

    const especies = new Set();
    let hayAgua = false;
    (data.elements || []).forEach(el => {
        const tags = el.tags || {};
        if (tags.natural === 'water' || tags.waterway === 'river' || tags.landuse === 'reservoir') hayAgua = true;
        if (tags.leaf_type) especies.add(tags.leaf_type);
        if (tags.species) especies.add(tags.species);
        if (tags.genus) especies.add(tags.genus);
    });

    let tipoVegetacion = 'No determinado con precisión (sin etiquetado detallado en OpenStreetMap para este punto)';
    if (especies.size > 0) {
        tipoVegetacion = Array.from(especies).join(', ');
    } else if ((data.elements || []).some(el => (el.tags || {}).natural === 'wood' || (el.tags || {}).landuse === 'forest')) {
        tipoVegetacion = 'Masa forestal genérica (sin especie detallada en OSM)';
    }

    return { vegetacion: tipoVegetacion, aguaCercana: hayAgua };
}

// 6c. FETCH CON REINTENTOS (clima) — para que nunca se quede colgado
async function fetchConReintentos(url, intentos = 3, timeoutMs = 6000) {
    for (let i = 0; i < intentos; i++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const resp = await fetch(url, { signal: controller.signal });
            clearTimeout(timer);
            if (resp.ok) return resp;
            console.warn(`[Clima] Intento ${i + 1} respondió ${resp.status}`);
        } catch (e) {
            clearTimeout(timer);
            console.warn(`[Clima] Intento ${i + 1} falló:`, e.message);
        }
        if (i < intentos - 1) await new Promise(r => setTimeout(r, 600));
    }
    return null;
}

// 6. OBTENCIÓN DE DATOS METEOROLÓGICOS (clic en mapa)
async function obtenerDatosClimaticos(lat, lon) {
    DOM.uiCoords.textContent = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    DOM.uiPercent.textContent = t('calculando');
    DOM.dashboard.classList.remove('estado-reposo', 'estado-ambar', 'estado-rojo');

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,soil_moisture_0_to_1cm,is_day`;

    const resp = await fetchConReintentos(url, 3, 6000);

    if (!resp) {
        DOM.uiPercent.textContent = 'Error';
        DOM.uiAlert.textContent = t('errorDatosClima');
        if (DOM.uiAlert) DOM.uiAlert.dataset.estado = 'error';
        DOM.uiAction.innerHTML = '';
        return;
    }

    try {
        const data = await resp.json();

        if (data.elevation <= 0) {
            DOM.uiAlert.textContent = t('zonaAgua');
            DOM.uiAction.innerHTML = t('zonaAguaMsg');
            DOM.uiPercent.textContent = "N/A";
            DOM.uiTemp.textContent = `- °C`;
            DOM.uiHum.textContent = `- %`;
            DOM.uiWind.textContent = `- km/h`;
            if (DOM.uiWindDir) DOM.uiWindDir.textContent = `--`;
            if (DOM.uiPropagacion) DOM.uiPropagacion.textContent = '';
            DOM.logRY.textContent = t('simulacionNoIniciadaAgua');
            DOM.logCNOT.textContent = "";
            DOM.logMedicion.textContent = "";
            DOM.logDetalles.textContent = "";

            if (marcadorActivo) map.removeLayer(marcadorActivo);
            marcadorActivo = L.circleMarker([lat, lon], {
                radius: 14,
                fillColor: '#0077be',
                color: '#00c3ff',
                weight: 2.5,
                opacity: 0.9,
                fillOpacity: 0.6
            }).addTo(map).bindPopup(`<b>${t('popupZonaAgua')}</b><br><small>Elevación: ${data.elevation}m</small>`);
            window.ultimoContextoManolito = null;
            return;
        }

        const temp = data.current.temperature_2m;
        const hum = data.current.relative_humidity_2m;
        const wind = data.current.wind_speed_10m;
        const windDir = data.current.wind_direction_10m;
        const humedadSuelo = data.current.soil_moisture_0_to_1cm;
        const esDia = data.current.is_day === 1;

        DOM.uiTemp.textContent = `${temp} °C`;
        DOM.uiHum.textContent = `${hum} %`;
        DOM.uiWind.textContent = `${wind} km/h`;
        if (DOM.uiWindDir) DOM.uiWindDir.textContent = `${windDir}° (${gradosACardinal(windDir)})`;

        obtenerNombreLugar(lat, lon).then(lugar => {
            if (window.ultimoContextoManolito && window.ultimoContextoManolito.lat === lat && window.ultimoContextoManolito.lon === lon) {
                window.ultimoContextoManolito.lugar = lugar;
            }
        }).catch(() => {});

        obtenerContextoTerreno(lat, lon).then(terreno => {
            if (window.ultimoContextoManolito && window.ultimoContextoManolito.lat === lat && window.ultimoContextoManolito.lon === lon) {
                window.ultimoContextoManolito.vegetacion = terreno.vegetacion;
                window.ultimoContextoManolito.aguaCercana = terreno.aguaCercana;
            }
        }).catch(() => {});

        ejecutarMotorCuantico(lat, lon, temp, hum, wind, windDir, null, humedadSuelo, esDia);
    } catch (error) {
        console.error('[Clima] Error procesando respuesta:', error);
        DOM.uiPercent.textContent = 'Error';
        DOM.uiAlert.textContent = t('errorDatosClima');
        if (DOM.uiAlert) DOM.uiAlert.dataset.estado = 'error';
        DOM.uiAction.innerHTML = '';
    }
}

// 7a. AGRUPACIÓN Y PERÍMETRO ESTIMADO A PARTIR DE PUNTOS ACTIVOS
// Esto NO es un dato inventado: se calcula en directo a partir de los propios
// puntos reales de FIRMS. Cada vez que llegan detecciones nuevas del satélite,
// el contorno se vuelve a calcular y por tanto crece, se junta con otros focos
// o cambia de forma, igual que en las webs de seguimiento de incendios.

function distanciaHaversineMetros(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
}

// Agrupa puntos cercanos entre sí (radio en metros) en focos independientes
function agruparPuntosFuego(puntos, radioMetros = 4000) {
    const grupos = [];
    const visitado = new Array(puntos.length).fill(false);
    for (let i = 0; i < puntos.length; i++) {
        if (visitado[i]) continue;
        const grupo = [puntos[i]];
        visitado[i] = true;
        let cambiado = true;
        while (cambiado) {
            cambiado = false;
            for (let j = 0; j < puntos.length; j++) {
                if (visitado[j]) continue;
                for (const p of grupo) {
                    if (distanciaHaversineMetros(p.lat, p.lon, puntos[j].lat, puntos[j].lon) <= radioMetros) {
                        grupo.push(puntos[j]);
                        visitado[j] = true;
                        cambiado = true;
                        break;
                    }
                }
            }
        }
        grupos.push(grupo);
    }
    return grupos;
}

// Envolvente convexa (contorno exterior) de un grupo de puntos
function envolventeConvexa(puntos) {
    if (puntos.length < 3) return puntos;
    const pts = puntos.map(p => ({ x: p.lon, y: p.lat, orig: p }))
        .sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
    const cruz = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

    const inferior = [];
    for (const p of pts) {
        while (inferior.length >= 2 && cruz(inferior[inferior.length - 2], inferior[inferior.length - 1], p) <= 0) inferior.pop();
        inferior.push(p);
    }
    const superior = [];
    for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        while (superior.length >= 2 && cruz(superior[superior.length - 2], superior[superior.length - 1], p) <= 0) superior.pop();
        superior.push(p);
    }
    inferior.pop(); superior.pop();
    return inferior.concat(superior).map(p => p.orig);
}

// Ensancha ligeramente el contorno hacia fuera desde su centro, para que no
// pase justo pegado a los puntos y se vea como un perímetro real de incendio
function expandirDesdeCentroide(puntos, factor = 1.3) {
    const lat0 = puntos.reduce((s, p) => s + p.lat, 0) / puntos.length;
    const lon0 = puntos.reduce((s, p) => s + p.lon, 0) / puntos.length;
    return puntos.map(p => [lat0 + (p.lat - lat0) * factor, lon0 + (p.lon - lon0) * factor]);
}

function dibujarPerimetrosActivos(puntos) {
    grupoPerimetroFuegos.clearLayers();
    if (!puntos.length) return;

    const estiloPerimetro = {
        color: '#ffd500',
        weight: 2,
        fillColor: '#ff4500',
        fillOpacity: 0.15,
        dashArray: '4 4'
    };

    const grupos = agruparPuntosFuego(puntos, 4000);
    grupos.forEach(grupo => {
        if (grupo.length === 1) {
            L.circle([grupo[0].lat, grupo[0].lon], { ...estiloPerimetro, radius: 400 })
                .addTo(grupoPerimetroFuegos)
                .bindTooltip('Perímetro estimado a partir de detecciones activas');
        } else if (grupo.length === 2) {
            const [a, b] = grupo;
            const midLat = (a.lat + b.lat) / 2, midLon = (a.lon + b.lon) / 2;
            const radio = Math.max(500, distanciaHaversineMetros(a.lat, a.lon, b.lat, b.lon) / 2 + 300);
            L.circle([midLat, midLon], { ...estiloPerimetro, radius: radio })
                .addTo(grupoPerimetroFuegos)
                .bindTooltip('Perímetro estimado a partir de detecciones activas');
        } else {
            const hull = envolventeConvexa(grupo);
            const hullExpandido = expandirDesdeCentroide(hull, 1.3);
            L.polygon(hullExpandido, estiloPerimetro)
                .addTo(grupoPerimetroFuegos)
                .bindTooltip('Perímetro estimado a partir de detecciones activas (crece con nuevas detecciones)');
        }
    });
}

// 7b. PROCESADOR DE DATOS DE INCENDIOS
function procesarCsvFuegos(csv) {
    grupoFuegos.clearLayers();
    const lineas = csv.trim().split('\n');
    if (lineas.length <= 1) {
        DOM.contadorFuegos.textContent = t('ceroFuegosVisibles');
        grupoPerimetroFuegos.clearLayers();
        return 0;
    }

    let contador = 0;
    const puntosParaPerimetro = [];
    for (let i = 1; i < lineas.length; i++) {
        const cols = lineas[i].split(',');
        const lat = parseFloat(cols[0]);
        const lon = parseFloat(cols[1]);
        const brillo = parseFloat(cols[2]);
        const confianza = cols[9];

        if (isNaN(lat) || isNaN(lon)) continue;

        const color = confianza === 'h' ? '#ff4500' : (confianza === 'n' ? '#ffaa00' : '#ff0000');
        const marker = L.circleMarker([lat, lon], {
            radius: 7,
            fillColor: color,
            color: '#fff',
            weight: 1,
            fillOpacity: 0.8
        }).addTo(grupoFuegos);

        marker.bindPopup(`
            <b>${t('popupIncendioActivo')}</b><br>
            ${t('popupBrillo')}: ${brillo} K<br>
            ${t('popupConfianza')}: ${confianza}<br>
            <button class="evaluar-fuego-btn" data-lat="${lat}" data-lon="${lon}">${t('popupEvaluarRiesgo')}</button>
        `);

        puntosParaPerimetro.push({ lat, lon });
        contador++;
    }

    dibujarPerimetrosActivos(puntosParaPerimetro);
    return contador;
}

// 7. CAPA DE INCENDIOS ACTIVOS (NASA FIRMS)
let fuegosUltimaActualizacion = 0;

async function cargarFuegosActivos() {
    if (Date.now() - fuegosUltimaActualizacion < 10000 && grupoFuegos.getLayers().length > 0) return;

    try {
        const bounds = map.getBounds();
        const sur = bounds.getSouth();
        const oeste = bounds.getWest();
        const norte = bounds.getNorth();
        const este = bounds.getEast();

        const boundsParam = `${oeste},${sur},${este},${norte}`;
        const url = `/getFires?bounds=${boundsParam}`;

        const resp = await fetch(url);
        if (!resp.ok) throw new Error("FIRMS no respondió");
        const csv = await resp.text();

        const contador = procesarCsvFuegos(csv);

        if (contador > 0) {
            DOM.contadorFuegos.textContent = t('fuegosActivosDetectados', { count: contador });
        }
        fuegosUltimaActualizacion = Date.now();

    } catch (error) {
        console.error("Error cargando FIRMS:", error);
        procesarCsvFuegos(CSV_EJEMPLO_FUEGOS);
        DOM.contadorFuegos.textContent = t('errorFirmsDev');
        fuegosUltimaActualizacion = Date.now();
    }
}

// 8. INTERACTIVIDAD DE LA INTERFAZ Y LÓGICA LEGAL
function setupUIInteractions() {
    DOM.toggleDashboardBtn.addEventListener('click', function () {
        DOM.dashboard.classList.add('closed');
        DOM.reopenDashboardBtn.style.display = 'block';
    });

    DOM.reopenDashboardBtn.addEventListener('click', function () {
        DOM.dashboard.classList.remove('closed');
        this.style.display = 'none';
    });

    if (DOM.toggleModeBtn) {
        DOM.toggleModeBtn.addEventListener('click', function () {
            DOM.dashboard.classList.toggle('mode-citizen');
            const isCitizenMode = DOM.dashboard.classList.contains('mode-citizen');
            this.textContent = isCitizenMode ? t('modoCientifico') : t('modoCiudadano');
            this.title = isCitizenMode ? t('titleModoCiencia') : t('titleModoCiudadano');
        });
    }

    if (DOM.quantumLogSection) {
        const logHeader = DOM.quantumLogSection.querySelector('h2');
        if (logHeader) {
            logHeader.addEventListener('click', () => {
                DOM.quantumLogSection.classList.toggle('section-collapsed');
            });
            logHeader.style.cursor = 'pointer';
            logHeader.title = t('titleColapsar');
        }
    }

    const debouncedObtenerDatosClimaticos = debounce(function (e) {
        obtenerDatosClimaticos(e.latlng.lat, e.latlng.lng);
    }, 500);
    map.on('click', debouncedObtenerDatosClimaticos);

    map.getContainer().addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('evaluar-fuego-btn')) {
            const lat = parseFloat(e.target.dataset.lat);
            const lon = parseFloat(e.target.dataset.lon);
            obtenerDatosClimaticos(lat, lon);
            map.closePopup();
        }
    });

    map.on('load moveend zoomend', cargarFuegosActivos);
}

async function initLegalNotice() {
    const hideModal = () => { DOM.legalModal.style.display = 'none'; };
    const showModal = () => { DOM.legalModal.style.display = 'flex'; };

    try {
        const response = await fetch('legal.html');
        if (!response.ok) throw new Error('No se pudo cargar el aviso legal.');
        const legalHTML = await response.text();
        DOM.legalContentContainer.innerHTML = legalHTML;
    } catch (error) {
        console.error(error);
        DOM.legalContentContainer.innerHTML = `<p>${t('errorCargaLegal')}</p>`;
    }

    DOM.acceptLegalBtn.addEventListener('click', () => {
        localStorage.setItem('manolitoLegalAccepted', 'true');
        hideModal();
    });
    DOM.modalCloseBtn.addEventListener('click', hideModal);
    DOM.openLegalLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModal();
    });

    if (localStorage.getItem('manolitoLegalAccepted') !== 'true') {
        showModal();
    }
}

// 9. INICIO DE LA APLICACIÓN
document.addEventListener('DOMContentLoaded', () => {
    if (DOM.uiAlert) DOM.uiAlert.dataset.estado = 'inicial';
    initLegalNotice();
    setupUIInteractions();
    cargarFuegosActivos();
});
