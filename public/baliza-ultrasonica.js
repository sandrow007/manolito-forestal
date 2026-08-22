/**
 * MANOLIT∞ FORESTAL - Nodo de Sincronización Táctica P2P
 * Módulo 1: Baliza Ultrasónica de Proximidad
 *
 * Qué hace: emite y detecta un identificador corto codificado en frecuencias
 * ultrasónicas (18.5 - 19.5 kHz, inaudibles para el oído humano) usando el
 * altavoz y micrófono del propio dispositivo, vía Web Audio API.
 *
 * NOVEDAD (filtro anti-ruido): cada trama ahora lleva 6 caracteres de ID
 * + 1 carácter de checksum (verificación). Antes, cualquier pitido agudo
 * ambiental (aire acondicionado, electrónica) podía leerse como un "ID"
 * falso, dando IDs disparatados tipo "EEEEEE" o "MMMMMM" que nunca
 * correspondían a un dispositivo real. Con el checksum, el receptor
 * comprueba si el ID "cuadra" matemáticamente antes de aceptarlo; el
 * ruido aleatorio solo cuadra por casualidad 1 de cada 33 veces, así que
 * casi todo el ruido se descarta en silencio.
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
 * El intercambio real de datos de peligro se hace después vía WebRTC.
 */

(function () {

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 33 símbolos

class BalizaUltrasonica {
    constructor(onDispositivoDetectado) {
        this.onDispositivoDetectado = onDispositivoDetectado;
        this.audioCtx = null;
        this.analizador = null;
        this.microfono = null;
        this.emitiendo = false;
        this.escuchando = false;
        this.idPropio = this.generarIdCorto();
        this.dispositivosVistos = new Map(); // id -> timestamp última detección
        this.FREQ_BASE = 18500;
        this.FREQ_PASO = 40;
        this.DURACION_SIMBOLO_MS = 80;
    }

    generarIdCorto() {
        let id = '';
        for (let i = 0; i < 6; i++) id += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
        return id;
    }

    // Checksum simple: suma de los índices de cada carácter, módulo el
    // tamaño del alfabeto, convertido de nuevo a carácter.
    _calcularChecksum(id) {
        let suma = 0;
        for (const c of id) suma += ALFABETO.indexOf(c);
        return ALFABETO[suma % ALFABETO.length];
    }

    idAFrecuencias(idConChecksum) {
        return idConChecksum.split('').map(c => this.FREQ_BASE + ALFABETO.indexOf(c) * this.FREQ_PASO);
    }

    frecuenciaACaracter(freq) {
        const indice = Math.round((freq - this.FREQ_BASE) / this.FREQ_PASO);
        return (indice >= 0 && indice < ALFABETO.length) ? ALFABETO[indice] : null;
    }

    async iniciar() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        await this.iniciarEscucha();
        this.iniciarEmision();
    }

    detener() {
        this.emitiendo = false;
        this.escuchando = false;
        if (this.audioCtx) { try { this.audioCtx.close(); } catch (e) {} }
    }

    iniciarEmision() {
        this.emitiendo = true;
        const emitirCiclo = () => {
            if (!this.emitiendo) return;
            this.emitirId(this.idPropio);
            const espera = 4000 + Math.random() * 2000;
            const longitudTrama = this.idPropio.length + 1; // + checksum
            setTimeout(emitirCiclo, espera + longitudTrama * (this.DURACION_SIMBOLO_MS + 20));
        };
        emitirCiclo();
    }

    emitirId(id) {
        const checksum = this._calcularChecksum(id);
        const frecuencias = this.idAFrecuencias(id + checksum);
        const gain = this.audioCtx.createGain();
        gain.gain.value = 0.15;
        gain.connect(this.audioCtx.destination);

        let tiempoActual = this.audioCtx.currentTime;
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

    async iniciarEscucha() {
        try {
            // echoCancellation/noiseSuppression/autoGainControl en false:
            // esos filtros de "limpieza de voz" del navegador identifican
            // un tono fijo y agudo como ruido y lo eliminan antes de que
            // nuestro código lo pueda ver.
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
        let mejorValor = -100;
        for (let i = binMin; i <= binMax && i < buffer.length; i++) {
            if (buffer[i] > mejorValor) { mejorValor = buffer[i]; mejorBin = i; }
        }
        if (mejorValor < -60) return null; // umbral algo más permisivo que antes
        return mejorBin * binHz;
    }

    _procesarSimboloDetectado(freq) {
        const ahora = Date.now();
        if (!this._tramaActual) this._tramaActual = [];

        const esInicioTrama = Math.abs(freq - (this.FREQ_BASE - this.FREQ_PASO)) < this.FREQ_PASO / 2;
        if (esInicioTrama) {
            this._tramaActual = [];
            this._ultimoSimboloTs = ahora;
            return;
        }

        if (!this._ultimoSimboloTs || ahora - this._ultimoSimboloTs > 300) return;
        this._ultimoSimboloTs = ahora;

        const caracter = this.frecuenciaACaracter(freq);
        if (caracter) this._tramaActual.push(caracter);

        // Ahora la trama completa son 7 símbolos: 6 de ID + 1 de checksum.
        if (this._tramaActual.length === 7) {
            const idDetectado = this._tramaActual.slice(0, 6).join('');
            const checksumRecibido = this._tramaActual[6];
            this._tramaActual = [];

            const checksumEsperado = this._calcularChecksum(idDetectado);
            if (checksumRecibido !== checksumEsperado) {
                // No cuadra: era ruido disfrazado de ID, se descarta sin más.
                return;
            }

            if (idDetectado !== this.idPropio) {
                this._notificarDispositivo(idDetectado);
            }
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
}

window.BalizaUltrasonica = BalizaUltrasonica;

})();