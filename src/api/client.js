/**
 * Cliente HTTP centralizado do $cleenkr.
 *
 * Todas as chamadas à API devem passar por aqui — nunca usar fetch() direto
 * nos hooks. Isso garante:
 *  - Base URL configurável via variável de ambiente (VITE_API_URL)
 *  - Headers padrão (Content-Type, futuramente Authorization)
 *  - Tratamento de erro padronizado em um único lugar
 *
 * Uso:
 *   import { api } from '../api/client';
 *   const empresas = await api.get('/empresas');
 *   const nova = await api.post('/empresas', { nome: 'Loja X' });
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Monta os headers padrão para cada requisição.
 * Agora ele busca dinamicamente o token de autenticação.
 */
function headersDefault() {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Busca o token salvo (futuramente a tela de login fará esse salvamento)
  const token = localStorage.getItem('scleenkr_token');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Executa o fetch e lança um erro legível se a resposta não for 2xx.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headersDefault(),
      ...options.headers,
    },
  });

  // Resposta sem corpo (ex.: 204 No Content)
  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensagem =
      data?.mensagem || data?.message || `Erro ${response.status}: ${response.statusText}`;
    throw new Error(mensagem);
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};