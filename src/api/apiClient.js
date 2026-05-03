// src/api/client.js
// 1. IMPORTANDO AS FUNÇÕES CORRETAS DO token.js
import { getToken, removeToken } from '../utils/token'; 

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Monta os headers padrão para cada requisição.
 * Agora ele busca dinamicamente o token de autenticação usando getToken().
 */
function headersDefault(body) {
  const headers = {};
  const token = getToken(); 

  // Se não for FormData, envia como JSON
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headersDefault(options.body), // Passa o body para o headersDefault decidir o Content-Type
      ...options.headers,
    },
  });

  // Resposta sem corpo (ex.: 204 No Content)
  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // INTERCEPTADOR DE SEGURANÇA (Obrigatório para JWT)
    // Se a API do Laravel disser que não estamos autenticados (401)
    if (response.status === 401) {
      removeToken(); // Limpa o token do localStorage
      
      // Só redireciona se já não estivermos na tela de login, para evitar loop
      if (!window.location.pathname.includes('/login')) {
        // Usamos window.location.href para resetar a memória do React no App.jsx
        window.location.href = '/scleenkr/login';
      }
    }

    const mensagem =
      data?.mensagem || data?.message || `Erro ${response.status}: ${response.statusText}`;
    throw new Error(mensagem);
  }

  return data;
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),

  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (path, body) =>
    request(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: (path, body) =>
    request(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (path) => request(path, { method: 'DELETE' }),
};