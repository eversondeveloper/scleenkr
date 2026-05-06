// src/pages/pdv/components/MetodosPagamento.tsx
import { useRef, useEffect, useMemo, useState } from 'react';
import IconeDinheiroSrc from '/dinheiro.svg';
import IconeCreditoSrc from '/card.svg';
import IconePixSrc from '/pix.svg';
import IconeMistoSrc from '/misto.svg';
import somMetodosPagamento from '/sounds/efeitos/metodos_pagamento.mp3';
import { formatarParaReal } from '../hooks/useVendas';

// ---------------------------------------------------------
// Tipos
// ---------------------------------------------------------
interface PagamentoMisto {
  id: string | number;
  metodo: string;
  valor: number;
}

interface MetodosPagamentoProps {
  metodoPagamento: string;
  setMetodoPagamento: (metodo: string) => void;
  valorDinheiroRecebido: number;
  setValorDinheiroRecebido: (valor: number) => void;
  inputValorRecebidoRef: React.RefObject<HTMLInputElement>;
  pagamentosMistos: PagamentoMisto[];
  adicionarPagamentoMisto: (metodo: string, valor: number) => void;
  removerPagamentoMisto: (id: string | number) => void;
  atualizarPagamentoMisto: (id: string | number, dados: { metodo?: string; valor?: number }) => void;
  totalGeral: number;
  somClick: () => void;
  somClickMenos: () => void;
  onFinalizarVenda: () => void;
}

interface MetodoConfig {
  nome: string;
  atalho: string;
  icone: string;
}

