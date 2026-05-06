// src/pages/cadastro_atendentes/hooks/useAtendentes.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/apiClient';
import { ApiError } from '@/api/errors';
import type { Atendente } from '@/lib/models/Atendente';

// ---------------------------------------------------------
// Tipos locais para operações (podem ir para
// lib/modules/atendentes/types.ts depois)
// ---------------------------------------------------------
export interface CriarAtendentePayload {
  nome: string;
  cpf: string;
  senha?: string;
  id_empresa: number; // agora number, coerente com o modelo
}

export interface AtualizarAtendentePayload {
  nome?: string;
  cpf?: string;
  senha?: string;
  email?: string | null;
  telefone?: string | null;
  ativo?: boolean;
}

interface OperacaoResultado {
  sucesso: boolean;
  atendente?: Atendente;
  erro?: string;
}

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------
export function useAtendentes() {
  const [atendentes, setAtendentes] = useState<Atendente[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');

  const buscarAtendentes = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');
      const dados = await apiClient.get<Atendente[]>('/atendentes');
      setAtendentes(Array.isArray(dados) ? dados : []);
    } catch (error: unknown) {
      const mensagem =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Erro ao buscar atendentes.';
      console.error('Erro ao buscar atendentes:', error);
      setErro(mensagem);
      setAtendentes([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarAtendentes();
  }, [buscarAtendentes]);

  const criarAtendente = async (
    dadosAtendente: CriarAtendentePayload,
    idEmpresa: number | null
  ): Promise<OperacaoResultado> => {
    if (!idEmpresa) {
      return { sucesso: false, erro: 'ID da empresa não detectado.' };
    }
    try {
      const resultado = await apiClient.post<{ atendente: Atendente }>('/atendentes', {
        ...dadosAtendente,
        id_empresa: idEmpresa,
      });
      await buscarAtendentes();
      return { sucesso: true, atendente: resultado?.atendente };
    } catch (error: unknown) {
      const mensagem =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Falha ao criar atendente.';
      return { sucesso: false, erro: mensagem };
    }
  };

  const atualizarAtendente = async (
    id: number,
    dadosAtendente: AtualizarAtendentePayload
  ): Promise<OperacaoResultado> => {
    try {
      const resultado = await apiClient.put<{ atendente: Atendente }>(
        `/atendentes/${id}`,
        dadosAtendente
      );
      await buscarAtendentes();
      return { sucesso: true, atendente: resultado?.atendente };
    } catch (error: unknown) {
      const mensagem =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Falha ao atualizar atendente.';
      return { sucesso: false, erro: mensagem };
    }
  };

  const deletarAtendente = async (id: number): Promise<OperacaoResultado> => {
    const confirmar = window.confirm(
      '⚠️ ATENÇÃO: Deseja EXCLUIR permanentemente este atendente? Esta ação não pode ser desfeita.'
    );
    if (!confirmar) return { sucesso: false };
    try {
      await apiClient.delete(`/atendentes/${id}`);
      await buscarAtendentes();
      return { sucesso: true };
    } catch (error: unknown) {
      console.error('Erro ao deletar atendente:', error);
      const mensagem =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Falha ao deletar atendente.';
      return { sucesso: false, erro: mensagem };
    }
  };

  return {
    atendentes,
    carregando,
    erro,
    criarAtendente,
    atualizarAtendente,
    deletarAtendente,
    buscarAtendentes,
    setAtendentes,
  };
}