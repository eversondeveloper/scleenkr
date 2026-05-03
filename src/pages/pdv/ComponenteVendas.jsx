import { useVendas } from "./hooks/useVendas";
import { useFiltros } from "./hooks/useFiltros";
import { useAtalhos } from "./hooks/useAtalhos";
import { useOrganizacao } from "./hooks/useOrganizacao";
import ToastMensagem from "./components/ToastMensagem";
import FiltrosCatalogo from "./components/FiltrosCatalogo";
import ListaProdutos from "./components/ListaProdutos";
import ProdutosSelecionados from "./components/ProdutosSelecionados";
import MetodosPagamento from "./components/MetodosPagamento";
import ResumoVenda from "./components/ResumoVenda";
import { useRef, useCallback } from "react"; 
import { useNavigate } from "react-router-dom";

// IMPORT DA NOSSA SEÇÃO PADRÃO
import { SecaoPagina } from "../../components/layout/SecaoPagina"; 

import somMetodosPagamento from "/sounds/efeitos/metodos_pagamento.mp3";
import somClickArquivo from "/sounds/efeitos/selecionar1.mp3";
import somClickArquivoMenos from "/sounds/efeitos/selecionarmenos.mp3";

const METODOS_NAVEGACAO = ["Dinheiro", "Crédito", "Débito", "Pix", "Misto"];

