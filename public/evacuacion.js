/**
 * MANOLIT∞ FORESTAL — evacuacion.js
 * ==================================
 * Sistema de evacuación en tiempo real con navegación híbrida
 * (GPS + brújula + capa offline). Módulo AUTÓNOMO: no toca el chat
 * ni el motor científico; solo lee window.perimetrosActivosGeom
 * (perímetros activos ya dibujados) y window.ultimoContextoManolito
 * (viento del punto seleccionado, si existe).
 *
 * PRINCIPIOS:
 *  - PRIVACIDAD ESTRICTA: la posición GPS jamás sale del dispositivo.
 *    Todos los cálculos (distancias, vectores de escape) se hacen aquí,
 *    en el navegador del usuario. No se envía nada a ningún servidor.
 *  - OFFLINE REAL: los perímetros de incendio conocidos se guardan en
 *    IndexedDB como base matemática inmutable. Si se corta internet, la
 *    navegación sigue funcionando con el último dato guardado.
 *  - MODO VECTORIAL: en monte no hay calles que seguir. Se calcula un
 *    VECTOR (rumbo de escape) desde la posición del usuario hacia zona
 *    limpia: perpendicular al avance del fuego o hacia barlovento /
 *    terreno ya quemado, según la doctrina de comportamiento del fuego.
 *  - FAILSAFE: si el GPS pierde precisión (humo, dosel forestal), se
 *    entra en MODO BRÚJULA PURO manteniendo el último rumbo de escape
 *    conocido apoyándose solo en el norte magnético. Nunca se deja al
 *    usuario sin una flecha en pantalla.
 *  - UI DE ESTRÉS: una flecha grande, flotante y PARPADEANTE superpuesta
 *    al mapa (estilo brújula militar), legible con sol, con guantes y
 *    corriendo. Botones >= 48px, role="alert", vibra en alerta roja.
 *
 * Expone: window.manolitoEvacuacion = { iniciar, detener, estado }
 * Respeta 'manolito:pausa' / 'manolito:reanudar' (batería): la
 * monitorización se duerme con la pestaña oculta; una evacuación ACTIVA
 * mantiene el GPS porque la vida manda sobre la batería.
 */
