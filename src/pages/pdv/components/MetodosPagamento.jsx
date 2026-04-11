import { useRef, useEffect, useMemo, useState } from "react";
import IconeDinheiroSrc from "/dinheiro.svg";
import IconeCreditoSrc from "/card.svg";
import IconePixSrc from "/pix.svg";
import IconeMistoSrc from "/misto.svg";
import somMetodosPagamento from "/sounds/efeitos/metodos_pagamento.mp3";
import { MetodosPagamentoStyled } from "./MetodosPagamentoStyled";
import { formatarParaReal } from "../hooks/useVendas";

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
  somClickMenos,
  onFinalizarVenda
}) => {
  const [editandoDinheiro, setEditandoDinheiro] = useState(false);
  const [editandoMistoId, setEditandoMistoId] = useState(null);

  const valoresBrasileiros = [0.05, 0.10, 0.50, 1, 2, 5, 10, 20, 50, 100];
  const metodosConfig = [
    { nome: "Dinheiro", atalho: "F1", icone: IconeDinheiroSrc },
    { nome: "Crédito", atalho: "F2", icone: IconeCreditoSrc },
    { nome: "Débito", atalho: "F3", icone: IconeCreditoSrc },
    { nome: "Pix", atalho: "F4", icone: IconePixSrc },
    { nome: "Misto", atalho: "F8", icone: IconeMistoSrc },
  ];

  const opcoesMetodos = ["Dinheiro", "Crédito", "Débito", "Pix"];
  const totalPagoMisto = pagamentosMistos.reduce((acc, p) => acc + (p.valor || 0), 0);
  
  const isPagoIntegralmente = useMemo(() => {
    if (totalGeral <= 0) return false;
    if (metodoPagamento === "Dinheiro") {
      return valorDinheiroRecebido >= (totalGeral - 0.009) && valorDinheiroRecebido > 0;
    }
    if (metodoPagamento === "Misto") {
      return totalPagoMisto >= (totalGeral - 0.009) && totalPagoMisto > 0;
    }
    return true;
  }, [metodoPagamento, totalGeral, valorDinheiroRecebido, totalPagoMisto]);

  const faltaPagarMisto = Math.max(0, totalGeral - totalPagoMisto);
  const somMetodos = useRef(new Audio(somMetodosPagamento)).current;

  useEffect(() => {
    if (metodoPagamento === "Dinheiro") {
      inputValorRecebidoRef.current?.focus();
    } else if (metodoPagamento === "Misto") {
      const inputs = document.querySelectorAll(".input-misto-valor");
      inputs[inputs.length - 1]?.focus();
    }
  }, [metodoPagamento, pagamentosMistos.length]);

  const handleMascaraPDV = (e, callback) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
        callback(0);
        return;
    }
    const valorFinal = parseFloat(raw) / 100;
    callback(valorFinal);
  };

  const handleKeyDown = (e, index, isMisto = false) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isPagoIntegralmente) {
        onFinalizarVenda();
      } else if (isMisto) {
        const inputs = document.querySelectorAll(".input-misto-valor");
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        } else {
          adicionarPagamentoMisto("Pix", faltaPagarMisto);
        }
      }
    }
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
            <span className="atalho-teclado-label">{m.atalho}</span>
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
                    value={editandoDinheiro && valorDinheiroRecebido === 0 ? "" : formatarParaReal(valorDinheiroRecebido)}
                    onFocus={() => {
                        setEditandoDinheiro(true);
                        setValorDinheiroRecebido(0);
                    }}
                    onBlur={() => setEditandoDinheiro(false)}
                    onChange={(e) => handleMascaraPDV(e, setValorDinheiroRecebido)}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                  <button type="button" onClick={() => { setValorDinheiroRecebido(valorDinheiroRecebido + 1); somClick(); }}>+</button>
                </div>

                <div className="acoes-sugestao-container">
                    <button type="button" className="btn-sugestao exato" onClick={() => { setValorDinheiroRecebido(totalGeral); somClick(); }}>VALOR EXATO</button>
                    <button type="button" className="btn-sugestao arredondar" onClick={() => { setValorDinheiroRecebido(Math.ceil(totalGeral)); somClick(); }}>ARREDONDAR</button>
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
                  <button type="button" className="btn-cedula-rapida limpar" onClick={() => { setValorDinheiroRecebido(0); somClickMenos(); }}>LIMPAR</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {metodoPagamento === "Misto" && (
          <div className="card-pagamento-misto">
            <div className="coluna-lista-mista">
              <div className="cabecalho-misto-moderno">
                <h4>PAGAMENTOS MÚLTIPLOS</h4>
                <button type="button" className="btn-adicionar-metodo-misto" onClick={() => { adicionarPagamentoMisto("Pix", faltaPagarMisto); somClick(); }}>+ ADICIONAR</button>
              </div>
              <div className="lista-itens-mistos">
                {pagamentosMistos.map((p, index) => (
                  <div key={p.id} className="item-misto-card">
                    <select className="select-moderno" value={p.metodo} onChange={(e) => atualizarPagamentoMisto(p.id, { metodo: e.target.value })}>
                      {opcoesMetodos.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div className="seletor-valor-pill pequeno">
                      <input 
                        type="text" 
                        inputMode="numeric"
                        className="input-misto-valor" 
                        value={editandoMistoId === p.id && p.valor === 0 ? "" : formatarParaReal(p.valor)}
                        onFocus={() => {
                            setEditandoMistoId(p.id);
                            atualizarPagamentoMisto(p.id, { valor: 0 });
                        }}
                        onBlur={() => setEditandoMistoId(null)}
                        onChange={(e) => handleMascaraPDV(e, (v) => atualizarPagamentoMisto(p.id, { valor: v }))}
                        onKeyDown={(e) => handleKeyDown(e, index, true)}
                      />
                    </div>
                    <button type="button" className="btn-remover-misto" onClick={() => { removerPagamentoMisto(p.id); somClickMenos(); }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {["Crédito", "Débito", "Pix"].includes(metodoPagamento) && (
          <div className="status-metodo-simples" style={{textAlign: 'center', margin: 'auto'}}>
             <p>Aguardando terminal de {metodoPagamento}...</p>
             <h2 style={{fontSize: '32px', fontWeight: '800', color: '#fff'}}>R$ {formatarParaReal(totalGeral)}</h2>
             <div className="pago-integral-badge" style={{background: '#1b5e20', color: '#64ff8a', padding: '10px', borderRadius: '8px', display: 'inline-block', marginTop: '20px'}}>✅ PAGO INTEGRALMENTE</div>
          </div>
        )}
      </div>
    </MetodosPagamentoStyled>
  );
};

export default MetodosPagamento;