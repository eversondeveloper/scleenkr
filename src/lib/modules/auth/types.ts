// src/lib/modules/auth/types.ts

/** Credenciais enviadas no formulário de login */
export interface CredenciaisLogin {
  cpf: string;
  senha: string;
}

/** Resposta bem‑sucedida da rota de login */
export interface AuthResponse {
  token: string;
  // Ajustar posteriormente conforme o modelo real de usuário retornado pelo backend
  usuario?: Record<string, unknown>; 
}