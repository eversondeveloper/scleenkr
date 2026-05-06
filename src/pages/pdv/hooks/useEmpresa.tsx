// src/pages/cadastro_atendentes/hooks/useEmpresa.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';
import { ApiError } from '@/api/errors';
import type { Empresa } from '@/lib/models/Empresa';

// ---------------------------------------------------------
// Tipos do retorno
// ---------------------------------------------------------
interface UseEmpresaReturn {
  dadosEmpresa: Empresa | null;
  carregandoEmpresa: boolean;
  erroEmpresa: string | null;
}

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------
export function useEmpresa(): UseEmpresaReturn {
  const [dadosEmpresa, setDadosEmpresa] = useState<Empresa | null>(null);
  const [carregandoEmpresa, setCarregandoEmpresa] = useState<boolean>(true);
  const [erroEmpresa, setErroEmpresa] = useState<string | null>(null);

  useEffect(() => {
    const buscarEmpresa = async () => {
      setCarregandoEmpresa(true);
      setErroEmpresa(null);
      try {
        const dados = await apiClient.get<Empresa[]>('/empresas');
        if (dados && dados.length > 0) {
          setDadosEmpresa(dados[0]);
        } else {
          setErroEmpresa('Nenhuma empresa encontrada na base de dados.');
        }
      } catch (error: unknown) {
        console.error('Erro ao buscar dados da empresa:', error);
        const mensagem =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : '❌ Erro ao carregar dados da empresa da API.';
        setErroEmpresa(mensagem);
      } finally {
        setCarregandoEmpresa(false);
      }
    };

    buscarEmpresa();
  }, []);

  return { dadosEmpresa, carregandoEmpresa, erroEmpresa };
}