/**
 * MANOLIT∞ FORESTAL — Soporte PWA / offline (pwa-offline.js)
 * ----------------------------------------------------------
 * Piezas:
 *   1. Registro del Service Worker (solo con https + soporte nativo).
 *   2. Badge flotante online/offline accesible (eventos + navigator.onLine).
 *   3. Botón "Preparar zona para campo": envía PRECARGA_ZONA al SW con el
 *      bbox visible del mapa y zoom actual ±1, muestra progreso (aria-live)
 *      y guarda la última respuesta FIRMS en IndexedDB.
 *   4. Arranque offline: si no hay red, expone los últimos FIRMS cacheados.
 *   5. BATERÍA: al ocultarse la pestaña emite el evento 'manolito:pausa' y
 *      al volver 'manolito:reanudar' (window). Otros módulos (modo-emergencias,
 *      animaciones del motor) deberían pausar sus timers con esos eventos.
 *      Este módulo solo pausa/reanuda lo que él mismo controla.
 *
 * Patrones del proyecto: IIFE + 'use strict', un solo hook window.*,
 * retry loop para DOM, ARIA, botones ≥48px, mobile-first, vanilla JS.
 *
 * Expone: window.manolitoOffline = {
 *   prepararZona(), hayDatosOffline(), obtenerFirmsCache(), estado()
 * }
 *
 * Licencia: AGPL-3.0 (igual que el resto del proyecto).
 */
