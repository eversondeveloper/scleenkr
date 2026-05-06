// src/lib/modules/users/types.ts

/** Payload enviado no cadastro de usuário/atendente */
export interface UserCreatePayload {
  nome: string;
  cpf: string;
  senha: string;
}

