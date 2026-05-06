// src/lib/models/atendente.ts
export interface Atendente {
  id_atendente: number;
  id_empresa: number;
  nome: string;
  email: string | null;
  telefone: string | null;
  cpf: string;
  ativo: boolean;
  data_cadastro: string; // ISO 8601
}