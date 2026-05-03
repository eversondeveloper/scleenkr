import { apiClient } from '../../../api/apiClient';

export const usersService = {
  /**
   * Envia os dados do novo usuário/atendente para a API.
   * Futuramente, essa rota pode virar '/users', mas por enquanto
   * mantém batendo no seu controller atual.
   */
  async cadastrar(dados) {
    return await apiClient.post('/atendentes', dados);
  }
};