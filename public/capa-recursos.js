/**
 * MANOLIT∞ FORESTAL — Capa de recursos de extinción (OpenStreetMap / Overpass)
 * ---------------------------------------------------------------------------
 * Capa LAZY: no consulta a Overpass hasta que el usuario la activa.
 * Tipos: hidrantes, depósitos de agua, helisuperficies, balsas/embalses
 * y parques de bomberos. Filtrado en cliente, caché en sessionStorage,
 * debounce en moveend y protección ante rate-limit (429/504/timeout).
 *
 * Licencia: AGPL-3.0 (igual que el resto del proyecto).
 * Sin APIs de pago. Vanilla JS + Leaflet 1.9.4.
 *
 * Expone: window.capaRecursos = { activar, desactivar, toggle, activa, recargar }
 */
(function () {
    'use strict';

    /* ================= CONFIGURACIÓN ================= */

    var OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
    var DEBOUNCE_MS = 800;
    var MAX_LADO_GRADOS = 0.5;      // si el bbox supera 0.5° de lado, pedimos zoom
    var CACHE_PREFIX = 'mf-recursos:';
    var CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

    var TIPOS = {
        hidrante: {
            emoji: '🚰',
            i18n: 'recursos.tipoHidrante',
            overpass: [
                'node["emergency"="fire_hydrant"]({{bbox}});',
                'way["emergency"="fire_hydrant"]({{bbox}});'
            ]
        },
        deposito: {
            emoji: '🛢️',
            i18n: 'recursos.tipoDeposito',
            overpass: [
                'node["emergency"="water_tank"]({{bbox}});',
                'way["emergency"="water_tank"]({{bbox}});'
            ]
        },
        helisuperficie: {
            emoji: '🚁',
            i18n: 'recursos.tipoHelisuperficie',
            overpass: [
                'node["aeroway"="helipad"]({{bbox}});',
                'way["aeroway"="helipad"]({{bbox}});'
            ]
        },
        balsa: {
            emoji: '💧',
            i18n: 'recursos.tipoBalsa',
            overpass: [
                'node["natural"="water"]["water"~"^(reservoir|basin)$"]({{bbox}});',
                'way["natural"="water"]["water"~"^(reservoir|basin)$"]({{bbox}});',
                'way["landuse"="reservoir"]({{bbox}});'
            ]
        },
        bomberos: {
            emoji: '🚒',
            i18n: 'recursos.tipoBomberos',
            overpass: [
                'node["emergency"="fire_station"]({{bbox}});',
                'way["emergency"="fire_station"]({{bbox}});'
            ]
        }
    };

    /* ================= I18N CON FALLBACK ================= */
    /* El proyecto define t() en idiomas.js. Aquí resolvemos con cascada:
       window.t → window.i18n.t → IDIOMAS[lang] → fallback ES embebido → clave. */

    var FALLBACK_ES = {
        'recursos.toggleAria': 'Activar capa de recursos de extinción',
        'recursos.panelTitulo': 'Recursos de extinción',
        'recursos.tipoHidrante': 'Hidrante',
        'recursos.tipoDeposito': 'Depósito de agua',
        'recursos.tipoHelisuperficie': 'Helisuperficie',
        'recursos.tipoBalsa': 'Balsa / embalse',
        'recursos.tipoBomberos': 'Parque de bomberos',
        'recursos.cargando': 'Cargando recursos…',
        'recursos.errorSaturado': 'Servidor de mapas saturado. Inténtalo de nuevo en unos minutos.',
        'recursos.errorRed': 'Sin conexión con el servidor de recursos.',
        'recursos.zoomNecesario': 'Zona demasiado grande: acerca el mapa para cargar recursos.',
        'recursos.contador': '{n} recursos en la zona visible',
        'recursos.sinResultados': 'No hay recursos de este tipo en la zona visible.',
        'recursos.copiar': 'Copiar coords',
        'recursos.copiado': '¡Copiado!',
        'recursos.tipo': 'Tipo',
        'recursos.nombre': 'Nombre',
        'recursos.coords': 'Coordenadas',
        'recursos.reintentar': 'Reintentar'
    };

    function idiomaActual() {
        var sel = document.getElementById('selector-idioma');
        if (sel && sel.value) return sel.value;
        var html = document.documentElement.lang;
        return (html || 'es').slice(0, 2);
    }

    function tr(clave) {
        try {
            if (typeof window.t === 'function') {
                var v = window.t(clave);
                if (v && v !== clave) return v;
            }
            if (window.i18n && typeof window.i18n.t === 'function') {
                var v2 = window.i18n.t(clave);
                if (v2 && v2 !== clave) return v2;
            }
            if (window.IDIOMAS) {
                var lang = idiomaActual();
                var pack = window.IDIOMAS[lang] || window.IDIOMAS.es;
                if (pack && pack[clave]) return pack[clave];
            }
        } catch (e) { /* cascada al fallback */ }
        return FALLBACK_ES[clave] || clave;
    }

    /* ================= ESTADO ================= */

    var mapa = null;
    var grupo = null;            // L.layerGroup con los marcadores
    var elementos = [];          // datos brutos de la última consulta
    var filtros = {};            // tipo → boolean (todos activos al inicio)
    var estaActiva = false;
    var consultaEnCurso = false;
    var debounceTimer = null;
    var ui = {};                 // referencias DOM
    var haSidoConsultado = false;

    Object.keys(TIPOS).forEach(function (k) { filtros[k] = true; });

    /* ================= OVERPASS ================= */

    function bboxActual() {
        var b = mapa.getBounds();
        return {
            south: b.getSouth(), west: b.getWest(),
            north: b.getNorth(), east: b.getEast()
        };
    }

    function bboxDemasiadoGrande(b) {
        return (b.north - b.south) > MAX_LADO_GRADOS ||
               (b.east - b.west) > MAX_LADO_GRADOS;
    }

    function claveCache(b) {
        function r(x) { return Math.round(x * 100) / 100; }
        return CACHE_PREFIX + r(b.south) + ',' + r(b.west) + ',' + r(b.north) + ',' + r(b.east);
    }

    function leerCache(clave) {
        try {
            var raw = sessionStorage.getItem(clave);
            if (!raw) return null;
            var obj = JSON.parse(raw);
            if (!obj || (Date.now() - obj.ts) > CACHE_TTL_MS) return null;
            return obj.elementos;
        } catch (e) { return null; }
    }

    function guardarCache(clave, lista) {
        try {
            sessionStorage.setItem(clave, JSON.stringify({ ts: Date.now(), elementos: lista }));
        } catch (e) { /* sessionStorage lleno: seguimos sin caché */ }
    }

    function construirQuery(b) {
        var bboxStr = b.south + ',' + b.west + ',' + b.north + ',' + b.east;
        var partes = [];
        Object.keys(TIPOS).forEach(function (k) {
            TIPOS[k].overpass.forEach(function (frag) {
                partes.push(frag.split('{{bbox}}').join(bboxStr));
            });
        });
        return '[out:json][timeout:25];(' + partes.join('') + ');out center;';
    }

    function clasificar(tags) {
        if (!tags) return null;
        if (tags.emergency === 'fire_hydrant') return 'hidrante';
        if (tags.emergency === 'water_tank') return 'deposito';
        if (tags.aeroway === 'helipad') return 'helisuperficie';
        if (tags.emergency === 'fire_station') return 'bomberos';
        if (tags.natural === 'water' || tags.landuse === 'reservoir') return 'balsa';
        return null;
    }

    function normalizar(el) {
        var lat = el.lat, lon = el.lon;
        if (el.type === 'way' && el.center) { lat = el.center.lat; lon = el.center.lon; }
        if (typeof lat !== 'number' || typeof lon !== 'number') return null;
        var tipo = clasificar(el.tags || {});
        if (!tipo) return null;
        return {
            tipo: tipo,
            lat: lat,
            lon: lon,
            nombre: (el.tags && (el.tags.name || el.tags.operator)) || null
        };
    }

    /* ================= CONSULTA (lazy, con caché y rate-limit) ================= */

    function consultar() {
        if (!estaActiva || !mapa || consultaEnCurso) return;

        var b = bboxActual();

        if (bboxDemasiadoGrande(b)) {
            elementos = [];
            pintarMarcadores();
            mostrarEstado('zoom');
            return;
        }

        var ck = claveCache(b);
        var enCache = leerCache(ck);
        if (enCache) {
            elementos = enCache;
            haSidoConsultado = true;
            pintarMarcadores();
            mostrarEstado('ok');
            return;
        }

        consultaEnCurso = true;
        mostrarEstado('cargando');

        fetch(OVERPASS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'data=' + encodeURIComponent(construirQuery(b))
        })
            .then(function (res) {
                if (res.status === 429 || res.status === 504) {
                    // Rate limit / gateway saturado: avisar y NO reintentar en bucle.
                    throw new Error('saturado');
                }
                if (!res.ok) throw new Error('http_' + res.status);
                return res.json();
            })
            .then(function (json) {
                var lista = (json.elements || []).map(normalizar).filter(Boolean);
                elementos = lista;
                haSidoConsultado = true;
                guardarCache(ck, lista);
                pintarMarcadores();
                mostrarEstado('ok');
            })
            .catch(function (err) {
                if (err && err.message === 'saturado') mostrarEstado('saturado');
                else mostrarEstado('red');
            })
            .finally(function () {
                consultaEnCurso = false;
            });
    }

    function alMoverMapa() {
        if (!estaActiva) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(consultar, DEBOUNCE_MS);
    }

    /* ================= PINTADO ================= */

    function icono(tipo) {
        return L.divIcon({
            className: 'mf-recurso-icono mf-recurso-' + tipo,
            html: '<span role="img" aria-label="' + tr(TIPOS[tipo].i18n) + '">' +
                  TIPOS[tipo].emoji + '</span>',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -14]
        });
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function htmlPopup(el) {
        var coords = el.lat.toFixed(5) + ', ' + el.lon.toFixed(5);
        var html = '<div class="mf-recurso-popup">' +
            '<strong>' + tr('recursos.tipo') + ':</strong> ' + escapeHtml(tr(TIPOS[el.tipo].i18n)) + '<br>';
        if (el.nombre) {
            html += '<strong>' + tr('recursos.nombre') + ':</strong> ' + escapeHtml(el.nombre) + '<br>';
        }
        html += '<strong>' + tr('recursos.coords') + ':</strong> <code>' + coords + '</code><br>' +
            '<button type="button" class="mf-btn-copiar" data-coords="' + coords + '" ' +
            'style="min-width:48px;min-height:48px;margin-top:6px;cursor:pointer;">' +
            tr('recursos.copiar') + '</button></div>';
        return html;
    }

    function pintarMarcadores() {
        if (!grupo) return;
        grupo.clearLayers();
        var visibles = 0;
        elementos.forEach(function (el) {
            if (!filtros[el.tipo]) return;
            visibles++;
            L.marker([el.lat, el.lon], { icon: icono(el.tipo), title: tr(TIPOS[el.tipo].i18n) })
                .bindPopup(htmlPopup(el))
                .addTo(grupo);
        });
        actualizarContador(visibles);
    }

    /* ================= UI: ESTADO / CONTADOR ================= */

    function mostrarEstado(estado) {
        if (!ui.estado) return;
        ui.estado.classList.remove('mf-cargando');
        ui.spinner.hidden = true;
        switch (estado) {
            case 'cargando':
                ui.estado.textContent = tr('recursos.cargando');
                ui.spinner.hidden = false;
                ui.estado.classList.add('mf-cargando');
                break;
            case 'saturado':
                ui.estado.textContent = tr('recursos.errorSaturado');
                break;
            case 'red':
                ui.estado.textContent = tr('recursos.errorRed');
                break;
            case 'zoom':
                ui.estado.textContent = tr('recursos.zoomNecesario');
                actualizarContador(0);
                break;
            default:
                ui.estado.textContent = '';
        }
    }

    function actualizarContador(n) {
        if (!ui.contador) return;
        if (!haSidoConsultado) { ui.contador.textContent = ''; return; }
        var msg = tr('recursos.contador').replace('{n}', String(n));
        if (n === 0 && elementos.length === 0) {
            var b = mapa ? bboxActual() : null;
            if (b && !bboxDemasiadoGrande(b)) msg = tr('recursos.sinResultados');
        }
        ui.contador.textContent = msg;
    }

    /* ================= UI: TOGGLE + PANEL ================= */

    function inyectarEstilos() {
        if (document.getElementById('mf-recursos-css')) return;
        var css = document.createElement('style');
        css.id = 'mf-recursos-css';
        css.textContent =
            /* Botón: abajo-IZQUIERDA (chat abajo-derecha, dashboard arriba-derecha,
               selector de idioma arriba-izquierda → sin colisiones). */
            '#mf-recursos-toggle{position:fixed;left:12px;bottom:12px;z-index:1000;' +
            'min-width:48px;min-height:48px;border-radius:12px;border:1px solid rgba(0,243,255,.4);' +
            'background:rgba(10,14,20,.9);color:#fff;font-size:1.4rem;cursor:pointer;' +
            'display:flex;align-items:center;justify-content:center;padding:0 12px;gap:6px}' +
            '#mf-recursos-toggle[aria-pressed="true"]{background:rgba(0,120,180,.85)}' +
            '#mf-recursos-panel{position:fixed;left:12px;bottom:72px;z-index:1000;' +
            'background:rgba(10,14,20,.94);color:#eee;border:1px solid rgba(0,243,255,.35);' +
            'border-radius:12px;padding:12px 14px;min-width:220px;max-width:calc(100vw - 24px);' +
            'font-size:.95rem;backdrop-filter:blur(4px)}' +
            '#mf-recursos-panel[hidden]{display:none}' +
            '#mf-recursos-panel fieldset{border:none;margin:0;padding:0}' +
            '#mf-recursos-panel legend{font-weight:700;margin-bottom:8px}' +
            '#mf-recursos-panel label{display:flex;align-items:center;gap:10px;' +
            'min-height:48px;cursor:pointer}' +
            '#mf-recursos-panel input[type=checkbox]{width:22px;height:22px}' +
            '#mf-recursos-estado{margin-top:8px;min-height:1.2em;color:#ffb347;display:flex;' +
            'align-items:center;gap:8px}' +
            '#mf-recursos-contador{margin-top:4px;color:#7fd4ff}' +
            '.mf-spinner{width:18px;height:18px;border:3px solid rgba(255,255,255,.25);' +
            'border-top-color:#00f3ff;border-radius:50%;animation:mf-spin 1s linear infinite}' +
            '@keyframes mf-spin{to{transform:rotate(360deg)}}' +
            '.mf-recurso-icono{background:rgba(10,14,20,.85);border:2px solid #00f3ff;' +
            'border-radius:50%;display:flex;align-items:center;justify-content:center;' +
            'font-size:16px;box-shadow:0 0 6px rgba(0,0,0,.6)}' +
            '.mf-recurso-popup code{user-select:all}' +
            '@media (max-width:420px){#mf-recursos-panel{left:12px;right:12px;max-width:none}}';
        document.head.appendChild(css);
    }

    function crearUI() {
        inyectarEstilos();

        var toggle = document.createElement('button');
        toggle.id = 'mf-recursos-toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-pressed', 'false');
        toggle.setAttribute('aria-label', tr('recursos.toggleAria'));
        toggle.setAttribute('aria-controls', 'mf-recursos-panel');
        toggle.innerHTML = '<span aria-hidden="true">🚒</span>';

        var panel = document.createElement('section');
        panel.id = 'mf-recursos-panel';
        panel.setAttribute('aria-label', tr('recursos.panelTitulo'));
        panel.hidden = true;

        var fieldset = document.createElement('fieldset');
        var legend = document.createElement('legend');
        legend.textContent = tr('recursos.panelTitulo');
        fieldset.appendChild(legend);

        Object.keys(TIPOS).forEach(function (k) {
            var label = document.createElement('label');
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = true;
            cb.dataset.tipo = k;
            cb.setAttribute('aria-label', tr(TIPOS[k].i18n));
            cb.addEventListener('change', function () {
                filtros[k] = cb.checked;   // filtrado en cliente, sin re-consultar
                pintarMarcadores();
            });
            label.appendChild(cb);
            var span = document.createElement('span');
            span.textContent = TIPOS[k].emoji + ' ' + tr(TIPOS[k].i18n);
            label.appendChild(span);
            fieldset.appendChild(label);
        });
        panel.appendChild(fieldset);

        var estado = document.createElement('p');
        estado.id = 'mf-recursos-estado';
        estado.setAttribute('aria-live', 'polite');
        var spinner = document.createElement('span');
        spinner.className = 'mf-spinner';
        spinner.hidden = true;
        spinner.setAttribute('aria-hidden', 'true');
        estado.appendChild(spinner);
        var estadoTxt = document.createElement('span');
        estado.appendChild(estadoTxt);
        panel.appendChild(estado);

        var contador = document.createElement('p');
        contador.id = 'mf-recursos-contador';
        contador.setAttribute('aria-live', 'polite');
        panel.appendChild(contador);

        document.body.appendChild(toggle);
        document.body.appendChild(panel);

        ui.toggle = toggle;
        ui.panel = panel;
        ui.estado = estadoTxt;
        ui.spinner = spinner;
        ui.contador = contador;

        toggle.addEventListener('click', function () {
            toggleCapa();
        });

        // Botón "Copiar coords" dentro de popups (delegado sobre el mapa)
        mapa.on('popupopen', function (e) {
            var node = e.popup && e.popup.getElement();
            if (!node) return;
            var btn = node.querySelector('.mf-btn-copiar');
            if (!btn) return;
            btn.addEventListener('click', function () {
                var texto = btn.dataset.coords;
                function feedback() {
                    var antes = btn.textContent;
                    btn.textContent = tr('recursos.copiado');
                    btn.disabled = true;
                    setTimeout(function () { btn.textContent = antes; btn.disabled = false; }, 1500);
                }
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(texto).then(feedback, feedback);
                } else {
                    var ta = document.createElement('textarea');
                    ta.value = texto;
                    document.body.appendChild(ta);
                    ta.select();
                    try { document.execCommand('copy'); } catch (e2) { /* noop */ }
                    document.body.removeChild(ta);
                    feedback();
                }
            });
        });
    }

    /* ================= API PÚBLICA ================= */

    function activar() {
        if (estaActiva || !mapa) return;
        estaActiva = true;
        if (!grupo) grupo = L.layerGroup().addTo(mapa);
        else grupo.addTo(mapa);
        mapa.on('moveend', alMoverMapa);
        ui.toggle.setAttribute('aria-pressed', 'true');
        ui.panel.hidden = false;
        consultar(); // primera consulta: aquí empieza la carga lazy
    }

    function desactivar() {
        if (!estaActiva) return;
        estaActiva = false;
        clearTimeout(debounceTimer);
        mapa.off('moveend', alMoverMapa);
        if (grupo) mapa.removeLayer(grupo);
        ui.toggle.setAttribute('aria-pressed', 'false');
        ui.panel.hidden = true;
        mostrarEstado('ok');
    }

    function toggleCapa() { estaActiva ? desactivar() : activar(); }

    function recargar() {
        // Invalida la caché del bbox actual y fuerza re-consulta si está activa.
        if (mapa) {
            try { sessionStorage.removeItem(claveCache(bboxActual())); } catch (e) { /* noop */ }
        }
        if (estaActiva) consultar();
    }

    window.capaRecursos = {
        activar: activar,
        desactivar: desactivar,
        toggle: toggleCapa,
        activa: function () { return estaActiva; },
        recargar: recargar
    };

    /* ================= ARRANQUE: resolver el mapa con retry loop ================= */
    /* motor-cuantico.js declara `const map = L.map('map', …)` en ámbito global
       de script (no en window). Probamos varios hooks antes de rendirnos. */

    function resolverMapa() {
        if (window.manolitoMapa && typeof window.manolitoMapa.getBounds === 'function') {
            return window.manolitoMapa;
        }
        if (window.map && typeof window.map.getBounds === 'function') {
            return window.map;
        }
        try {
            // eslint-disable-next-line no-undef
            if (typeof map !== 'undefined' && map && typeof map.getBounds === 'function') {
                return map; // binding léxico global del script motor-cuantico.js
            }
        } catch (e) { /* no disponible */ }
        return null;
    }

    var intentos = 0;
    var MAX_INTENTOS = 20;
    var intervalo = setInterval(function () {
        var m = resolverMapa();
        if (m && document.body) {
            clearInterval(intervalo);
            mapa = m;
            crearUI();
        } else if (++intentos >= MAX_INTENTOS) {
            clearInterval(intervalo);
            console.warn('[capa-recursos] mapa Leaflet no encontrado tras ' +
                MAX_INTENTOS + ' intentos; window.capaRecursos queda expuesta pero inactiva.');
        }
    }, 200);
})();
