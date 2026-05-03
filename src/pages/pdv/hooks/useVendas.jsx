/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { apiClient } from '../../../api/apiClient';
import somCancelar from '/sounds/efeitos/cancelar1.mp3';
import somFinalizar from '/sounds/efeitos/printer16.mp3';

export const formatarParaReal = (valor) =>
  new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor || 0);

export const limparFormatacao = (stringFormatada) => {
  if (typeof stringFormatada !== 'string') return stringFormatada;
  return parseFloat(stringFormatada.replace(/\D/g, '')) / 100;
};

export const useVendas = (sessaoAtual) => {
  const [produtosDB, setProdutosDB] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [valorDinheiroRecebido, setValorDinheiroRecebido] = useState(0);
  const [metodoPagamento, setMetodoPagamento] = useState('Dinheiro');
  const [valorOutroMetodo, setValorOutroMetodo] = useState(0);
  const [metodoSecundario, setMetodoSecundario] = useState('Crédito');
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [mensagemFlutuante, setMensagemFlutuante] = useState('');
  const [pagamentosMistos, setPagamentosMistos] = useState([
    { id: 1, metodo: 'Dinheiro', valor: 0 },
    { id: 2, metodo: 'Crédito', valor: 0 },
  ]);

  const audioFinalizar = useRef(new Audio(somFinalizar));
  const audioCancelar = useRef(new Audio(somCancelar));
  const inputFiltroBuscaRef = useRef(null);
  const inputValorRecebidoRef = useRef(null);
  const botaoFinalizarRef = useRef(null);

  const totalGeral = useMemo(
    () => produtosSelecionados.reduce((acc, p) => acc + parseFloat(p.preco || 0) * p.quantidade, 0),
    [produtosSelecionados]
  );

  const valorPagoTotal = useMemo(() => {
    if (totalGeral === 0) return 0;
    if (metodoPagamento === 'Misto') return pagamentosMistos.reduce((acc, p) => acc + (parseFloat(p.valor) || 0), 0);
    if (['Crédito', 'Débito', 'Pix'].includes(metodoPagamento)) return totalGeral;
    return valorDinheiroRecebido;
  }, [metodoPagamento, valorDinheiroRecebido, pagamentosMistos, totalGeral]);

  const valorTroco = useMemo(() => {
    if (['Crédito', 'Débito', 'Pix'].includes(metodoPagamento)) return 0;
    if (totalGeral <= 0 || valorPagoTotal <= totalGeral) return 0;
    return valorPagoTotal - totalGeral;
  }, [valorPagoTotal, totalGeral, metodoPagamento]);

  const podeFinalizarVenda = useMemo(() => {
    if (!sessaoAtual || totalGeral <= 0) return false;
    if (['Crédito', 'Débito', 'Pix'].includes(metodoPagamento)) return true;
    return valorPagoTotal >= (totalGeral - 0.009);
  }, [totalGeral, metodoPagamento, valorPagoTotal, sessaoAtual]);

  const somFinalizarVenda = () => {
    audioFinalizar.current.currentTime = 0;
    audioFinalizar.current.play().catch(() => {});
  };

  const buscarProdutos = useCallback(async () => {
    try {
      setCarregandoProdutos(true);
      const dados = await apiClient.get('/produtos');
      setProdutosDB(Array.isArray(dados) ? dados : []);
    } catch {
      setMensagemFlutuante('❌ Erro ao carregar catálogo.');
    } finally {
      setCarregandoProdutos(false);
    }
  }, []);

  const adicionarProduto = useCallback((item) => {
    if (!sessaoAtual) return setMensagemFlutuante('⚠️ Abra o caixa para vender.');
    const produtoOriginal = produtosDB.find(p => p.id_produto === item.id_produto);
    if (!produtoOriginal) return;
    setProdutosSelecionados(prev => {
      const produtoExistente = prev.find(p => p.id_produto === item.id_produto);
      const quantidadeAtual = produtoExistente ? produtoExistente.quantidade : 0;
      if (produtoOriginal.tipo_item === 'Produto' && produtoOriginal.estoque_atual <= quantidadeAtual) {
        setMensagemFlutuante('⚠️ Estoque insuficiente.');
        return prev;
      }
      if (produtoExistente) {
        return prev.map(p => p.id_produto === item.id_produto ? { ...p, quantidade: p.quantidade + 1 } : p);
      }
      return [...prev, { ...item, idUnico: Date.now() + Math.random(), quantidade: 1 }];
    });
  }, [produtosDB, sessaoAtual]);

  const removerProduto = useCallback((idUnico) => {
    setProdutosSelecionados(prev => prev.filter(p => p.idUnico !== idUnico));
  }, []);

  const handleQuantidadeChange = useCallback((idUnico, novaQuantidade) => {
    setProdutosSelecionados(prev =>
      prev.map(p => p.idUnico === idUnico ? { ...p, quantidade: Math.max(0, parseFloat(novaQuantidade) || 0) } : p)
    );
  }, []);

  const adicionarPagamentoMisto = useCallback((metodo = 'Pix', valor = 0) => {
    setPagamentosMistos(prev => [...prev, { id: Date.now(), metodo, valor }]);
  }, []);

  const removerPagamentoMisto = useCallback((id) => {
    setPagamentosMistos(prev => prev.filter(p => p.id !== id));
  }, []);

  const atualizarPagamentoMisto = useCallback((id, novosDados) => {
    setPagamentosMistos(prev => prev.map(p => p.id === id ? { ...p, ...novosDados } : p));
  }, []);

  const resetarCaixa = useCallback(() => {
    setProdutosSelecionados([]);
    setValorDinheiroRecebido(0);
    setMetodoPagamento('Dinheiro');
    setPagamentosMistos([{ id: 1, metodo: 'Dinheiro', valor: 0 }, { id: 2, metodo: 'Crédito', valor: 0 }]);
    setTimeout(() => inputFiltroBuscaRef.current?.focus(), 50);
  }, []);

  const cancelarVenda = useCallback((limparFiltrosCallback) => {
    audioCancelar.current.currentTime = 0;
    audioCancelar.current.play().catch(() => {});
    if (limparFiltrosCallback) limparFiltrosCallback();
    resetarCaixa();
  }, [resetarCaixa]);

  const finalizarVenda = useCallback(async (limparFiltrosCallback) => {
    if (!sessaoAtual) return;
    const pagamentosFinal = [];
    if (metodoPagamento === 'Misto') {
      pagamentosMistos.forEach(p => { if (p.valor > 0) pagamentosFinal.push({ metodo: p.metodo, valor_pago: p.valor }); });
    } else {
      const valorParaRegistrar = ['Crédito', 'Débito', 'Pix'].includes(metodoPagamento) ? totalGeral : valorDinheiroRecebido;
      pagamentosFinal.push({ metodo: metodoPagamento, valor_pago: valorParaRegistrar || 0 });
    }
    const venda = {
      id_sessao: sessaoAtual.id_sessao, id_atendente: sessaoAtual.id_atendente, id_empresa: sessaoAtual.id_empresa,
      valor_total_bruto: totalGeral, valor_pago_total: valorPagoTotal, valor_troco: valorTroco,
      statusVenda: 'Finalizada',
      itens: produtosSelecionados.map(i => ({
        id_produto: i.id_produto, categoria: i.categoria || 'Geral',
        descricao: i.descricao || 'PRODUTO SEM NOME', preco_unitario: Number(i.preco) || 0,
        quantidade: i.quantidade || 0, subtotal: (parseFloat(i.preco) * i.quantidade) || 0,
      })),
      pagamentos: pagamentosFinal,
    };
    try {
      console.log(venda)
      await apiClient.post('/vendas', venda);
      somFinalizarVenda();
      setMensagemFlutuante('✅ Venda registrada!');
      if (limparFiltrosCallback) limparFiltrosCallback();
      resetarCaixa();
      buscarProdutos();
    } catch {
      setMensagemFlutuante('❌ Erro de conexão.');
    }
  }, [totalGeral, sessaoAtual, produtosSelecionados, pagamentosMistos, metodoPagamento, valorPagoTotal, valorTroco, resetarCaixa, buscarProdutos]);

  useEffect(() => { buscarProdutos(); }, [buscarProdutos]);

  return {
    produtosDB, produtosSelecionados, carregandoProdutos, mensagemFlutuante, setMensagemFlutuante,
    valorDinheiroRecebido, setValorDinheiroRecebido, metodoPagamento, setMetodoPagamento,
    valorOutroMetodo, setValorOutroMetodo, metodoSecundario, setMetodoSecundario, pagamentosMistos,
    inputFiltroBuscaRef, inputValorRecebidoRef, botaoFinalizarRef,
    totalGeral, valorPagoTotal, valorTroco, podeFinalizarVenda,
    adicionarProduto, removerProduto, handleQuantidadeChange,
    adicionarPagamentoMisto, removerPagamentoMisto, atualizarPagamentoMisto,
    resetarCaixa, finalizarVenda, cancelarVenda, formatarParaReal, limparFormatacao,
  };
};
