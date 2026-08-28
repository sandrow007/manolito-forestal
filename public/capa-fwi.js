/**
 * MANOLIT∞ FORESTAL - Capa FWI (Fire Weather Index) de EFFIS/Copernicus
 *
 * Capa coropleta WMS de peligro de incendio (FWI del ECMWF) servida por el
 * European Forest Fire Information System (EFFIS). Gratuita, sin API key.
 *
 * Patrones:
 *  - IIFE + 'use strict'. Un único hook público: window.capaFWI.
 *  - Lazy-load real: el L.tileLayer.wms NO se crea hasta la primera activación.
 *  - DOM inyectado con retry loop (setInterval, máx 20 intentos × 200 ms).
 *  - Textos vía i18n global del proyecto: t('clave') con fallback a la clave
 *    (idiomas.js expone IDIOMAS + t() + cambiarIdioma()). Fallback interno en
 *    español si t() aún no está disponible.
 *
 * Integración: este módulo necesita una referencia al mapa Leaflet.
 * motor-cuantico.js crea el mapa como `const map = L.map('map', ...)`, que NO
 * queda expuesto en window. El integrador debe añadir una línea tras crear el
 * mapa:  window.manolitoMapa = map;
 * (este módulo también prueba window.map como fallback, por compatibilidad).
 */
