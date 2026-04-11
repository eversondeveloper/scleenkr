import { useState, useRef, useCallback, useEffect } from "react";
import { useGerarOrcamento } from "../hooks/useGerarOrcamento";
import somCancelar from "/sounds/efeitos/desselecionar.mp3";
import { ProdutosSelecionadosStyled } from "./ProdutosSelecionadosStyled";
import { formatarParaReal } from "../hooks/useVendas";

const ProdutosSelecionados = ({
  produtosSelecionados,
  removerProduto,
  handleQuantidadeChange,
  totalGeral,
  dadosEmpresa,
  somClick,
  somClickMenos,
}) => {
  const { gerarOrcamentoPDF, gerandoOrcamento } = useGerarOrcamento();
  const [mostrarModalOrcamento, setMostrarModalOrcamento] = useState(false);
  const [dadosCliente, setDadosCliente] = useState({
    nome: "", email: "", telefone: "", observacoes: "",
  });

  const [valorTemp, setValorTemp] = useState({});
  const somCancelaRef = useRef(new Audio(somCancelar));
  const listaRef = useRef(null);

  useEffect(() => {
    if (listaRef.current) {
      listaRef.current.scrollTop = listaRef.current.scrollHeight;
    }
  }, [produtosSelecionados.length]);

  const somCancel = () => {
    somCancelaRef.current.volume = 1.0;
    somCancelaRef.current.currentTime = 0;
    somCancelaRef.current.play().catch(() => {});
  };

  const confirmarGerarOrcamento = async () => {
    try {
      await gerarOrcamentoPDF({
        produtosSelecionados,
        totalGeral,
        nomeCliente: dadosCliente.nome,
        emailCliente: dadosCliente.email,
        telefoneCliente: dadosCliente.telefone,
        observacoes: dadosCliente.observacoes,
        dadosEmpresa: dadosEmpresa,
      });
      setMostrarModalOrcamento(false);
      setDadosCliente({ nome: "", email: "", telefone: "", observacoes: "" });
    } catch (error) {
      console.error("Erro ao gerar orçamento:", error);
    }
  };

  const handleAjusteQuantidade = useCallback(
    (idUnico, delta) => {
      const produto = produtosSelecionados.find((p) => p.idUnico === idUnico);
      if (!produto) return;
      const atual = parseFloat(produto.quantidade) || 0;
      const novaQuantidade = Math.max(0, atual + delta);
      
      if (novaQuantidade > 0) {
        if (typeof handleQuantidadeChange === "function") {
          handleQuantidadeChange(idUnico, novaQuantidade);
        }
      } else {
        somCancel();
        removerProduto(idUnico);
      }
    },
    [produtosSelecionados, handleQuantidadeChange, removerProduto]
  );

  const handleAjusteInteligente = useCallback(
    (idUnico, valorBotao) => {
      const produto = produtosSelecionados.find((p) => p.idUnico === idUnico);
      if (!produto) return;
      const quantidadeAtual = parseFloat(produto.quantidade) || 0;
      
      if (typeof handleQuantidadeChange === "function") {
        if (quantidadeAtual === 1) {
          handleQuantidadeChange(idUnico, valorBotao);
        } else {
          handleQuantidadeChange(idUnico, quantidadeAtual + valorBotao);
        }
      }
    },
    [produtosSelecionados, handleQuantidadeChange]
  );

  return (
    <ProdutosSelecionadosStyled>
      <div className="cabecalho-carrinho">
        <div className="titulo-grupo">
          <h2>CARRINHO</h2>
          <button 
            className="btn-limpar-carrinho" 
            onClick={(e) => {
                e.stopPropagation();
                if(window.confirm("Esvaziar carrinho?")) produtosSelecionados.forEach(p => removerProduto(p.idUnico));
            }}
            title="Limpar tudo"
          >
            LIMPAR
          </button>
        </div>
        <span className="contador-itens">{produtosSelecionados.length} ITENS</span>
      </div>

      <div className="lista-produtos-carrinho" ref={listaRef}>
        {produtosSelecionados.length === 0 ? (
          <div className="carrinho-vazio-mensagem">
            <div className="icone-vazio">🛒</div>
            <p>Seu carrinho está vazio</p>
          </div>
        ) : (
          produtosSelecionados.map((produto) => {
            const valorItem = parseFloat(produto.preco) || 0;
            const totalDoItem = valorItem * produto.quantidade;
            const valorParaExibir = valorTemp[produto.idUnico] !== undefined 
                ? valorTemp[produto.idUnico] 
                : produto.quantidade.toString().replace(".", ",");

            return (
              <div className="card-produto-selecionado" key={produto.idUnico}>
                <div className="info-produto-topo">
                  <div className="textos-produto">
                    <span className="categoria-label">{produto.categoria}</span>
                    <h4 className="descricao-titulo">{produto.descricao.toUpperCase()}</h4>
                  </div>
                  <button 
                    type="button"
                    className="btn-remover-item" 
                    onClick={(e) => { 
                        e.stopPropagation();
                        somCancel(); 
                        removerProduto(produto.idUnico); 
                    }}
                    title="Remover item"
                  >
                    ✕
                  </button>
                </div>

                <div className="controles-produto-baixo">
                  <div className="secao-quantidade-completa">
                    <div className="pill-seletor-quantidade">
                      <button 
                        type="button" 
                        onClick={(e) => { 
                            e.stopPropagation();
                            handleAjusteQuantidade(produto.idUnico, -1); 
                            somClickMenos(); 
                        }}
                      >-</button>
                      <input
                        type="text"
                        className="input-quantidade-campo"
                        inputMode="decimal"
                        value={valorParaExibir}
                        onFocus={(e) => {
                            e.stopPropagation();
                            setValorTemp({ ...valorTemp, [produto.idUnico]: "" });
                        }}
                        onBlur={(e) => {
                            e.stopPropagation();
                            const n = { ...valorTemp };
                            delete n[produto.idUnico];
                            setValorTemp(n);
                        }}
                        onChange={(e) => {
                          e.stopPropagation();
                          const val = e.target.value;
                          setValorTemp({ ...valorTemp, [produto.idUnico]: val });
                          const processado = val.replace(",", ".");
                          if (processado !== "" && !isNaN(processado)) {
                              if (typeof handleQuantidadeChange === "function") {
                                handleQuantidadeChange(produto.idUnico, parseFloat(processado));
                              }
                          }
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      <button 
                        type="button" 
                        onClick={(e) => { 
                            e.stopPropagation();
                            handleAjusteQuantidade(produto.idUnico, 1); 
                            somClick(); 
                        }}
                      >+</button>
                    </div>
                    
                    <div className="atalhos-quantidade">
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleAjusteInteligente(produto.idUnico, 5); somClick(); }}>5</button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleAjusteInteligente(produto.idUnico, 10); somClick(); }}>10</button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleAjusteInteligente(produto.idUnico, 50); somClick(); }}>50</button>
                    </div>
                  </div>
                  
                  <div className="precos-item-container">
                    <span className="unitario-label">Un: R$ {formatarParaReal(valorItem)}</span>
                    <strong className="subtotal-item">R$ {formatarParaReal(totalDoItem)}</strong>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {produtosSelecionados.length > 0 && (
        <div className="rodape-carrinho">
          <div className="linha-total-geral">
            <span>TOTAL</span>
            <strong>R$ {formatarParaReal(totalGeral)}</strong>
          </div>
          <button
            type="button"
            className="btn-acao-orcamento"
            onClick={() => setMostrarModalOrcamento(true)}
            disabled={gerandoOrcamento}
          >
            {gerandoOrcamento ? "PROCESSANDO..." : "GERAR ORÇAMENTO [F4]"}
          </button>
        </div>
      )}

      {mostrarModalOrcamento && (
        <div className="modal-overlay-moderno" onClick={(e) => setMostrarModalOrcamento(false)}>
          <div className="modal-conteudo-moderno" onClick={(e) => e.stopPropagation()}>
            <div className="modal-cabecalho-moderno">
              <div className="titulo-modal">
                <span className="icone-modal">📄</span>
                <h3>DADOS DO ORÇAMENTO</h3>
              </div>
              <button className="btn-fechar-x" onClick={() => setMostrarModalOrcamento(false)}>✕</button>
            </div>
            <div className="modal-corpo-moderno">
              <div className="grid-campos">
                <div className="campo-entrada">
                  <label>NOME DO CLIENTE</label>
                  <input 
                    type="text" 
                    placeholder="Ex: João Silva" 
                    value={dadosCliente.nome} 
                    onChange={(e) => setDadosCliente({...dadosCliente, nome: e.target.value})} 
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if(e.key === "Enter") e.target.blur();
                    }}
                    autoFocus
                  />
                </div>
                <div className="campo-entrada">
                  <label>TELEFONE / WHATSAPP</label>
                  <input 
                    type="text" 
                    placeholder="(00) 00000-0000" 
                    value={dadosCliente.telefone} 
                    onChange={(e) => setDadosCliente({...dadosCliente, telefone: e.target.value})} 
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if(e.key === "Enter") e.target.blur();
                    }}
                  />
                </div>
              </div>
              <div className="resumo-total-modal">
                <div className="info-total">
                  <span>TOTAL ESTIMADO:</span>
                  <strong>R$ {formatarParaReal(totalGeral)}</strong>
                </div>
                <p className="dica-validade">Válido por 30 dias após a emissão</p>
              </div>
            </div>
            <div className="modal-rodape-moderno">
              <button className="btn-voltar-modal" onClick={() => setMostrarModalOrcamento(false)}>VOLTAR [ESC]</button>
              <button className="btn-confirmar-pdf" onClick={confirmarGerarOrcamento}>GERAR PDF</button>
            </div>
          </div>
        </div>
      )}
    </ProdutosSelecionadosStyled>
  );
};

export default ProdutosSelecionados;