// ---------------------------------------------------------
// Componente
// ---------------------------------------------------------
const MetodosPagamento: React.FC<MetodosPagamentoProps> = ({
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
  onFinalizarVenda,
}) => {
  const [editandoDinheiro, setEditandoDinheiro] = useState<boolean>(false);
  const [editandoMistoId, setEditandoMistoId] = useState<string | number | null>(null);

  const valoresBrasileiros = [0.05, 0.1, 0.5, 1, 2, 5, 10, 20, 50, 100];

  const metodosConfig: MetodoConfig[] = [
    { nome: 'Dinheiro', atalho: 'F1', icone: IconeDinheiroSrc },
    { nome: 'Crédito', atalho: 'F2', icone: IconeCreditoSrc },
    { nome: 'Débito', atalho: 'F3', icone: IconeCreditoSrc },
    { nome: 'Pix', atalho: 'F4', icone: IconePixSrc },
    { nome: 'Misto', atalho: 'F8', icone: IconeMistoSrc },
  ];

  const opcoesMetodos = ['Dinheiro', 'Crédito', 'Débito', 'Pix'];
  const totalPagoMisto = pagamentosMistos.reduce((acc, p) => acc + (p.valor || 0), 0);

  const isPagoIntegralmente = useMemo(() => {
    if (totalGeral <= 0) return false;
    if (metodoPagamento === 'Dinheiro') {
      return valorDinheiroRecebido >= totalGeral - 0.009 && valorDinheiroRecebido > 0;
    }
    if (metodoPagamento === 'Misto') {
      return totalPagoMisto >= totalGeral - 0.009 && totalPagoMisto > 0;
    }
    return true; // Crédito, Débito, Pix são considerados pagos integralmente
  }, [metodoPagamento, totalGeral, valorDinheiroRecebido, totalPagoMisto]);

  const faltaPagarMisto = Math.max(0, totalGeral - totalPagoMisto);
  const somMetodos = useRef(new Audio(somMetodosPagamento)).current;

  useEffect(() => {
    if (metodoPagamento === 'Dinheiro') {
      inputValorRecebidoRef.current?.focus();
    } else if (metodoPagamento === 'Misto') {
      const inputs = document.querySelectorAll<HTMLInputElement>('.input-misto-valor');
      inputs[inputs.length - 1]?.focus();
    }
  }, [metodoPagamento, pagamentosMistos.length, inputValorRecebidoRef]);

  const handleMascaraPDV = (e: React.ChangeEvent<HTMLInputElement>, callback: (valor: number) => void) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw === '') {
      callback(0);
      return;
    }
    const valorFinal = parseFloat(raw) / 100;
    callback(valorFinal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index?: number, isMisto = false) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isPagoIntegralmente) {
        onFinalizarVenda();
      } else if (isMisto && index !== undefined) {
        const inputs = document.querySelectorAll<HTMLInputElement>('.input-misto-valor');
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        } else {
          adicionarPagamentoMisto('Pix', faltaPagarMisto);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full w-full overflow-hidden box-border">
      {/* GRADE DE BOTÕES (TOPO) */}
      <div className="grid grid-cols-5 gap-1.5 w-full shrink-0">
        {metodosConfig.map((m) => (
          <button
            type="button"
            key={m.nome}
            className={`
              h-13.75 bg-[#1a1a1a] border border-[#282828] rounded-[10px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 text-[#666]
              hover:bg-[#222] hover:border-[#444]
              ${metodoPagamento === m.nome ? 'bg-[#646cff]! border-[#646cff]! text-white shadow-[0_4px_12px_rgba(100,108,255,0.2)]' : ''}
            `}
            onClick={() => { setMetodoPagamento(m.nome); somMetodos.play().catch(() => {}); }}
          >
            <span className="text-[8px] tracking-[0.5px]">{m.atalho}</span>
            <img
              src={m.icone}
              alt={m.nome}
              className={`w-4.5 h-4.5 transition-all duration-200 ${metodoPagamento === m.nome ? 'opacity-100 grayscale-0 brightness-200' : 'opacity-40 grayscale'}`}
            />
            <strong className="text-[8px] tracking-[0.5px]">{m.nome.toUpperCase()}</strong>
          </button>
        ))}
      </div>

      {/* PAINEL DE CONFIGURAÇÃO */}
      <div className="flex-1 bg-[#121212] border border-[#222] rounded-2xl p-3.75 flex flex-col overflow-y-auto overflow-x-hidden">
        {metodoPagamento === 'Dinheiro' && (
          <div className="flex flex-col gap-5 justify-start items-center w-full h-full p-4">
            <div className="w-full flex flex-col gap-3">
              <label className="text-[10px] text-[#4caf50] font-extrabold uppercase mb-1 tracking-wider">
                VALOR RECEBIDO
              </label>

              <div className="flex items-center bg-[#0a0a0a] rounded-[20px] border border-[#222] p-0.5 h-12.5">
                <button
                  type="button"
                  className="bg-transparent border-none text-[#4caf50] font-bold cursor-pointer w-11.25 h-full text-xl flex items-center justify-center transition-colors hover:text-[#64ff8a] active:scale-90"
                  onClick={() => { setValorDinheiroRecebido(Math.max(0, valorDinheiroRecebido - 1)); somClickMenos(); }}
                >
                  -
                </button>
                <input
                  ref={inputValorRecebidoRef}
                  type="text"
                  inputMode="numeric"
                  className="flex-1 w-full bg-transparent border-none text-white text-center text-lg font-bold outline-none"
                  value={editandoDinheiro && valorDinheiroRecebido === 0 ? '' : formatarParaReal(valorDinheiroRecebido)}
                  onFocus={() => {
                    setEditandoDinheiro(true);
                    setValorDinheiroRecebido(0);
                  }}
                  onBlur={() => setEditandoDinheiro(false)}
                  onChange={(e) => handleMascaraPDV(e, setValorDinheiroRecebido)}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
                <button
                  type="button"
                  className="bg-transparent border-none text-[#4caf50] font-bold cursor-pointer w-11.25 h-full text-xl flex items-center justify-center transition-colors hover:text-[#64ff8a] active:scale-90"
                  onClick={() => { setValorDinheiroRecebido(valorDinheiroRecebido + 1); somClick(); }}
                >
                  +
                </button>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  className="flex-1 h-10 rounded-[10px] border-none font-extrabold text-[10px] cursor-pointer bg-[#1b5e20] text-[#64ff8a] hover:brightness-110 active:scale-95 transition-all"
                  onClick={() => { setValorDinheiroRecebido(totalGeral); somClick(); }}
                >
                  VALOR EXATO
                </button>
                <button
                  type="button"
                  className="flex-1 h-10 rounded-[10px] border-none font-extrabold text-[10px] cursor-pointer bg-[#0d47a1] text-[#64b5f6] hover:brightness-110 active:scale-95 transition-all"
                  onClick={() => { setValorDinheiroRecebido(Math.ceil(totalGeral)); somClick(); }}
                >
                  ARREDONDAR
                </button>
              </div>
            </div>

            <div className="w-full bg-[#181818] p-3 rounded-[14px] border border-[#282828] flex flex-col gap-2.5">
              <label className="text-[10px] text-[#4caf50] font-extrabold uppercase mb-1 tracking-wider">
                ADICIONAR VALORES
              </label>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(65px,1fr))] gap-1.5">
                {valoresBrasileiros.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className="h-9.5 bg-[#1a1a1a] border border-[#252525] rounded-lg text-[#888] font-extrabold text-sm cursor-pointer transition-all hover:bg-[#333] hover:border-[#4caf50] hover:text-[#64ff8a]"
                    onClick={() => { setValorDinheiroRecebido(valorDinheiroRecebido + v); somClick(); }}
                  >
                    +{v < 1 ? v.toFixed(2).replace('.', ',') : v}
                  </button>
                ))}
                <button
                  type="button"
                  className="col-span-full h-9.5 rounded-lg font-extrabold text-[10px] cursor-pointer transition-all bg-[#2a1a1a] text-[#ff5252] border border-[#4a2121] hover:bg-[#ff5252] hover:text-white"
                  onClick={() => { setValorDinheiroRecebido(0); somClickMenos(); }}
                >
                  LIMPAR
                </button>
              </div>
            </div>
          </div>
        )}

        {metodoPagamento === 'Misto' && (
          <div className="flex flex-col gap-5 justify-start items-center w-full h-full">
            <div className="w-full flex flex-col gap-3">
              <div className="flex justify-between items-center mb-2.5">
                <h4 className="text-[#888] text-[11px] m-0 font-extrabold tracking-widest">
                  PAGAMENTOS MÚLTIPLOS
                </h4>
                <button
                  type="button"
                  className="bg-[#4caf50] text-black border-none py-1.5 px-3 rounded-lg text-[10px] font-black uppercase cursor-pointer transition-all hover:bg-[#64ff8a] active:scale-95"
                  onClick={() => { adicionarPagamentoMisto('Pix', faltaPagarMisto); somClick(); }}
                >
                  + ADICIONAR
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {pagamentosMistos.map((p, index) => (
                  <div key={p.id} className="bg-[#1a1a1a] rounded-xl p-2.5 flex items-center gap-2.5 border border-[#282828]">
                    <select
                      className="flex-1 bg-[#121212] border border-[#333] text-white p-2 rounded-[10px] text-[11px] outline-none transition-colors focus:border-[#4caf50]"
                      value={p.metodo}
                      onChange={(e) => atualizarPagamentoMisto(p.id, { metodo: e.target.value })}
                    >
                      {opcoesMetodos.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>

                    <div className="flex items-center bg-[#0a0a0a] rounded-[20px] border border-[#222] p-0.5 h-9 max-w-32.5">
                      <input
                        type="text"
                        inputMode="numeric"
                        className="input-misto-valor flex-1 w-full bg-transparent border-none text-white text-center text-[13px] font-bold outline-none"
                        value={editandoMistoId === p.id && p.valor === 0 ? '' : formatarParaReal(p.valor)}
                        onFocus={() => {
                          setEditandoMistoId(p.id);
                          atualizarPagamentoMisto(p.id, { valor: 0 });
                        }}
                        onBlur={() => setEditandoMistoId(null)}
                        onChange={(e) => handleMascaraPDV(e, (v) => atualizarPagamentoMisto(p.id, { valor: v }))}
                        onKeyDown={(e) => handleKeyDown(e, index, true)}
                      />
                    </div>

                    <button
                      type="button"
                      className="bg-transparent border-none text-[#444] cursor-pointer text-base hover:text-[#ff5252] transition-colors"
                      onClick={() => { removerPagamentoMisto(p.id); somClickMenos(); }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Aguardando Terminal */}
        {['Crédito', 'Débito', 'Pix'].includes(metodoPagamento) && (
          <div className="text-center m-auto flex flex-col items-center justify-center h-full w-full">
            <p className="text-[#888] text-[13px]">Aguardando terminal de {metodoPagamento}...</p>
            <h2 className="text-[32px] font-extrabold text-white">R$ {formatarParaReal(totalGeral)}</h2>
            <div className="bg-[#1b5e20] text-[#64ff8a] p-2.5 rounded-lg inline-block mt-5 font-bold tracking-wider shadow-lg">
              ✅ PAGO INTEGRALMENTE
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetodosPagamento;