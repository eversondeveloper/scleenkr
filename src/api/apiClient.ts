// src/api/apiClient.ts
import { getToken, removeToken } from '@/lib/utils/token';
import { ApiError } from './errors';

const BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface BaseRequestOptions {
  headers?: Record<string, string>;
  // Imagine que Record é uma fábrica de tipos de objeto uniformes. Você diz qual o conjunto de chaves (K) e qual o tipo dos valores (T),
  //  e ele te devolve um tipo de objeto onde todas as chaves têm o mesmo tipo de valor.
  signal?: AbortSignal; // O AbortSignal nativo de fetch para cancelar requisições.
};

// Métodos que NÃO aceitam body
interface GetRequestOptions extends BaseRequestOptions {
  method: 'GET';
  body?: never; // proíbe explicitamente a propriedade body
};

interface DeleteRequestOptions extends BaseRequestOptions {
  method: 'DELETE';
  body?: never;
};

// Métodos que ACEITAM body (opcional)
interface BodyRequestOptions extends BaseRequestOptions {
  method: 'POST' | 'PUT' | 'PATCH';
  body?: BodyInit | null;
};

// União de todos os formatos possíveis (disciminated union)
type RequestOptions = GetRequestOptions | DeleteRequestOptions | BodyRequestOptions;

// Headers padrão
function headersDefault(body?: unknown): Record<string, string> {
  const headers: Record<string, string> = {};
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

// Função central de requisição (genérica)
async function request<T = unknown>(
  path: string,
  options: RequestOptions = { method: 'GET' }
): Promise<T | null> {

  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headersDefault(options.body),
      ...options.headers,
    },
  });

  // Resposta sem corpo (ex.: 204 No Content)
  if (response.status === 204) return null;

  let data: T | null = null;
  try {
    data = (await response.json()) as T; // O casting as T é uma asserção de tipo – dizemos ao TypeScript "confie, este JSON tem o formato T". Não há validação em runtime.
  } catch {
    // corpo não é JSON (ex.: texto puro) – data permanece null
  }

  if (!response.ok) {
    // INTERCEPTADOR DE SEGURANÇA (JWT)
    if (response.status === 401) {
      removeToken();
      // Só redireciona se não estivermos na tela de login
      if (!window.location.pathname.includes('/scleenkr/login')) {
        window.location.href = '/scleenkr/login';
      }
    }

    const mensagem =
      (data as any)?.mensagem ||
      (data as any)?.message ||
      `Erro ${response.status}: ${response.statusText}`;

    throw new ApiError(mensagem, response.status, data);
  }

  return data;
}


// Cliente público
export const apiClient = {
  get: <T = unknown>(path: string) =>
    request<T>(path, { method: 'GET' }),

  post: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T = unknown>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T = unknown>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};