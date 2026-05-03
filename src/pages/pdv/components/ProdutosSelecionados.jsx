import { useState, useRef, useCallback, useEffect } from "react";
import { useGerarOrcamento } from "../hooks/useGerarOrcamento";
import somCancelar from "/sounds/efeitos/desselecionar.mp3";
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
    <div className="w-full h-full flex flex-col bg-background border border-border rounded-2xl overflow-hidden">
      
      {/* CABEÇALHO */}
      <div className="p-4 bg-card border-b border-border flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm text-muted-foreground tracking-wide m-0 font-bold">CARRINHO</h2>
          <button 
            className="bg-destructive/10 border border-destructive/30 text-destructive text-[9px] font-extrabold px-2.5 py-1 rounded-md cursor-pointer transition-all hover:bg-destructive hover:text-destructive-foreground" 
            onClick={(e) => {
                e.stopPropagation();
                if(window.confirm("Esvaziar carrinho?")) produtosSelecionados.forEach(p => removerProduto(p.idUnico));
            }}
            title="Limpar tudo"
          >
            LIMPAR
          </button>
        </div>
        <span className="bg-primary text-primary-foreground text-[10px] font-extrabold px-2 py-0.5 rounded-full">
          {produtosSelecionados.length} ITENS
        </span>
      </div>

      {/* LISTA DE PRODUTOS */}
      <div 
        className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2.5 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50" 
        ref={listaRef}
      >
        {produtosSelecionados.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-10">
            <div className="text-4xl mb-2.5 opacity-20">🛒</div>
            <p className="italic m-0">Seu carrinho está vazio</p>
          </div>
        ) : (
          produtosSelecionados.map((produto) => {
            const valorItem = parseFloat(produto.preco) || 0;
            const totalDoItem = valorItem * produto.quantidade;
            const valorParaExibir = valorTemp[produto.idUnico] !== undefined 
                ? valorTemp[produto.idUnico] 
                : produto.quantidade.toString().replace(".", ",");

            return (
              <div className="bg-card border border-border rounded-xl p-3 transition-colors hover:border-muted-foreground/50" key={produto.idUnico}>
                
                {/* Info Topo */}
                <div className="flex justify-between mb-3">
                  <div>
                    <span className="text-[9px] text-primary font-bold uppercase">{produto.categoria}</span>
                    <h4 className="text-[13px] text-foreground m-0 mt-0.5 font-medium">{produto.descricao.toUpperCase()}</h4>
                  </div>
                  <button 
                    type="button"
                    className="bg-transparent border-none text-muted-foreground cursor-pointer text-base hover:text-destructive transition-colors ml-2" 
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

                {/* Controles Baixo */}
                <div className="flex justify-between items-center bg-background p-2.5 rounded-lg gap-2.5">
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    
                    {/* Seletor Quantidade Pill */}
                    <div className="flex items-center bg-secondary/30 rounded-full border border-border p-0.5 max-w-[100px]">
                      <button 
                        type="button" 
                        className="bg-transparent border-none text-primary font-bold cursor-pointer w-7 h-7 text-base flex items-center justify-center transition-colors hover:text-primary/80"
                        onClick={(e) => { 
                            e.stopPropagation();
                            handleAjusteQuantidade(produto.idUnico, -1); 
                            somClickMenos(); 
                        }}
                      >-</button>
                      <input
                        type="text"
                        className="w-full flex-1 min-w-0 bg-transparent border-none text-foreground text-center text-xs font-bold outline-none"
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
                        className="bg-transparent border-none text-primary font-bold cursor-pointer w-7 h-7 text-base flex items-center justify-center transition-colors hover:text-primary/80"
                        onClick={(e) => { 
                            e.stopPropagation();
                            handleAjusteQuantidade(produto.idUnico, 1); 
                            somClick(); 
                        }}
                      >+</button>
                    </div>
                    
                    {/* Atalhos Rápidos */}
                    <div className="grid grid-cols-4 gap-1">
                      {[5, 10, 50].map((val) => (
                        <button 
                          key={val}
                          type="button" 
                          className="bg-card border border-border text-muted-foreground text-[9px] font-extrabold py-1 px-0.5 rounded cursor-pointer transition-all hover:bg-accent hover:text-primary hover:border-primary active:scale-95 active:bg-primary active:text-primary-foreground"
                          onClick={(e) => { e.stopPropagation(); handleAjusteInteligente(produto.idUnico, val); somClick(); }}
                        >
                          {val}
                        </button>
                      ))}
                    </div>

                  </div>
                  
                  <div className="text-right min-w-fit pl-2">
                    <span className="text-[10px] text-muted-foreground block">Un: R$ {formatarParaReal(valorItem)}</span>
                    <strong className="text-sm text-success font-bold">R$ {formatarParaReal(totalDoItem)}</strong>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* RODAPÉ E BOTÃO DE ORÇAMENTO */}
      {produtosSelecionados.length > 0 && (
        <div className="p-4 bg-card border-t border-border shrink-0">
          <div className="flex justify-between items-center mb-3">
            <span className="text-muted-foreground text-xs font-bold">TOTAL</span>
            <strong className="text-foreground text-xl font-extrabold">R$ {formatarParaReal(totalGeral)}</strong>
          </div>
          <button
            type="button"
            className="w-full p-3.5 rounded-xl border-none bg-primary text-primary-foreground font-extrabold cursor-pointer transition-all hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setMostrarModalOrcamento(true)}
            disabled={gerandoOrcamento}
          >
            {gerandoOrcamento ? "PROCESSANDO..." : "GERAR ORÇAMENTO [F4]"}
          </button>
        </div>
      )}

      {/* MODAL DE ORÇAMENTO */}
      {mostrarModalOrcamento && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-3000" onClick={() => setMostrarModalOrcamento(false)}>
          <div className="bg-background border border-border rounded-3xl w-[90%] max-w-[450px] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            
            <div className="p-5 bg-card flex justify-between items-center border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📄</span>
                <h3 className="m-0 text-base text-foreground tracking-wide font-bold">DADOS DO ORÇAMENTO</h3>
              </div>
              <button className="bg-transparent border-none text-muted-foreground cursor-pointer text-xl hover:text-destructive transition-colors" onClick={() => setMostrarModalOrcamento(false)}>✕</button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-primary font-extrabold uppercase tracking-wide">NOME DO CLIENTE</label>
                  <input 
                    type="text" 
                    placeholder="Ex: João Silva" 
                    className="p-3.5 bg-card border border-border rounded-xl text-foreground text-sm outline-none transition-colors focus:border-primary focus:bg-background"
                    value={dadosCliente.nome} 
                    onChange={(e) => setDadosCliente({...dadosCliente, nome: e.target.value})} 
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if(e.key === "Enter") e.target.blur();
                    }}
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-primary font-extrabold uppercase tracking-wide">TELEFONE / WHATSAPP</label>
                  <input 
                    type="text" 
                    placeholder="(00) 00000-0000" 
                    className="p-3.5 bg-card border border-border rounded-xl text-foreground text-sm outline-none transition-colors focus:border-primary focus:bg-background"
                    value={dadosCliente.telefone} 
                    onChange={(e) => setDadosCliente({...dadosCliente, telefone: e.target.value})} 
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if(e.key === "Enter") e.target.blur();
                    }}
                  />
                </div>
              </div>
              
              <div className="p-5 bg-card rounded-2xl border border-border text-center">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-muted-foreground text-xs font-semibold">TOTAL ESTIMADO:</span>
                  <strong className="text-success text-2xl font-extrabold">R$ {formatarParaReal(totalGeral)}</strong>
                </div>
                <p className="text-[10px] text-muted-foreground m-0">Válido por 30 dias após a emissão</p>
              </div>
            </div>

            <div className="p-5 bg-card flex gap-3 border-t border-border">
              <button className="flex-1 p-3.5 rounded-xl border-none font-extrabold text-sm cursor-pointer transition-colors bg-secondary text-foreground hover:bg-muted-foreground/20" onClick={() => setMostrarModalOrcamento(false)}>VOLTAR [ESC]</button>
              <button className="flex-1 p-3.5 rounded-xl border-none font-extrabold text-sm cursor-pointer transition-colors bg-primary text-primary-foreground hover:brightness-110" onClick={confirmarGerarOrcamento}>GERAR PDF</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProdutosSelecionados;