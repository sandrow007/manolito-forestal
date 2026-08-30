/**
 * MANOLIT∞ FORESTAL - BANDAS ESTIMADAS DE PROPAGACIÓN DE INCENDIO
 * =================================================================
 * Dibuja 3 bandas elípticas concéntricas (t+2h, t+6h, t+12h) desde el
 * último punto evaluado, usando la ROS real del motor científico
 * (Rothermel 1972, window.MotorFuego) y el viento actual.
 *
 * MODELO: elipse estándar de propagación (Anderson 1983 / Alexander 1985,
 * "simple ellipse model", el mismo que usa la literatura operativa de
 * FARSITE para formas de fuego):
 *
 *   - La dirección del eje mayor es la de AVANCE del fuego = viento
 *     hacia sotavento: azAvance = (windDirOrigen + 180) % 360.
 *   - Distancia de cabeza (head fire) en t minutos:
 *         head_m = rosMMin * t
 *   - Distancia de cola (back fire): fracción del head según el viento
 *     U (km/h):  ratio = clamp(0.5 - 0.005*U, 0.3, 0.5)
 *     (con viento fuerte la cola avanza proporcionalmente menos; en
 *     calma la forma tiende a circular y back->0.5*head por asimetría
 *     de encendido puntual).
 *   - Relación longitud/anchura: LB = clamp(1 + 0.25 * U, 1, 8)
 *     (forma canónica de Anderson 1983 / Finney; LB=1 con calma,
 *     ~2-3 con viento moderado, acotado a 8 para no producir agujas
 *     irreales con vendavales).
 *   - Longitud total L = head + back; semiejes:
 *         a = L / 2            (semieje mayor)
 *         b = L / (2 * LB)     (semieje menor)
 *         offset = (head - back) / 2   (centro desplazado a sotavento:
 *                                       el punto de ignición NO es el
 *                                       centro geométrico de la elipse)
 *
 * APROXIMACIONES (¡estimación simplificada, NO herramienta operativa!):
 *   1. ROS constante durante todo el horizonte: ignora el ciclo
 *      diario, cambios de viento, agotamiento/curado del combustible
 *      y los cortafuegos naturales (ríos, carreteras, roquedo).
 *   2. Viento constante en velocidad y dirección durante 12 h.
 *   3. No modela aceleración inicial del fuego (point-ignition
 *      acceleration): las primeras horas reales son algo menores.
 *   4. No modela antorchas, fuego de copas ni focos secundarios
 *      (spotting), que en episodios extremos adelantan mucho el frente.
 *   5. La pendiente ya entra en la ROS vía Rothermel, pero se asume
 *      uniforme en todas las direcciones de la elipse.
 *
 * INTEGRACIÓN:
 *   - Mapa Leaflet: el módulo intenta obtenerlo así, por este orden:
 *       1. Captura la instancia en el constructor L.Map si este script
 *          se carga ANTES de motor-cuantico.js (recomendado).
 *       2. window.MANOLITO_MAPA (si el integrador lo expone).
 *       3. Evento 'manolitoforestal:mapa-listo' con detail = map.
 *     Hay un retry loop (máx ~10 s) hasta tener mapa y DOM listos.
 *   - El integrador debe llamar tras cada evaluación:
 *       window.bandasPropagacion.actualizar(lat, lng, datosMotor)
 *     (ver bandas.integracion.md para el formato exacto de datosMotor).
 *
 * Expone UN solo hook: window.bandasPropagacion =
 *   { actualizar(lat, lng, datosMotor), limpiar(), visibles(), toggle() }
 *
 * Licencia: AGPL (como el resto del proyecto).
 */

