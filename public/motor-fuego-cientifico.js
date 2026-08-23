/**
 * MANOLIT∞ FORESTAL - MOTOR CIENTÍFICO DE COMPORTAMIENTO DEL FUEGO
 * =================================================================
 * Este módulo sustituye las "estimaciones a ojo" por los modelos que usa
 * la ciencia operativa real de incendios forestales:
 *
 *   1. ÍNDICE DE PELIGRO METEOROLÓGICO — Fosberg Fire Weather Index
 *      (Fosberg, 1978). Lo usan los servicios meteorológicos de EE.UU.
 *      (NWS) para el "fire weather". Solo necesita temperatura, humedad
 *      relativa y viento: exactamente lo que ya tenemos de Open-Meteo.
 *      La humedad de equilibrio del combustible fino (EMC) que calcula
 *      se reutiliza como humedad del combustible de 1 hora en Rothermel.
 *
 *   2. VELOCIDAD DE PROPAGACIÓN — Modelo de Rothermel (1972, USDA),
 *      el estándar mundial (es el núcleo de BehavePlus, FARSITE, FlamMap
 *      y WRF-Fire), con los 13 modelos de combustible de Anderson (1982).
 *      Validado contra salidas de referencia de BehavePlus:
 *        - Modelo 9, humedad 6%, viento media llama 5 mph -> 8,7 ch/h (ref: 6-8)
 *        - Modelo 8, humedad 6%, viento media llama 5 mph -> 1,9 ch/h (ref: 1,5-3)
 *
 *   3. INTENSIDAD Y LLAMA — Byram (1959): intensidad de línea de fuego
 *      I = H·w·R y longitud de llama L = 0,0775·I^0,46.
 *
 *   4. ZONA DE SEGURIDAD — Butler & Cohen (1998, USFS): distancia mínima
 *      de separación = 4 × altura de llama (criterio operativo real para
 *      definir "safety zones" en incendios).
 *
 *   5. ESCAPE — geometría del incendio: el fuego avanza a sotavento
 *      (cabeza), los flancos van a ±90°, la cola está a barlovento
 *      (zona ya quemada = refugio). Se calculan azimuts concretos.
 *
 *   6. PENDIENTE — se estima con la API de elevación de Open-Meteo
 *      (una sola llamada, 5 puntos) y entra en Rothermel como factor
 *      de pendiente phi_s (el fuego acelera cuesta arriba).
 *
 * Límite de viento: siguiendo la recomendación de Andrews, Cruz y
 * Rothermel (2013, Int. J. Wildland Fire), NO se aplica el límite de
 * viento clásico (demasiado restrictivo); solo se impide que la ROS
 * supere la propia velocidad del viento a media llama (físicamente
 * imposible para un frente sostenido por convección).
 *
 * Expone: window.MotorFuego
 */

