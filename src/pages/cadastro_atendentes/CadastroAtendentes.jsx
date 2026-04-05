import React, { useState, useEffect } from 'react';
import { CadastroAtendentesStyled } from './CadastroAtendentesStyled';
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

  if (carregandoEmpresa) return <div style={{ color: '#E0E0E0', padding: '40px', textAlign: 'center', background: '#1e1e1e', height: '100vh' }}>Sincronizando configurações...</div>;

  if (!empresa) {
    return (
      <CadastroAtendentesStyled>
        <div className="cabecalho"><h1>Configuração Obrigatória</h1></div>
        <div className="container-bloqueio-caixa">
          <div className="card-bloqueio" style={{ border: '1px solid #FF9800', padding: '30px', background: '#2d2d2d', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ color: '#FF9800', fontWeight: '300' }}>🏢 Empresa não identificada</h2>
            <p style={{ margin: '15px 0', color: '#A0A0A0' }}>Cadastre os dados da empresa antes de gerenciar operadores.</p>
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
      </CadastroAtendentesStyled>
    );
  }

  return (
    <CadastroAtendentesStyled>
      <div className="cabecalho">
        <h1>Gestão de Operadores e Caixa</h1>
      </div>

      <div className="secao-empresa-container">
        <SecaoEmpresa 
            empresa={empresa}
            onCadastrar={cadastrarEmpresa}
            onAtualizar={atualizarEmpresa}
            onDeletar={handleExcluirEmpresaDefinitivo}
        />
      </div>

      <div className="secao-filtros">
        <h3 className="titulo-secao-filtros" style={{ color: '#E0E0E0', fontSize: '14px', marginBottom: '15px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>
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

      <div className="secao-resumo secao-acoes">
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

      {/* Nome alterado para evitar conflitos de estilo que escondiam a tabela */}
      <div className="area-tabela-operadores">
        <div className="tabela-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#FF9800', fontSize: '18px', fontWeight: '400', margin: 0 }}>
                📋 Operadores Cadastrados
            </h3>
            <span style={{ color: '#A0A0A0', fontSize: '12px' }}>
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
          <div className="vazio-container" style={{ padding: '60px', textAlign: 'center', background: '#2d2d2d', borderRadius: '12px', color: '#666', border: '1px dashed #444' }}>
            <p style={{ fontSize: '16px' }}>Nenhum operador encontrado para os critérios selecionados.</p>
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
    </CadastroAtendentesStyled>
  );
};