/**
 * MANOLIT∞ FORESTAL - Modo de Emergencia
 * Panel visual + orquestador de conexiones WebRTC reales
 *
 * ÚNICO ARCHIVO. No hace falta tocar nada más salvo añadir una línea
 * en tu index.html, DESPUÉS de baliza-ultrasonica.js:
 *
 *   <script src="baliza-ultrasonica.js"></script>
 *   <script src="modo-emergencia.js"></script>
 *
 * Qué hace:
 * 1. Inyecta su propio CSS y HTML (no toca tus otros ficheros).
 * 2. Pinta un botón flotante (triángulo de alerta) en cualquier pantalla,
 *    incluido encima del mapa. Al pulsarlo se abre el panel de emergencia.
 * 3. Al "Activar modo emergencia" arranca BalizaUltrasonica (ya la tienes).
 * 4. Cuando la baliza detecta un ID cercano, se decide automáticamente
 *    quién "llama" y quién "responde" (comparando IDs) para no chocar,
 *    y se abre un RTCPeerConnection real con canal de datos ("peligro").
 * 5. Señalización (el intercambio de SDP/ICE que WebRTC necesita para
 *    arrancar) es enchufable:
 *      - Si tu proyecto ya carga Firebase (firebase.firestore()), lo usa
 *        automáticamente vía una colección "senales_emergencia".
 *      - Si no hay Firebase, cae a un modo manual (copiar/pegar un código
 *        corto) para que puedas probar YA, hoy, entre dos móviles.
 *
 * Limitación honesta: sin ningún canal de señalización (Firebase u otro
 * servidor), dos móviles independientes NO pueden intercambiar SDP/ICE
 * solos por el aire; por eso existe el modo manual como red de seguridad.
 */

