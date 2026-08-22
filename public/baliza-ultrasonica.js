/**
 * MANOLIT∞ FORESTAL - Nodo de Sincronización Táctica P2P
 * Módulo 1: Baliza Ultrasónica de Proximidad
 *
 * Qué hace: emite y detecta un identificador corto codificado en frecuencias
 * ultrasónicas (18.5 - 19.5 kHz, inaudibles para el oído humano) usando el
 * altavoz y micrófono del propio dispositivo, vía Web Audio API.
 *
 * Por qué ultrasonido y no QR/Bluetooth:
 * - Bluetooth Web API: NO funciona en iPhone (Safari lo bloquea).
 * - QR: requiere acción manual de cada persona, lento en una emergencia.
 * - Ultrasonido: funciona en Android e iPhone por igual, es automático
 *   (solo pide permiso de micrófono una vez), y no requiere confianza
 *   ciega en un código que no sabes qué contiene.
 *
 * Limitación honesta: esto SOLO sirve para el "apretón de manos" inicial
 * (detectar que hay alguien cerca e intercambiar un identificador corto).
 * El intercambio real de datos de peligro se hace después vía WebRTC,
 * normalmente sobre una red WiFi local (con o sin internet).
 */

class BalizaUltrasonica {
    constructor(onDispositivoDetectado) {
        this.onDispositivoDetectado = onDispositivoDetectado;
        this.audioCtx = null;
        this.oscilador = null;
        this.analizador = null;
        this.microfono = null;
        this.emitiendo = false;
        this.escuchando = false;
        this.idPropio = this.generarIdCorto();
        this.dispositivosVistos = new Map(); // id -> timestamp última detección
        this.FREQ_BASE = 18500; // Hz, inicio del rango ultrasónico usado
        this.FREQ_PASO = 40;    // separación entre "símbolos" de frecuencia
        this.DURACION_SIMBOLO_MS = 80;
    }

    generarIdCorto() {
        // 6 caracteres alfanuméricos, suficiente para identificar un
        // dispositivo en un radio pequeño sin colisiones prácticas.
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let id = '';
        for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
        return id;
    }

    // Convierte el ID (6 caracteres) en una secuencia de frecuencias,
    // una por carácter, dentro del rango ultrasónico.
    idAFrecuencias(id) {
        const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        return id.split('').map(c => this.FREQ_BASE + alfabeto.indexOf(c) * this.FREQ_PASO);
    }

    frecuenciaACaracter(freq) {
        const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        const indice = Math.round((freq - this.FREQ_BASE) / this.FREQ_PASO);
        return (indice >= 0 && indice < alfabeto.length) ? alfabeto[indice] : null;
    }

