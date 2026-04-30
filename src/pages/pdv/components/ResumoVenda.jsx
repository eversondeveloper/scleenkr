import { formatarParaReal } from "../hooks/useVendas";

const ResumoVenda = ({
  metodoPagamento,
  totalGeral,
  valorFaltando,
  valorTroco,
  podeFinalizarVenda,
  finalizarVenda,
  cancelarVenda,
  pagamentosMistos,
  valorPagoTotal,
}) => {
  const metodosUsadosMisto = pagamentosMistos?.filter((p) => p.valor > 0) || [];

  const formatarMetodosMistos = () => {
    if (metodoPagamento !== "Misto" || !metodosUsadosMisto.length) {
      return metodoPagamento;
    }
    if (metodosUsadosMisto.length === 1) {
      return metodosUsadosMisto[0].metodo;
    }
    return metodosUsadosMisto.map((p) => p.metodo).join(" + ");
  };

  const vendaIniciada = totalGeral > 0;
  const valorFaltandoReal = Math.max(0, totalGeral - valorPagoTotal);
  const temPendencia = valorFaltandoReal > 0.009;
  const temTroco = valorTroco > 0.009;
  const pagoIntegralmente = vendaIniciada && !temPendencia && valorPagoTotal >= (totalGeral - 0.009);

  return (
    <div className="flex flex-col h-full w-full gap-[15px] box-border">
      
      {/* --- PAINEL SUPERIOR DE STATUS --- */}
      <div className="flex-1 flex flex-col gap-5 p-2.5 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 [&::-webkit-scrollbar-thumb]:rounded-full">
        
        {/* FORMA DE PAGAMENTO */}
        <div>
          <label className="block text-[10px] font-extrabold text-primary tracking-widest uppercase mb-1.5">
            FORMA DE PAGAMENTO
          </label>
          <div className="text-lg text-foreground/90 font-bold tracking-wide">
            {formatarMetodosMistos().toUpperCase()}
          </div>
        </div>

        {/* VALOR TOTAL (DESTAQUE) */}
        <div>
          <label className="block text-[10px] font-extrabold text-primary tracking-widest uppercase mb-1.5">
            TOTAL A PAGAR
          </label>
          <div className="text-[44px] text-foreground font-black leading-none">
            R$ {formatarParaReal(totalGeral)}
          </div>
        </div>

        {/* DETALHAMENTO MISTO */}
        {metodoPagamento === "Misto" && metodosUsadosMisto.length > 0 && (
          <div className="bg-secondary/30 rounded-xl p-4 border border-border">
            {metodosUsadosMisto.map((pagamento, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-border text-xs last:border-b-0">
                <span className="text-muted-foreground">{pagamento.metodo}</span>
                <strong className="text-foreground">R$ {formatarParaReal(pagamento.valor)}</strong>
              </div>
            ))}
            <div className="mt-2.5 pt-2.5 border-t border-border flex justify-between items-center">
              <span className="text-muted-foreground font-extrabold text-[10px]">TOTAL RECEBIDO</span>
              <strong className="text-success text-lg font-black">R$ {formatarParaReal(valorPagoTotal)}</strong>
            </div>
          </div>
        )}

        {/* PAINEL DE RESULTADO (PENDENTE / TROCO / PAGO) */}
        <div className="mt-auto">
          {!vendaIniciada ? (
            <div className="rounded-2xl p-5 text-center bg-card border border-border">
              <div className="text-muted-foreground font-bold tracking-widest text-sm">AGUARDANDO ITENS...</div>
            </div>
          ) : temPendencia ? (
            <div className="rounded-2xl p-5 text-center bg-destructive/10 border border-destructive/30 transition-all duration-300">
              <label className="block text-[10px] font-extrabold text-destructive tracking-widest uppercase mb-1.5">VALOR RESTANTE</label>
              <div className="text-destructive text-[32px] font-black">R$ {formatarParaReal(valorFaltandoReal)}</div>
            </div>
          ) : temTroco ? (
            <div className="rounded-2xl p-5 text-center bg-background border-2 border-primary transition-all duration-300 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
              <label className="block text-[10px] font-extrabold text-primary tracking-widest uppercase mb-1.5">TROCO</label>
              <div className="text-success text-[32px] font-black">R$ {formatarParaReal(valorTroco)}</div>
            </div>
          ) : pagoIntegralmente ? (
            <div className="rounded-2xl p-6 text-center bg-success border border-success/50 transition-all duration-300">
              <div className="text-success-foreground text-base font-black tracking-[1.5px] animate-pulse drop-shadow-md">
                PAGO INTEGRALMENTE
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-5 text-center bg-card border border-border">
              <div className="text-muted-foreground font-bold tracking-widest text-sm">AGUARDANDO PAGAMENTO...</div>
            </div>
          )}
        </div>
      </div>

      {/* --- BOTÕES DE RODAPÉ --- */}
      <div className="flex gap-3 pt-2.5 shrink-0">
        <button
          type="button"
          onClick={cancelarVenda}
          className="flex-1 h-[55px] rounded-xl border border-destructive/30 font-extrabold text-[13px] cursor-pointer transition-all uppercase bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground active:scale-95"
          title="Atalho: ESC"
        >
          CANCELAR [ESC]
        </button>

        <button
          type="button"
          onClick={finalizarVenda}
          className={`
            flex-1 h-[55px] rounded-xl border border-border font-extrabold text-[13px] transition-all uppercase
            ${podeFinalizarVenda 
              ? "bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95" 
              : "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"
            }
          `}
          disabled={!podeFinalizarVenda}
          title="Atalho: ENTER"
        >
          FINALIZAR [ENTER]
        </button>
      </div>
      
    </div>
  );
};

export default ResumoVenda;