(function () {
  'use strict';

  // ============================================================
  // 1. ESTILOS
  // ============================================================
  const CSS = `
    :root {
      --me-rojo: #ff2b3d;
      --me-rojo-oscuro: #b30015;
      --me-fondo: #0d0f14;
      --me-panel: #14171f;
      --me-texto: #f2f2f2;
      --me-texto-tenue: #9aa0ab;
      --me-borde: #2a2f3a;
    }

    #me-fab {
      position: fixed;
      left: 18px;
      bottom: 18px;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(145deg, var(--me-rojo), var(--me-rojo-oscuro));
      box-shadow: 0 4px 18px rgba(255, 43, 61, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 99998;
      border: none;
      transition: transform .15s ease;
    }
    #me-fab:active { transform: scale(0.92); }
    #me-fab svg { width: 30px; height: 30px; }

    #me-fab.me-activo {
      animation: me-pulso 1.4s infinite;
    }
    @keyframes me-pulso {
      0%   { box-shadow: 0 0 0 0 rgba(255,43,61,0.65); }
      70%  { box-shadow: 0 0 0 16px rgba(255,43,61,0); }
      100% { box-shadow: 0 0 0 0 rgba(255,43,61,0); }
    }

    #me-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      z-index: 99999;
      display: none;
      align-items: flex-end;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #me-overlay.me-abierto { display: flex; }

    #me-panel {
      width: 100%;
      max-width: 480px;
      max-height: 82vh;
      overflow-y: auto;
      background: var(--me-panel);
      border-top: 1px solid var(--me-borde);
      border-radius: 20px 20px 0 0;
      padding: 20px 20px 28px;
      color: var(--me-texto);
      box-shadow: 0 -8px 30px rgba(0,0,0,0.5);
      animation: me-subir .22s ease-out;
    }
    @keyframes me-subir {
      from { transform: translateY(24px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }

    #me-panel h2 {
      margin: 0 0 4px;
      font-size: 19px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--me-rojo);
    }
    #me-panel .me-sub {
      color: var(--me-texto-tenue);
      font-size: 13px;
      margin-bottom: 16px;
      line-height: 1.4;
    }

    #me-btn-toggle {
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      border: none;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: .2px;
      cursor: pointer;
      background: var(--me-rojo);
      color: white;
      transition: background .15s ease;
    }
    #me-btn-toggle.me-on { background: #2a2f3a; }
    #me-btn-toggle:active { opacity: .85; }

    #me-estado {
      margin-top: 14px;
      font-size: 13px;
      color: var(--me-texto-tenue);
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 18px;
    }
    #me-estado .me-punto {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--me-texto-tenue);
      flex: none;
    }
    #me-estado.me-buscando .me-punto {
      background: #ffb020;
      animation: me-parpadeo 1s infinite;
    }
    @keyframes me-parpadeo { 50% { opacity: .25; } }

    #me-mi-id {
      margin-top: 8px;
      font-size: 12px;
      color: var(--me-texto-tenue);
    }
    #me-mi-id b { color: var(--me-texto); letter-spacing: 1px; }

    #me-lista {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .me-item {
      background: #1b1f29;
      border: 1px solid var(--me-borde);
      border-radius: 10px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
    }
    .me-item .me-id { font-weight: 700; letter-spacing: 1px; }
    .me-badge {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 20px;
      font-weight: 600;
    }
    .me-badge.buscando  { background: #3a3320; color: #ffb020; }
    .me-badge.conectando{ background: #26314a; color: #6aa0ff; }
    .me-badge.conectado { background: #1f3a26; color: #3ddc6a; }
    .me-badge.fallo     { background: #3a2020; color: #ff6a6a; }

    #me-log-wrap { display: none; margin-top: 16px; }
    #me-log-wrap.me-visible { display: block; }
    #me-log {
      background: #0a0c11;
      border: 1px solid var(--me-borde);
      border-radius: 10px;
      padding: 10px;
      height: 110px;
      overflow-y: auto;
      font-size: 12px;
      color: #c9d1d9;
      font-family: ui-monospace, monospace;
    }
    #me-log div { margin-bottom: 4px; }

    #me-envio { display: flex; gap: 8px; margin-top: 10px; }
    #me-envio input {
      flex: 1;
      background: #0a0c11;
      border: 1px solid var(--me-borde);
      border-radius: 8px;
      padding: 10px;
      color: var(--me-texto);
      font-size: 13px;
    }
    #me-envio button {
      background: var(--me-rojo);
      border: none;
      color: white;
      border-radius: 8px;
      padding: 0 16px;
      font-weight: 700;
      cursor: pointer;
    }

    /* --- Fallback manual de señalización --- */
    #me-manual { display: none; margin-top: 16px; border-top: 1px dashed var(--me-borde); padding-top: 14px; }
    #me-manual.me-visible { display: block; }
    #me-manual textarea {
      width: 100%;
      background: #0a0c11;
      border: 1px solid var(--me-borde);
      color: var(--me-texto);
      border-radius: 8px;
      font-size: 11px;
      padding: 8px;
      height: 60px;
      resize: none;
      box-sizing: border-box;
    }
    #me-manual label { font-size: 12px; color: var(--me-texto-tenue); display:block; margin: 8px 0 4px; }
    #me-manual button {
      margin-top: 8px;
      background: #2a2f3a;
      color: var(--me-texto);
      border: none;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      cursor: pointer;
    }

    #me-cerrar {
      position: absolute;
      top: 14px;
      right: 16px;
      background: none;
      border: none;
      color: var(--me-texto-tenue);
      font-size: 20px;
      cursor: pointer;
    }
  `;

  // ============================================================
  // 2. HTML
  // ============================================================
  const ICONO_TRIANGULO = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L1 21H23L12 3Z" fill="white"/>
      <rect x="11" y="9" width="2" height="6" fill="#b30015"/>
      <rect x="11" y="16.5" width="2" height="2" fill="#b30015"/>
    </svg>
  `;

  const HTML = `
    <button id="me-fab" title="Modo Emergencia">${ICONO_TRIANGULO}</button>
    <div id="me-overlay">
      <div id="me-panel" style="position:relative;">
        <button id="me-cerrar">✕</button>
        <h2>${ICONO_TRIANGULO.replace('width:30','width:20')} Modo Emergencia</h2>
        <div class="me-sub">
          Detecta a otras personas cerca por ultrasonido y abre una conexión
          directa (WebRTC) para intercambiar datos de peligro, sin depender
          de que todo el mundo tenga internet.
        </div>

        <button id="me-btn-toggle">Activar modo emergencia</button>

        <div id="me-estado"><span class="me-punto"></span><span id="me-estado-txt">Modo desactivado</span></div>
        <div id="me-mi-id"></div>

        <div id="me-lista"></div>

        <div id="me-log-wrap">
          <div id="me-log"></div>
          <div id="me-envio">
            <input id="me-input" placeholder="Mensaje de prueba..." />
            <button id="me-enviar">Enviar</button>
          </div>
        </div>

        <div id="me-manual">
          <div class="me-sub" style="margin-bottom:4px;">
            No se detectó Firebase en la página, así que la señalización va
            en modo manual: copia el código de abajo y pégaselo a la otra
            persona (por WhatsApp, AirDrop, lo que sea), y viceversa.
          </div>
          <label id="me-manual-label-local">Tu código (envíaselo a la otra persona):</label>
          <textarea id="me-manual-local" readonly></textarea>
          <label>Pega aquí el código que te han enviado:</label>
          <textarea id="me-manual-remoto"></textarea>
          <button id="me-manual-aplicar">Aplicar código recibido</button>
        </div>
      </div>
    </div>
  `;

  // ============================================================
  // 3. LÓGICA
  // ============================================================
  const RTC_CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  class GestorEmergencia {
    constructor() {
      this.activo = false;
      this.baliza = null;
      this.conexiones = new Map(); // id remoto -> { pc, canal, estado }
      this._pendienteManual = null; // { idRemoto, pc } a la espera de código pegado
      this._montarUI();
      this._canal = null; // canal de señalización, se resuelve al activar
    }

    // ---------- UI ----------
    _montarUI() {
      const estilo = document.createElement('style');
      estilo.textContent = CSS;
      document.head.appendChild(estilo);

      const contenedor = document.createElement('div');
      contenedor.innerHTML = HTML;
      document.body.appendChild(contenedor);

      this.$fab = document.getElementById('me-fab');
      this.$overlay = document.getElementById('me-overlay');
      this.$cerrar = document.getElementById('me-cerrar');
      this.$toggle = document.getElementById('me-btn-toggle');
      this.$estado = document.getElementById('me-estado');
      this.$estadoTxt = document.getElementById('me-estado-txt');
      this.$miId = document.getElementById('me-mi-id');
      this.$lista = document.getElementById('me-lista');
      this.$logWrap = document.getElementById('me-log-wrap');
      this.$log = document.getElementById('me-log');
      this.$input = document.getElementById('me-input');
      this.$enviar = document.getElementById('me-enviar');
      this.$manual = document.getElementById('me-manual');
      this.$manualLocal = document.getElementById('me-manual-local');
      this.$manualRemoto = document.getElementById('me-manual-remoto');
      this.$manualAplicar = document.getElementById('me-manual-aplicar');

      this.$fab.addEventListener('click', () => this.$overlay.classList.add('me-abierto'));
      this.$cerrar.addEventListener('click', () => this.$overlay.classList.remove('me-abierto'));
      this.$overlay.addEventListener('click', (e) => { if (e.target === this.$overlay) this.$overlay.classList.remove('me-abierto'); });
      this.$toggle.addEventListener('click', () => this.activo ? this.desactivar() : this.activar());
      this.$enviar.addEventListener('click', () => this._enviarPrueba());
      this.$manualAplicar.addEventListener('click', () => this._aplicarCodigoManual());
    }

    _log(msg) {
      const linea = document.createElement('div');
      const hora = new Date().toLocaleTimeString();
      linea.textContent = `[${hora}] ${msg}`;
      this.$log.appendChild(linea);
      this.$log.scrollTop = this.$log.scrollHeight;
    }

    // ---------- ACTIVAR / DESACTIVAR ----------
    async activar() {
      if (typeof window.BalizaUltrasonica !== 'function') {
        this.$estadoTxt.textContent = 'Falta baliza-ultrasonica.js en la página';
        return;
      }

      this._canal = this._obtenerCanalSenal();

      this.baliza = new window.BalizaUltrasonica((idDetectado) => this._alDetectarDispositivo(idDetectado));
      try {
        await this.baliza.iniciar();
      } catch (e) {
        this.$estadoTxt.textContent = 'No se pudo activar el micrófono';
        this._log('Error al iniciar la baliza: ' + e.message);
        return;
      }

      this.activo = true;
      this.$fab.classList.add('me-activo');
      this.$toggle.textContent = 'Desactivar modo emergencia';
      this.$toggle.classList.add('me-on');
      this.$estado.classList.add('me-buscando');
      this.$estadoTxt.textContent = 'Buscando dispositivos cercanos...';
      this.$miId.innerHTML = `Tu ID de emergencia: <b>${this.baliza.idPropio}</b>`;
      this.$logWrap.classList.add('me-visible');

      if (this._canal.tipo === 'manual') {
        this.$manual.classList.add('me-visible');
      }

      if (this._canal.escuchar) {
        this._canal.escuchar(this.baliza.idPropio, (de, mensaje) => this._alRecibirSenal(de, mensaje));
      }

      this._log('Modo emergencia activado. Escuchando ultrasonidos...');
    }

    desactivar() {
      this.activo = false;
      if (this.baliza) this.baliza.detener();
      for (const [, info] of this.conexiones) {
        try { info.pc.close(); } catch (e) {}
      }
      this.conexiones.clear();
      this._renderLista();

      this.$fab.classList.remove('me-activo');
      this.$toggle.textContent = 'Activar modo emergencia';
      this.$toggle.classList.remove('me-on');
      this.$estado.classList.remove('me-buscando');
      this.$estadoTxt.textContent = 'Modo desactivado';
      this.$manual.classList.remove('me-visible');
      this._log('Modo emergencia desactivado.');
    }

    // ---------- DETECCIÓN POR ULTRASONIDO ----------
    _alDetectarDispositivo(idRemoto) {
      if (this.conexiones.has(idRemoto)) return; // ya en curso
      this._log(`📡 Dispositivo detectado cerca: ${idRemoto}`);
      this._actualizarBadge(idRemoto, 'buscando');

      const idPropio = this.baliza.idPropio;
      const soyIniciador = idPropio < idRemoto; // regla determinista, evita choque

      this._crearConexionWebRTC(idRemoto, soyIniciador);
    }

    // ---------- WEBRTC ----------
    _crearConexionWebRTC(idRemoto, soyIniciador) {
      const pc = new RTCPeerConnection(RTC_CONFIG);
      const info = { pc, canalDatos: null, estado: 'conectando' };
      this.conexiones.set(idRemoto, info);
      this._actualizarBadge(idRemoto, 'conectando');

      pc.onicecandidate = (evento) => {
        if (evento.candidate) {
          this._enviarSenal(idRemoto, { tipo: 'candidato', candidato: evento.candidate });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          info.estado = 'conectado';
          this._actualizarBadge(idRemoto, 'conectado');
          this._log(`🔴 Conectado con ${idRemoto}. Canal de datos de peligro listo.`);
        } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          info.estado = 'fallo';
          this._actualizarBadge(idRemoto, 'fallo');
        }
      };

      if (soyIniciador) {
        const canal = pc.createDataChannel('peligro');
        this._prepararCanalDatos(canal, idRemoto, info);

        pc.createOffer()
          .then((oferta) => pc.setLocalDescription(oferta))
          .then(() => this._enviarSenal(idRemoto, { tipo: 'oferta', sdp: pc.localDescription }));
      } else {
        pc.ondatachannel = (evento) => this._prepararCanalDatos(evento.channel, idRemoto, info);
      }
    }

    _prepararCanalDatos(canal, idRemoto, info) {
      info.canalDatos = canal;
      canal.onopen = () => this._log(`✅ Canal de datos abierto con ${idRemoto}`);
      canal.onmessage = (evento) => this._log(`⬅️ ${idRemoto}: ${evento.data}`);
    }

    async _alRecibirSenal(idRemoto, mensaje) {
      let info = this.conexiones.get(idRemoto);

      if (mensaje.tipo === 'oferta') {
        if (!info) {
          this._crearConexionWebRTC(idRemoto, false);
          info = this.conexiones.get(idRemoto);
        }
        await info.pc.setRemoteDescription(new RTCSessionDescription(mensaje.sdp));
        const respuesta = await info.pc.createAnswer();
        await info.pc.setLocalDescription(respuesta);
        this._enviarSenal(idRemoto, { tipo: 'respuesta', sdp: info.pc.localDescription });
        return;
      }

      if (!info) return;

      if (mensaje.tipo === 'respuesta') {
        await info.pc.setRemoteDescription(new RTCSessionDescription(mensaje.sdp));
      } else if (mensaje.tipo === 'candidato') {
        try { await info.pc.addIceCandidate(mensaje.candidato); } catch (e) {}
      }
    }

    // ---------- CANAL DE SEÑALIZACIÓN (enchufable) ----------
    _obtenerCanalSenal() {
      if (window.canalSenalEmergencia) {
        return window.canalSenalEmergencia;
      }
      if (window.firebase && typeof firebase.firestore === 'function') {
        return this._crearCanalFirestore();
      }
      return this._crearCanalManual();
    }

    _crearCanalFirestore() {
      const db = firebase.firestore();
      const coleccion = db.collection('senales_emergencia');
      let callback = null;
      let idPropio = null;

      return {
        tipo: 'firestore',
        enviar: (destino, mensaje) => {
          coleccion.add({
            de: idPropio,
            para: destino,
            datos: JSON.stringify(mensaje),
            ts: Date.now()
          });
        },
        escuchar: (miId, cb) => {
          idPropio = miId;
          callback = cb;
          coleccion.where('para', '==', miId)
            .orderBy('ts')
            .onSnapshot((snap) => {
              snap.docChanges().forEach((cambio) => {
                if (cambio.type === 'added') {
                  const d = cambio.doc.data();
                  callback(d.de, JSON.parse(d.datos));
                }
              });
            });
        }
      };
    }

    _crearCanalManual() {
      const gestor = this;
      return {
        tipo: 'manual',
        enviar: (destino, mensaje) => {
          // Guarda el mensaje pendiente en el cuadro "tu código" para
          // que el usuario lo copie y se lo pase a mano a la otra persona.
          const paquete = { destino, mensaje };
          gestor.$manualLocal.value = btoa(JSON.stringify(paquete));
          gestor._log(`✋ Código de señalización listo para copiar (para ${destino})`);
        },
        escuchar: () => { /* el usuario pega el código a mano, ver _aplicarCodigoManual */ }
      };
    }

    _aplicarCodigoManual() {
      const texto = this.$manualRemoto.value.trim();
      if (!texto) return;
      try {
        const paquete = JSON.parse(atob(texto));
        this._alRecibirSenal(paquete.destino === this.baliza.idPropio ? paquete.mensaje.de || 'DESCONOCIDO' : paquete.destino, paquete.mensaje);
        this.$manualRemoto.value = '';
      } catch (e) {
        this._log('⚠️ Código pegado no válido');
      }
    }

    _enviarSenal(destino, mensaje) {
      if (!this._canal) return;
      // Adjuntamos el remitente para que el otro lado sepa quién habla
      const conRemitente = Object.assign({ de: this.baliza.idPropio }, mensaje);
      this._canal.enviar(destino, conRemitente);
    }

    // ---------- UI: lista de dispositivos ----------
    _actualizarBadge(id, estado) {
      let item = document.getElementById('me-item-' + id);
      if (!item) {
        item = document.createElement('div');
        item.id = 'me-item-' + id;
        item.className = 'me-item';
        item.innerHTML = `<span class="me-id">${id}</span><span class="me-badge"></span>`;
        this.$lista.appendChild(item);
      }
      const badge = item.querySelector('.me-badge');
      badge.className = 'me-badge ' + estado;
      const etiquetas = { buscando: 'buscando', conectando: 'conectando', conectado: 'conectado', fallo: 'fallo' };
      badge.textContent = etiquetas[estado] || estado;
    }

    _renderLista() {
      this.$lista.innerHTML = '';
    }

    // ---------- Enviar datos de peligro reales ----------
    enviarDatoPeligro(objeto) {
      const texto = JSON.stringify(objeto);
      let enviados = 0;
      for (const [, info] of this.conexiones) {
        if (info.canalDatos && info.canalDatos.readyState === 'open') {
          info.canalDatos.send(texto);
          enviados++;
        }
      }
      this._log(`📤 Dato de peligro enviado a ${enviados} dispositivo(s)`);
      return enviados;
    }

    _enviarPrueba() {
      const texto = this.$input.value.trim();
      if (!texto) return;
      const enviados = this.enviarDatoPeligro({ tipo: 'prueba', texto, ts: Date.now() });
      if (enviados === 0) this._log('⚠️ No hay ninguna conexión abierta todavía');
      this.$input.value = '';
    }
  }

  window.gestorEmergencia = new GestorEmergencia();

  // API pública mínima para el resto de tu app (por ejemplo, tu mapa
  // podría llamar a esto cuando detecte un incendio real):
  //   window.gestorEmergencia.activar()
  //   window.gestorEmergencia.enviarDatoPeligro({ lat, lng, tipo: 'incendio' })
})();