(function () {
    'use strict';

    /* ================= CONFIGURACIÓN ================= */

    var DB_NOMBRE = 'manolito-offline';
    var DB_STORE = 'datos';
    var CLAVE_FIRMS = 'ultimosFirms';
    var RETRY_MAX = 20;       // 20 × 250 ms = 5 s esperando al DOM/mapa
    var RETRY_MS = 250;

    /* ================= ESTADO INTERNO ================= */

    var swRegistro = null;
    var badge = null;
    var boton = null;
    var zonaProgreso = null;
    var enLinea = navigator.onLine;
    var preparando = false;

    /* ================= I18N (con fallback si idiomas.js no está) ================= */

    function tt(clave) {
        if (typeof window.t === 'function') return window.t(clave);
        // Fallbacks en castellano por si el módulo se carga antes de idiomas.js
        var fb = {
            'pwa.online': 'En línea',
            'pwa.offline': 'Sin conexión — modo campo',
            'pwa.prepararZona': 'Preparar zona para campo',
            'pwa.preparando': 'Descargando mapa de la zona… {hechas}/{total}',
            'pwa.zonaLista': 'Zona lista para uso offline ({tiles} tiles)',
            'pwa.zonaError': 'No se pudo preparar la zona. Reintenta con conexión.',
            'pwa.sinMapa': 'Mapa no disponible todavía'
        };
        return fb[clave] || clave;
    }

    /* ================= INDEXEDDB (helper mínimo, sin librerías) ================= */

    function abrirDB() {
        return new Promise(function (resolve, reject) {
            var req = indexedDB.open(DB_NOMBRE, 1);
            req.onupgradeneeded = function () {
                req.result.createObjectStore(DB_STORE);
            };
            req.onsuccess = function () { resolve(req.result); };
            req.onerror = function () { reject(req.error); };
        });
    }

    function idbPoner(clave, valor) {
        return abrirDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var tx = db.transaction(DB_STORE, 'readwrite');
                tx.objectStore(DB_STORE).put(valor, clave);
                tx.oncomplete = function () { db.close(); resolve(); };
                tx.onerror = function () { db.close(); reject(tx.error); };
            });
        });
    }

    function idbObtener(clave) {
        return abrirDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var req = db.transaction(DB_STORE, 'readonly').objectStore(DB_STORE).get(clave);
                req.onsuccess = function () { db.close(); resolve(req.result); };
                req.onerror = function () { db.close(); reject(req.error); };
            });
        });
    }

    /* ================= SERVICE WORKER ================= */

    function registrarSW() {
        var esSeguro = location.protocol === 'https:' ||
            location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        if (!('serviceWorker' in navigator) || !esSeguro) {
            console.info('[PWA] Service Worker no disponible (¿falta https?).');
            return;
        }
        navigator.serviceWorker.register('sw.js').then(function (reg) {
            swRegistro = reg;
        }).catch(function (e) {
            console.warn('[PWA] Fallo al registrar el SW:', e);
        });
    }

    /* ================= BADGE ONLINE / OFFLINE ================= */

    function crearBadge() {
        badge = document.createElement('div');
        badge.id = 'pwa-badge-conexion';
        badge.setAttribute('role', 'status');
        badge.setAttribute('aria-live', 'polite');
        badge.style.cssText =
            'position:fixed;top:calc(env(safe-area-inset-top,0px) + 10px);left:50%;' +
            'transform:translateX(-50%);z-index:1800;padding:8px 16px;border-radius:999px;' +
            'font:600 13px/1.4 system-ui,sans-serif;color:#070a10;' +
            'box-shadow:0 2px 8px rgba(0,0,0,.5);pointer-events:none;' +
            'transition:background .3s,opacity .3s;';
        document.body.appendChild(badge);
        actualizarBadge();
    }

    function actualizarBadge() {
        if (!badge) return;
        if (enLinea) {
            badge.textContent = '📶 ' + tt('pwa.online');
            badge.style.background = '#00f3ff';
            // En línea: visible un momento y luego se atenúa para no estorbar.
            badge.style.opacity = '0.35';
        } else {
            badge.textContent = '📵 ' + tt('pwa.offline');
            badge.style.background = '#ff9f43';
            badge.style.opacity = '1';
        }
    }

    function alCambiarConexion() {
        enLinea = navigator.onLine;
        actualizarBadge();
    }

    /* ================= BOTÓN "PREPARAR ZONA PARA CAMPO" ================= */

    function resolverMapa() {
        // Mismo orden de resolución que capa-recursos.js.
        if (window.manolitoMapa) return window.manolitoMapa;
        if (window.map) return window.map;
        try { if (typeof map !== 'undefined') return map; } catch (e) { /* binding léxico */ }
        return null;
    }

    function crearBoton() {
        boton = document.createElement('button');
        boton.id = 'pwa-btn-preparar-zona';
        boton.type = 'button';
        // ≥48px de alto, bottom-left para no colisionar con el chat (bottom-right)
        // ni con el dashboard (panel lateral superior).
        boton.style.cssText =
            'position:fixed;left:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 12px);' +
            'z-index:1800;min-height:48px;min-width:48px;padding:12px 18px;border:0;' +
            'border-radius:12px;background:#00f3ff;color:#070a10;cursor:pointer;' +
            'font:700 14px/1.2 system-ui,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.6);';
        boton.setAttribute('aria-label', tt('pwa.prepararZona'));
        boton.textContent = '⬇️ ' + tt('pwa.prepararZona');
        boton.addEventListener('click', prepararZona);

        zonaProgreso = document.createElement('div');
        zonaProgreso.id = 'pwa-progreso-zona';
        zonaProgreso.setAttribute('role', 'status');
        zonaProgreso.setAttribute('aria-live', 'polite');
        zonaProgreso.style.cssText =
            'position:fixed;left:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 72px);' +
            'z-index:1800;max-width:min(320px,80vw);padding:6px 12px;border-radius:8px;' +
            'background:rgba(7,10,16,.9);color:#00f3ff;font:600 12px/1.4 system-ui,sans-serif;' +
            'display:none;';
        document.body.appendChild(boton);
        document.body.appendChild(zonaProgreso);
    }

    function mostrarProgreso(texto) {
        if (!zonaProgreso) return;
        zonaProgreso.textContent = texto;
        zonaProgreso.style.display = texto ? 'block' : 'none';
    }

    function escucharMensajesSW() {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.addEventListener('message', function (event) {
            var d = event.data || {};
            if (d.type === 'PRECARGA_PROGRESO') {
                mostrarProgreso(tt('pwa.preparando').replace('{hechas}', d.hechas).replace('{total}', d.total));
            } else if (d.type === 'PRECARGA_COMPLETA') {
                preparando = false;
                if (boton) boton.disabled = false;
                if (d.error) {
                    mostrarProgreso(tt('pwa.zonaError'));
                } else {
                    mostrarProgreso(tt('pwa.zonaLista').replace('{tiles}', d.tiles));
                    // Guardar también los últimos FIRMS para consulta offline.
                    guardarFirmsCache().catch(function () {});
                }
                setTimeout(function () { mostrarProgreso(''); }, 8000);
            }
        });
    }

    // Descarga (vía SW, network-first) y guarda en IndexedDB los FIRMS del bbox visible.
    function guardarFirmsCache() {
        var m = resolverMapa();
        if (!m || !enLinea) return Promise.resolve();
        var b = m.getBounds();
        var param = b.getWest() + ',' + b.getSouth() + ',' + b.getEast() + ',' + b.getNorth();
        return fetch('/getFires?bounds=' + param).then(function (resp) {
            if (!resp.ok) throw new Error('FIRMS ' + resp.status);
            return resp.text();
        }).then(function (csv) {
            return idbPoner(CLAVE_FIRMS, {
                csv: csv,
                bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
                guardado: Date.now()
            });
        }).catch(function (e) {
            console.warn('[PWA] No se pudieron cachear los FIRMS:', e);
        });
    }

    function prepararZona() {
        if (preparando) return Promise.resolve(false);
        var m = resolverMapa();
        if (!m) {
            mostrarProgreso(tt('pwa.sinMapa'));
            return Promise.resolve(false);
        }
        if (!swRegistro || !swRegistro.active) {
            mostrarProgreso(tt('pwa.zonaError'));
            return Promise.resolve(false);
        }
        preparando = true;
        if (boton) boton.disabled = true;

        var b = m.getBounds();
        var z = m.getZoom();
        swRegistro.active.postMessage({
            type: 'PRECARGA_ZONA',
            bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
            zoomMin: Math.max(0, z - 1),
            zoomMax: Math.min(20, z + 1)
        });
        mostrarProgreso(tt('pwa.preparando').replace('{hechas}', 0).replace('{total}', '…'));
        return Promise.resolve(true);
    }

    /* ================= API PÚBLICA ================= */

    function hayDatosOffline() {
        return idbObtener(CLAVE_FIRMS).then(function (v) { return !!v; }).catch(function () { return false; });
    }

    function obtenerFirmsCache() {
        return idbObtener(CLAVE_FIRMS).catch(function () { return null; });
    }

    function estado() {
        return {
            enLinea: enLinea,
            swActivo: !!(swRegistro && swRegistro.active),
            preparando: preparando
        };
    }

    window.manolitoOffline = {
        prepararZona: prepararZona,
        hayDatosOffline: hayDatosOffline,
        obtenerFirmsCache: obtenerFirmsCache,
        estado: estado
    };

    /* ================= BATERÍA: eventos de pausa/reanudación =================
     * Documentación para otros módulos:
     *   window.addEventListener('manolito:pausa',   ...) → detener timers,
     *     sondeos (setInterval de modo-emergencias), animaciones, etc.
     *   window.addEventListener('manolito:reanudar', ...) → reanudarlos.
     * Este módulo solo emite los eventos; cada módulo pausa LO SUYO.        */

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            window.dispatchEvent(new CustomEvent('manolito:pausa'));
        } else {
            enLinea = navigator.onLine;
            actualizarBadge();
            window.dispatchEvent(new CustomEvent('manolito:reanudar'));
        }
    });

    /* ================= ARRANQUE ================= */

    function arrancarOffline() {
        if (enLinea) return;
        // Sin red al arrancar: comprobar si hay FIRMS guardados y avisar.
        hayDatosOffline().then(function (hay) {
            if (hay) console.info('[PWA] Sin red: hay datos FIRMS offline disponibles vía manolitoOffline.obtenerFirmsCache()');
        });
    }

    window.addEventListener('online', alCambiarConexion);
    window.addEventListener('offline', alCambiarConexion);
    escucharMensajesSW();
    registrarSW();

    // Retry loop: espera a que exista document.body (el script usa defer,
    // pero somos defensivos por si se carga de otra forma).
    var intentos = 0;
    var retry = setInterval(function () {
        intentos++;
        if (document.body) {
            clearInterval(retry);
            crearBadge();
            crearBoton();
            arrancarOffline();
        } else if (intentos >= RETRY_MAX) {
            clearInterval(retry);
            console.warn('[PWA] DOM no disponible; badge y botón no creados.');
        }
    }, RETRY_MS);
})();
