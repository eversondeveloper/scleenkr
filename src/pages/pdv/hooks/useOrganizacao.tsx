// src/pages/pdv/hooks/useOrganizacao.ts
import { useState } from 'react';

export interface OpcaoOrganizacao {
  valor: string;
  label: string;
}

export interface UseOrganizacaoReturn {
  modoOrganizacao: string;
  setModoOrganizacao: (modo: string) => void;
  OPCOES_ORGANIZACAO: OpcaoOrganizacao[];
}

export function useOrganizacao(): UseOrganizacaoReturn {
  const [modoOrganizacao, setModoOrganizacao] = useState<string>('mais_vendidos');

  const OPCOES_ORGANIZACAO: OpcaoOrganizacao[] = [
    { valor: 'mais_vendidos', label: 'Mais Vendidos' },
    { valor: 'alfabetica', label: 'Ordem Alfabética (Cat./Desc.)' },
    { valor: 'cadastro', label: 'Ordem de Cadastro (ID)' },
  ];

  return {
    modoOrganizacao,
    setModoOrganizacao,
    OPCOES_ORGANIZACAO,
  };
}