(function () {
'use strict';

// ============================================================
// 1. CONSTANTES DEL MODELO
// ============================================================
const BANDAS = [
    { horas: 12, color: '#ffe600' },  // AMARILLO - se dibuja primero (al fondo)
    { horas: 6,  color: '#ffaa00' },  // NARANJA
    { horas: 2,  color: '#ff003c' }   // ROJO - se dibuja último (encima)
];
const FILL_OPACITY = 0.15;
const MAX_VERTICES = 64;        // rendimiento móvil
const RADIO_TIERRA_KM = 6371;

// ============================================================
// 2. I18N — usa la t() global de idiomas.js si existe
//    (idiomas.js: 6 idiomas es/ca/eu/gl/en/fr, t(clave, params)).
//    Si falta la clave o la función, cae a este diccionario (es).
// ============================================================
const FALLBACK = {
    bandasTituloToggle: 'Mostrar/ocultar bandas de propagación estimada',
    bandasTooltip: 't+{h}h ≈ {km} km (cabeza de fuego)',
    bandasAviso: 'Estimación simplificada: viento y velocidad constantes. No usar para decisiones operativas.'
};
function tr(clave, params) {
    let s;
    if (typeof window.t === 'function') {
        s = window.t(clave, params || {});
        if (typeof s === 'string' && s !== clave) return s;
    }
    s = FALLBACK[clave] || clave;
    if (params) {
        Object.keys(params).forEach(k => {
            s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), String(params[k]));
        });
    }
    return s;
}

// ============================================================
// 3. GEODESIA — destino sobre la esfera (misma fórmula que
//    destinoDesdeAzimut de motor-cuantico.js, autocontenida aquí)
// ============================================================
function destinoDesdeAzimut(lat, lon, azimutDeg, distanciaKm) {
    const brng = azimutDeg * Math.PI / 180;
    const lat1 = lat * Math.PI / 180;
    const lon1 = lon * Math.PI / 180;
    const d = distanciaKm / RADIO_TIERRA_KM;
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) +
        Math.cos(lat1) * Math.sin(d) * Math.cos(brng));
    const lon2 = lon1 + Math.atan2(
        Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
        Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
    );
    return [lat2 * 180 / Math.PI, lon2 * 180 / Math.PI];
}

// ============================================================
// 4. GEOMETRÍA DE LA ELIPSE DE FUEGO
//    Devuelve vértices [lat, lon] (<= MAX_VERTICES) y distancias.
//    El punto (lat, lon) es el foco de ignición; el centro de la
//    elipse está desplazado a sotavento (head > back).
// ============================================================
function calcularElipse(lat, lon, rosMMin, minutos, windKmh, windDirOrigen) {
    const headM = Math.max(0, rosMMin) * minutos;
    if (headM <= 0) return null;

    const U = Math.max(0, windKmh || 0);
    const LB = Math.min(8, Math.max(1, 1 + 0.25 * U));            // Anderson/Finney
    const ratioBack = Math.min(0.5, Math.max(0.3, 0.5 - 0.005 * U));
    const backM = headM * ratioBack;

    const longitudM = headM + backM;
    const a = longitudM / 2;                   // semieje mayor (m)
    const b = longitudM / (2 * LB);            // semieje menor (m)
    const offsetM = (headM - backM) / 2;       // desplazamiento del centro

    const azAvance = (typeof windDirOrigen === 'number' && !isNaN(windDirOrigen))
        ? (windDirOrigen + 180) % 360
        : 0; // sin viento: forma circular hacia el norte (LB=1 => b=a)

    // Centro de la elipse desplazado a sotavento
    const centro = destinoDesdeAzimut(lat, lon, azAvance, offsetM / 1000);

    // Proyección local en grados: lon ajustado por cos(lat)
    const lat0 = centro[0] * Math.PI / 180;
    const mPorGradoLat = 111320;
    const mPorGradoLon = 111320 * Math.cos(lat0) || 1e-6;
    const azRad = azAvance * Math.PI / 180;

    const vertices = [];
    const N = Math.min(MAX_VERTICES, 64);
    for (let i = 0; i < N; i++) {
        const th = (2 * Math.PI * i) / N;
        // x = a lo largo del eje mayor (dirección de avance), y = perpendicular
        const x = a * Math.cos(th);   // +x = hacia cabeza
        const y = b * Math.sin(th);
        // Rotar: x apunta al azimut azAvance (componentes N y E)
        const norteM = x * Math.cos(azRad) - y * Math.sin(azRad);
        const esteM  = x * Math.sin(azRad) + y * Math.cos(azRad);
        vertices.push([
            centro[0] + norteM / mPorGradoLat,
            centro[1] + esteM / mPorGradoLon
        ]);
    }
    return { vertices, headM, backM, LB };
}

// ============================================================
// 5. ESTADO Y RENDERIZADO
// ============================================================
let mapa = null;
let grupoBandas = null;        // L.layerGroup con las 3 bandas
let capaAviso = null;          // marcador del aviso "estimación simplificada"
let botonToggle = null;
let visible = true;
let ultimaEvaluacion = null;   // { lat, lng, datos } para redibujar al reactivar

