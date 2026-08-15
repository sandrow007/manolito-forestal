/**
 * MANOLIT∞ FORESTAL - Widget de chat "Manolito"
 * Se conecta a /manolito (Cloudflare Pages Function) y usa el contexto
 * de la última zona evaluada (window.ultimoContextoManolito) para dar
 * recomendaciones de dónde trabajar la biomasa según viento y riesgo.
 */

function crearBurbuja(texto, clase) {
    const cont = document.getElementById('manolito-mensajes');
    const div = document.createElement('div');
    div.className = `manolito-msg ${clase}`;
    div.textContent = texto;
    cont.appendChild(div);
    cont.scrollTop = cont.scrollHeight;
    return div;
}

async function enviarMensajeManolito() {
    const input = document.getElementById('manolito-input');
    const texto = input.value.trim();
    if (!texto) return;
    input.value = '';

    crearBurbuja(texto, 'msg-user');
    const pensando = crearBurbuja('...', 'msg-bot msg-thinking');

    try {
        const resp = await fetch('/manolito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: texto,
                contexto: window.ultimoContextoManolito || null,
                idioma: (typeof idiomaActual !== 'undefined') ? idiomaActual : 'es'
            })
        });
        const data = await resp.json();
        pensando.remove();
        if (data.respuesta) {
            crearBurbuja(data.respuesta, 'msg-bot');
        } else {
            crearBurbuja(data.error || 'Manolito no ha podido responder ahora mismo.', 'msg-bot msg-error');
        }
    } catch (e) {
        pensando.remove();
        crearBurbuja('Error de conexión con Manolito. Comprueba tu red.', 'msg-bot msg-error');
    }
}

function setupManolitoChat() {
    const toggleBtn = document.getElementById('manolito-toggle-btn');
    const panel = document.getElementById('manolito-panel');
    const closeBtn = document.getElementById('manolito-close-btn');
    const sendBtn = document.getElementById('manolito-send-btn');
    const input = document.getElementById('manolito-input');

    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('manolito-abierto');
        if (panel.classList.contains('manolito-abierto') && document.getElementById('manolito-mensajes').children.length === 0) {
            crearBurbuja(t('chatSaludo'), 'msg-bot');
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.remove('manolito-abierto'));
    if (sendBtn) sendBtn.addEventListener('click', enviarMensajeManolito);
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') enviarMensajeManolito();
        });
    }
}

document.addEventListener('DOMContentLoaded', setupManolitoChat);