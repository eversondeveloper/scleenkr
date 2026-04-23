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
 * Futuramente: adicionar Authorization Bearer aqui.
 */
function headersDefault() {
  return {
    'Content-Type': 'application/json',
  };
}

/**
 * Executa o fetch e lança um erro legível se a resposta não for 2xx.
 * @param {string} path - Caminho relativo à BASE_URL (ex.: '/empresas')
 * @param {RequestInit} options - Opções do fetch
 * @returns {Promise<any>} - Dados JSON da resposta
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
  /** GET /path */
  get: (path) => request(path, { method: 'GET' }),

  /** POST /path com body JSON */
  post: (path, body) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),

  /** PUT /path com body JSON */
  put: (path, body) =>
    request(path, { method: 'PUT', body: JSON.stringify(body) }),

  /** PATCH /path com body JSON */
  patch: (path, body) =>
    request(path, { method: 'PATCH', body: JSON.stringify(body) }),

  /** DELETE /path */
  delete: (path) => request(path, { method: 'DELETE' }),
};
