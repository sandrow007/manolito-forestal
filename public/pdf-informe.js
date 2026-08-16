/**
 * MANOLIT∞ FORESTAL - Generador de informe PDF
 * Usa jsPDF (cargado por CDN en index.html) para exportar un informe
 * técnico descargable con coordenadas, lugar aproximado, datos
 * meteorológicos, % de estrés, estado del punto (rojo/amarillo/verde),
 * situación respecto al perímetro estimado de incendio activo, y
 * recomendación de zonas de trabajo.
 */

async function obtenerNombreLugar(lat, lon) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=es&zoom=10`;
        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!resp.ok) return null;
        const data = await resp.json();
        const addr = data.address || {};
        const partes = [
            addr.village || addr.town || addr.city || addr.municipality,
            addr.county || addr.state_district,
            addr.state
        ].filter(Boolean);
        return partes.length ? partes.join(', ') : (data.display_name || null);
    } catch (e) {
        return null;
    }
}

// Mismo criterio que en el chat: rojo = incendio activo confirmado por
// satélite o punto dentro del perímetro estimado; amarillo = sin fuego
// confirmado pero estrés de biomasa alto; verde = riesgo bajo-moderado.
// Se usa para el aviso del 112 en el PDF.
function determinarEstadoPunto(c) {
    if (c.incendiosActivosCercanos > 0 || (c.perimetroEstimado && c.perimetroEstimado.dentro)) {
        return { color: 'rojo', etiqueta: 'INCENDIO ACTIVO', rgb: [200, 30, 30] };
    }
    const pct = parseFloat(c.pct);
    if (!isNaN(pct) && pct >= 60) {
        return { color: 'amarillo', etiqueta: 'RIESGO ALTO (vigilancia)', rgb: [190, 140, 0] };
    }
    return { color: 'verde', etiqueta: 'riesgo bajo-moderado', rgb: [40, 130, 60] };
}

function generarInformePDF(contexto) {
    if (!contexto || !contexto.lat) {
        alert('Selecciona primero una zona en el mapa para generar el informe.');
        return;
    }
    if (typeof window.jspdf === 'undefined') {
        alert('No se pudo cargar el generador de PDF. Comprueba tu conexión.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const fecha = new Date().toLocaleString('es-ES');
    const estado = determinarEstadoPunto(contexto);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('MANOLIT∞ FORESTAL', 15, 20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Informe técnico de riesgo y propagación de incendio forestal', 15, 28);
    doc.setDrawColor(200);
    doc.line(15, 32, 195, 32);

    // Aviso de estado del punto (rojo/amarillo), bien visible y sin pisar nada
    let y = 42;
    if (estado.color !== 'verde') {
        doc.setFillColor(...estado.rgb);
        // Ajustamos el alto del rectángulo a 12 para que no corte las letras
        doc.roundedRect(15, y - 6, 180, 12, 1.5, 1.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        let textoAviso;
        if (contexto.perimetroEstimado && contexto.perimetroEstimado.dentro) {
            textoAviso = `⚠ ${estado.etiqueta} — DENTRO del perímetro estimado. Aléjate. Emergencias: 112`;
        } else if (estado.color === 'rojo') {
            textoAviso = `⚠ ${estado.etiqueta} — si estás cerca de la zona, aléjate. Emergencias: 112`;
        } else {
            textoAviso = `⚠ ${estado.etiqueta} — sin incendio confirmado, zona bajo vigilancia`;
        }
        // Usamos y + 2 para que el texto quede perfectamente centrado dentro del rectángulo y no se oculte
        doc.text(textoAviso, 20, y + 2);
        doc.setTextColor(0, 0, 0);
        y += 16;
    }


    // Etiqueta:valor con el ancho de la etiqueta calculado en cada línea,
    // para que ninguna etiqueta larga (p. ej. "Estrés de biomasa (modelo
    // cuántico):") pueda solaparse con el valor y taparlo.
    const COL_VALOR_MIN = 68;
    const linea = (label, valor, colorValor) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(0, 0, 0);
        const labelTexto = `${label}:`;
        doc.text(labelTexto, 15, y);
        const anchoLabel = doc.getTextWidth(labelTexto);
        const xValor = Math.max(COL_VALOR_MIN, 15 + anchoLabel + 4);
        doc.setFont('helvetica', 'normal');
        if (colorValor) doc.setTextColor(...colorValor);
        doc.text(String(valor), xValor, y);
        doc.setTextColor(0, 0, 0);
        y += 8;
    };

    linea('Fecha del informe', fecha);
    linea('Lugar aproximado', contexto.lugar || 'No disponible');
    linea('Coordenadas', `${contexto.lat.toFixed(5)}, ${contexto.lon.toFixed(5)}`);
    linea('Temperatura', `${contexto.temp} °C`);
    linea('Humedad relativa', `${contexto.hum} %`);
    linea('Viento', `${contexto.wind} km/h, dirección ${contexto.windDir}° (${contexto.windDirCardinal || ''})`);
    linea('Estrés de biomasa (modelo cuántico)', `${contexto.pct} %`, estado.color !== 'verde' ? estado.rgb : null);
    if (contexto.incendiosActivosCercanos !== undefined && contexto.incendiosActivosCercanos !== null) {
        linea('Incendios activos en 25km (satélite)', contexto.incendiosActivosCercanos > 0
            ? `${contexto.incendiosActivosCercanos} (el más cercano a ${contexto.distanciaIncendioMasCercanoKm} km)`
            : 'ninguno detectado');
    }

    // Perímetro estimado de incendio activo (calculado a partir de los
    // puntos de calor FIRMS agrupados). Solo se muestra si hay datos.
    if (contexto.perimetroEstimated || contexto.perimetroEstimado) {
        const p = contexto.perimetroEstimado;
        if (p.dentro) {
            linea('Perímetro estimado de incendio', `dentro del perímetro (foco de ~${p.areaHa.toFixed(1)} ha)`, [200, 30, 30]);
        } else {
            linea('Perímetro estimado más cercano', `a ${p.distanciaKm.toFixed(1)} km (foco de ~${p.areaHa.toFixed(1)} ha)`);
        }
    }

    y += 4;
    doc.setDrawColor(200);
    doc.line(15, y, 195, y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Recomendación de zonas de trabajo', 15, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    const textoRecom = contexto.recomendacionTexto || 'Sin recomendación calculada.';
    const lineasTexto = doc.splitTextToSize(textoRecom, 180);
    doc.text(lineasTexto, 15, y);
    y += lineasTexto.length * 5.5 + 10;

    doc.setFontSize(8.5);
    doc.setTextColor(120);
    const nota = estado.color === 'rojo'
        ? 'Este informe es un modelo de apoyo a la decisión basado en datos meteorológicos abiertos (Open-Meteo), satélite de incendios (NASA FIRMS) y una simulación de circuito cuántico ejecutada en el navegador. El perímetro estimado es una aproximación geométrica calculada a partir de los puntos de calor detectados y NO es un dato oficial verificado sobre el terreno. No sustituye las órdenes de mando de bomberos, Protección Civil, AEMET ni al 112. Hay indicios de incendio activo en esta zona: ante cualquier duda, contacta con el 112 o con Protección Civil/bomberos.'
        : 'Este informe es un modelo de apoyo a la decisión basado en datos meteorológicos abiertos (Open-Meteo) y una simulación de circuito cuántico ejecutada en el navegador. El perímetro estimado, cuando aparece, es una aproximación geométrica calculada a partir de los puntos de calor detectados y NO es un dato oficial verificado sobre el terreno. No sustituye las órdenes de mando de bomberos, Protección Civil, AEMET ni al 112. Ante un incendio activo, contacta siempre con el 112.';
    const lineasNota = doc.splitTextToSize(nota, 180);
    doc.text(lineasNota, 15, y);

    const nombreArchivo = `manolito-informe-${contexto.lat.toFixed(3)}_${contexto.lon.toFixed(3)}.pdf`;
    doc.save(nombreArchivo);
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-descargar-pdf');
    if (btn) {
        btn.addEventListener('click', () => generarInformePDF(window.ultimoContextoManolito));
    }
});
