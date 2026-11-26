/**
 * MANOLIT∞ FORESTAL - Worker principal
 * Enruta las peticiones a la API (Manolito, FIRMS, Señalización de
 * emergencia y los proxies de APIs externas) y deja pasar todo lo demás
 * al servidor de archivos estáticos (carpeta "public", binding ASSETS).
 */

import { handleManolitoPost, handleManolitoOptions } from './manolito.js';
import { handleGetFires } from './getFires.js';
import { handleSenalPost, handleSenalGet, handleSenalOptions } from './senales.js';
import {
  handleReverse,
  handleTerreno,
  handleRecursos,
  handleWeather,
  handleElevation
} from './externos.js';

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

    if (url.pathname === '/senal') {
      if (request.method === 'POST') return handleSenalPost(request, env);
      if (request.method === 'GET') return handleSenalGet(request, env);
      if (request.method === 'OPTIONS') return handleSenalOptions();
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Proxies de APIs externas (mismo origen; nunca devuelven error HTTP al
    // navegador: fallan con 200 + {"error":...} para mantener la consola limpia).
    if (request.method === 'GET') {
      if (url.pathname === '/reverse') return handleReverse(request, env, ctx);
      if (url.pathname === '/terreno') return handleTerreno(request, env, ctx);
      if (url.pathname === '/recursos') return handleRecursos(request, env, ctx);
      if (url.pathname === '/weather') return handleWeather(request, env, ctx);
      if (url.pathname === '/elevation') return handleElevation(request, env, ctx);
    }

    // Cualquier otra ruta: servir los archivos estáticos de "public"
    return env.ASSETS.fetch(request);
  }
};
