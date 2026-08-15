/**
 * MANOLIT∞ FORESTAL - Traducciones
 * Expone window.idiomaActual y la función global t(clave, variables)
 * usada por motor-cuantico.js y manolito-chat.js.
 */

const TRADUCCIONES = {
    es: {
        calculando: "Calculando…",
        zonaAgua: "ZONA DE AGUA",
        zonaAguaMsg: "Este punto está sobre una masa de agua. No se calcula estrés de biomasa aquí.",
        simulacionNoIniciadaAgua: "Simulación no aplicable: zona de agua.",
        errorDatosClima: "No se pudieron obtener los datos meteorológicos de esta zona. Inténtalo de nuevo.",
        popupZonaAgua: "Zona de agua",

        logRyAplicadas: "Puertas RY aplicadas",
        logCnotEjecutados: "Entrelazamiento CNOT ejecutado",
        logMedicionEjecutada: "Medición según la regla de Born ejecutada",

        zonaSeguro: "Zona en calma",
        actionOptimo: "Condiciones estables. No se requiere acción prioritaria en este punto.",
        zonaAmbar: "Zona de vigilancia",
        actionRecomendada: "Estrés de biomasa moderado-alto. Se recomienda vigilancia y prevención activa.",
        zonaRojo: "Riesgo crítico",
        actionUrgente: "Estrés de biomasa crítico. Prioriza esta zona para labores de prevención inmediatas.",

        popupEstresBiomasa: "Estrés de biomasa",

        trabajoUrgenciaBaja: "baja",
        trabajoUrgenciaMedia: "media",
        trabajoUrgenciaAlta: "alta",
        trabajoVientoFlojo: "viento flojo",
        trabajoVientoModerado: "viento moderado",
        trabajoVientoFuerte: "viento fuerte",
        trabajoTexto: "El viento sopla desde el {cardCola} ({windDirOrigen}°) a {windSpeed} km/h ({intensidadViento}). Un incendio en este punto avanzaría hacia el {cardAvance}: prioriza la franja de cabeza en esa dirección y trabaja los flancos hacia el {cardFlancoIzq} y el {cardFlancoDer}.\n\nUrgencia de intervención: {urgencia}.",
        tooltipPropagacion: "Cono de propagación estimado",

        ceroFuegosVisibles: "Sin incendios activos en esta zona del mapa",
        popupIncendioActivo: "Incendio activo (NASA FIRMS)",
        popupBrillo: "Brillo",
        popupConfianza: "Confianza",
        popupEvaluarRiesgo: "Evaluar riesgo aquí",
        fuegosActivosDetectados: "{count} incendios activos detectados en esta zona",
        errorFirmsDev: "Mostrando datos de ejemplo (FIRMS no disponible ahora mismo)",

        modoCientifico: "Modo científico",
        modoCiudadano: "Modo ciudadano",
        titleModoCiencia: "Cambiar a modo científico (todos los detalles técnicos)",
        titleModoCiudadano: "Cambiar a modo ciudadano (lectura simplificada)",
        titleColapsar: "Pulsa para colapsar/expandir",
        errorCargaLegal: "No se pudo cargar el aviso legal. Recarga la página.",

        chatSaludo: "¡Hola! Soy Manolit∞ Pincha un punto en el mapa y pregúntame lo que quieras sobre esa zona."
    },
    en: {
        calculando: "Calculating…",
        zonaAgua: "WATER ZONE",
        zonaAguaMsg: "This point is over a body of water. Biomass stress is not calculated here.",
        simulacionNoIniciadaAgua: "Simulation not applicable: water zone.",
        errorDatosClima: "Could not fetch weather data for this area. Please try again.",
        popupZonaAgua: "Water zone",

        logRyAplicadas: "RY gates applied",
        logCnotEjecutados: "CNOT entanglement executed",
        logMedicionEjecutada: "Measurement via Born rule executed",

        zonaSeguro: "Calm zone",
        actionOptimo: "Stable conditions. No priority action needed at this point.",
        zonaAmbar: "Watch zone",
        actionRecomendada: "Moderate-to-high biomass stress. Active monitoring and prevention recommended.",
        zonaRojo: "Critical risk",
        actionUrgente: "Critical biomass stress. Prioritize this zone for immediate prevention work.",

        popupEstresBiomasa: "Biomass stress",

        trabajoUrgenciaBaja: "low",
        trabajoUrgenciaMedia: "medium",
        trabajoUrgenciaAlta: "high",
        trabajoVientoFlojo: "light wind",
        trabajoVientoModerado: "moderate wind",
        trabajoVientoFuerte: "strong wind",
        trabajoTexto: "Wind is blowing from the {cardCola} ({windDirOrigen}°) at {windSpeed} km/h ({intensidadViento}). A fire at this point would tend to advance towards the {cardAvance}: prioritize the head strip in that direction and work the flanks towards the {cardFlancoIzq} and {cardFlancoDer}.\n\nIntervention urgency: {urgencia}.",
        tooltipPropagacion: "Estimated spread cone",

        ceroFuegosVisibles: "No active fires in this map area",
        popupIncendioActivo: "Active fire (NASA FIRMS)",
        popupBrillo: "Brightness",
        popupConfianza: "Confidence",
        popupEvaluarRiesgo: "Assess risk here",
        fuegosActivosDetectados: "{count} active fires detected in this area",
        errorFirmsDev: "Showing sample data (FIRMS unavailable right now)",

        modoCientifico: "Scientific mode",
        modoCiudadano: "Citizen mode",
        titleModoCiencia: "Switch to scientific mode (full technical detail)",
        titleModoCiudadano: "Switch to citizen mode (simplified reading)",
        titleColapsar: "Click to collapse/expand",
        errorCargaLegal: "Could not load the legal notice. Please reload the page.",

        chatSaludo: "Hi! I'm Manolit∞ Click a point on the map and ask me anything about that area."
    }
};

let idiomaActual = localStorage.getItem('manolitoIdioma') || 'es';
window.idiomaActual = idiomaActual;

function t(clave, variables) {
    const dict = TRADUCCIONES[idiomaActual] || TRADUCCIONES.es;
    let texto = dict[clave] !== undefined ? dict[clave] : (TRADUCCIONES.es[clave] !== undefined ? TRADUCCIONES.es[clave] : clave);
    if (variables) {
        Object.keys(variables).forEach(k => {
            texto = texto.split(`{${k}}`).join(variables[k]);
        });
    }
    return texto;
}

function cambiarIdioma(nuevo) {
    if (!TRADUCCIONES[nuevo]) return;
    localStorage.setItem('manolitoIdioma', nuevo);
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('language-select');
    if (selector) {
        selector.value = idiomaActual;
        selector.addEventListener('change', (e) => cambiarIdioma(e.target.value));
    }
});