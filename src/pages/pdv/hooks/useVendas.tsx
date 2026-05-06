// src/pages/pdv/hooks/useVendas.ts
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { apiClient } from '@/api/apiClient';
import somCancelar from '/sounds/efeitos/cancelar1.mp3';
import somFinalizar from '/sounds/efeitos/printer16.mp3';
import type { SessaoCaixa } from '@/lib/models/SessaoCaixa';

// ---------------------------------------------------------
// Tipos
// ---------------------------------------------------------
export interface ProdutoDB {
  id_produto: number;
  descricao: string;
  categoria: string;
  preco: number;
  tipo_item?: string;
  estoque_atual?: number;
  total_vendido?: number;
}

export interface ProdutoSelecionado {
  idUnico: number;
  id_produto: number;
  descricao: string;
  categoria: string;
  preco: number;
  quantidade: number;
  tipo_item?: string;
  estoque_atual?: number;
  total_vendido?: number;
}

export interface PagamentoMisto {
  id: number;
  metodo: string;
  valor: number;
}

interface ItemVenda {
  id_produto: number;
  categoria: string;
  descricao: string;
  preco_unitario: number;
  quantidade: number;
  subtotal: number;
}

interface PagamentoFinal {
  metodo: string;
  valor_pago: number;
}

interface VendaPayload {
  id_sessao: number;
  id_atendente: number;
  id_empresa: number;
  valor_total_bruto: number;
  valor_pago_total: number;
  valor_troco: number;
  statusVenda: string;
  itens: ItemVenda[];
  pagamentos: PagamentoFinal[];
}

export interface UseVendasReturn {
  produtosDB: ProdutoDB[];
  produtosSelecionados: ProdutoSelecionado[];
  carregandoProdutos: boolean;
  mensagemFlutuante: string;
  setMensagemFlutuante: (msg: string) => void;
  valorDinheiroRecebido: number;
  setValorDinheiroRecebido: (valor: number) => void;
  metodoPagamento: string;
  setMetodoPagamento: (metodo: string) => void;
  valorOutroMetodo: number;
  setValorOutroMetodo: (valor: number) => void;
  metodoSecundario: string;
  setMetodoSecundario: (metodo: string) => void;
  pagamentosMistos: PagamentoMisto[];
  inputFiltroBuscaRef: React.RefObject<HTMLInputElement>;
  inputValorRecebidoRef: React.RefObject<HTMLInputElement>;
  botaoFinalizarRef: React.RefObject<HTMLButtonElement>;
  totalGeral: number;
  valorPagoTotal: number;
  valorTroco: number;
  valorFaltando: number; // calculado como max(0, totalGeral - valorPagoTotal)
  podeFinalizarVenda: boolean;
  adicionarProduto: (item: ProdutoDB) => void;
  removerProduto: (idUnico: number) => void;
  handleQuantidadeChange: (idUnico: number, novaQuantidade: number) => void;
  adicionarPagamentoMisto: (metodo?: string, valor?: number) => void;
  removerPagamentoMisto: (id: number) => void;
  atualizarPagamentoMisto: (id: number, novosDados: Partial<Pick<PagamentoMisto, 'metodo' | 'valor'>>) => void;
  resetarCaixa: () => void;
  finalizarVenda: (callback?: () => void) => Promise<void>;
  cancelarVenda: (callback?: () => void) => void;
  formatarParaReal: (valor: number | string | undefined | null) => string;
  limparFormatacao: (stringFormatada: unknown) => number | unknown;
}

// ---------------------------------------------------------
// Funções auxiliares
// ---------------------------------------------------------
export const formatarParaReal = (valor: number | string | undefined | null): string =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(valor ?? 0));