(function () {
    'use strict';

    // ------------------------------------------------------------------ i18n
    // Fallbacks en español por si idiomas.js aún no ha cargado (defer order).
    var FALLBACK_ES = {
        fwiToggle: 'Índice FWI (peligro de incendio)',
        fwiToggleActivar: 'Activar capa FWI de peligro de incendio',
        fwiToggleDesactivar: 'Desactivar capa FWI de peligro de incendio',
        fwiLeyendaTitulo: 'Índice FWI (EFFIS)',
        fwiLeyendaExpandir: 'Mostrar leyenda FWI',
        fwiLeyendaColapsar: 'Ocultar leyenda FWI',
        fwiMuyBajo: 'Muy bajo',
        fwiBajo: 'Bajo',
        fwiModerado: 'Moderado',
        fwiAlto: 'Alto',
        fwiMuyAlto: 'Muy alto',
        fwiExtremo: 'Extremo',
        fwiCargando: 'Cargando capa FWI…',
        fwiError: 'No se pudo cargar la capa FWI. Reintentar',
        fwiFuente: 'Fuente: EFFIS / Copernicus ECMWF'
    };

    function tr(clave) {
        try {
            if (typeof window.t === 'function') {
                var v = window.t(clave);
                // t() devuelve la propia clave si no existe: usar fallback.
                if (v && v !== clave) return v;
            } else if (typeof t === 'function') {
                var v2 = t(clave);
                if (v2 && v2 !== clave) return v2;
            }
        } catch (e) { /* i18n no disponible todavía */ }
        return FALLBACK_ES[clave] || clave;
    }

    // ------------------------------------------------------- Constantes capa
    var WMS_URL = 'https://maps.effis.emergency.copernicus.eu/effis';
    var WMS_OPTS = {
        service: 'WMS',
        version: '1.1.1',        // 1.1.1 evita el lío de ejes lat/lon de 1.3.0
        request: 'GetMap',
        layers: 'mf010.fwi',
        format: 'image/png',
        transparent: true,
        opacity: 0.55,
        attribution: 'FWI © EFFIS - Copernicus (ECMWF)'
    };

    var TIMEOUT_CARGA_MS = 8000;
    var MAX_INTENTOS_DOM = 20;
    var INTERVALO_DOM_MS = 200;

    // Escala oficial EFFIS de clases de peligro FWI (umbrales superiores).
    var CLASES_FWI = [
        { clave: 'fwiMuyBajo',  color: '#00FF00', rango: '< 5.2' },
        { clave: 'fwiBajo',     color: '#C0FF00', rango: '5.2 – 11.2' },
        { clave: 'fwiModerado', color: '#FFFF00', rango: '11.2 – 21.3' },
        { clave: 'fwiAlto',     color: '#FFA500', rango: '21.3 – 38' },
        { clave: 'fwiMuyAlto',  color: '#FF0000', rango: '38 – 50' },
        { clave: 'fwiExtremo',  color: '#800080', rango: '≥ 50' }
    ];

    // ---------------------------------------------------------------- Estado
    var capaWms = null;          // se crea solo en la primera activación
    var estaActiva = false;
    var cargando = false;
    var timerTimeout = null;
    var ui = null;               // { contenedor, boton, leyenda, estado }

    function obtenerMapa() {
        return window.manolitoMapa || window.map || null;
    }

    // ------------------------------------------------------------------- CSS
    function inyectarCSS() {
        if (document.getElementById('capa-fwi-css')) return;
        var css = document.createElement('style');
        css.id = 'capa-fwi-css';
        css.textContent = [
            '#capa-fwi-wrap{position:absolute;top:64px;left:16px;z-index:500;',
            '  font-family:inherit;max-width:min(300px,calc(100vw - 32px));}',
            '#capa-fwi-toggle{min-width:48px;min-height:48px;display:flex;',
            '  align-items:center;gap:8px;padding:10px 14px;cursor:pointer;',
            '  border-radius:8px;font-size:0.85rem;font-weight:600;',
            '  border:1px solid rgba(0,243,255,0.35);',
            '  background:rgba(5,16,19,0.85);color:#e8f6f8;',
            '  box-shadow:0 2px 10px rgba(0,0,0,0.4);}',
            '#capa-fwi-toggle:hover{filter:brightness(1.15);}',
            '#capa-fwi-toggle:focus-visible{outline:3px solid #00f3ff;outline-offset:2px;}',
            '#capa-fwi-toggle[aria-pressed="true"]{',
            '  background:rgba(255,165,0,0.18);border-color:rgba(255,165,0,0.75);}',
            '#capa-fwi-toggle .fwi-spinner{display:none;width:16px;height:16px;',
            '  border:2px solid rgba(255,255,255,0.25);border-top-color:#ffa500;',
            '  border-radius:50%;animation:fwi-giro 0.8s linear infinite;}',
            '#capa-fwi-toggle.fwi-cargando .fwi-spinner{display:inline-block;}',
            '@keyframes fwi-giro{to{transform:rotate(360deg);}}',
            '#capa-fwi-estado{margin-top:6px;font-size:0.75rem;color:#ffd27a;',
            '  background:rgba(5,16,19,0.85);border-radius:6px;padding:6px 10px;',
            '  display:none;}',
            '#capa-fwi-estado.fwi-visible{display:block;}',
            '#capa-fwi-estado button{margin-left:8px;min-width:48px;',
            '  min-height:48px;padding:6px 10px;cursor:pointer;border-radius:6px;',
            '  border:1px solid rgba(0,243,255,0.4);background:transparent;',
            '  color:#e8f6f8;font-size:0.75rem;}',
            '#capa-fwi-leyenda{margin-top:8px;background:rgba(5,16,19,0.9);',
            '  border:1px solid rgba(0,243,255,0.3);border-radius:8px;',
            '  padding:8px 10px;color:#e8f6f8;font-size:0.75rem;}',
            '#capa-fwi-leyenda[hidden]{display:none;}',
            '#capa-fwi-leyenda-titulo{display:flex;justify-content:space-between;',
            '  align-items:center;gap:8px;min-height:48px;width:100%;',
            '  background:none;border:none;color:inherit;font:inherit;',
            '  font-weight:700;cursor:pointer;padding:6px 0;}',
            '#capa-fwi-leyenda-lista{list-style:none;margin:6px 0 0;padding:0;}',
            '#capa-fwi-leyenda-lista[hidden]{display:none;}',
            '#capa-fwi-leyenda-lista li{display:flex;align-items:center;gap:8px;',
            '  margin-bottom:4px;}',
            '#capa-fwi-leyenda-lista .fwi-muestra{width:18px;height:14px;',
            '  flex:0 0 18px;border-radius:3px;border:1px solid rgba(255,255,255,0.35);}',
            '#capa-fwi-leyenda-lista .fwi-rango{margin-left:auto;opacity:0.75;',
            '  font-variant-numeric:tabular-nums;}',
            '#capa-fwi-leyenda-fuente{margin-top:6px;font-size:0.65rem;opacity:0.6;}',
            '@media (max-width:480px){',
            '  #capa-fwi-wrap{top:auto;bottom:90px;left:12px;max-width:calc(100vw - 24px);}',
            '}'
        ].join('\n');
        document.head.appendChild(css);
    }

    // ------------------------------------------------------------------- DOM
    function construirUI(contenedor) {
        inyectarCSS();

        var wrap = document.createElement('div');
        wrap.id = 'capa-fwi-wrap';

        var boton = document.createElement('button');
        boton.id = 'capa-fwi-toggle';
        boton.type = 'button';
        boton.setAttribute('aria-pressed', 'false');
        boton.setAttribute('aria-label', tr('fwiToggleActivar'));
        boton.innerHTML = '<span class="fwi-spinner" aria-hidden="true"></span>' +
            '<span aria-hidden="true">🔥</span>' +
            '<span class="fwi-texto"></span>';
        boton.querySelector('.fwi-texto').textContent = tr('fwiToggle');
        boton.addEventListener('click', function () { api.toggle(); });

        var estado = document.createElement('div');
        estado.id = 'capa-fwi-estado';
        estado.setAttribute('role', 'status');
        estado.setAttribute('aria-live', 'polite');

        var leyenda = document.createElement('div');
        leyenda.id = 'capa-fwi-leyenda';
        leyenda.hidden = true;

        var titulo = document.createElement('button');
        titulo.id = 'capa-fwi-leyenda-titulo';
        titulo.type = 'button';
        titulo.setAttribute('aria-expanded', 'false');
        titulo.setAttribute('aria-label', tr('fwiLeyendaExpandir'));

        var lista = document.createElement('ul');
        lista.id = 'capa-fwi-leyenda-lista';
        lista.hidden = true;

        function reconstruirLeyenda() {
            titulo.innerHTML = '';
            var spanTit = document.createElement('span');
            spanTit.textContent = tr('fwiLeyendaTitulo');
            var spanFlecha = document.createElement('span');
            spanFlecha.setAttribute('aria-hidden', 'true');
            spanFlecha.textContent = lista.hidden ? '▸' : '▾';
            titulo.appendChild(spanTit);
            titulo.appendChild(spanFlecha);
            titulo.setAttribute('aria-label',
                lista.hidden ? tr('fwiLeyendaExpandir') : tr('fwiLeyendaColapsar'));

            lista.innerHTML = '';
            CLASES_FWI.forEach(function (c) {
                var li = document.createElement('li');
                var muestra = document.createElement('span');
                muestra.className = 'fwi-muestra';
                muestra.style.backgroundColor = c.color;
                muestra.setAttribute('aria-hidden', 'true');
                var nombre = document.createElement('span');
                nombre.textContent = tr(c.clave);
                var rango = document.createElement('span');
                rango.className = 'fwi-rango';
                rango.textContent = c.rango;
                li.appendChild(muestra);
                li.appendChild(nombre);
                li.appendChild(rango);
                lista.appendChild(li);
            });
            var fuente = leyenda.querySelector('.fwi-fuente');
            if (fuente) fuente.textContent = tr('fwiFuente');
        }

        titulo.addEventListener('click', function () {
            lista.hidden = !lista.hidden;
            titulo.setAttribute('aria-expanded', String(!lista.hidden));
            reconstruirLeyenda();
        });

        var fuente = document.createElement('div');
        fuente.id = 'capa-fwi-leyenda-fuente';
        fuente.className = 'fwi-fuente';

        leyenda.appendChild(titulo);
        leyenda.appendChild(lista);
        leyenda.appendChild(fuente);

        wrap.appendChild(boton);
        wrap.appendChild(estado);
        wrap.appendChild(leyenda);
        contenedor.appendChild(wrap);

        ui = { contenedor: wrap, boton: boton, leyenda: leyenda, estado: estado,
               reconstruirLeyenda: reconstruirLeyenda };
        reconstruirLeyenda();

        // Re-traducir si el usuario cambia de idioma (idiomas.js dispara este
        // evento; si no existe, el usuario verá el último idioma cacheado).
        document.addEventListener('manolito:idioma-cambiado', refrescarTextos);
    }

    function refrescarTextos() {
        if (!ui) return;
        ui.boton.querySelector('.fwi-texto').textContent = tr('fwiToggle');
        ui.boton.setAttribute('aria-label',
            estaActiva ? tr('fwiToggleDesactivar') : tr('fwiToggleActivar'));
        ui.reconstruirLeyenda();
    }

    function mostrarEstado(texto, conReintento) {
        if (!ui) return;
        ui.estado.innerHTML = '';
        ui.estado.appendChild(document.createTextNode(texto));
        if (conReintento) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = '↻';
            btn.setAttribute('aria-label', texto);
            btn.addEventListener('click', function () { api.activar(); });
            ui.estado.appendChild(btn);
        }
        ui.estado.classList.add('fwi-visible');
    }

    function ocultarEstado() {
        if (ui) ui.estado.classList.remove('fwi-visible');
    }

    // ------------------------------------------------------------------ Capa
    function limpiarTimeout() {
        if (timerTimeout) { clearTimeout(timerTimeout); timerTimeout = null; }
    }

    function activarCapa() {
        var map = obtenerMapa();
        if (!map) return; // aún no hay mapa; el retry loop lo reintentará

        if (!capaWms) {
            cargando = true;
            ui.boton.classList.add('fwi-cargando');
            mostrarEstado(tr('fwiCargando'), false);

            // EFFIS sirve el FWI del día: sin TIME el servidor devuelve tiles
            // vacíos. Se calcula la fecha UTC de hoy al instanciar la capa.
            var hoyUTC = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
            capaWms = L.tileLayer.wms(WMS_URL,
                Object.assign({}, WMS_OPTS, { time: hoyUTC }));

            var tileOk = false;
            capaWms.on('load', function () {
                tileOk = true;
                limpiarTimeout();
                cargando = false;
                ui.boton.classList.remove('fwi-cargando');
                ocultarEstado();
            });

            timerTimeout = setTimeout(function () {
                if (tileOk || !cargando) return;
                cargando = false;
                ui.boton.classList.remove('fwi-cargando');
                map.removeLayer(capaWms);
                capaWms = null;
                estaActiva = false;
                ui.boton.setAttribute('aria-pressed', 'false');
                ui.boton.setAttribute('aria-label', tr('fwiToggleActivar'));
                ui.leyenda.hidden = true;
                mostrarEstado(tr('fwiError'), true);
            }, TIMEOUT_CARGA_MS);
        }

        capaWms.addTo(map);
        estaActiva = true;
        ui.boton.setAttribute('aria-pressed', 'true');
        ui.boton.setAttribute('aria-label', tr('fwiToggleDesactivar'));
        ui.leyenda.hidden = false;
    }

    function desactivarCapa() {
        var map = obtenerMapa();
        limpiarTimeout();
        if (cargando) {
            cargando = false;
            if (ui) ui.boton.classList.remove('fwi-cargando');
        }
        if (map && capaWms) map.removeLayer(capaWms);
        estaActiva = false;
        if (ui) {
            ui.boton.setAttribute('aria-pressed', 'false');
            ui.boton.setAttribute('aria-label', tr('fwiToggleActivar'));
            ui.leyenda.hidden = true;
            ocultarEstado();
        }
    }

    // --------------------------------------------------------------- API pública
    var api = {
        activar: function () {
            if (estaActiva || cargando) return;
            if (!ui) return; // UI aún no inyectada; el retry seguirá
            activarCapa();
        },
        desactivar: function () { desactivarCapa(); },
        toggle: function () {
            if (estaActiva) desactivarCapa();
            else api.activar();
        },
        activa: function () { return estaActiva; }
    };
    window.capaFWI = api;

    // ------------------------------------------------- Inyección con retry loop
    // Espera a que exista el contenedor del mapa Y el mapa Leaflet expuesto.
    var intentos = 0;
    var intervalo = setInterval(function () {
        intentos++;
        var contenedor = document.getElementById('map');
        var mapListo = !!obtenerMapa();
        if (contenedor && mapListo) {
            clearInterval(intervalo);
            if (!ui) construirUI(document.body);
        } else if (intentos >= MAX_INTENTOS_DOM) {
            clearInterval(intervalo);
            // Sin mapa expuesto no podemos funcionar: no rompemos nada.
            if (typeof console !== 'undefined') {
                console.warn('[capa-fwi] No se encontró window.manolitoMapa ni window.map. ' +
                    'Añade `window.manolitoMapa = map;` tras crear el mapa en motor-cuantico.js');
            }
        }
    }, INTERVALO_DOM_MS);
})();
