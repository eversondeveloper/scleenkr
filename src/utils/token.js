/**
 * Gerenciamento centralizado do token de autenticação.
 * 
 * Uso:
 *   import { getToken, setToken, removeToken } from '@/utils/token';
 *   setToken('jwt-aqui');
 *   const token = getToken();
 */

const TOKEN_KEY = 'scleenkr_token';

/**
 * Retorna o token salvo (ou null).
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Salva o token no storage.
 */
export function setToken(newToken) {
  if (!newToken) {
    removeToken();
    return;
  }
  localStorage.setItem(TOKEN_KEY, newToken);
}

/**
 * Remove o token (logout).
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}