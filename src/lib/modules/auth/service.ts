// src/lib/modules/auth/service.ts
import { apiClient } from '@/api/apiClient';
import { removeToken } from '@/lib/utils/token';
import type { CredenciaisLogin, AuthResponse } from './types';

export const authService = {
  async login(credenciais: CredenciaisLogin): Promise<AuthResponse> {
    const resposta = await apiClient.post<AuthResponse>('/auth/login', credenciais);

    if (!resposta) {
      throw new Error('Resposta inválida do servidor');
    }
    return resposta;
  },

  async logout(): Promise<void> {
    try {
      // await apiClient.post('/auth/logout');
    } catch (erro) {
      console.error('Erro ao invalidar token no backend:', erro);
    } finally {
      removeToken();
    }
  },
};