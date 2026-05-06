// src/pages/cadastro_atendentes/hooks/useSessoesCaixa.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/apiClient';
import { ApiError } from '@/api/errors';
import type { SessaoCaixa } from '@/lib/models/sessaoCaixa';

// ---------------------------------------------------------
// Tipos específicos
// ---------------------------------------------------------
interface AbrirSessaoPayload {
  id_atendente: number;
  valor_inicial: number;
  id_empresa: number;
}

interface FecharSessaoPayload {
  valor_final: number;
}

interface OperacaoSessaoResultado {
  sucesso: boolean;
  sessao?: SessaoCaixa | null;
  erro?: string;
}

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------
export function useSessoesCaixa() {
  const [sessoes, setSessoes] = useState<SessaoCaixa[]>([]);
  const [sessaoAtual, setSessaoAtual] = useState<SessaoCaixa | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');

  const buscarSessaoAtual = useCallback(async (): Promise<SessaoCaixa | null> => {
    try {
      const sessao = await apiClient.get<SessaoCaixa>('/sessoes-caixa/atual');
      setSessaoAtual(sessao || null);
      return sessao;
    } catch {
      setSessaoAtual(null);
      return null;
    }
  }, []);

  const buscarSessoes = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await apiClient.get<SessaoCaixa[]>('/sessoes-caixa');
      setSessoes(Array.isArray(dados) ? dados : []);
    } catch (error: unknown) {
      console.error('Erro buscarSessoes:', error);
      const mensagem =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Erro ao buscar sessões.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }, []);

  const abrirSessaoCaixa = async (
    dadosSessao: AbrirSessaoPayload
  ): Promise<OperacaoSessaoResultado> => {
    const idEmpresaFinal = dadosSessao.id_empresa;
    if (!idEmpresaFinal) {
      return { sucesso: false, erro: 'ID da empresa não detectado.' };
    }
    try {
      setErro('');
      const resultado = await apiClient.post<{ sessao: SessaoCaixa }>('/sessoes-caixa', {
        id_atendente: dadosSessao.id_atendente,
        valor_inicial: dadosSessao.valor_inicial || 0,
        id_empresa: idEmpresaFinal,
      });
      const sessao = resultado?.sessao ?? null;
      setSessaoAtual(sessao);
      await buscarSessaoAtual();
      await buscarSessoes();
      return { sucesso: true, sessao };
    } catch (error: unknown) {
      const mensagem =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Falha ao abrir sessão.';
      setErro(mensagem);
      return { sucesso: false, erro: mensagem };
    }
  };

  const fecharSessaoCaixa = async (
    idSessao: number,
    dadosFechamento: FecharSessaoPayload
  ): Promise<OperacaoSessaoResultado> => {
    try {
      setErro('');
      await apiClient.put(`/sessoes-caixa/${idSessao}/fechar`, {
        valor_final: dadosFechamento.valor_final || 0,
      });
      setSessaoAtual(null);
      await buscarSessaoAtual();
      await buscarSessoes();
      return { sucesso: true };
    } catch (error: unknown) {
      const mensagem =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Falha ao fechar sessão.';
      setErro(mensagem);
      return { sucesso: false, erro: mensagem };
    }
  };

  useEffect(() => {
    buscarSessaoAtual();
    const intervalo = setInterval(() => buscarSessaoAtual(), 30000);
    return () => clearInterval(intervalo);
  }, [buscarSessaoAtual]);

  useEffect(() => {
    buscarSessoes();
  }, [buscarSessoes]);

  return {
    sessoes,
    sessaoAtual,
    setSessaoAtual,
    carregando,
    erro,
    buscarSessoes,
    buscarSessaoAtual,
    abrirSessaoCaixa,
    fecharSessaoCaixa,
  };
}