    async iniciar() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        await this.iniciarEscucha();
        this.iniciarEmision();
    }

    detener() {
        this.emitiendo = false;
        this.escuchando = false;
        if (this.oscilador) { try { this.oscilador.stop(); } catch (e) {} }
        if (this.audioCtx) { this.audioCtx.close(); }
    }

    // --- EMISIÓN: repite el identificador propio cada pocos segundos ---
    iniciarEmision() {
        this.emitiendo = true;
        const emitirCiclo = () => {
            if (!this.emitiendo) return;
            this.emitirId(this.idPropio);
            // Emite cada 4-6 segundos (aleatorio para evitar que todos
            // los dispositivos emitan a la vez y se pisen entre sí).
            const espera = 4000 + Math.random() * 2000;
            setTimeout(emitirCiclo, espera + this.idPropio.length * (this.DURACION_SIMBOLO_MS + 20));
        };
        emitirCiclo();
    }

    emitirId(id) {
        const frecuencias = this.idAFrecuencias(id);
        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.15; // volumen bajo, suficiente para el rango de detección deseado
        gain.connect(this.audioCtx.destination);

        let tiempoActual = this.audioCtx.currentTime;
        // Tono de "inicio de trama" fijo, para que el receptor sepa
        // cuándo empieza un identificador nuevo.
        this._emitirTono(this.FREQ_BASE - this.FREQ_PASO, tiempoActual, gain);
        tiempoActual += (this.DURACION_SIMBOLO_MS + 15) / 1000;

        frecuencias.forEach(freq => {
            this._emitirTono(freq, tiempoActual, gain);
            tiempoActual += (this.DURACION_SIMBOLO_MS + 15) / 1000;
        });
    }

    _emitirTono(freq, cuando, gainNode) {
        const osc = this.audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gainNode);
        osc.start(cuando);
        osc.stop(cuando + this.DURACION_SIMBOLO_MS / 1000);
    }

    // --- ESCUCHA: capta el micrófono y decodifica identificadores ajenos ---
    async iniciarEscucha() {
        try {
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
            this.microfono.connect(this.analizador);
            this.escuchando = true;
            this._bucleDeteccion();
        } catch (e) {
            console.warn('[BalizaUltrasonica] No se pudo acceder al micrófono:', e.message);
        }
    }

    _bucleDeteccion() {
        if (!this.escuchando) return;
        const buffer = new Float32Array(this.analizador.frequencyBinCount);
        this.analizador.getFloatFrequencyData(buffer);

        const freqDetectada = this._detectarPicoFrecuencia(buffer);
        if (freqDetectada) this._procesarSimboloDetectado(freqDetectada);

        requestAnimationFrame(() => this._bucleDeteccion());
    }

    _detectarPicoFrecuencia(buffer) {
        const sampleRate = this.audioCtx.sampleRate;
        const binHz = sampleRate / (this.analizador.fftSize);
        const binMin = Math.floor((this.FREQ_BASE - this.FREQ_PASO * 2) / binHz);
        const binMax = Math.ceil((this.FREQ_BASE + this.FREQ_PASO * 34) / binHz);

        let mejorBin = -1;
        let mejorValor = -100; // dB, umbral mínimo de detección
        for (let i = binMin; i <= binMax && i < buffer.length; i++) {
            if (buffer[i] > mejorValor) { mejorValor = buffer[i]; mejorBin = i; }
        }
        if (mejorValor < -65) return null; // demasiado débil, ruido de fondo
        return mejorBin * binHz;
    }

    _procesarSimboloDetectado(freq) {
        // Acumula símbolos detectados en una ventana corta de tiempo y,
        // cuando se completa una trama de 6 caracteres tras el tono de
        // inicio, la interpreta como un ID de dispositivo cercano.
        const ahora = Date.now();
        if (!this._tramaActual) this._tramaActual = [];

        const esInicioTrama = Math.abs(freq - (this.FREQ_BASE - this.FREQ_PASO)) < this.FREQ_PASO / 2;
        if (esInicioTrama) {
            this._tramaActual = [];
            this._ultimoSimboloTs = ahora;
            return;
        }

        if (!this._ultimoSimboloTs || ahora - this._ultimoSimboloTs > 300) return; // fuera de ventana
        this._ultimoSimboloTs = ahora;

        const caracter = this.frecuenciaACaracter(freq);
        if (caracter) this._tramaActual.push(caracter);

        if (this._tramaActual.length === 6) {
            const idDetectado = this._tramaActual.join('');
            this._tramaActual = [];
            if (idDetectado !== this.idPropio) {
                this._notificarDispositivo(idDetectado);
            }
        }
    }

    _notificarDispositivo(id) {
        const ahora = Date.now();
        const ultimaVez = this.dispositivosVistos.get(id);
        this.dispositivosVistos.set(id, ahora);
        // Solo avisa si es la primera vez, o si llevaba más de 20s sin verse
        // (para no saturar con notificaciones repetidas del mismo vecino).
        if (!ultimaVez || ahora - ultimaVez > 20000) {
            if (this.onDispositivoDetectado) this.onDispositivoDetectado(id);
        }
    }
}

// Exponer globalmente para uso desde el resto de la app
window.BalizaUltrasonica = BalizaUltrasonica;