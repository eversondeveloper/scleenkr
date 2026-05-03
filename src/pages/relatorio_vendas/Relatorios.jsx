import React, { useState, useEffect } from 'react';
import { ModalRetirada } from "./components/ModalRetirada";
import { ModalEdicaoRetirada } from "./components/ModalEdicaoRetirada";
import { ModalEdicaoVenda } from "./components/ModalEdicaoVenda";
import { ModalObservacao } from "./components/ModalObservacao"; 
import { useVendas } from "./hooks/useVendas";
import { useRetiradas } from "./hooks/useRetiradas";
import { useFiltros } from "./hooks/useFiltros";
import { useCalculos } from "./hooks/useCalculos";
import { useGeracaoPDF } from "./hooks/useGeracaoPDF";
import { useObservacoes } from "./hooks/useObservacoes"; 
import { SecaoFiltros } from "./components/SecaoFiltros";
import { SecaoResumo } from "./components/SecaoResumo";
import { SecaoDelecao } from "./components/SecaoDelecao";
import { TabelaVendasComponent } from "./components/TabelaVendasComponent";
import { TabelaRetiradasComponent } from "./components/TabelaRetiradasComponent";
import { useEmpresa } from '../pdv/hooks/useEmpresa';

export const Relatorios = () => {
  // --- HOOKS DE DADOS ---
  const {
    vendas,
    carregando,
    deletarVenda,
    deletarTudoPorPeriodo, 
    limparHistoricoTotal,   
    atualizarPagamentosVenda,
    buscarVendas,
  } = useVendas();

  const {
    retiradasFiltradas: retiradasFiltradasDoHook,
    mostrarModal,
    setMostrarModal,
    modalEdicao,
    retiradaEditando,
    novaRetirada,
    setNovaRetirada,
    buscarRetiradas,
    filtrarRetiradasLocalmente,
    registrarRetirada,
    atualizarRetirada,
    deletarRetirada,
    abrirModalEdicao,
    fecharModalEdicao,
    resetarFormulario,
  } = useRetiradas();
  
  const { dadosEmpresa, carregandoEmpresa } = useEmpresa();

  const {
    filtroDataInicio,
    setFiltroDataInicio,
    filtroDataFim,
    setFiltroDataFim,
    filtroMetodosPagamento,
    toggleMetodoPagamento,
    limparFiltros,
    limparFiltrosMetodos,
    METODOS_PAGAMENTO,
    vendasFiltradas,
    retiradasFiltradas,
  } = useFiltros(vendas, retiradasFiltradasDoHook, filtrarRetiradasLocalmente);

  const {
    totaisPorMetodo,
    totalVendasBruto,
    totalValorPago,
    totalTroco,
    totalRetiradas,
    totalLiquido,
    quantidadeVendas,
  } = useCalculos(vendasFiltradas, retiradasFiltradas);

  const { gerarPDF, gerandoPDF } = useGeracaoPDF();

  const { 
    observacoes, 
    buscarObservacoesNoPeriodo, 
    salvarObservacao, 
    apagarObservacao, 
    carregandoObs 
  } = useObservacoes();
  
  // --- ESTADOS DE CONTROLE DE UI ---
  const [mostrarModalObs, setMostrarModalObs] = useState(false);
  const [textoEdicao, setTextoEdicao] = useState("");
  const [dataEdicao, setDataEdicao] = useState("");
  const [vendaEditando, setVendaEditando] = useState(null);
  const [modalEdicaoVenda, setModalEdicaoVenda] = useState(false);

  // --- EFEITO DE SINCRONIZAÇÃO INICIAL E FILTROS ---
  useEffect(() => {
    if (filtroDataInicio) {
      const fim = filtroDataFim || filtroDataInicio;
      buscarVendas(filtroDataInicio, fim);
      buscarRetiradas(filtroDataInicio, fim);
      buscarObservacoesNoPeriodo(filtroDataInicio);
    }
  }, [filtroDataInicio, filtroDataFim, buscarVendas, buscarRetiradas, buscarObservacoesNoPeriodo]);

  // --- HANDLERS DE VENDAS ---
  const handleDeletarVenda = async (id) => {
    if (!window.confirm(`⚠️ EXCLUSÃO DEFINITIVA: Deseja apagar a Venda ID: ${id}?`)) return;
    const sucesso = await deletarVenda(id);
    if (sucesso) {
      const fim = filtroDataFim || filtroDataInicio;
      await buscarVendas(filtroDataInicio, fim);
    } else {
      alert("Erro ao tentar deletar a venda no servidor.");
    }
  };

  const handleEditarVenda = (venda) => {
    setVendaEditando(venda);
    setModalEdicaoVenda(true);
  };

  const handleAtualizarVenda = async (idVenda, novosPagamentos) => {
    const sucesso = await atualizarPagamentosVenda(idVenda, novosPagamentos);
    if (sucesso) {
      setModalEdicaoVenda(false);
      setVendaEditando(null);
      const fim = filtroDataFim || filtroDataInicio;
      await buscarVendas(filtroDataInicio, fim);
    }
  };

  // --- HANDLERS DE LIMPEZA EM MASSA ---
  const handleDeletarFiltrados = async () => {
    const inicio = filtroDataInicio;
    const fim = filtroDataFim || filtroDataInicio;

    if (!inicio) {
        alert("⚠️ Selecione um período nos filtros antes de deletar.");
        return;
    }

    if (!window.confirm(`🚨 CUIDADO: Deseja apagar Vendas, Retiradas e Notas de ${inicio} até ${fim}?`)) return;

    const sucesso = await deletarTudoPorPeriodo(inicio, fim);
    if (sucesso) {
      await Promise.all([
        buscarVendas(inicio, fim),
        buscarRetiradas(inicio, fim),
        buscarObservacoesNoPeriodo(inicio)
      ]);
      alert("✅ Registros do período apagados.");
    }
  };

  const handleDeletarTudo = async () => {
    if (window.confirm("🛑 BLOQUEIO DE SEGURANÇA: Deseja apagar TODO O HISTÓRICO do sistema?")) {
      if (window.confirm("❗ ESTA AÇÃO NÃO PODE SER DESFEITA. Todos os dados financeiros sumirão. Continuar?")) {
        const sucesso = await limparHistoricoTotal();
        if (sucesso) {
          window.location.reload(); 
        } else {
          alert("Erro técnico ao tentar resetar o banco de dados.");
        }
      }
    }
  };

  // --- HANDLERS DE RETIRADAS ---
  const handleRegistrarRetirada = async () => {
    try {
      await registrarRetirada();
      const fim = filtroDataFim || filtroDataInicio;
      await buscarRetiradas(filtroDataInicio, fim);
      resetarFormulario();
      setMostrarModal(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleAtualizarRetirada = async () => {
    if (!retiradaEditando) return;
    try {
      await atualizarRetirada(retiradaEditando.id_retirada, novaRetirada);
      const fim = filtroDataFim || filtroDataInicio;
      await buscarRetiradas(filtroDataInicio, fim);
      fecharModalEdicao();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeletarRetirada = async (id) => {
    if (!window.confirm("🗑️ Deseja excluir permanentemente esta retirada?")) return;
    const sucesso = await deletarRetirada(id);
    if (sucesso) {
      const fim = filtroDataFim || filtroDataInicio;
      await buscarRetiradas(filtroDataInicio, fim);
    }
  };

  // --- HANDLERS DE OBSERVAÇÕES ---
  const handleAbrirObsParaData = (data, texto = "") => {
    setDataEdicao(data);
    setTextoEdicao(texto);
    setMostrarModalObs(true);
  };

  const handleBotaoPrincipalObservacao = () => {
    const dataAlvo = filtroDataInicio || new Date().toISOString().split('T')[0];
    const obsExistente = observacoes.find(obs => 
      obs.data_observacao.split('T')[0] === dataAlvo
    );
    handleAbrirObsParaData(dataAlvo, obsExistente ? obsExistente.texto : "");
  };

  const handleSalvarObservacao = async () => {
    const sucesso = await salvarObservacao(dataEdicao, textoEdicao, dadosEmpresa?.id_empresa);
    if (sucesso) {
      setMostrarModalObs(false);
      await buscarObservacoesNoPeriodo(dataEdicao);
    }
  };

  const handleApagarObservacao = async () => {
    const sucesso = await apagarObservacao(dataEdicao);
    if (sucesso) {
      setMostrarModalObs(false);
      await buscarObservacoesNoPeriodo(dataEdicao);
    }
  };

  // --- PDF ---
  const handleGerarPDF = () => {
    if (carregandoEmpresa) return;
    gerarPDF({
      vendasFiltradas,
      retiradasFiltradas,
      totaisPorMetodo,
      totalVendasBruto,
      totalValorPago,
      totalTroco,
      totalRetiradas,
      totalLiquido,
      quantidadeVendas,
      filtroDataInicio,
      filtroDataFim,
      filtroMetodosPagamento,
      dadosEmpresa,
      observacoes: observacoes 
    });
  };

  // --- RENDERIZAÇÃO ---
  if (carregando || carregandoEmpresa) {
    return (
      <div className="flex w-[98%] h-full my-5 mx-auto items-center justify-center bg-card rounded-xl shadow-2xl border border-border">
        <h1 className="text-3xl font-light text-muted-foreground animate-pulse">Sincronizando Relatórios...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-5">
      
      <div className="w-full text-center mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-light text-foreground mb-2 m-0">Relatório Financeiro</h1>
        <p className="text-base text-muted-foreground m-0">Acompanhamento de vendas, retiradas e fluxo de caixa.</p>
      </div>

      <div className="flex flex-col w-full">
        
        <SecaoFiltros
          filtroDataInicio={filtroDataInicio}
          setFiltroDataInicio={setFiltroDataInicio}
          filtroDataFim={filtroDataFim}
          setFiltroDataFim={setFiltroDataFim}
          filtroMetodosPagamento={filtroMetodosPagamento}
          toggleMetodoPagamento={toggleMetodoPagamento}
          limparFiltros={limparFiltros}
          limparFiltrosMetodos={limparFiltrosMetodos}
          METODOS_PAGAMENTO={METODOS_PAGAMENTO}
        />

        <SecaoResumo
          filtroDataInicio={filtroDataInicio}
          filtroDataFim={filtroDataFim}
          filtroMetodosPagamento={filtroMetodosPagamento}
          quantidadeVendas={quantidadeVendas}
          totalVendasBruto={totalVendasBruto}
          totalValorPago={totalValorPago}
          totalTroco={totalTroco}
          totalRetiradas={totalRetiradas}
          totalLiquido={totalLiquido}
          totaisPorMetodo={totaisPorMetodo}
          dadosEmpresa={dadosEmpresa}
        />

        <SecaoDelecao
          onNovaRetirada={() => setMostrarModal(true)}
          onGerarPDF={handleGerarPDF}
          gerandoPDF={gerandoPDF}
          vendasFiltradas={vendasFiltradas}
          retiradasFiltradas={retiradasFiltradas}
          vendas={vendas}
          onDeletarFiltrados={handleDeletarFiltrados}
          onDeletarTudo={handleDeletarTudo} 
          onAbrirObservacao={handleBotaoPrincipalObservacao}
          temObservacao={observacoes.length > 0}
        />

        <TabelaVendasComponent
          vendasFiltradas={vendasFiltradas}
          quantidadeVendas={quantidadeVendas}
          totalVendasBruto={totalVendasBruto}
          onDeletarVenda={handleDeletarVenda}
          onEditarVenda={handleEditarVenda}
        />

        <TabelaRetiradasComponent
          retiradasFiltradas={retiradasFiltradas}
          filtroDataInicio={filtroDataInicio}
          filtroDataFim={filtroDataFim}
          onEditarRetirada={abrirModalEdicao}
          onDeletarRetirada={handleDeletarRetirada}
        />

      </div>

      {/* Seção de Observações */}
      {observacoes.length > 0 && (
        <div className="w-full mt-8 mb-5">
          <h2 className="text-foreground text-xl mb-4 font-semibold">📝 Observações do Período</h2>
          {observacoes.map((obs) => {
             const d = obs.data_observacao.split('T')[0].split('-');
             const dataFormatada = `${d[2]}/${d[1]}/${d[0]}`;

             return (
              <div key={obs.data_observacao} className="bg-card p-5 mb-5 rounded-lg w-full border border-border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-muted-foreground text-base m-0 font-bold">Data: {dataFormatada}</h3>
                  <button 
                    className="bg-warning text-warning-foreground border-none py-1.5 px-3 rounded cursor-pointer transition-colors hover:bg-warning/90 font-bold text-xs shadow-sm"
                    onClick={() => handleAbrirObsParaData(obs.data_observacao.split('T')[0], obs.texto)}
                  >
                    Editar Nota
                  </button>
                </div>
                <div 
                  className="p-4 pl-6 bg-background rounded-md border-l-4 border-success text-success text-sm leading-relaxed mt-2.5"
                  dangerouslySetInnerHTML={{ __html: obs.texto }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* MODAIS DE APOIO */}
      <ModalObservacao
        mostrar={mostrarModalObs}
        onClose={() => setMostrarModalObs(false)}
        texto={textoEdicao}
        setTexto={setTextoEdicao}
        onSalvar={handleSalvarObservacao}
        onApagar={handleApagarObservacao}
        carregando={carregandoObs}
        dataSelecionada={dataEdicao}
      />
      
      <ModalRetirada
        mostrar={mostrarModal}
        onClose={() => { setMostrarModal(false); resetarFormulario(); }}
        novaRetirada={novaRetirada}
        setNovaRetirada={setNovaRetirada}
        onRegistrar={handleRegistrarRetirada}
      />

      <ModalEdicaoRetirada
        mostrar={modalEdicao}
        onClose={fecharModalEdicao}
        novaRetirada={novaRetirada}
        setNovaRetirada={setNovaRetirada}
        onAtualizar={handleAtualizarRetirada}
        retiradaEditando={retiradaEditando}
      />

      <ModalEdicaoVenda
        mostrar={modalEdicaoVenda}
        onClose={() => { setModalEdicaoVenda(false); setVendaEditando(null); }}
        vendaEditando={vendaEditando}
        onAtualizar={handleAtualizarVenda}
      />
    </div>
  );
};