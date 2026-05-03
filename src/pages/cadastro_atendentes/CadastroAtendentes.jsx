import React, { useState, useEffect } from 'react';
import { useAtendentes } from './hooks/useAtendentes';
import { useSessoesCaixa } from './hooks/useSessoesCaixa';
import { useFiltrosAtendentes } from './hooks/useFiltrosAtendentes'; 
import { useEmpresa } from './hooks/useEmpresa';

// Componentes de Seção
import { SecaoEmpresa } from './components/SecaoEmpresa'; 
import { SecaoFiltrosAtendentes } from './components/SecaoFiltrosAtendentes';
import { SecaoAcoesAtendentes } from './components/SecaoAcoesAtendentes';
import { TabelaAtendentes } from './components/TabelaAtendentes';
import { ModalAtendente } from './components/ModalAtendente';
import { ModalSessaoCaixa } from './components/ModalSessaoCaixa';

export const CadastroAtendentes = ({ onResetEstado, onAtualizarEmpresa }) => {
  const {
    atendentes: atendentesBase,
    carregando: carregandoAtendentes,
    criarAtendente,
    atualizarAtendente,
    deletarAtendente,
    buscarAtendentes
  } = useAtendentes();

  const { sessaoAtual, abrirSessaoCaixa, fecharSessaoCaixa, buscarSessaoAtual } = useSessoesCaixa();
  const { empresa, carregandoEmpresa, cadastrarEmpresa, atualizarEmpresa, deletarEmpresa } = useEmpresa();

  const {
    filtroNome,
    setFiltroNome,
    filtroAtivo,
    setFiltroAtivo,
    atendentesFiltrados,
    handleLimparFiltros
  } = useFiltrosAtendentes(atendentesBase || []); 

  const [mostrarModalAtendente, setMostrarModalAtendente] = useState(false);
  const [mostrarModalSessao, setMostrarModalSessao] = useState(false);
  const [atendenteEditando, setAtendenteEditando] = useState(null);
  const [atendenteSelecionadoParaSessao, setAtendenteSelecionadoParaSessao] = useState(null);

  useEffect(() => {
    if (empresa) {
      buscarAtendentes();
    }
  }, [buscarAtendentes, empresa]);

  const handleSalvarAtendente = async (dadosAtendente) => {
    const idEmpresaFinal = empresa?.id_empresa || empresa?.id;
    const resultado = atendenteEditando 
      ? await atualizarAtendente(atendenteEditando.id_atendente, dadosAtendente)
      : await criarAtendente(dadosAtendente, idEmpresaFinal);

    if (resultado.sucesso) {
      setMostrarModalAtendente(false);
      setAtendenteEditando(null);
      await buscarAtendentes(); 
    } else {
      alert(resultado.erro || "Erro ao salvar atendente.");
    }
  };

  const handleDeletarAtendente = async (id) => {
    if(!window.confirm("Deseja realmente excluir este operador?")) return;
    
    const resultado = await deletarAtendente(id);
    if (resultado.sucesso) {
      if (sessaoAtual?.id_atendente === id) {
        onResetEstado('ATENDENTE');
      }
      await buscarAtendentes();
    } else {
      alert(resultado.erro || "Não foi possível excluir o atendente.");
    }
  };

  const handleAbrirSessao = async (atendenteId, valorInicial = 0) => {
    const idEmpresaFinal = empresa?.id_empresa || empresa?.id;
    const resultado = await abrirSessaoCaixa({ 
      id_atendente: atendenteId, 
      valor_inicial: valorInicial,
      id_empresa: idEmpresaFinal 
    });

    if (resultado.sucesso) {
      setMostrarModalSessao(false);
      setAtendenteSelecionadoParaSessao(null);
      if (typeof buscarSessaoAtual === 'function') await buscarSessaoAtual();
      window.location.reload(); 
    } else {
      alert(resultado.erro || "Erro ao abrir sessão.");
    }
  };

  const handleExcluirEmpresaDefinitivo = async (id) => {
    if (window.confirm("⚠️ PERIGO: Isso apagará TODOS os dados da empresa (Vendas, Produtos, Operadores). Deseja continuar?")) {
      const res = await deletarEmpresa(id);
      if (res.sucesso) {
        onResetEstado('EMPRESA');
      } else {
        alert("Erro ao remover empresa.");
      }
    }
  };

  // --- ESTADO DE CARREGAMENTO ---
  if (carregandoEmpresa) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground text-lg animate-pulse">
        Sincronizando configurações...
      </div>
    );
  }

  // --- TELA DE BLOQUEIO (SEM EMPRESA) ---
  if (!empresa) {
    return (
      <div className="flex flex-col w-[98%] h-[calc(100vh-120px)] mt-24 mb-5 mx-auto p-6 md:p-8 bg-background rounded-xl shadow-2xl border border-border overflow-y-auto box-border text-foreground [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50">
        <div className="flex flex-col gap-1.5 items-center justify-center pb-6 border-b border-border shrink-0">
          <h1 className="text-3xl font-light text-foreground m-0">Configuração Obrigatória</h1>
        </div>
        
        <div className="flex flex-1 items-center justify-center mt-8">
          <div className="p-8 bg-card border border-primary rounded-xl text-center shadow-lg w-full max-w-xl">
            <h2 className="text-primary font-light text-2xl m-0">🏢 Empresa não identificada</h2>
            <p className="mt-4 mb-6 text-muted-foreground text-sm">
              Cadastre os dados da empresa antes de gerenciar operadores.
            </p>
            <SecaoEmpresa 
                empresa={null} 
                onCadastrar={async (dados) => {
                    const res = await cadastrarEmpresa(dados);
                    if(res.sucesso) onAtualizarEmpresa();
                    return res;
                }} 
            />
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO PRINCIPAL ---
  return (
    <div className="flex flex-col w-full h-full gap-5">
      <div className="flex flex-col gap-1.5 items-center justify-center pb-6 border-b border-border shrink-0">
        <h1 className="text-3xl font-light text-foreground m-0">Gestão de Operadores e Caixa</h1>
      </div>

      <div className="w-full">
        <SecaoEmpresa 
            empresa={empresa}
            onCadastrar={cadastrarEmpresa}
            onAtualizar={atualizarEmpresa}
            onDeletar={handleExcluirEmpresaDefinitivo}
        />
      </div>

      <div className="p-5 bg-card rounded-lg border border-border">
        <h3 className="text-foreground text-sm mb-4 font-medium uppercase tracking-wider m-0">
            Filtros de Busca
        </h3>
        <SecaoFiltrosAtendentes
          filtroNome={filtroNome}
          setFiltroNome={setFiltroNome}
          filtroAtivo={filtroAtivo}
          setFiltroAtivo={setFiltroAtivo}
          onLimparFiltros={handleLimparFiltros}
        />
      </div>

      <div className="p-5 bg-card rounded-lg border border-border">
        <SecaoAcoesAtendentes
          onNovoAtendente={() => { setAtendenteEditando(null); setMostrarModalAtendente(true); }}
          onAbrirSessao={() => { setAtendenteSelecionadoParaSessao(null); setMostrarModalSessao(true); }}
          onFecharSessao={async (vFinal) => {
             const res = await fecharSessaoCaixa(sessaoAtual.id_sessao, { valor_final: vFinal });
             if (res.sucesso) {
                 onResetEstado('SESSAO');
             } else {
                 alert(res.erro);
             }
          }}
          sessaoAtual={sessaoAtual}
          totalAtendentes={atendentesBase?.length || 0}
        />
      </div>

      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center mb-5">
            <h3 className="text-primary text-lg font-normal m-0">
                📋 Operadores Cadastrados
            </h3>
            <span className="text-muted-foreground text-xs">
                Total: {atendentesFiltrados?.length || 0}
            </span>
        </div>
        
        {atendentesFiltrados?.length > 0 ? (
          <TabelaAtendentes
            atendentes={atendentesFiltrados}
            carregando={carregandoAtendentes}
            sessaoAtual={sessaoAtual}
            onEditarAtendente={(a) => { setAtendenteEditando(a); setMostrarModalAtendente(true); }}
            onDeletarAtendente={handleDeletarAtendente}
            onAbrirSessao={(id) => { setAtendenteSelecionadoParaSessao(id); setMostrarModalSessao(true); }}
          />
        ) : (
          <div className="p-14 text-center bg-card rounded-xl text-muted-foreground border border-dashed border-border">
            <p className="text-base m-0">Nenhum operador encontrado para os critérios selecionados.</p>
          </div>
        )}
      </div>

      <ModalAtendente
        mostrar={mostrarModalAtendente}
        onClose={() => setMostrarModalAtendente(false)}
        atendenteEditando={atendenteEditando}
        onSalvar={handleSalvarAtendente}
      />

      <ModalSessaoCaixa
        mostrar={mostrarModalSessao}
        onClose={() => setMostrarModalSessao(false)}
        atendentes={atendentesBase || []}
        onAbrirSessao={handleAbrirSessao}
        sessaoAtual={sessaoAtual}
        atendentePreSelecionado={atendenteSelecionadoParaSessao}
      />
    </div>
  );
};