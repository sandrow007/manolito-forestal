/**
 * MANOLIT∞ FORESTAL - Worker principal
 * Enruta las peticiones a la API (Manolito, FIRMS) y deja pasar todo lo
 * demás al servidor de archivos estáticos (carpeta "dist", binding ASSETS).
 */

import { handleManolitoPost, handleManolitoOptions } from './manolito.js';
import { handleGetFires } from './getFires.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/manolito') {
      if (request.method === 'POST') return handleManolitoPost(request, env);
      if (request.method === 'OPTIONS') return handleManolitoOptions();
      return new Response('Method Not Allowed', { status: 405 });
    }

    if (url.pathname === '/getFires') {
      return handleGetFires(request, env);
    }

    // Cualquier otra ruta: servir los archivos estáticos de "dist"
    return env.ASSETS.fetch(request);
  }
};