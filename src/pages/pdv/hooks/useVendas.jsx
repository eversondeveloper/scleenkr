/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import somCancelar from "/sounds/efeitos/cancelar1.mp3";
import somFinalizar from "/sounds/efeitos/printer2.mp3";

const URL_API_VENDAS = "http://localhost:3000/vendas";
const URL_API_PRODUTOS = "http://localhost:3000/produtos";

export const formatarParaReal = (valor) => {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor || 0);
};

export const limparFormatacao = (stringFormatada) => {
  if (typeof stringFormatada !== "string") return stringFormatada;
  const apenasNumeros = stringFormatada.replace(/\D/g, "");
  return parseFloat(apenasNumeros) / 100;
};

export const useVendas = (sessaoAtual) => {
  // 1. ESTADOS
  const [produtosDB, setProdutosDB] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [valorDinheiroRecebido, setValorDinheiroRecebido] = useState(0);
  const [metodoPagamento, setMetodoPagamento] = useState("Dinheiro");
  const [valorOutroMetodo, setValorOutroMetodo] = useState(0);
  const [metodoSecundario, setMetodoSecundario] = useState("Crédito");
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [mensagemFlutuante, setMensagemFlutuante] = useState("");
  const [pagamentosMistos, setPagamentosMistos] = useState([
    { id: 1, metodo: "Dinheiro", valor: 0 },
    { id: 2, metodo: "Crédito", valor: 0 },
  ]);

  // 2. REFS
  const audioFinalizar = useRef(new Audio(somFinalizar));
  const audioCancelar = useRef(new Audio(somCancelar));
  const inputFiltroBuscaRef = useRef(null);
  const inputValorRecebidoRef = useRef(null);
  const botaoFinalizarRef = useRef(null);

  // 3. CÁLCULOS BÁSICOS (ESTES NÃO DEPENDEM DE OUTROS MEMOS)
  const totalGeral = useMemo(
    () => produtosSelecionados.reduce((acc, p) => acc + parseFloat(p.preco || 0) * p.quantidade, 0),
    [produtosSelecionados]
  );

  // 4. CÁLCULOS DEPENDENTES DO totalGeral
  const valorPagoTotal = useMemo(() => {
    if (totalGeral === 0) return 0;
    if (metodoPagamento === "Misto") return pagamentosMistos.reduce((acc, p) => acc + p.valor, 0);
    if (["Crédito", "Débito", "Pix"].includes(metodoPagamento)) return totalGeral;
    return valorDinheiroRecebido;
  }, [metodoPagamento, valorDinheiroRecebido, pagamentosMistos, totalGeral]);

  const valorTroco = useMemo(() => {
    if (["Crédito", "Débito", "Pix"].includes(metodoPagamento)) return 0;
    if (totalGeral <= 0 || valorPagoTotal <= totalGeral) return 0;
    return valorPagoTotal - totalGeral;
  }, [valorPagoTotal, totalGeral, metodoPagamento]);

  const sugestoesTroco = useMemo(() => {
    if (totalGeral <= 0) return [2, 5, 10, 20, 50, 100];
    const notas = [2, 5, 10, 20, 50, 100];
    const sugestoes = new Set();
    sugestoes.add(Math.round((totalGeral + Number.EPSILON) * 100) / 100);
    notas.forEach(nota => {
      if (nota > totalGeral) sugestoes.add(nota);
      if (nota + 10 > totalGeral && nota + 10 < totalGeral + 50) sugestoes.add(nota + 10);
    });
    return Array.from(sugestoes).sort((a, b) => a - b).slice(0, 8);
  }, [totalGeral]);

  const podeFinalizarVenda = useMemo(() => {
    if (!sessaoAtual || totalGeral <= 0) return false;
    if (["Crédito", "Débito", "Pix"].includes(metodoPagamento)) return true;
    return valorPagoTotal >= (totalGeral - 0.01);
  }, [totalGeral, metodoPagamento, valorPagoTotal, sessaoAtual]);

  // 5. FUNÇÕES E CALLBACKS
  const somFinalizarVenda = () => {
    audioFinalizar.current.currentTime = 0;
    audioFinalizar.current.play().catch(() => {});
  };

  const somCancelarVenda = () => {
    audioCancelar.current.currentTime = 0;
    audioCancelar.current.play().catch(() => {});
  };

  const buscarProdutos = useCallback(async () => {
    try {
      setCarregandoProdutos(true);
      const resposta = await fetch(URL_API_PRODUTOS);
      const dados = await resposta.json();
      setProdutosDB(Array.isArray(dados) ? dados : []);
    } catch (error) {
      setMensagemFlutuante("❌ Erro ao carregar catálogo.");
    } finally {
      setCarregandoProdutos(false);
    }
  }, []);

  const adicionarProduto = useCallback((item) => {
    if (!sessaoAtual) return setMensagemFlutuante("⚠️ Abra o caixa para vender.");
    const produtoOriginal = produtosDB.find(p => p.id_produto === item.id_produto);
    if (!produtoOriginal) return;

    setProdutosSelecionados(prev => {
      const produtoExistente = prev.find(p => p.id_produto === item.id_produto);
      const quantidadeAtual = produtoExistente ? produtoExistente.quantidade : 0;
      if (produtoOriginal.tipo_item === "Produto" && produtoOriginal.estoque_atual <= quantidadeAtual) {
        setMensagemFlutuante("⚠️ Estoque insuficiente.");
        return prev;
      }
      if (produtoExistente) {
        return prev.map(p => p.id_produto === item.id_produto ? { ...p, quantidade: p.quantidade + 1 } : p);
      } else {
        return [...prev, { ...item, idUnico: Date.now() + Math.random(), quantidade: 1 }];
      }
    });
  }, [produtosDB, sessaoAtual]);

  const processarBuscaDireta = useCallback((termo, limparInputCallback) => {
    if (!termo || termo.trim() === "") return false;
    const produtoEncontrado = produtosDB.find(p => 
      p.id_produto.toString() === termo.trim() || (p.codigo_barras && p.codigo_barras === termo.trim())
    );
    if (produtoEncontrado) {
      adicionarProduto(produtoEncontrado);
      if (limparInputCallback) limparInputCallback();
      return true;
    }
    return false;
  }, [produtosDB, adicionarProduto]);

  const resetarCaixa = useCallback(() => {
    setProdutosSelecionados([]);
    setValorDinheiroRecebido(0);
    setMetodoPagamento("Dinheiro");
    setPagamentosMistos([{ id: 1, metodo: "Dinheiro", valor: 0 }, { id: 2, metodo: "Crédito", valor: 0 }]);
    setTimeout(() => inputFiltroBuscaRef.current?.focus(), 50);
  }, []);

  const finalizarVenda = useCallback(async (limparFiltrosCallback) => {
    if (!sessaoAtual) return;
    const pagamentosFinal = [];
    if (metodoPagamento === "Misto") {
      pagamentosMistos.forEach(p => { if (p.valor > 0) pagamentosFinal.push({ metodo: p.metodo, valor_pago: p.valor }); });
    } else {
      const valorParaRegistrar = ["Crédito", "Débito", "Pix"].includes(metodoPagamento) ? totalGeral : valorDinheiroRecebido;
      pagamentosFinal.push({ metodo: metodoPagamento, valor_pago: valorParaRegistrar || 0 });
    }

    const venda = {
      id_sessao: sessaoAtual.id_sessao,
      id_atendente: sessaoAtual.id_atendente,
      id_empresa: sessaoAtual.id_empresa,
      valor_total_bruto: totalGeral,
      valor_pago_total: valorPagoTotal,
      valor_troco: valorTroco,
      status_venda: 'Finalizada',
      itens: produtosSelecionados.map(i => ({
        id_produto: i.id_produto,
        preco_unitario: i.preco || 0,
        quantidade: i.quantidade || 0,
        subtotal: (parseFloat(i.preco) * i.quantidade) || 0,
      })),
      pagamentos: pagamentosFinal
    };

    try {
      const r = await fetch(URL_API_VENDAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda),
      });
      if (r.ok) {
        somFinalizarVenda();
        setMensagemFlutuante(`✅ Venda registrada!`);
        if (limparFiltrosCallback) limparFiltrosCallback();
        resetarCaixa();
        buscarProdutos(); 
      }
    } catch (error) {
      setMensagemFlutuante("❌ Erro de conexão.");
    }
  }, [totalGeral, sessaoAtual, produtosSelecionados, pagamentosMistos, metodoPagamento, valorPagoTotal, valorTroco]);

  // 6. EFEITOS
  useEffect(() => { buscarProdutos(); }, [buscarProdutos]);

  return {
    produtosDB, produtosSelecionados, carregandoProdutos,
    mensagemFlutuante, setMensagemFlutuante, valorDinheiroRecebido, setValorDinheiroRecebido,
    metodoPagamento, setMetodoPagamento, valorOutroMetodo, setValorOutroMetodo,
    metodoSecundario, setMetodoSecundario, pagamentosMistos, 
    inputFiltroBuscaRef, inputValorRecebidoRef, botaoFinalizarRef, 
    totalGeral, valorPagoTotal, valorTroco, sugestoesTroco,
    podeFinalizarVenda, adicionarProduto, processarBuscaDireta, resetarCaixa, finalizarVenda,
    formatarParaReal, limparFormatacao
  };
};