// src/lib/models/SessaoCaixa.ts

export interface SessaoCaixa {
  id_sessao: number;
  id_atendente: number;
  id_empresa: number;
  data_abertura: string;   // ISO 8601
  data_fechamento: string | null;
  valor_inicial: number;
  valor_final: number | null;
  status: string;          // Ex.: "aberta", "fechada"
}