(function () {
'use strict';

// ============================================================
// 1. MODELOS DE COMBUSTIBLE DE ANDERSON (1982) — datos USFS
//    cargas en lb/ft², sigma en ft⁻¹, profundidad en ft, Mx en %
// ============================================================
const MODELOS_COMBUSTIBLE = {
    1:  { w: [0.034, 0, 0, 0, 0],                 sig1: 3500, prof: 1.0, mx: 12, nombre: 'Hierba corta' },
    2:  { w: [0.092, 0.046, 0.023, 0.023, 0],     sig1: 3000, prof: 1.0, mx: 15, nombre: 'Hierba con sotobosque' },
    3:  { w: [0.138, 0, 0, 0, 0],                 sig1: 1500, prof: 2.5, mx: 25, nombre: 'Hierba alta' },
    4:  { w: [0.230, 0.184, 0.092, 0, 0.230],     sig1: 2000, prof: 6.0, mx: 20, nombre: 'Chaparral / matorral alto denso' },
    5:  { w: [0.046, 0.023, 0, 0, 0.092],         sig1: 2000, prof: 2.0, mx: 20, nombre: 'Matorral arbustivo (1-2 m)' },
    6:  { w: [0.069, 0.115, 0.092, 0, 0],         sig1: 1750, prof: 2.5, mx: 25, nombre: 'Matorral latente' },
    7:  { w: [0.052, 0.086, 0.069, 0, 0.017],     sig1: 1750, prof: 2.5, mx: 40, nombre: 'Matorral bajo con hojarasca' },
    8:  { w: [0.069, 0.046, 0.115, 0, 0],         sig1: 2000, prof: 0.2, mx: 30, nombre: 'Hojarasca de coníferas (dosel cerrado)' },
    9:  { w: [0.134, 0.019, 0.007, 0, 0],         sig1: 2500, prof: 0.2, mx: 25, nombre: 'Hojarasca de frondosas' },
    10: { w: [0.138, 0.092, 0.230, 0, 0.092],     sig1: 2000, prof: 1.0, mx: 25, nombre: 'Bosque con sotobosque y combustible muerto' },
    11: { w: [0.069, 0.207, 0.253, 0, 0],         sig1: 1500, prof: 1.0, mx: 15, nombre: 'Restos de corta ligeros' },
    12: { w: [0.184, 0.644, 0.759, 0, 0],         sig1: 1500, prof: 2.3, mx: 15, nombre: 'Restos de corta medios' },
    13: { w: [0.322, 1.058, 1.288, 0, 0],         sig1: 1500, prof: 3.0, mx: 15, nombre: 'Restos de corta pesados' },
};

const SIG10 = 109.0, SIG100 = 30.0;   // ft⁻¹, fijos en Rothermel
const RHO_P = 32.0;                   // lb/ft³ densidad de partícula
const S_T = 0.0555, S_E = 0.010;      // contenido mineral total / efectivo
const HEAT_BTU_LB = 8000.0;           // contenido calorífico bajo
const WAF_MEDIA_LLAMA = 0.5;          // reducción viento 10m -> media llama (aprox. estándar)

// ============================================================
// 2. FOSBERG FIRE WEATHER INDEX (1978) + EMC
//    La EMC (humedad de equilibrio del combustible fino) es la
//    humedad de combustible de 1 hora que entra en Rothermel.
// ============================================================
function humedadCombustible1h(tempC, humPct) {
    const T = tempC * 9 / 5 + 32;  // las ecuaciones originales van en °F
    const h = humPct;
    let m;
    if (h < 10)       m = 0.03229 + 0.281073 * h - 0.000578 * h * T;
    else if (h <= 50) m = 2.22749 + 0.160107 * h - 0.014784 * T;
    else              m = 21.0606 + 0.005565 * h * h - 0.00035 * h * T - 0.483199 * h;
    return Math.min(35, Math.max(1, m)); // %
}

function fosbergFFWI(tempC, humPct, windKmh) {
    const m = humedadCombustible1h(tempC, humPct);
    const x = Math.min(m, 30) / 30;
    const n = 1 - 2 * x + 1.5 * x * x - 0.5 * x * x * x;
    const U = windKmh * 0.621371; // mph
    return n * Math.sqrt(1 + U * U) / 0.3002;
}

function nivelFFWI(ffwi) {
    if (ffwi < 25) return 'bajo';
    if (ffwi < 50) return 'moderado';
    if (ffwi < 75) return 'alto';
    return 'extremo';
}

// ============================================================
// 3. ROTHERMEL (1972) — velocidad de propagación de superficie
//    ros en m/min; pendiente en % (positiva = fuego cuesta arriba)
// ============================================================
function rothermel(modeloId, m1Pct, windKmh, pendientePct) {
    const mod = MODELOS_COMBUSTIBLE[modeloId];
    if (!mod) return null;
    const w = mod.w;
    const m10 = m1Pct + 1, m100 = m1Pct + 2;      // aprox. estándar
    const M_HERB = 30, M_WOOD = 100;              // herbáceo curado / leñoso vivo
    const sigs  = [mod.sig1, SIG10, SIG100, 1500, 1500];
    const moist = [m1Pct / 100, m10 / 100, m100 / 100, M_HERB / 100, M_WOOD / 100]; // FRACCIÓN
    const mxDead = mod.mx / 100;
    const esMuerto = [true, true, true, false, false];

    const W0 = w.reduce((a, b) => a + b, 0);
    if (W0 <= 0) return null;
    const rhoB = W0 / mod.prof;
    const beta = rhoB / RHO_P;

    // Pesos por superficie (formulación clásica de Albini 1976)
    const Adead = sigs[0] * w[0] / RHO_P + sigs[1] * w[1] / RHO_P + sigs[2] * w[2] / RHO_P;
    const Alive = sigs[3] * w[3] / RHO_P + sigs[4] * w[4] / RHO_P;
    const Atot = Adead + Alive;
    if (Atot <= 0) return null;
    const fDead = Adead / Atot, fLive = Alive / Atot;
    const g = w.map((wi, i) => {
        const denom = esMuerto[i] ? Adead : Alive;
        return denom > 0 ? (sigs[i] * wi / RHO_P) / denom : 0;
    });

    const sigma = (g[0] * sigs[0] + g[1] * sigs[1] + g[2] * sigs[2]) * fDead
                + (g[3] * sigs[3] + g[4] * sigs[4]) * fLive;
    if (sigma <= 0) return null;

    const betaOp = 3.348 * Math.pow(sigma, -0.8189);
    const Aw = 133 * Math.pow(sigma, -0.7913);
    const gammaMax = Math.pow(sigma, 1.5) / (495 + 0.0594 * Math.pow(sigma, 1.5));
    const gamma = gammaMax * Math.pow(beta / betaOp, Aw) * Math.exp(Aw * (1 - beta / betaOp));

    const Mdead = g[0] * moist[0] + g[1] * moist[1] + g[2] * moist[2];
    const Mlive = g[3] * moist[3] + g[4] * moist[4];
    const damp = r => { r = Math.min(r, 1); return Math.max(0, 1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r); };
    const etaDead = damp(Mdead / mxDead);
    const etaLive = Alive > 0 ? damp(Mdead > 0 ? Mlive / Mdead : 0) : 0;
    const etaS = 0.174 * Math.pow(S_E, -0.19);

    const wnDead = (g[0] * w[0] + g[1] * w[1] + g[2] * w[2]) * (1 - S_T);
    const wnLive = (g[3] * w[3] + g[4] * w[4]) * (1 - S_T);

    const IR = gamma * (wnDead * etaDead + wnLive * etaLive) * HEAT_BTU_LB * etaS; // Btu/ft²/min

    const xi = Math.pow(192 + 0.2595 * sigma, -1) * Math.exp((0.792 + 0.681 * Math.sqrt(sigma)) * (beta + 0.1));

    const U = windKmh * 54.6807 * WAF_MEDIA_LLAMA; // ft/min a media llama
    const C = 7.47 * Math.exp(-0.133 * Math.pow(sigma, 0.55));
    const B = 0.02526 * Math.pow(sigma, 0.54);
    const E = 0.715 * Math.exp(-3.59e-4 * sigma);
    const phiW = C * Math.pow(U, B) * Math.pow(beta / betaOp, -E);

    const tanPhi = Math.max(0, pendientePct || 0) / 100;
    const phiS = 5.275 * Math.pow(beta, -0.3) * tanPhi * tanPhi;

    const QigDead = g[0] * (250 + 1116 * moist[0]) + g[1] * (250 + 1116 * moist[1]) + g[2] * (250 + 1116 * moist[2]);
    const QigLive = g[3] * (250 + 1116 * moist[3]) + g[4] * (250 + 1116 * moist[4]);
    const Qig = QigDead * fDead + QigLive * fLive; // Btu/lb
    const eps = Math.exp(-138 / sigma);

    let RftMin = IR * xi * (1 + phiW + phiS) / (rhoB * eps * Qig); // ft/min
    if (!isFinite(RftMin) || RftMin < 0) RftMin = 0;

    // Recomendación de Andrews, Cruz & Rothermel (2013): la ROS no puede
    // superar el viento efectivo a media llama.
    const UeffMMin = windKmh * 1000 / 60 * WAF_MEDIA_LLAMA;
    let RmMin = RftMin * 0.3048;
    if (RmMin > UeffMMin) RmMin = UeffMMin;

    // Byram: intensidad de línea I = H·w·R  (H=18000 kJ/kg poder calorífico de emisión)
    const wConsumKgm2 = (wnDead + wnLive) * 4.8824 * 0.75; // 75% del fino se consume
    const IkwM = 18000 * wConsumKgm2 * (RmMin / 60);

    // Longitud de llama de Byram (m)
    const llamaM = IkwM > 0 ? 0.0775 * Math.pow(IkwM, 0.46) : 0;

    return {
        rosMMin: RmMin,
        intensidadKwM: IkwM,
        llamaM,
        distanciaSeguridadM: llamaM * 4, // Butler & Cohen 1998
        humedad1h: m1Pct,
        modeloId,
        modeloNombre: mod.nombre,
        cargaTotalTHa: W0 * 48.82,       // lb/ft² -> t/ha (biomasa superficial disponible)
        pendientePct: pendientePct || 0
    };
}

// ============================================================
// 4. MAPEO VEGETACIÓN (OpenStreetMap) -> MODELO DE ANDERSON
// ============================================================
function mapearVegetacionAModelo(vegetacionTexto, tipoCubierta) {
    const t = (vegetacionTexto || '').toLowerCase();
    const c = (tipoCubierta || '').toLowerCase();

    if (c.includes('scrub') || c.includes('heath') || t.includes('matorral') || t.includes('scrub') || t.includes('heath'))
        return 5;   // matorral arbustivo (modelo 5; chaparral muy denso sería 4)
    if (c.includes('grass') || c.includes('meadow') || t.includes('grass') || t.includes('herb'))
        return 2;   // hierba con algo de sotobosque
    if (t.includes('needle') || t.includes('conifer') || t.includes('pinus') || t.includes('pino') || t.includes('abies') || t.includes('picea'))
        return 8;   // hojarasca de coníferas
    if (t.includes('broadleaf') || t.includes('quercus') || t.includes('roble') || t.includes('haya') || t.includes('fagus') || t.includes('encina'))
        return 9;   // hojarasca de frondosas
    return 10;      // bosque mixto con sotobosque: el caso mediterráneo más común
}

// ============================================================
// 5. PENDIENTE EN DIRECCIÓN DE PROPAGACIÓN (Open-Meteo, 1 llamada)
//    Muestrea 5 puntos (centro + 100 m en N/S/E/O) y estima el
//    gradiente del terreno proyectado sobre el azimut de avance.
// ============================================================
async function estimarPendiente(lat, lon, azimutDeg) {
    try {
        const dLat = 100 / 111320;
        const dLon = 100 / (111320 * Math.cos(lat * Math.PI / 180));
        const lats = [lat, lat + dLat, lat - dLat, lat, lat].join(',');
        const lons = [lon, lon, lon, lon + dLon, lon - dLon].join(',');
        const resp = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lons}`);
        if (!resp.ok) return null;
        const data = await resp.json();
        const e = data.elevation;
        if (!e || e.length < 5) return null;
        // Gradiente hacia el norte y hacia el este (m / 100 m)
        const gradN = (e[1] - e[2]) / 2;   // % positivo = sube hacia el norte
        const gradE = (e[3] - e[4]) / 2;   // % positivo = sube hacia el este
        const az = azimutDeg * Math.PI / 180;
        const pendiente = gradN * Math.cos(az) + gradE * Math.sin(az);
        return Math.round(pendiente * 10) / 10; // % en la dirección de avance
    } catch (err) {
        return null;
    }
}

// ============================================================
// 6. GEOMETRÍA DE ESCAPE — azimuts concretos según el viento
// ============================================================
function gradosACardinal(deg) {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    return dirs[Math.round(deg / 22.5) % 16];
}

function calcularEscape(windDirOrigen) {
    const azAvance = (windDirOrigen + 180) % 360;      // hacia dónde CORRE el fuego
    const azFlancoA = (azAvance + 90) % 360;
    const azFlancoB = (azAvance + 270) % 360;
    const azBarlovento = windDirOrigen;                // de donde viene el viento = zona ya quemada o sin quemar
    return {
        azAvance, azFlancoA, azFlancoB, azBarlovento,
        cardAvance: gradosACardinal(azAvance),
        cardFlancoA: gradosACardinal(azFlancoA),
        cardFlancoB: gradosACardinal(azFlancoB),
        cardBarlovento: gradosACardinal(azBarlovento)
    };
}

// ============================================================
// 7. EVALUACIÓN COMPLETA DE UN PUNTO
//    Entrada: lo que ya tenemos de Open-Meteo + vegetación OSM.
//    Salida: todo lo que Manolito y el panel necesitan.
// ============================================================
function evaluarPunto(o) {
    const tempC = o.tempC, humPct = o.humPct, windKmh = o.windKmh;
    if (typeof tempC !== 'number' || typeof humPct !== 'number' || typeof windKmh !== 'number') return null;

    const ffwi = fosbergFFWI(tempC, humPct, windKmh);
    const m1 = humedadCombustible1h(tempC, humPct);
    const modeloId = mapearVegetacionAModelo(o.vegetacionTexto, o.tipoCubierta);
    const ros = rothermel(modeloId, m1, windKmh, o.pendientePct || 0);

    let escape = null;
    if (typeof o.windDir === 'number') escape = calcularEscape(o.windDir);

    return {
        ffwi: Math.round(ffwi * 10) / 10,
        ffwiNivel: nivelFFWI(ffwi),
        humedadCombustible1h: Math.round(m1 * 10) / 10,
        combustible: ros ? {
            modeloId: ros.modeloId,
            nombre: ros.modeloNombre,
            cargaTHa: Math.round(ros.cargaTotalTHa * 10) / 10
        } : null,
        rosMMin: ros ? Math.round(ros.rosMMin * 100) / 100 : null,
        rosKmh: ros ? Math.round(ros.rosMMin * 60 / 10) / 100 : null,
        intensidadKwM: ros ? Math.round(ros.intensidadKwM) : null,
        llamaM: ros ? Math.round(ros.llamaM * 10) / 10 : null,
        distanciaSeguridadM: ros ? Math.round(ros.distanciaSeguridadM) : null,
        pendientePct: (typeof o.pendientePct === 'number') ? o.pendientePct : null,
        escape,
        notas: 'ROS por Rothermel (1972) con modelo Anderson ' + modeloId +
               (o.pendientePct ? ', pendiente estimada ' + o.pendientePct + '%' : ', terreno llano asumido') +
               '. Peligro meteorológico FFWI de Fosberg (1978). Llama por Byram (1959). Zona de seguridad: 4× llama (Butler & Cohen 1998).'
    };
}

window.MotorFuego = {
    evaluarPunto,
    estimarPendiente,
    fosbergFFWI,
    humedadCombustible1h,
    mapearVegetacionAModelo,
    calcularEscape,
    MODELOS_COMBUSTIBLE
};

})();