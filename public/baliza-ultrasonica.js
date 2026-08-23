/**
 * MANOLIT∞ FORESTAL - Nodo de Sincronización Táctica P2P
 * Módulo 1: Baliza Ultrasónica de Proximidad (v2, reingeniería acústica)
 * =====================================================================
 *
 * QUÉ EMITEN Y QUÉ OYEN LOS MÓVILES DE VERDAD (la física manda):
 *
 *  - Los altavoces de smartphone reproducen hasta ~20 kHz, pero por
 *    encima de ~19 kHz caen mucho de volumen (respuesta del altavoz
 *    miniatura) y algunos sistemas de audio recortan a 48 kHz de
 *    muestreo. La banda 17-20 kHz es la que la literatura de "acoustic
 *    data transmission" usa porque es audible-para-el-móvil pero
 *    prácticamente inaudible para personas (el oído adulto raramente
 *    pasa de 16-17 kHz).
 *  - Los micrófonos de smartphone sí captan 17-20 kHz sin problema
 *    (muestrean a 44,1/48 kHz -> Nyquist 22/24 kHz), SIEMPRE que se
 *    desactiven los filtros de voz (echoCancellation, noiseSuppression,
 *    autoGainControl), que si no, borran el tono antes de analizarlo.
 *
 * CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR (por qué fallaba en campo):
 *
 *  1. BANDA REAL: antes 18,5-19,8 kHz con pasos de 40 Hz. 40 Hz entre
 *     símbolos con tramas de 80 ms roza el límite de resolución
 *     (incertidumbre ~1/0,08 s = 12,5 Hz, sí, pero con ruido y deriva
 *     del reloj se solapan los picos). Ahora: 33 símbolos entre
 *     17,3 y 19,86 kHz con pasos de 80 Hz (~7 bins FFT de separación a
 *     48 kHz/4096 puntos) y marca de inicio en 17,22 kHz.
 *
 *  2. BUG DE SÍMBOLOS DUPLICADOS (crítico): el bucle lee el espectro a
 *     ~60 fps, así que cada tono de 80 ms se veía 4-5 veces y el ID se
 *     registraba con caracteres repetidos ("AABBC..."), rompiendo el
 *     checksum casi siempre. Ahora hay una MÁQUINA DE ESTADOS: un tono
 *     solo se registra UNA vez, cuando permanece estable varios frames
 *     y luego cambia (o cesa).
 *
 *  3. UMBRAL ADAPTATIVO (SNR), no fijo: antes bastaba superar -65 dB y
 *     cualquier pitido electrónico colaba. Ahora el pico debe superar
 *     la MEDIANA del ruido de la banda en al menos +9 dB, que es el
 *     criterio clásico de detección de tonos en ruido (análisis de
 *     densidad espectral). El ruido ambiental plano ya no dispara nada.
 *
 *  4. SÍMBOLOS MÁS LARGOS (110 ms + 30 ms de guarda) con rampas de
 *     subida/bajada de 8 ms: evita los "clics" de conmutación que
 *     ensucian la FFT y que además delatan el tono al oído.
 *
 *  5. SEÑALES DE ALARMA AUDIBLES (nuevo): la baliza ultrasónica sirve
 *     para el "apretón de manos" automático, pero en una emergencia
 *     también hace falta LLAMAR LA ATENCIÓN DE PERSONAS. Se añaden dos
 *     señales que cualquier móvil emite alto y claro:
 *       - Sirena "yelp" (barrido 650↔1450 Hz): patrón de alerta real.
 *       - SOS en morse a 880 Hz (· · · — — — · · ·): universal.
 *     Ambas usan su propio AudioContext, funcionan aunque el modo
 *     emergencia ultrasónico esté parado.
 *
 * API:
 *   const baliza = new BalizaUltrasonica(id => console.log('cerca:', id));
 *   await baliza.iniciar();   // pide micrófono una vez
 *   baliza.detener();
 *   BalizaUltrasonica.emitirSirena(8);     // segundos, audible
 *   BalizaUltrasonica.emitirSOSMorse();    // audible
 *   BalizaUltrasonica.pararAlarmas();
 */