function asegurarGrupo() {
    if (!grupoBandas) grupoBandas = L.layerGroup();
    if (visible && mapa && !mapa.hasLayer(grupoBandas)) grupoBandas.addTo(mapa);
}

function limpiarCapas() {
    if (grupoBandas) grupoBandas.clearLayers();
    if (capaAviso && mapa) { mapa.removeLayer(capaAviso); capaAviso = null; }
}

function renderizar(lat, lng, datos) {
    if (!mapa) return;
    limpiarCapas();
    ultimaEvaluacion = { lat, lng, datos };

    const rosMMin = Number(datos.rosMMin);
    if (!isFinite(rosMMin) || rosMMin <= 0) return; // sin propagación: nada que dibujar

    asegurarGrupo();

    // De mayor a menor para que las tres se vean (12h al fondo)
    BANDAS.forEach(banda => {
        const el = calcularElipse(lat, lng, rosMMin, banda.horas * 60,
                                  datos.windKmh, datos.windDir);
        if (!el) return;
        const km = (el.headM / 1000);
        const kmTxt = km >= 10 ? km.toFixed(0) : km.toFixed(1);
        const poligono = L.polygon(el.vertices, {
            color: banda.color,
            weight: 2,
            opacity: 0.95,
            fillColor: banda.color,
            fillOpacity: FILL_OPACITY,
            interactive: true
        });
        poligono.bindTooltip(
            tr('bandasTooltip', { h: banda.horas, km: kmTxt }),
            {
                permanent: true,
                direction: 'center',
                className: 'banda-propagacion-tooltip',
                interactive: false
            }
        );
        poligono.addTo(grupoBandas);
    });

    // Aviso "estimación simplificada" junto al punto de ignición
    capaAviso = L.marker([lat, lng], {
        interactive: true,
        keyboard: true,
        icon: L.divIcon({
            className: 'banda-aviso-icono',
            html: '<span aria-hidden="true" style="font-size:18px">⚠️</span>',
            iconSize: [24, 24],
            iconAnchor: [12, 30]
        }),
        title: tr('bandasAviso')
    });
    capaAviso.bindTooltip(tr('bandasAviso'), { direction: 'top' });
    if (visible) capaAviso.addTo(mapa);
}

// ============================================================
// 6. CAPTURA DEL MAPA LEAFLET
//    motor-cuantico.js guarda el mapa en una `const` local: no es
//    accesible desde fuera. Tres vías (documentadas para el integrador):
//      a) Parche del constructor L.Map si cargamos antes que el motor
//         (el <script> debe ir ANTES de motor-cuantico.js).
//      b) window.MANOLITO_MAPA expuesta por el integrador.
//      c) Evento 'manolitoforestal:mapa-listo' (e.detail = mapa).
// ============================================================
function capturarMapa(m) { if (m && !mapa) { mapa = m; onMapaListo(); } }

if (window.L && window.L.Map && window.L.Map.prototype && !window.L.Map.__manolitoParcheado) {
    const addInitHookOriginal = window.L.Map.prototype.addInitHook;
    // Vía más segura: envolver el constructor
    const MapOriginal = window.L.Map;
    window.L.Map = function (id, options) {
        const instancia = new MapOriginal(id, options);
        capturarMapa(instancia);
        return instancia;
    };
    window.L.Map.prototype = MapOriginal.prototype;
    window.L.Map.__manolitoParcheado = true;
    // L.map() es factoría: también la envolvemos
    const factoriaOriginal = window.L.map;
    window.L.map = function (id, options) {
        const instancia = factoriaOriginal(id, options);
        capturarMapa(instancia);
        return instancia;
    };
}

window.addEventListener('manolitoforestal:mapa-listo', function (e) {
    capturarMapa(e && e.detail);
});

// Retry loop: DOM + mapa (máx 40 intentos x 250 ms = 10 s)
let intentosMapa = 0;
const reintento = setInterval(function () {
    intentosMapa++;
    if (!mapa && window.MANOLITO_MAPA) capturarMapa(window.MANOLITO_MAPA);
    if (mapa || intentosMapa >= 40) {
        if (mapa || intentosMapa >= 40) clearInterval(reintento);
        if (mapa) asegurarBoton();
        else console.warn('[bandas-propagacion] No se encontró el mapa Leaflet. ' +
            'Expón window.MANOLITO_MAPA o carga este script antes de motor-cuantico.js.');
    }
}, 250);

