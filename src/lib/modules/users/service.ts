// src/lib/modules/users/service.ts
import { apiClient } from '@/api/apiClient';
import { ApiError } from '@/api/errors';
import type { UserCreatePayload } from './types';
import type { User } from '@/lib/models/User';

export const usersService = {
  /**
   * Cadastra um novo usuário/atendente.
   * Rota atual: POST /atendentes
   */
  async cadastrar(dados: UserCreatePayload): Promise<User> {
    const resposta = await apiClient.post<User>('/atendentes', dados);

    if (!resposta) {
      throw new ApiError('Resposta inválida do servidor', 0);
    }

    return resposta;
  },
};