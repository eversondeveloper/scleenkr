/* eslint-disable no-unused-vars */
import { useRef, useEffect, useMemo, useState } from "react";
import IconeDinheiroSrc from "/dinheiro.svg";
import IconeCreditoSrc from "/card.svg";
import IconePixSrc from "/pix.svg";
import IconeMistoSrc from "/misto.svg";
import somMetodosPagamento from "/sounds/efeitos/metodos_pagamento.mp3";
import { MetodosPagamentoStyled } from "./MetodosPagamentoStyled";
import { formatarParaReal, limparFormatacao } from "../hooks/useVendas";

const MetodosPagamento = ({
  metodoPagamento,
  setMetodoPagamento,
  valorDinheiroRecebido,
  setValorDinheiroRecebido,
  inputValorRecebidoRef,
  pagamentosMistos,
  adicionarPagamentoMisto,
  removerPagamentoMisto,
  atualizarPagamentoMisto,
  totalGeral,
  somClick,
  somClickMenos
}) => {
  const [valorTempDinheiro, setValorTempDinheiro] = useState(null);
  const [valoresTempMistos, setValoresTempMistos] = useState({});

  const valoresBrasileiros = [0.05, 0.10, 0.50, 1, 2, 5, 10, 20, 50, 100];

  const metodosConfig = [
    { nome: "Dinheiro", atalho: "F1", icone: IconeDinheiroSrc },
    { nome: "Crédito", atalho: "F2", icone: IconeCreditoSrc },
    { nome: "Débito", atalho: "F3", icone: IconeCreditoSrc },
    { nome: "Pix", atalho: "F4", icone: IconePixSrc },
    { nome: "Misto", atalho: "F8", icone: IconeMistoSrc },
  ];

  const opcoesMetodos = ["Dinheiro", "Crédito", "Débito", "Pix"];
  const totalPagoMisto = pagamentosMistos.reduce((acc, p) => acc + p.valor, 0);
  
  const isPagoIntegralmente = useMemo(() => {
    if (totalGeral <= 0) return false;
    if (["Crédito", "Débito", "Pix"].includes(metodoPagamento)) return true;
    return (metodoPagamento === "Dinheiro" ? valorDinheiroRecebido : totalPagoMisto) >= (totalGeral - 0.01);
  }, [metodoPagamento, totalGeral, valorDinheiroRecebido, totalPagoMisto]);

  const faltaPagarMisto = Math.max(0, totalGeral - totalPagoMisto);
  const somMetodos = useRef(new Audio(somMetodosPagamento)).current;

  useEffect(() => {
    const delay = 50;
    if (metodoPagamento === "Dinheiro") {
      setTimeout(() => inputValorRecebidoRef.current?.focus(), delay);
    } else if (metodoPagamento === "Misto") {
      setTimeout(() => document.querySelector(".input-misto-valor")?.focus(), delay);
    }
  }, [metodoPagamento]);

  const handleInputChangeMascara = (valRaw, callback) => {
    const valorLimpo = limparFormatacao(valRaw);
    callback(valorLimpo);
  };

  return (
    <MetodosPagamentoStyled>
      <div className="grade-metodos-pagamento-topo">
        {metodosConfig.map((m) => (
          <button
            type="button"
            key={m.nome}
            className={`botao-metodo-moderno ${metodoPagamento === m.nome ? "ativo" : ""}`}
            onClick={() => { setMetodoPagamento(m.nome); somMetodos.play().catch(() => {}); }}
          >
            <span className="atalho-teclado-label" style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '8px', opacity: 0.5, fontWeight: '800' }}>{m.atalho}</span>
            <img src={m.icone} alt={m.nome} className="icone-metodo-img" />
            <strong>{m.nome.toUpperCase()}</strong>
          </button>
        ))}
      </div>

      <div className="painel-configuracao-pagamento">
        {metodoPagamento === "Dinheiro" && (
          <div className="card-config-dinheiro">
            <div className="layout-dinheiro-horizontal">
              <div className="coluna-input-principal">
                <label className="label-moderna">VALOR RECEBIDO</label>
                <div className="seletor-valor-pill">
                  <button type="button" onClick={() => { setValorDinheiroRecebido(Math.max(0, valorDinheiroRecebido - 1)); somClickMenos(); }}>-</button>
                  <input
                    ref={inputValorRecebidoRef}
                    type="text"
                    inputMode="numeric"
                    value={valorTempDinheiro !== null ? valorTempDinheiro : formatarParaReal(valorDinheiroRecebido)}
                    onFocus={() => setValorTempDinheiro("")}
                    onBlur={() => setValorTempDinheiro(null)}
                    onChange={(e) => {
                      setValorTempDinheiro(e.target.value);
                      handleInputChangeMascara(e.target.value, setValorDinheiroRecebido);
                    }}
                  />
                  <button type="button" onClick={() => { setValorDinheiroRecebido(valorDinheiroRecebido + 1); somClick(); }}>+</button>
                </div>
                <div className="acoes-sugestao-container">
                  {/* ADICIONADO somClick() ABAIXO NO VALOR EXATO */}
                  <button type="button" className="btn-sugestao exato" onClick={() => { setValorDinheiroRecebido(totalGeral); somClick(); }}>VALOR EXATO</button>
                  <button type="button" className="btn-sugestao arredondar" onClick={() => {
                    const prox = [1, 2, 5, 10, 20, 50, 100].find(s => s > totalGeral) || Math.ceil(totalGeral/50)*50;
                    setValorDinheiroRecebido(prox);
                    somClick();
                  }}>ARREDONDAR</button>
                </div>
              </div>

              <div className="coluna-cedulas-rapidas">
                <label className="label-moderna">ADICIONAR VALORES</label>
                <div className="grade-cedulas">
                  {valoresBrasileiros.map(v => (
                    <button key={v} type="button" className="btn-cedula-rapida" onClick={() => { setValorDinheiroRecebido(valorDinheiroRecebido + v); somClick(); }}>
                      +{v < 1 ? v.toFixed(2).replace('.', ',') : v}
                    </button>
                  ))}
                  {/* ADICIONADO somClickMenos() NO LIMPAR PARA FEEDBACK DE LIMPEZA */}
                  <button type="button" className="btn-cedula-rapida limpar" onClick={() => { setValorDinheiroRecebido(0); somClickMenos(); }}>LIMPAR</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {metodoPagamento === "Misto" && (
          <div className="card-pagamento-misto">
            <div className="layout-misto-horizontal">
              <div className="coluna-lista-mista">
                <div className="cabecalho-misto-moderno">
                  <h4>PAGAMENTOS MÚLTIPLOS</h4>
                  <button type="button" className="btn-adicionar-metodo-misto" onClick={() => { adicionarPagamentoMisto("Crédito"); somClick(); }}>+ ADICIONAR</button>
                </div>
                <div className="lista-itens-mistos">
                  {pagamentosMistos.map((p) => (
                    <div key={p.id} className="item-misto-card">
                      <select className="select-moderno" value={p.metodo} onChange={(e) => atualizarPagamentoMisto(p.id, { metodo: e.target.value })}>
                        {opcoesMetodos.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <div className="seletor-valor-pill pequeno">
                        <button type="button" onClick={() => { atualizarPagamentoMisto(p.id, { valor: Math.max(0, p.valor - 1)}); somClickMenos(); }}>-</button>
                        <input 
                          type="text" 
                          inputMode="numeric"
                          className="input-misto-valor" 
                          value={valoresTempMistos[p.id] !== undefined ? valoresTempMistos[p.id] : formatarParaReal(p.valor)}
                          onFocus={() => setValoresTempMistos({...valoresTempMistos, [p.id]: ""})}
                          onBlur={() => {
                            const newTemps = {...valoresTempMistos};
                            delete newTemps[p.id];
                            setValoresTempMistos(newTemps);
                          }}
                          onChange={(e) => {
                            setValoresTempMistos({...valoresTempMistos, [p.id]: e.target.value});
                            handleInputChangeMascara(e.target.value, (v) => atualizarPagamentoMisto(p.id, { valor: v }));
                          }} 
                        />
                        <button type="button" onClick={() => { atualizarPagamentoMisto(p.id, { valor: p.valor + 1}); somClick(); }}>+</button>
                      </div>
                      <button type="button" className="btn-remover-misto" onClick={() => { removerPagamentoMisto(p.id); somClickMenos(); }}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="resumo-misto-moderno">
                  <div className="linha-resumo-mista"><span>TOTAL PAGO:</span><strong>R$ {formatarParaReal(totalPagoMisto)}</strong></div>
                  {!isPagoIntegralmente && <div className="linha-resumo-mista"><span>FALTANDO:</span><strong style={{color: '#ff4b4b'}}>R$ {formatarParaReal(faltaPagarMisto)}</strong></div>}
                </div>
              </div>
              <div className="coluna-cedulas-rapidas">
                <label className="label-moderna">VALORES RÁPIDOS</label>
                <div className="grade-cedulas">
                    {[2, 5, 10, 20, 50, 100].map(v => (
                        <button key={v} type="button" className="btn-cedula-rapida" onClick={() => {
                            const primeiro = pagamentosMistos[0];
                            atualizarPagamentoMisto(primeiro.id, { valor: primeiro.valor + v });
                            somClick();
                        }}>+{v}</button>
                    ))}
                    <button type="button" className="btn-cedula-rapida limpar" onClick={() => {
                        const primeiro = pagamentosMistos[0];
                        atualizarPagamentoMisto(primeiro.id, { valor: 0 });
                        somClickMenos();
                    }}>LIMPAR</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {["Crédito", "Débito", "Pix"].includes(metodoPagamento) && (
          <div className="status-metodo-simples" style={{textAlign: 'center', padding: '40px'}}>
             <p>Aguardando terminal de {metodoPagamento}...</p>
             <h2 style={{color: '#64ff8a', fontSize: '2.5rem'}}>R$ {formatarParaReal(totalGeral)}</h2>
             <div className="pago-integral-badge" style={{background: '#1b5e20', color: '#64ff8a', padding: '10px', borderRadius: '8px', display: 'inline-block', marginTop: '20px'}}>✅ PAGO INTEGRALMENTE</div>
          </div>
        )}
      </div>
    </MetodosPagamentoStyled>
  );
};

export default MetodosPagamento;