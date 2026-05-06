/**
 * Gerenciamento centralizado do token de autenticação.
 * 
 * Uso:
 *   import { getToken, setToken, removeToken } from '@/utils/token';
 *   setToken('jwt-aqui');
 *   const token = getToken();
 */

const TOKEN_KEY: string = 'scleenkr_token';

/**
 * Retorna o token salvo (ou null).
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Salva o token no storage.
 * Se o valor for vazio (null/undefined/string vazia), remove o token.
 */
export function setToken(newToken: string | null | undefined): void {
  if (!newToken) {
    removeToken();
    return;
  }
  localStorage.setItem(TOKEN_KEY, newToken);
}

/**
 * Remove o token (logout).
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}