export const limparFormatacao = (stringFormatada: unknown): number | unknown => {
  if (typeof stringFormatada !== 'string') return stringFormatada;
  return parseFloat(stringFormatada.replace(/\D/g, '')) / 100;
};

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------
export function useVendas(sessaoAtual: SessaoCaixa | null): UseVendasReturn {
  const [produtosDB, setProdutosDB] = useState<ProdutoDB[]>([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);
  const [valorDinheiroRecebido, setValorDinheiroRecebido] = useState<number>(0);
  const [metodoPagamento, setMetodoPagamento] = useState<string>('Dinheiro');
  const [valorOutroMetodo, setValorOutroMetodo] = useState<number>(0);
  const [metodoSecundario, setMetodoSecundario] = useState<string>('Crédito');
  const [carregandoProdutos, setCarregandoProdutos] = useState<boolean>(true);
  const [mensagemFlutuante, setMensagemFlutuante] = useState<string>('');
  const [pagamentosMistos, setPagamentosMistos] = useState<PagamentoMisto[]>([
    { id: 1, metodo: 'Dinheiro', valor: 0 },
    { id: 2, metodo: 'Crédito', valor: 0 },
  ]);

  const audioFinalizar = useRef<HTMLAudioElement>(new Audio(somFinalizar));
  const audioCancelar = useRef<HTMLAudioElement>(new Audio(somCancelar));
  const inputFiltroBuscaRef = useRef<HTMLInputElement>(null);
  const inputValorRecebidoRef = useRef<HTMLInputElement>(null);
  const botaoFinalizarRef = useRef<HTMLButtonElement>(null);

  const totalGeral = useMemo<number>(
    () => produtosSelecionados.reduce((acc, p) => acc + (Number(p.preco) || 0) * p.quantidade, 0),
    [produtosSelecionados]
  );

  const valorPagoTotal = useMemo<number>(() => {
    if (totalGeral === 0) return 0;
    if (metodoPagamento === 'Misto')
      return pagamentosMistos.reduce((acc, p) => acc + (Number(p.valor) || 0), 0);
    if (['Crédito', 'Débito', 'Pix'].includes(metodoPagamento)) return totalGeral;
    return valorDinheiroRecebido;
  }, [metodoPagamento, valorDinheiroRecebido, pagamentosMistos, totalGeral]);

  const valorTroco = useMemo<number>(() => {
    if (['Crédito', 'Débito', 'Pix'].includes(metodoPagamento)) return 0;
    if (totalGeral <= 0 || valorPagoTotal <= totalGeral) return 0;
    return valorPagoTotal - totalGeral;
  }, [valorPagoTotal, totalGeral, metodoPagamento]);

  const valorFaltando = useMemo<number>(
    () => Math.max(0, totalGeral - valorPagoTotal),
    [totalGeral, valorPagoTotal]
  );

  const podeFinalizarVenda = useMemo<boolean>(() => {
    if (!sessaoAtual || totalGeral <= 0) return false;
    if (['Crédito', 'Débito', 'Pix'].includes(metodoPagamento)) return true;
    return valorPagoTotal >= totalGeral - 0.009;
  }, [totalGeral, metodoPagamento, valorPagoTotal, sessaoAtual]);

  const somFinalizarVenda = () => {
    audioFinalizar.current.currentTime = 0;
    audioFinalizar.current.play().catch(() => {});
  };

  const buscarProdutos = useCallback(async () => {
    try {
      setCarregandoProdutos(true);
      const dados = await apiClient.get<ProdutoDB[]>('/produtos');
      setProdutosDB(Array.isArray(dados) ? dados : []);
    } catch {
      setMensagemFlutuante('❌ Erro ao carregar catálogo.');
    } finally {
      setCarregandoProdutos(false);
    }
  }, []);

  const adicionarProduto = useCallback(
    (item: ProdutoDB) => {
      if (!sessaoAtual) {
        setMensagemFlutuante('⚠️ Abra o caixa para vender.');
        return;
      }
      const produtoOriginal = produtosDB.find((p) => p.id_produto === item.id_produto);
      if (!produtoOriginal) return;
      setProdutosSelecionados((prev) => {
        const produtoExistente = prev.find((p) => p.id_produto === item.id_produto);
        const quantidadeAtual = produtoExistente ? produtoExistente.quantidade : 0;
        if (
          produtoOriginal.tipo_item === 'Produto' &&
          (produtoOriginal.estoque_atual ?? 0) <= quantidadeAtual
        ) {
          setMensagemFlutuante('⚠️ Estoque insuficiente.');
          return prev;
        }
        if (produtoExistente) {
          return prev.map((p) =>
            p.id_produto === item.id_produto ? { ...p, quantidade: p.quantidade + 1 } : p
          );
        }
        return [
          ...prev,
          {
            ...item,
            idUnico: Date.now() + Math.random(),
            quantidade: 1,
          },
        ];
      });
    },
    [produtosDB, sessaoAtual]
  );

  const removerProduto = useCallback((idUnico: number) => {
    setProdutosSelecionados((prev) => prev.filter((p) => p.idUnico !== idUnico));
  }, []);

  const handleQuantidadeChange = useCallback((idUnico: number, novaQuantidade: number) => {
    setProdutosSelecionados((prev) =>
      prev.map((p) =>
        p.idUnico === idUnico
          ? { ...p, quantidade: Math.max(0, Number(novaQuantidade) || 0) }
          : p
      )
    );
  }, []);

  const adicionarPagamentoMisto = useCallback((metodo = 'Pix', valor = 0) => {
    setPagamentosMistos((prev) => [...prev, { id: Date.now(), metodo, valor }]);
  }, []);

  const removerPagamentoMisto = useCallback((id: number) => {
    setPagamentosMistos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const atualizarPagamentoMisto = useCallback(
    (id: number, novosDados: Partial<Pick<PagamentoMisto, 'metodo' | 'valor'>>) => {
      setPagamentosMistos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...novosDados } : p))
      );
    },
    []
  );

  const resetarCaixa = useCallback(() => {
    setProdutosSelecionados([]);
    setValorDinheiroRecebido(0);
    setMetodoPagamento('Dinheiro');
    setPagamentosMistos([
      { id: 1, metodo: 'Dinheiro', valor: 0 },
      { id: 2, metodo: 'Crédito', valor: 0 },
    ]);
    setTimeout(() => inputFiltroBuscaRef.current?.focus(), 50);
  }, []);

  const cancelarVenda = useCallback(
    (limparFiltrosCallback?: () => void) => {
      audioCancelar.current.currentTime = 0;
      audioCancelar.current.play().catch(() => {});
      limparFiltrosCallback?.();
      resetarCaixa();
    },
    [resetarCaixa]
  );

  const finalizarVenda = useCallback(
    async (limparFiltrosCallback?: () => void) => {
      if (!sessaoAtual) return;

      const pagamentosFinal: PagamentoFinal[] = [];
      if (metodoPagamento === 'Misto') {
        pagamentosMistos.forEach((p) => {
          if (p.valor > 0) pagamentosFinal.push({ metodo: p.metodo, valor_pago: p.valor });
        });
      } else {
        const valorParaRegistrar = ['Crédito', 'Débito', 'Pix'].includes(metodoPagamento)
          ? totalGeral
          : valorDinheiroRecebido;
        pagamentosFinal.push({ metodo: metodoPagamento, valor_pago: valorParaRegistrar || 0 });
      }

      const itens: ItemVenda[] = produtosSelecionados.map((i) => ({
        id_produto: i.id_produto,
        categoria: i.categoria || 'Geral',
        descricao: i.descricao || 'PRODUTO SEM NOME',
        preco_unitario: Number(i.preco) || 0,
        quantidade: i.quantidade || 0,
        subtotal: (Number(i.preco) || 0) * i.quantidade || 0,
      }));

      const venda: VendaPayload = {
        id_sessao: sessaoAtual.id_sessao,
        id_atendente: sessaoAtual.id_atendente,
        id_empresa: sessaoAtual.id_empresa,
        valor_total_bruto: totalGeral,
        valor_pago_total: valorPagoTotal,
        valor_troco: valorTroco,
        statusVenda: 'Finalizada',
        itens,
        pagamentos: pagamentosFinal,
      };

      try {
        console.log(venda);
        await apiClient.post('/vendas', venda);
        somFinalizarVenda();
        setMensagemFlutuante('✅ Venda registrada!');
        limparFiltrosCallback?.();
        resetarCaixa();
        buscarProdutos();
      } catch {
        setMensagemFlutuante('❌ Erro de conexão.');
      }
    },
    [
      totalGeral,
      sessaoAtual,
      produtosSelecionados,
      pagamentosMistos,
      metodoPagamento,
      valorPagoTotal,
      valorTroco,
      resetarCaixa,
      buscarProdutos,
    ]
  );

  useEffect(() => {
    buscarProdutos();
  }, [buscarProdutos]);

  return {
    produtosDB,
    produtosSelecionados,
    carregandoProdutos,
    mensagemFlutuante,
    setMensagemFlutuante,
    valorDinheiroRecebido,
    setValorDinheiroRecebido,
    metodoPagamento,
    setMetodoPagamento,
    valorOutroMetodo,
    setValorOutroMetodo,
    metodoSecundario,
    setMetodoSecundario,
    pagamentosMistos,
    inputFiltroBuscaRef: inputFiltroBuscaRef as React.RefObject<HTMLInputElement>,
    inputValorRecebidoRef: inputValorRecebidoRef as React.RefObject<HTMLInputElement>,
    botaoFinalizarRef: botaoFinalizarRef as React.RefObject<HTMLButtonElement>,
    totalGeral,
    valorPagoTotal,
    valorTroco,
    valorFaltando,
    podeFinalizarVenda,
    adicionarProduto,
    removerProduto,
    handleQuantidadeChange,
    adicionarPagamentoMisto,
    removerPagamentoMisto,
    atualizarPagamentoMisto,
    resetarCaixa,
    finalizarVenda,
    cancelarVenda,
    formatarParaReal,
    limparFormatacao,
  };
}