(function () {
'use strict';

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 33 símbolos, sin I/O/0/1 (confusión)

class BalizaUltrasonica {
    constructor(onDispositivoDetectado) {
        this.onDispositivoDetectado = onDispositivoDetectado;
        this.audioCtx = null;
        this.analizador = null;
        this.microfono = null;
        this.emitiendo = false;
        this.escuchando = false;
        this.idPropio = this.generarIdCorto();
        this.dispositivosVistos = new Map();

        // --- Plan de frecuencias (ver cabecera) ---
        this.FREQ_BASE = 17300;          // Hz, símbolo 0
        this.FREQ_PASO = 80;             // Hz entre símbolos (~7 bins FFT)
        this.FREQ_MARCA = 17220;         // marca de inicio de trama
        this.FREQ_MAX = this.FREQ_BASE + this.FREQ_PASO * (ALFABETO.length - 1); // 19.860 Hz
        this.DURACION_SIMBOLO_MS = 110;
        this.GUARDA_SIMBOLO_MS = 30;

        // --- Estado del receptor (máquina de estados anti-duplicados) ---
        this._tonoActual = null;         // frecuencia cuantizada vigente
        this._tonoFrames = 0;            // frames consecutivos en ese tono
        this._tramaActual = [];
        this._ultimoSimboloTs = 0;
        this._ultimoFrameConTonoTs = 0;
    }

    generarIdCorto() {
        let id = '';
        const cryptoObj = window.crypto || window.msCrypto;
        const buf = new Uint8Array(6);
        if (cryptoObj && cryptoObj.getRandomValues) cryptoObj.getRandomValues(buf);
        else for (let i = 0; i < 6; i++) buf[i] = Math.floor(Math.random() * 256);
        for (let i = 0; i < 6; i++) id += ALFABETO[buf[i] % ALFABETO.length];
        return id;
    }

    _calcularChecksum(id) {
        let suma = 0;
        for (const c of id) suma += ALFABETO.indexOf(c);
        return ALFABETO[suma % ALFABETO.length];
    }

    idAFrecuencias(idConChecksum) {
        return idConChecksum.split('').map(c => this.FREQ_BASE + ALFABETO.indexOf(c) * this.FREQ_PASO);
    }

    // Cuantiza una frecuencia al símbolo más cercano, o null si no cae
    // dentro de la tolerancia de ninguno (±medio paso).
    frecuenciaACaracter(freq) {
        const indice = Math.round((freq - this.FREQ_BASE) / this.FREQ_PASO);
        if (indice < 0 || indice >= ALFABETO.length) return null;
        const esperada = this.FREQ_BASE + indice * this.FREQ_PASO;
        if (Math.abs(freq - esperada) > this.FREQ_PASO / 2) return null;
        return ALFABETO[indice];
    }

    async iniciar() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.audioCtx.state === 'suspended') {
            try { await this.audioCtx.resume(); } catch (e) {}
        }
        await this.iniciarEscucha();
        this.iniciarEmision();
    }

    detener() {
        this.emitiendo = false;
        this.escuchando = false;
        if (this.audioCtx) { try { this.audioCtx.close(); } catch (e) {} }
        this.audioCtx = null;
    }

    // ---------------- EMISIÓN ULTRASÓNICA ----------------
    iniciarEmision() {
        this.emitiendo = true;
        const emitirCiclo = () => {
            if (!this.emitiendo || !this.audioCtx) return;
            this.emitirId(this.idPropio);
            const duracionTramaMs = (this.idPropio.length + 2) * (this.DURACION_SIMBOLO_MS + this.GUARDA_SIMBOLO_MS);
            const espera = 3500 + Math.random() * 2000;
            setTimeout(emitirCiclo, espera + duracionTramaMs);
        };
        emitirCiclo();
    }

    emitirId(id) {
        const checksum = this._calcularChecksum(id);
        const frecuencias = this.idAFrecuencias(id + checksum);
        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.35; // volumen de emisión (0-1)
        gain.connect(this.audioCtx.destination);

        let t = this.audioCtx.currentTime + 0.05;
        this._emitirTono(this.FREQ_MARCA, t, gain);
        t += (this.DURACION_SIMBOLO_MS + this.GUARDA_SIMBOLO_MS) / 1000;
        for (const f of frecuencias) {
            this._emitirTono(f, t, gain);
            t += (this.DURACION_SIMBOLO_MS + this.GUARDA_SIMBOLO_MS) / 1000;
        }
    }

    _emitirTono(freq, cuando, gainNode) {
        const osc = this.audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        // Envolvente con rampas de 8 ms: sin rampa, el arranque/parada
        // brusca genera un "clic" de banda ancha que contamina la FFT.
        const env = this.audioCtx.createGain();
        const dur = this.DURACION_SIMBOLO_MS / 1000;
        env.gain.setValueAtTime(0, cuando);
        env.gain.linearRampToValueAtTime(1, cuando + 0.008);
        env.gain.setValueAtTime(1, cuando + dur - 0.008);
        env.gain.linearRampToValueAtTime(0, cuando + dur);
        osc.connect(env);
        env.connect(gainNode);
        osc.start(cuando);
        osc.stop(cuando + dur + 0.01);
    }

    // ---------------- ESCUCHA ULTRASÓNICA ----------------
    async iniciarEscucha() {
        // echoCancellation/noiseSuppression/autoGainControl en false:
        // esos filtros de "limpieza de voz" clasifican un tono agudo y
        // estable como ruido y lo eliminan antes de que lo veamos.
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                channelCount: 1
            }
        });
        this.microfono = this.audioCtx.createMediaStreamSource(stream);
        this.analizador = this.audioCtx.createAnalyser();
        this.analizador.fftSize = 4096;
        this.analizador.smoothingTimeConstant = 0; // sin suavizado: necesitamos ver el tono real en cada frame
        this.microfono.connect(this.analizador);
        this.escuchando = true;
        this._bucleDeteccion();
    }

    _bucleDeteccion() {
        if (!this.escuchando || !this.analizador) return;
        const buffer = new Float32Array(this.analizador.frequencyBinCount);
        this.analizador.getFloatFrequencyData(buffer);

        const freqDetectada = this._detectarTono(buffer);
        this._maquinaEstados(freqDetectada);

        requestAnimationFrame(() => this._bucleDeteccion());
    }

    /**
     * Detección con umbral ADAPTATIVO: el pico de la banda debe superar
     * la mediana del ruido de la propia banda en >= +9 dB (y un mínimo
     * absoluto de -72 dB). Un pitido estable pero débil, o ruido de
     * banda ancha (que sube toda la banda a la vez, mediana incluida),
     * no pasan el filtro.
     */
    _detectarTono(buffer) {
        const sampleRate = this.audioCtx.sampleRate;
        const binHz = sampleRate / this.analizador.fftSize;
        const binMin = Math.max(0, Math.floor((this.FREQ_MARCA - 150) / binHz));
        const binMax = Math.min(buffer.length - 1, Math.ceil((this.FREQ_MAX + 150) / binHz));
        if (binMax - binMin < 8) return null; // sampleRate demasiado bajo para esta banda

        let mejorBin = -1, mejorValor = -Infinity;
        const valores = [];
        for (let i = binMin; i <= binMax; i++) {
            valores.push(buffer[i]);
            if (buffer[i] > mejorValor) { mejorValor = buffer[i]; mejorBin = i; }
        }

        // Mediana del ruido de banda (robusta frente al propio pico)
        valores.sort((a, b) => a - b);
        const mediana = valores[Math.floor(valores.length / 2)];

        if (mejorValor < -72) return null;                 // silencio absoluto
        if (mejorValor < mediana + 9) return null;         // no destaca sobre el ruido (SNR insuficiente)

        // El pico debe estar centrado en un bin único (un tono real),
        // no ser un escalón de banda ancha: comprobamos que los bins
        // vecinos inmediatos caen claramente.
        const izq = buffer[mejorBin - 1] !== undefined ? buffer[mejorBin - 1] : -Infinity;
        const der = buffer[mejorBin + 1] !== undefined ? buffer[mejorBin + 1] : -Infinity;
        if (Math.max(izq, der) > mejorValor - 3) return null; // demasiado plano = ruido

        return mejorBin * binHz;
    }

    /**
     * Máquina de estados: convierte la sucesión de frames (60 por
     * segundo) en símbolos discretos. Un tono SOLO se registra una vez:
     * cuando llevaba >= 2 frames estable y luego cambia o desaparece.
     * Así un símbolo de 110 ms (6-7 frames) se cuenta exactamente una
     * vez, y un parpadeo de un solo frame (ruido impulsivo) se ignora.
     */
    _maquinaEstados(freq) {
        const ahora = Date.now();

        if (freq === null) {
            // Silencio: si llevábamos un tono estable, ciérralo
            if (this._tonoActual !== null && this._tonoFrames >= 2) {
                this._registrarSimbolo(this._tonoActual, ahora);
            }
            this._tonoActual = null;
            this._tonoFrames = 0;
            // Si llevamos mucho sin recibir nada, la trama murió
            if (this._tramaActual.length > 0 && ahora - this._ultimoSimboloTs > 600) {
                this._tramaActual = [];
            }
            return;
        }

        // Cuantiza el tono: marca de inicio o símbolo del alfabeto
        let clave;
        if (Math.abs(freq - this.FREQ_MARCA) <= this.FREQ_PASO / 2) clave = 'MARCA';
        else clave = this.frecuenciaACaracter(freq);
        if (clave === null) { this._tonoActual = null; this._tonoFrames = 0; return; }

        if (clave === this._tonoActual) {
            this._tonoFrames++;
        } else {
            // Cambio de tono: el anterior, si era estable, ya es símbolo
            if (this._tonoActual !== null && this._tonoFrames >= 2) {
                this._registrarSimbolo(this._tonoActual, ahora);
            }
            this._tonoActual = clave;
            this._tonoFrames = 1;
        }
        this._ultimoFrameConTonoTs = ahora;
    }

    _registrarSimbolo(clave, ahora) {
        if (clave === 'MARCA') {
            this._tramaActual = [];
            this._ultimoSimboloTs = ahora;
            return;
        }
        // Símbolo de datos: debe llegar dentro del ritmo de la trama
        if (this._tramaActual.length === 0 && ahora - this._ultimoSimboloTs > 400) {
            // Símbolo suelto sin marca de inicio reciente: probablemente
            // nos comimos la marca o es ruido; lo usamos como arranque
            // optimista solo si después cuadra el checksum.
            this._tramaActual = [];
        }
        this._ultimoSimboloTs = ahora;
        this._tramaActual.push(clave);

        if (this._tramaActual.length === 7) { // 6 de ID + 1 de checksum
            const idDetectado = this._tramaActual.slice(0, 6).join('');
            const checksumRecibido = this._tramaActual[6];
            this._tramaActual = [];
            if (checksumRecibido !== this._calcularChecksum(idDetectado)) return; // ruido, se descarta
            if (idDetectado !== this.idPropio) this._notificarDispositivo(idDetectado);
        }
    }

    _notificarDispositivo(id) {
        const ahora = Date.now();
        const ultimaVez = this.dispositivosVistos.get(id);
        this.dispositivosVistos.set(id, ahora);
        if (!ultimaVez || ahora - ultimaVez > 20000) {
            if (this.onDispositivoDetectado) this.onDispositivoDetectado(id);
        }
    }

    // ============================================================
    // SEÑALES AUDIBLES DE ALARMA (para personas, no para móviles)
    // Estáticas: funcionan sin activar la baliza ultrasónica.
    // ============================================================

    /** Sirena tipo "yelp": barrido repetido 650 <-> 1450 Hz. */
    static emitirSirena(segundos = 8) {
        const ctx = BalizaUltrasonica._ctxAlarma();
        BalizaUltrasonica._alarmaHasta = Date.now() + segundos * 1000;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.value = 0.7;
        osc.type = 'triangle'; // más armónicos que el seno: suena "de sirena" y atraviesa mejor el ruido
        osc.connect(gain); gain.connect(ctx.destination);
        const t0 = ctx.currentTime;
        const ciclo = 0.55; // segundos por barrido
        const pasos = Math.ceil(segundos / ciclo);
        for (let i = 0; i < pasos; i++) {
            osc.frequency.setValueAtTime(650, t0 + i * ciclo);
            osc.frequency.linearRampToValueAtTime(1450, t0 + i * ciclo + ciclo / 2);
            osc.frequency.linearRampToValueAtTime(650, t0 + (i + 1) * ciclo);
        }
        osc.start(t0);
        osc.stop(t0 + segundos);
        return osc;
    }

    /** SOS en morse a 880 Hz: · · ·  — — —  · · · (x2) */
    static emitirSOSMorse() {
        const ctx = BalizaUltrasonica._ctxAlarma();
        const gain = ctx.createGain();
        gain.gain.value = 0.8;
        gain.connect(ctx.destination);
        const PUNTO = 0.12, RAYA = 0.36, HUECO = 0.12, HUECO_GRUPO = 0.45;
        const patron = [PUNTO, PUNTO, PUNTO, RAYA, RAYA, RAYA, PUNTO, PUNTO, PUNTO];
        let t = ctx.currentTime + 0.05;
        for (let rep = 0; rep < 2; rep++) {
            for (const dur of patron) {
                const osc = ctx.createOscillator();
                osc.type = 'sine'; osc.frequency.value = 880;
                osc.connect(gain);
                osc.start(t); osc.stop(t + dur);
                t += dur + HUECO;
            }
            t += HUECO_GRUPO;
        }
    }

    static pararAlarmas() {
        if (BalizaUltrasonica._ctx) {
            try { BalizaUltrasonica._ctx.close(); } catch (e) {}
            BalizaUltrasonica._ctx = null;
        }
    }

    static _ctxAlarma() {
        if (!BalizaUltrasonica._ctx || BalizaUltrasonica._ctx.state === 'closed') {
            BalizaUltrasonica._ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (BalizaUltrasonica._ctx.state === 'suspended') BalizaUltrasonica._ctx.resume();
        return BalizaUltrasonica._ctx;
    }
}

window.BalizaUltrasonica = BalizaUltrasonica;

})();