function onMapaListo() {
    asegurarBoton();
    if (ultimaEvaluacion) {
        renderizar(ultimaEvaluacion.lat, ultimaEvaluacion.lng, ultimaEvaluacion.datos);
    }
}

// ============================================================
// 7. BOTÓN TOGGLE — accesible, >=48px, abajo-izquierda
//    (no colisiona: zoom arriba-izq, idioma arriba-izq compensado,
//     dashboard arriba-der, capas + chat abajo-der)
// ============================================================
function inyectarCss() {
    if (document.getElementById('bandas-propagacion-css')) return;
    const style = document.createElement('style');
    style.id = 'bandas-propagacion-css';
    style.textContent = [
        '#bandas-toggle{position:absolute;left:12px;bottom:96px;z-index:600;',
        'min-width:48px;min-height:48px;width:52px;height:52px;border-radius:10px;',
        'border:1px solid rgba(255,255,255,.12);background:rgba(14,19,28,.88);',
        'color:#ffe600;font-size:24px;line-height:1;cursor:pointer;',
        'display:flex;align-items:center;justify-content:center;',
        'backdrop-filter:blur(8px);touch-action:manipulation;}',
        '#bandas-toggle:hover,#bandas-toggle:focus-visible{outline:2px solid #ffe600;outline-offset:2px;}',
        '#bandas-toggle[aria-pressed="false"]{opacity:.55;}',
        '.banda-propagacion-tooltip{background:rgba(14,19,28,.9);color:#e6ecf2;',
        'border:1px solid rgba(255,255,255,.25);border-radius:6px;',
        'font:600 11px Inter,sans-serif;box-shadow:none;}',
        '.banda-propagacion-tooltip:before{display:none;}',
        '@media (max-width:640px){#bandas-toggle{bottom:120px;left:10px;}}'
    ].join('');
    document.head.appendChild(style);
}

function asegurarBoton() {
    if (botonToggle || !document.body) return;
    inyectarCss();
    botonToggle = document.createElement('button');
    botonToggle.id = 'bandas-toggle';
    botonToggle.type = 'button';
    botonToggle.setAttribute('aria-pressed', String(visible));
    botonToggle.setAttribute('aria-label', tr('bandasTituloToggle'));
    botonToggle.title = tr('bandasTituloToggle');
    botonToggle.textContent = '🔥';
    botonToggle.addEventListener('click', function () { api.toggle(); });
    document.body.appendChild(botonToggle);

    // Si el idioma cambia en caliente, re-etiquetar
    window.addEventListener('manolitoforestal:idioma-cambiado', function () {
        if (botonToggle) {
            botonToggle.setAttribute('aria-label', tr('bandasTituloToggle'));
            botonToggle.title = tr('bandasTituloToggle');
        }
    });
}

// ============================================================
// 8. API PÚBLICA (único hook window.*)
//    datosMotor (campos REALES de window.MotorFuego.evaluarPunto + viento):
//      {
//        rosMMin:  number  (m/min, de evaluarPunto().rosMMin)   [obligatorio]
//        windKmh:  number  (km/h, viento 10 m de Open-Meteo)    [obligatorio]
//        windDir:  number  (grados, DIRECCIÓN DE ORIGEN del
//                           viento, igual que en todo el código) [opcional:
//                                                                 sin él la
//                                                                 banda es circular]
//      }
// ============================================================
const api = {
    actualizar: function (lat, lng, datosMotor) {
        if (typeof lat !== 'number' || typeof lng !== 'number' || !datosMotor) return;
        if (!mapa) { ultimaEvaluacion = { lat, lng, datos: datosMotor }; return; }
        renderizar(lat, lng, datosMotor);
    },
    limpiar: function () {
        ultimaEvaluacion = null;
        limpiarCapas();
    },
    visibles: function () { return visible; },
    toggle: function () {
        visible = !visible;
        if (botonToggle) botonToggle.setAttribute('aria-pressed', String(visible));
        if (!mapa || !grupoBandas) return;
        if (visible) {
            grupoBandas.addTo(mapa);
            if (capaAviso) capaAviso.addTo(mapa);
        } else {
            mapa.removeLayer(grupoBandas);
            if (capaAviso) mapa.removeLayer(capaAviso);
        }
    }
};

window.bandasPropagacion = api;

})();