(function () {
    'use strict';

    // ================= i18n =================
    // Fallback en español por si idiomas.js aún no cargó la clave.
    const T_FALLBACK = {
        'evac.boton': 'Evacuación',
        'evac.botonAria': 'Activar el sistema de evacuación por GPS. Tu posición no sale de tu dispositivo.',
        'evac.alertaRoja': 'PELIGRO DE INCENDIO CERCANO ({dist}). Inicie la evacuación de inmediato.',
        'evac.alertaAmarilla': 'Zona de riesgo de incendio a {dist}. Manténgase alerta y prepárese para evacuar.',
        'evac.iniciar': 'Iniciar evacuación',
        'evac.detener': 'Detener evacuación',
        'evac.haciaZonaSegura': 'Zona segura a {dist}',
        'evac.rumbo': 'Rumbo de escape: {card} ({grados}°)',
        'evac.modoBrujula': 'Modo brújula: GPS débil. Siga el último rumbo conocido.',
        'evac.buscandoGps': 'Localizando GPS…',
        'evac.sinGps': 'GPS no disponible. Active la ubicación del dispositivo.',
        'evac.recalculando': 'Recalculando vector de escape…',
        'evac.offline': 'Sin conexión: navegando con los últimos datos guardados ({hora})',
        'evac.permisoBrujula': 'Toca para activar la brújula',
        'evac.popupEscapar': '🧭 Escapar de este foco',
        'evac.fueraDeZona': 'Fuera de la zona de peligro inmediato. Siga alejándose.',
        'evac.privacidad': 'GPS procesado solo en tu dispositivo. Nada sale del móvil.',
        'evac.datosGuardados': 'Datos de incendio guardados: {hora}',
        'evac.sinDatos': 'Sin datos de incendios. Muévase en dirección contraria al humo y llame al 112.',
        'evac.cerrar': 'Cerrar navegación de evacuación'
    };

    function tt(clave, interp) {
        let s = (typeof window.t === 'function') ? window.t(clave) : clave;
        if (!s || s === clave) s = T_FALLBACK[clave] || clave;
        if (interp) for (const k in interp) s = s.replace('{' + k + '}', interp[k]);
        return s;
    }

    function gradosACardinalLocal(deg) {
        const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
        return dirs[Math.round(deg / 22.5) % 16];
    }

    // ================= Matemática geográfica (todo en local) =================
    const R_TIERRA = 6371000;
    const rad = d => d * Math.PI / 180;
    const deg = r => r * 180 / Math.PI;

    function distanciaM(lat1, lon1, lat2, lon2) {
        const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
        return 2 * R_TIERRA * Math.asin(Math.sqrt(a));
    }

    function rumboEntre(lat1, lon1, lat2, lon2) {
        const dLon = rad(lon2 - lon1);
        const y = Math.sin(dLon) * Math.cos(rad(lat2));
        const x = Math.cos(rad(lat1)) * Math.sin(rad(lat2)) -
            Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(dLon);
        return (deg(Math.atan2(y, x)) + 360) % 360;
    }

    function puntoDestino(lat, lon, az, distM) {
        const d = distM / R_TIERRA, a = rad(az);
        const lat2 = Math.asin(Math.sin(rad(lat)) * Math.cos(d) +
            Math.cos(rad(lat)) * Math.sin(d) * Math.cos(a));
        const lon2 = rad(lon) + Math.atan2(
            Math.sin(a) * Math.sin(d) * Math.cos(rad(lat)),
            Math.cos(d) - Math.sin(rad(lat)) * Math.sin(lat2));
        return [deg(lat2), ((deg(lon2) + 540) % 360) - 180];
    }

    function puntoEnPoligono(lat, lon, coords) {
        let dentro = false;
        for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
            const [ilat, ilon] = coords[i], [jlat, jlon] = coords[j];
            if (((ilon > lon) !== (jlon > lon)) &&
                (lat < (jlat - ilat) * (lon - ilon) / (jlon - ilon) + ilat)) {
                dentro = !dentro;
            }
        }
        return dentro;
    }

    // Distancia (m) a una zona de peligro (círculo o polígono) y punto más
    // cercano de su borde, que se usa como referencia para el vector radial.
    function distanciaAZona(lat, lon, zona) {
        if (zona.tipo === 'poligono') {
            const dentro = puntoEnPoligono(lat, lon, zona.coords);
            let mejor = Infinity, punto = null;
            for (const [la, lo] of zona.coords) {
                const d = distanciaM(lat, lon, la, lo);
                if (d < mejor) { mejor = d; punto = [la, lo]; }
            }
            return { distM: dentro ? 0 : mejor, dentro, puntoCercano: punto };
        }
        const d = distanciaM(lat, lon, zona.centro[0], zona.centro[1]);
        return {
            distM: Math.max(0, d - zona.radioM),
            dentro: d <= zona.radioM,
            puntoCercano: zona.centro
        };
    }

    // ================= Persistencia local (IndexedDB) =================
    // Base matemática inmutable: últimos perímetros conocidos. Si internet
    // se corta, la app sigue navegando con este dato.
    const IDB_NAME = 'manolito-evacuacion';
    const IDB_STORE = 'zonas';

    function idbAbrir() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(IDB_NAME, 1);
            req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function idbGuardarZonas(zonas) {
        try {
            const db = await idbAbrir();
            await new Promise((resolve, reject) => {
                const tx = db.transaction(IDB_STORE, 'readwrite');
                tx.objectStore(IDB_STORE).put({ id: 'perimetros', zonas, ts: Date.now() }, 'perimetros');
                tx.oncomplete = resolve;
                tx.onerror = () => reject(tx.error);
            });
            estado.tsDatosGuardados = Date.now();
            db.close();
        } catch (e) {
            console.warn('[Evacuación] No se pudieron guardar los perímetros:', e.message);
        }
    }

    async function idbLeerZonas() {
        try {
            const db = await idbAbrir();
            const dato = await new Promise((resolve, reject) => {
                const req = db.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get('perimetros');
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => reject(req.error);
            });
            db.close();
            if (dato && Array.isArray(dato.zonas) && dato.zonas.length) {
                estado.zonasGuardadas = dato.zonas;
                estado.tsDatosGuardados = dato.ts;
            }
        } catch (e) {
            console.warn('[Evacuación] No se pudieron leer los perímetros guardados:', e.message);
        }
    }

    // ================= Estado del módulo =================
    const estado = {
        monitorizando: false,     // GPS en bajo consumo vigilando proximidad
        evacuando: false,         // navegación activa con flecha
        zonasGuardadas: null,     // último snapshot de IndexedDB
        tsDatosGuardados: null,
        azEscape: null,           // último rumbo de escape calculado (failsafe)
        meta: null,               // [lat, lon] de la zona segura actual
        heading: null,            // orientación del dispositivo (brújula)
        gpsCourse: null,          // rumbo GPS (fallback si no hay brújula)
        ultimaPos: null,          // {lat, lon, precision, ts}
        modoBrujulaPuro: false,   // failsafe: GPS degradado
        nivelAlerta: null,        // null | 'amarilla' | 'roja'
        pausado: false            // pestaña oculta (evento manolito:pausa)
    };

    // Umbrales de proximidad al borde de un perímetro activo
    const UMBRAL_ROJO_M = 300;      // dentro o a menos de 300 m: evacuar ya
    const UMBRAL_AMARILLO_M = 1200; // a menos de 1,2 km: aviso de preparación
    const GPS_MALO_M = 75;          // precisión peor que esto = GPS degradado
    const GPS_STALE_MS = 12000;     // sin fix en 12 s durante evacuación = degradado

    // Zonas de peligro: las vivas del mapa; si no hay (offline), las guardadas.
    function zonasActuales() {
        const vivas = window.perimetrosActivosGeom;
        if (Array.isArray(vivas) && vivas.length) return { zonas: vivas, origen: 'vivo' };
        if (estado.zonasGuardadas && estado.zonasGuardadas.length) return { zonas: estado.zonasGuardadas, origen: 'cache' };
        return { zonas: [], origen: 'vacio' };
    }

    // Guarda en IndexedDB cada vez que cambian los perímetros del mapa.
    let ultimoSnapshotZonas = '';
    function persistirSiCambia() {
        const vivas = window.perimetrosActivosGeom;
        if (!Array.isArray(vivas) || !vivas.length) return;
        const snap = JSON.stringify(vivas);
        if (snap !== ultimoSnapshotZonas) {
            ultimoSnapshotZonas = snap;
            idbGuardarZonas(vivas);
        }
    }

    // ================= Lógica del vector de escape =================
    // Doctrina: el fuego avanza a sotavento. El escape correcto es
    // PERPENDICULAR al avance (hacia los flancos) o hacia lo ya quemado a
    // BARLOVENTO. Nunca sotavento ni cuesta arriba por vaguadas alineadas.
    // Se puntúan los rumbos candidatos simulando un paso de 1 km y eligiendo
    // el que más aumenta la distancia al perímetro.
    function calcularVectorEscape(lat, lon) {
        const { zonas } = zonasActuales();
        if (!zonas.length) return null;

        let peorZona = null;
        for (const z of zonas) {
            const d = distanciaAZona(lat, lon, z);
            if (!peorZona || d.distM < peorZona.distM || (d.dentro && !peorZona.dentro)) {
                peorZona = { ...d, zona: z };
            }
        }
        if (!peorZona) return null;

        // Rumbo radial: del punto del fuego más cercano hacia el usuario
        // (seguir hacia afuera, alejándose del frente).
        const ref = peorZona.puntoCercano;
        const azRadial = ref ? rumboEntre(ref[0], ref[1], lat, lon) : 0;

        const candidatos = [azRadial];
        const ctx = window.ultimoContextoManolito;
        if (ctx && typeof ctx.windDir === 'number') {
            const azAvance = (ctx.windDir + 180) % 360; // el fuego corre a sotavento
            candidatos.push((azAvance + 90) % 360);     // flanco A (perpendicular)
            candidatos.push((azAvance - 90 + 360) % 360); // flanco B (perpendicular)
            candidatos.push(ctx.windDir);               // barlovento: hacia lo quemado
        }

        let mejorAz = azRadial, mejorDist = -1;
        for (const az of candidatos) {
            const [pla, plo] = puntoDestino(lat, lon, az, 1000);
            let dMin = Infinity;
            for (const z of zonas) dMin = Math.min(dMin, distanciaAZona(pla, plo, z).distM);
            if (dMin > mejorDist) { mejorDist = dMin; mejorAz = az; }
        }

        // Meta: punto limpio a distancia suficiente (mínimo 2 km, o lo que
        // falte para salir de la zona + 1,5 km de margen de seguridad).
        const distMeta = Math.max(2000, peorZona.distM + 1500);
        const meta = puntoDestino(lat, lon, mejorAz, distMeta);
        return {
            azEscape: mejorAz,
            meta,
            distZonaM: peorZona.distM,
            dentro: peorZona.dentro
        };
    }

    // ================= Brújula (fusión de sensores) =================
    // Android: 'deviceorientationabsolute' con alpha absoluto.
    // iOS: 'deviceorientation' con webkitCompassHeading (requiere permiso
    // explícito desde un gesto del usuario en iOS 13+).
    function alOrientacion(e) {
        let h = null;
        if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
            h = e.webkitCompassHeading;
        } else if (typeof e.alpha === 'number' && (e.absolute || e.alpha !== null)) {
            h = 360 - e.alpha;
        }
        if (h === null || isNaN(h)) return;
        // Corrección por orientación de la pantalla: si el usuario gira el
        // móvil a apaisado mientras corre, la flecha sigue apuntando bien.
        const giro = (screen.orientation && typeof screen.orientation.angle === 'number')
            ? screen.orientation.angle
            : (typeof window.orientation === 'number' ? window.orientation : 0);
        estado.heading = (h + giro + 360) % 360;
    }

    async function activarBrujula() {
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permiso = await DeviceOrientationEvent.requestPermission();
                if (permiso !== 'granted') return false;
            } catch (e) {
                return false;
            }
        }
        window.addEventListener('deviceorientationabsolute', alOrientacion, true);
        window.addEventListener('deviceorientation', alOrientacion, true);
        return true;
    }

    function desactivarBrujula() {
        window.removeEventListener('deviceorientationabsolute', alOrientacion, true);
        window.removeEventListener('deviceorientation', alOrientacion, true);
        estado.heading = null;
    }

    // ================= GPS =================
    let watchMonitoreo = null;
    let watchEvacuacion = null;

    function alErrorGps(err) {
        console.warn('[Evacuación] GPS:', err.message);
        if (estado.evacuando) {
            // Failsafe: si el GPS falla en plena evacuación, no soltamos al
            // usuario — pasamos a brújula pura con el último rumbo conocido.
            estado.modoBrujulaPuro = true;
            pintarEstadoNav();
        } else {
            pintarBanner(tt('evac.sinGps'), 'amarilla');
        }
    }

    function alPosicionMonitoreo(pos) {
        estado.ultimaPos = { lat: pos.coords.latitude, lon: pos.coords.longitude, precision: pos.coords.accuracy, ts: Date.now() };
        comprobarProximidad(pos.coords.latitude, pos.coords.longitude);
    }

    function alPosicionEvacuacion(pos) {
        const c = pos.coords;
        estado.ultimaPos = { lat: c.latitude, lon: c.longitude, precision: c.accuracy, ts: Date.now() };
        if (typeof c.heading === 'number' && !isNaN(c.heading) && c.speed > 0.5) {
            estado.gpsCourse = c.heading; // rumbo por desplazamiento (fallback sin brújula)
        }

        // Degradación del sensor: humo denso o dosel forestal.
        estado.modoBrujulaPuro = (c.accuracy > GPS_MALO_M);

        const anterior = estado.azEscape;
        const vec = calcularVectorEscape(c.latitude, c.longitude);
        if (vec) {
            estado.azEscape = vec.azEscape;
            estado.meta = vec.meta;
            dibujarVectorEnMapa(c.latitude, c.longitude, vec.meta);
            // Recálculo dinámico: si el usuario se desvía, el rumbo cambia.
            if (anterior !== null) {
                let diff = Math.abs(vec.azEscape - anterior);
                if (diff > 180) diff = 360 - diff;
                if (diff > 25) flashRecalculando();
            }
            pintarDistancia(vec);
        } else {
            pintarBanner(tt('evac.sinDatos'), 'roja');
        }
        pintarEstadoNav();
        comprobarProximidad(c.latitude, c.longitude);
    }

    function comprobarProximidad(lat, lon) {
        const { zonas } = zonasActuales();
        if (!zonas.length) return;
        let dMin = Infinity, dentro = false;
        for (const z of zonas) {
            const d = distanciaAZona(lat, lon, z);
            if (d.dentro) dentro = true;
            dMin = Math.min(dMin, d.distM);
        }
        const kmTxt = dMin < 1000 ? `${Math.round(dMin)} m` : `${(dMin / 1000).toFixed(1)} km`;

        if ((dentro || dMin < UMBRAL_ROJO_M) && estado.nivelAlerta !== 'roja') {
            estado.nivelAlerta = 'roja';
            pintarBanner(tt('evac.alertaRoja', { dist: dentro ? '0 m' : kmTxt }), 'roja', true);
            if (navigator.vibrate) navigator.vibrate([400, 150, 400, 150, 400]);
        } else if (!dentro && dMin >= UMBRAL_ROJO_M && dMin < UMBRAL_AMARILLO_M && estado.nivelAlerta !== 'roja' && estado.nivelAlerta !== 'amarilla') {
            estado.nivelAlerta = 'amarilla';
            pintarBanner(tt('evac.alertaAmarilla', { dist: kmTxt }), 'amarilla', true);
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        } else if (!dentro && dMin >= UMBRAL_AMARILLO_M && estado.nivelAlerta && !estado.evacuando) {
            estado.nivelAlerta = null;
            ocultarBanner();
        }
    }

    // ================= Arranque / parada =================
    function iniciarMonitoreo() {
        if (estado.monitorizando || !('geolocation' in navigator)) return;
        estado.monitorizando = true;
        watchMonitoreo = navigator.geolocation.watchPosition(alPosicionMonitoreo, alErrorGps, {
            enableHighAccuracy: false, maximumAge: 30000, timeout: 20000
        });
        actualizarBoton();
    }

    function detenerMonitoreo() {
        if (watchMonitoreo !== null) navigator.geolocation.clearWatch(watchMonitoreo);
        watchMonitoreo = null;
        estado.monitorizando = false;
        estado.nivelAlerta = null;
        ocultarBanner();
        actualizarBoton();
    }

    async function iniciarEvacuacion() {
        if (!('geolocation' in navigator)) {
            pintarBanner(tt('evac.sinGps'), 'roja');
            return;
        }
        await activarBrujula(); // gesto del usuario: aquí cabe el permiso de iOS
        detenerMonitoreo();
        estado.evacuando = true;
        estado.modoBrujulaPuro = false;
        mostrarNav();
        pintarBanner(tt('evac.buscandoGps'), 'amarilla');
        watchEvacuacion = navigator.geolocation.watchPosition(alPosicionEvacuacion, alErrorGps, {
            enableHighAccuracy: true, maximumAge: 1000, timeout: 10000
        });
        bucleFlecha();
        actualizarBoton();
    }

    function detenerEvacuacion() {
        if (watchEvacuacion !== null) navigator.geolocation.clearWatch(watchEvacuacion);
        watchEvacuacion = null;
        estado.evacuando = false;
        estado.modoBrujulaPuro = false;
        desactivarBrujula();
        ocultarNav();
        ocultarBanner();
        limpiarVectorEnMapa();
        iniciarMonitoreo(); // vuelve a vigilancia de bajo consumo
        actualizarBoton();
    }

    // ================= Mapa: vector de escape =================
    let capaVector = null;
    function dibujarVectorEnMapa(lat, lon, meta) {
        const mapa = window.manolitoMapa;
        if (!mapa || !window.L) return;
        if (!capaVector) {
            capaVector = L.layerGroup().addTo(mapa);
        }
        capaVector.clearLayers();
        // Línea discontinua de referencia sobre el mapa (la flecha flotante
        // es la guía principal; esta línea orienta al mirar el mapa).
        L.polyline([[lat, lon], meta], {
            color: '#00e5ff', weight: 4, dashArray: '10 8', opacity: 0.9
        }).addTo(capaVector);
        L.circleMarker(meta, {
            radius: 10, fillColor: '#00e676', color: '#fff', weight: 2, fillOpacity: 0.9
        }).addTo(capaVector).bindTooltip(tt('evac.haciaZonaSegura', { dist: '' }));
        L.circleMarker([lat, lon], {
            radius: 8, fillColor: '#2196f3', color: '#fff', weight: 2, fillOpacity: 1
        }).addTo(capaVector);
    }

    function limpiarVectorEnMapa() {
        if (capaVector) {
            capaVector.clearLayers();
            const mapa = window.manolitoMapa;
            if (mapa) mapa.removeLayer(capaVector);
            capaVector = null;
        }
    }

    // ================= UI: estilos autocontenidos =================
    function inyectarEstilos() {
        if (document.getElementById('evac-estilos')) return;
        const css = `
#evac-boton{position:fixed;right:12px;bottom:96px;z-index:1200;min-width:48px;min-height:48px;
 padding:10px 14px;border-radius:24px;border:2px solid #fff;background:#b71c1c;color:#fff;
 font-size:15px;font-weight:700;box-shadow:0 2px 10px rgba(0,0,0,.5);cursor:pointer;
 display:flex;align-items:center;gap:6px}
#evac-boton[aria-pressed="true"]{background:#1b5e20}
#evac-alerta{position:fixed;top:0;left:0;right:0;z-index:1300;padding:12px 14px;font-size:17px;
 font-weight:700;text-align:center;display:none;line-height:1.35}
#evac-alerta.roja{background:#b71c1c;color:#fff;animation:evacParpadeo 1s step-start infinite}
#evac-alerta.amarilla{background:#ffb300;color:#000}
#evac-alerta button{min-width:48px;min-height:48px;margin-top:8px;font-size:16px;font-weight:700;
 border-radius:10px;border:2px solid currentColor;background:transparent;color:inherit;cursor:pointer;
 display:block;width:100%}
#evac-nav{position:fixed;inset:0;z-index:1250;pointer-events:none;display:none}
#evac-flecha{position:absolute;top:18%;left:50%;margin-left:-70px;width:140px;height:140px;
 transform-origin:50% 50%;will-change:transform}
#evac-flecha svg{width:100%;height:100%;filter:drop-shadow(0 0 10px rgba(255,60,0,.9));
 animation:evacParpadeo 0.8s step-start infinite}
#evac-panel{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.9);color:#fff;
 padding:12px 14px;border-radius:16px 16px 0 0;text-align:center;pointer-events:auto}
#evac-dist{font-size:26px;font-weight:800}
#evac-rumbo{font-size:17px;margin-top:2px}
#evac-estado{font-size:14px;margin-top:6px;color:#ffd54f;min-height:18px}
#evac-nota{font-size:12px;margin-top:6px;color:#b0bec5}
#evac-cerrar{min-width:48px;min-height:48px;margin-top:10px;font-size:16px;font-weight:700;
 border-radius:10px;border:2px solid #fff;background:#b71c1c;color:#fff;cursor:pointer;width:100%}
.evac-escapar-btn{min-width:48px;min-height:48px;margin-top:6px;font-weight:700;border-radius:8px;
 border:2px solid #b71c1c;background:#fff;color:#b71c1c;cursor:pointer;width:100%}
@keyframes evacParpadeo{0%{opacity:1}50%{opacity:.25}100%{opacity:1}}
@media (orientation:landscape){
 #evac-flecha{top:8%;width:110px;height:110px;margin-left:-55px}
 #evac-panel{left:auto;right:0;width:320px;border-radius:16px 0 0 0}
}
body.modo-accesible #evac-alerta.roja{background:#ff0000;color:#fff;animation:none}
body.modo-accesible #evac-flecha svg{animation:none;filter:drop-shadow(0 0 14px #ff0)}
`;
        const st = document.createElement('style');
        st.id = 'evac-estilos';
        st.textContent = css;
        document.head.appendChild(st);
    }

    // ================= UI: DOM =================
    let elBoton, elBanner, elNav, elFlecha, elDist, elRumbo, elEstado, elNota;

    function construirUI() {
        inyectarEstilos();

        elBoton = document.createElement('button');
        elBoton.id = 'evac-boton';
        elBoton.type = 'button';
        elBoton.setAttribute('aria-pressed', 'false');
        elBoton.addEventListener('click', () => {
            if (estado.evacuando) detenerEvacuacion();
            else if (estado.monitorizando) detenerMonitoreo();
            else iniciarMonitoreo();
        });
        document.body.appendChild(elBoton);

        elBanner = document.createElement('div');
        elBanner.id = 'evac-alerta';
        elBanner.setAttribute('role', 'alert');
        elBanner.setAttribute('aria-live', 'assertive');
        document.body.appendChild(elBanner);

        elNav = document.createElement('div');
        elNav.id = 'evac-nav';
        elNav.innerHTML = `
<div id="evac-flecha" aria-hidden="true">
 <svg viewBox="0 0 100 100"><polygon points="50,4 88,92 50,70 12,92" fill="#ff3c00" stroke="#fff" stroke-width="4"/></svg>
</div>
<div id="evac-panel" role="status">
 <div id="evac-dist" aria-live="polite"></div>
 <div id="evac-rumbo"></div>
 <div id="evac-estado" aria-live="polite"></div>
 <div id="evac-nota"></div>
 <button id="evac-cerrar" type="button"></button>
</div>`;
        document.body.appendChild(elNav);

        elFlecha = document.getElementById('evac-flecha');
        elDist = document.getElementById('evac-dist');
        elRumbo = document.getElementById('evac-rumbo');
        elEstado = document.getElementById('evac-estado');
        elNota = document.getElementById('evac-nota');
        const btnCerrar = document.getElementById('evac-cerrar');
        btnCerrar.addEventListener('click', detenerEvacuacion);

        actualizarTextos();
    }

    function actualizarTextos() {
        if (!elBoton) return;
        actualizarBoton();
        elBoton.setAttribute('aria-label', tt('evac.botonAria'));
        const btnCerrar = document.getElementById('evac-cerrar');
        if (btnCerrar) btnCerrar.textContent = tt('evac.detener');
        if (elNota) {
            const offline = !navigator.onLine;
            const hora = estado.tsDatosGuardados
                ? new Date(estado.tsDatosGuardados).toLocaleTimeString()
                : '—';
            elNota.textContent = offline
                ? tt('evac.offline', { hora })
                : tt('evac.privacidad');
        }
        if (estado.evacuando) pintarEstadoNav();
    }

    function actualizarBoton() {
        if (!elBoton) return;
        const activo = estado.evacuando || estado.monitorizando;
        elBoton.setAttribute('aria-pressed', activo ? 'true' : 'false');
        elBoton.textContent = estado.evacuando ? `🧭 ${tt('evac.detener')}` : `🧭 ${tt('evac.boton')}`;
    }

    function pintarBanner(texto, nivel, conBoton) {
        if (!elBanner) return;
        elBanner.className = nivel || '';
        elBanner.style.display = 'block';
        elBanner.innerHTML = '';
        const span = document.createElement('span');
        span.textContent = texto;
        elBanner.appendChild(span);
        if (conBoton && !estado.evacuando) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = tt('evac.iniciar');
            btn.addEventListener('click', iniciarEvacuacion);
            elBanner.appendChild(btn);
        }
    }

    function ocultarBanner() {
        if (elBanner) elBanner.style.display = 'none';
    }

    function mostrarNav() {
        if (elNav) elNav.style.display = 'block';
    }

    function ocultarNav() {
        if (elNav) elNav.style.display = 'none';
    }

    function pintarDistancia(vec) {
        if (!elDist || !estado.ultimaPos) return;
        const dMeta = distanciaM(estado.ultimaPos.lat, estado.ultimaPos.lon, vec.meta[0], vec.meta[1]);
        const kmTxt = dMeta < 1000 ? `${Math.round(dMeta)} m` : `${(dMeta / 1000).toFixed(1)} km`;
        elDist.textContent = tt('evac.haciaZonaSegura', { dist: kmTxt });
        elRumbo.textContent = tt('evac.rumbo', {
            card: gradosACardinalLocal(vec.azEscape),
            grados: Math.round(vec.azEscape)
        });
    }

    function pintarEstadoNav() {
        if (!elEstado) return;
        if (estado.modoBrujulaPuro) {
            elEstado.textContent = tt('evac.modoBrujula');
        } else if (estado.ultimaPos) {
            elEstado.textContent = `GPS ±${Math.round(estado.ultimaPos.precision)} m`;
        }
        actualizarTextosNota();
    }

    function actualizarTextosNota() {
        if (!elNota) return;
        const offline = !navigator.onLine;
        const hora = estado.tsDatosGuardados
            ? new Date(estado.tsDatosGuardados).toLocaleTimeString()
            : '—';
        elNota.textContent = offline ? tt('evac.offline', { hora }) : tt('evac.privacidad');
    }

    let flashTimer = null;
    function flashRecalculando() {
        if (!elEstado) return;
        elEstado.textContent = tt('evac.recalculando');
        clearTimeout(flashTimer);
        flashTimer = setTimeout(pintarEstadoNav, 1500);
    }

    // ================= Flecha flotante =================
    // Gira con la diferencia entre el rumbo de escape y la orientación del
    // dispositivo: la punta señala SIEMPRE la dirección física de huida.
    function bucleFlecha() {
        if (!estado.evacuando) return;
        if (estado.azEscape !== null && elFlecha) {
            let referencia = estado.heading;
            if (referencia === null) referencia = estado.gpsCourse;
            if (referencia === null) referencia = 0; // sin sensores: flecha fija al norte del rumbo
            elFlecha.style.transform = `rotate(${estado.azEscape - referencia}deg)`;
        }
        // GPS stale: sin fix reciente en plena evacuación = brújula pura
        if (estado.ultimaPos && (Date.now() - estado.ultimaPos.ts > GPS_STALE_MS) && !estado.modoBrujulaPuro) {
            estado.modoBrujulaPuro = true;
            pintarEstadoNav();
        }
        requestAnimationFrame(bucleFlecha);
    }

    // ================= Activación manual desde un foco =================
    // Al abrir el popup de un foco FIRMS se inyecta "Escapar de este foco".
    function engancharPopups() {
        const mapa = window.manolitoMapa;
        if (!mapa) return;
        mapa.on('popupopen', (e) => {
            const el = e.popup.getElement();
            if (!el || !el.querySelector('.evaluar-fuego-btn') || el.querySelector('.evac-escapar-btn')) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'evac-escapar-btn';
            btn.textContent = tt('evac.popupEscapar');
            btn.addEventListener('click', () => {
                mapa.closePopup();
                iniciarEvacuacion();
            });
            el.querySelector('.leaflet-popup-content')?.appendChild(btn);
        });
    }

    // ================= Eventos globales =================
    function engancharEventos() {
        // Batería: pestaña oculta → dormir monitorización (una evacuación
        // activa NO se duerme: la vida manda sobre la batería).
        window.addEventListener('manolito:pausa', () => {
            estado.pausado = true;
            if (estado.monitorizando && !estado.evacuando) {
                if (watchMonitoreo !== null) navigator.geolocation.clearWatch(watchMonitoreo);
                watchMonitoreo = null;
            }
        });
        window.addEventListener('manolito:reanudar', () => {
            estado.pausado = false;
            if (estado.monitorizando && watchMonitoreo === null && !estado.evacuando) {
                watchMonitoreo = navigator.geolocation.watchPosition(alPosicionMonitoreo, alErrorGps, {
                    enableHighAccuracy: false, maximumAge: 30000, timeout: 20000
                });
            }
        });

        // Pérdida de conexión: la navegación no se interrumpe; solo se
        // informa de que los datos son los últimos guardados.
        window.addEventListener('offline', actualizarTextosNota);
        window.addEventListener('online', () => { actualizarTextosNota(); persistirSiCambia(); });

        // i18n en caliente
        document.addEventListener('manolito:idioma-cambiado', actualizarTextos);
        window.addEventListener('manolitoforestal:idioma-cambiado', actualizarTextos);

        // Persistencia continua de perímetros (base inmutable offline)
        setInterval(() => { if (!estado.pausado) persistirSiCambia(); }, 20000);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') persistirSiCambia();
        });
    }

    // ================= Init =================
    function init() {
        construirUI();
        idbLeerZonas(); // precarga la base inmutable para uso offline
        engancharEventos();
        // El mapa se crea en motor-cuantico.js (defer anterior): reintenta
        // por si el orden de carga cambiara algún día.
        let intentos = 0;
        const reintento = setInterval(() => {
            if (window.manolitoMapa) {
                clearInterval(reintento);
                engancharPopups();
            } else if (++intentos >= 20) {
                clearInterval(reintento);
                console.warn('[Evacuación] mapa no disponible tras 20 intentos');
            }
        }, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.manolitoEvacuacion = {
        iniciar: iniciarEvacuacion,
        detener: detenerEvacuacion,
        estado
    };
})();