export default function ComponenteVendas({ sessaoAtual, temAtendentes, empresaGlobal }) {
  const navigate = useNavigate();

  const audioMetodos = useRef(new Audio(somMetodosPagamento));
  const audioClickProduto = useRef(new Audio(somClickArquivo));
  const audioClickProdutoMenos = useRef(new Audio(somClickArquivoMenos));

  const tocarSomMetodo = useCallback(() => {
    audioMetodos.current.currentTime = 0;
    audioMetodos.current.play().catch(() => {});
  }, []);

  const tocarSomProduto = useCallback(() => {
    audioClickProduto.current.currentTime = 0;
    audioClickProduto.current.play().catch(() => {});
  }, []);

  const tocarSomProdutoMenos = useCallback(() => {
    audioClickProdutoMenos.current.currentTime = 0;
    audioClickProdutoMenos.current.play().catch(() => {});
  }, []);

  const {
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
    metodoSecundario,
    setMetodoSecundario,
    pagamentosMistos,
    adicionarPagamentoMisto,
    removerPagamentoMisto,
    atualizarPagamentoMisto,
    inputFiltroBuscaRef,
    inputValorRecebidoRef,
    totalGeral,
    valorPagoTotal,
    valorFaltando,
    valorTroco,
    podeFinalizarVenda,
    adicionarProduto,
    removerProduto,
    handleQuantidadeChange,
    finalizarVenda,
    cancelarVenda,
  } = useVendas(sessaoAtual); 

  const {
    filtroCategoriasSelecionadas,
    filtroTipoItem,
    filtroBusca,
    filtrosExpandidos,
    setFiltroBusca,
    setFiltrosExpandidos,
    categoriasUnicas,
    produtosFiltrados,
    temFiltrosAtivos,
    toggleCategoriaFiltro,
    setFiltroTipoItem,
    limparFiltros
  } = useFiltros(produtosDB);

  const { modoOrganizacao, setModoOrganizacao, OPCOES_ORGANIZACAO } = useOrganizacao();

  const handleFinalizarVendaComLimpeza = useCallback(() => {
    finalizarVenda(() => {
      limparFiltros();
      setFiltrosExpandidos(false);
    });
  }, [finalizarVenda, limparFiltros, setFiltrosExpandidos]);

  const handleCancelarVendaComLimpeza = useCallback(() => {
    cancelarVenda(() => {
      limparFiltros();
      setFiltrosExpandidos(false);
    });
  }, [cancelarVenda, limparFiltros, setFiltrosExpandidos]);

  const alternarMetodoPagamento = useCallback(() => {
    const currentIndex = METODOS_NAVEGACAO.indexOf(metodoPagamento);
    const nextIndex = (currentIndex + 1) % METODOS_NAVEGACAO.length;
    const nextMetodo = METODOS_NAVEGACAO[nextIndex];

    tocarSomMetodo();
    setMetodoPagamento(nextMetodo);

    if (nextMetodo === "Dinheiro" || nextMetodo === "Misto") {
      setTimeout(() => inputValorRecebidoRef.current?.focus(), 50);
    }
  }, [metodoPagamento, setMetodoPagamento, tocarSomMetodo, inputValorRecebidoRef]);

  useAtalhos({
    podeFinalizarVenda,
    finalizarVenda: handleFinalizarVendaComLimpeza,
    cancelarVenda: handleCancelarVendaComLimpeza,
    produtosSelecionados,
    removerProduto,
    limparFiltros,
    setMetodoPagamento,
    alternarMetodoPagamento,
    inputFiltroBuscaRef,
    inputValorRecebidoRef
  });

  const btnBloqueioClass = "py-3 px-6 rounded-md font-bold cursor-pointer text-base transition-all hover:-translate-y-0.5 text-white border-none shadow-sm";

  // --- TELA DE ERRO: EMPRESA NÃO CONFIGURADA ---
  if (!empresaGlobal) {
    return (
      <SecaoPagina>
        <div className="w-full h-full flex items-center justify-center">
          <div className="bg-card p-10 rounded-xl border-2 border-primary text-center max-w-md shadow-2xl">
            <span className="text-6xl block mb-5">🏢</span>
            <h2 className="text-foreground mb-2.5 font-light text-2xl">Sistema não Configurado</h2>
            <p className="text-muted-foreground mb-7 leading-relaxed">Os dados da empresa emissora foram removidos ou não existem.</p>
            <button 
              className={`${btnBloqueioClass} bg-primary hover:brightness-110`}
              onClick={() => navigate("/scleenkr/atendentes_sessao")}
            >
              Configurar Empresa
            </button>
          </div>
        </div>
      </SecaoPagina>
    );
  }

  // --- TELA DE ERRO: CAIXA INDISPONÍVEL ---
  if (!temAtendentes || !sessaoAtual) {
    return (
      <SecaoPagina>
        <div className="w-full h-full flex items-center justify-center">
          <div className="bg-card p-10 rounded-xl border border-border text-center max-w-md shadow-2xl">
            <span className="text-6xl block mb-5">{!temAtendentes ? "👤" : "🔒"}</span>
            <h2 className="text-foreground mb-2.5 font-light text-2xl">Caixa Indisponível</h2>
            <p className="text-muted-foreground mb-7 leading-relaxed">
              {!temAtendentes 
                ? "Nenhum atendente cadastrado no sistema." 
                : "É necessário abrir uma sessão de caixa para realizar vendas."}
            </p>
            <button 
              className={`${btnBloqueioClass} bg-primary text-primary-foreground hover:brightness-110`}
              onClick={() => navigate("/scleenkr/atendentes_sessao")}
            >
              {!temAtendentes ? "Cadastrar Atendente" : "Ir para Gestão de Caixa"}
            </button>
          </div>
        </div>
      </SecaoPagina>
    );
  }

  // TELA PRINCIPAL DO PDV ---
  return (
    <SecaoPagina layout="row" semScrollGlobal={true}>
      <ToastMensagem mensagem={mensagemFlutuante} onClose={() => setMensagemFlutuante("")} />

      {/* COLUNA ESQUERDA: CATÁLOGO (Agora com 30% para dar mais respiro ao Caixa) */}
      <div className="w-full lg:w-[30%] h-full flex flex-col border border-border shadow-sm p-3 rounded-lg overflow-hidden bg-card">
        <FiltrosCatalogo
          filtroBusca={filtroBusca}
          setFiltroBusca={setFiltroBusca}
          filtrosExpandidos={filtrosExpandidos}
          setFiltrosExpandidos={setFiltrosExpandidos}
          categoriasUnicas={categoriasUnicas}
          filtroCategoriasSelecionadas={filtroCategoriasSelecionadas}
          toggleCategoriaFiltro={toggleCategoriaFiltro}
          filtroTipoItem={filtroTipoItem}
          setFiltroTipoItem={setFiltroTipoItem}
          temFiltrosAtivos={temFiltrosAtivos}
          limparFiltros={limparFiltros}
          inputFiltroBuscaRef={inputFiltroBuscaRef}
        />

        <div className="flex-1 overflow-y-auto min-h-0 mt-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 [&::-webkit-scrollbar-thumb]:rounded-full">
          <ListaProdutos
            carregandoProdutos={carregandoProdutos}
            produtosFiltrados={produtosFiltrados}
            produtosSelecionados={produtosSelecionados}
            adicionarProduto={adicionarProduto}
            corTextoBtn="#cecece" 
            somClick={tocarSomProduto}
            modoOrganizacao={modoOrganizacao}
            setModoOrganizacao={setModoOrganizacao}
            OPCOES_ORGANIZACAO={OPCOES_ORGANIZACAO}
          />
        </div>
      </div>

      {/* COLUNA DIREITA: CAIXA E PAGAMENTO (Agora com 70% da tela) */}
      <div className="w-full lg:w-[70%] h-full border border-border p-4 shadow-md rounded-lg bg-card flex flex-col overflow-hidden">
        {produtosSelecionados.length > 0 ? (
          
          /* PAREDES DE FERRO: Flexbox com min-w-0 para proibir um componente de esmagar o outro */
          <div className="flex flex-row w-full h-full gap-4 min-h-0">
            
            {/* 1. ÁREA DO CARRINHO (28% do espaço do Caixa) */}
            <div className="w-[28%] min-w-0 h-full flex flex-col border-r border-border/50 pr-3">
              <ProdutosSelecionados
                produtosSelecionados={produtosSelecionados}
                removerProduto={removerProduto}
                handleQuantidadeChange={handleQuantidadeChange}
                totalGeral={totalGeral}
                dadosEmpresa={empresaGlobal} 
                somClick={tocarSomProduto}
                somClickMenos={tocarSomProdutoMenos}
              />
            </div>

            {/* 2. ÁREA DE PAGAMENTO / CALCULADORA (40% do espaço - Garante que os botões caibam perfeitos) */}
            <div className="w-[40%] min-w-0 h-full overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col">
              <MetodosPagamento
                metodoPagamento={metodoPagamento}
                setMetodoPagamento={setMetodoPagamento}
                valorDinheiroRecebido={valorDinheiroRecebido}
                setValorDinheiroRecebido={setValorDinheiroRecebido}
                inputValorRecebidoRef={inputValorRecebidoRef}
                pagamentosMistos={pagamentosMistos}
                adicionarPagamentoMisto={adicionarPagamentoMisto}
                removerPagamentoMisto={removerPagamentoMisto}
                atualizarPagamentoMisto={atualizarPagamentoMisto}
                totalGeral={totalGeral}
                somClick={tocarSomProduto}
                somClickMenos={tocarSomProdutoMenos}
                onFinalizarVenda={handleFinalizarVendaComLimpeza}
              />
            </div>

            {/* 3. ÁREA DE RESUMO FINAL (32% do espaço) */}
            <div className="w-[32%] min-w-0 h-full flex flex-col bg-secondary p-5 rounded-lg border border-border shadow-sm">
              <ResumoVenda
                metodoPagamento={metodoPagamento}
                metodoSecundario={metodoSecundario}
                totalGeral={totalGeral}
                valorFaltando={valorFaltando}
                valorTroco={valorTroco}
                podeFinalizarVenda={podeFinalizarVenda}
                finalizarVenda={handleFinalizarVendaComLimpeza}
                cancelarVenda={handleCancelarVendaComLimpeza}
                pagamentosMistos={pagamentosMistos}
                valorPagoTotal={valorPagoTotal}
                somClick={tocarSomProduto}
                somClickMenos={tocarSomProdutoMenos}
              />
            </div>

          </div>

        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-center gap-5">
            <div className="text-3xl font-extrabold text-muted-foreground tracking-widest opacity-50 uppercase">
              {empresaGlobal?.nome_fantasia || "EVERSCASH"}
            </div>
            
            <div>
              <h2 className="bg-success text-success-foreground px-12 py-4 rounded-full text-2xl font-bold shadow-lg shadow-success/40 animate-pulse">
                CAIXA LIVRE
              </h2>
            </div>
            
            <div className="text-muted-foreground text-base flex flex-col gap-4 w-[60%]">
              <p>Selecione produtos no catálogo para iniciar uma venda</p>
              <div className="flex justify-center gap-2.5 text-sm text-muted-foreground flex-wrap">
                <span><strong className="text-primary mr-1">[MOUSE]</strong> Selecionar Produtos</span>
                <span><strong className="text-primary mr-1">[BACKSPACE]</strong> Excluir Produtos</span>
                <span><strong className="text-primary mr-1">[F2]</strong> Métodos de Pagamento</span>
                <span><strong className="text-primary mr-1">[ESC]</strong> Cancelar Venda</span>
                <span><strong className="text-primary mr-1">[ENTER]</strong> Finalizar Venda</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </SecaoPagina>
  );
}