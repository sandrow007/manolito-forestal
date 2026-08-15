/**
 * MANOLIT∞ FORESTAL - Worker principal
 * Enruta las peticiones a la API (Manolito, FIRMS) y deja pasar todo lo
 * demás al servidor de archivos estáticos (carpeta "dist", binding ASSETS).
 */

import { handleManolitoPost, handleManolitoOptions } from './manolito.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/manolito') {
      if (request.method === 'POST') return handleManolitoPost(request, env);
      if (request.method === 'OPTIONS') return handleManolitoOptions();
      return new Response('Method Not Allowed', { status: 405 });
    }

    if (url.pathname === '/getFires') {
      // TODO: aquí va tu lógica existente para pedir los incendios activos a
      // NASA FIRMS con la API key inyectada desde el Worker. Si tenías esto
      // como otra Cloudflare Pages Function (ej. functions/getFires.js),
      // pásame ese archivo y te lo integro aquí igual que a Manolito —
      // mientras tanto esta ruta también daría 405/404 y el frontend caerá
      // en su fallback de datos de ejemplo (CSV_EJEMPLO_FUEGOS).
      return new Response('getFires todavía no migrado a este Worker', { status: 501 });
    }

    // Cualquier otra ruta: servir los archivos estáticos de "dist"
    return env.ASSETS.fetch(request);
  }
};