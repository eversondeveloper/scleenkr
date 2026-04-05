import { ResumoVendaStyled } from "./ResumoVendaStyled";
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

  const vendaIniciada = totalGeral > 0.001;
  const temPendencia = valorFaltando > 0.001;
  const temTroco = valorTroco > 0.001;

  return (
    <ResumoVendaStyled>
      <div className="painel-status-pagamento">
        <div className="secao-metodo">
          <label>FORMA DE PAGAMENTO</label>
          <div className="metodo-valor">{formatarMetodosMistos().toUpperCase()}</div>
        </div>

        <div className="secao-total-venda">
          <label>TOTAL A PAGAR</label>
          <div className="total-valor">
            R$ {formatarParaReal(totalGeral)}
          </div>
        </div>

        {metodoPagamento === "Misto" && metodosUsadosMisto.length > 0 && (
          <div className="detalhes-mistos-container">
            {metodosUsadosMisto.map((pagamento, index) => (
              <div key={index} className="linha-detalhe">
                <span>{pagamento.metodo}</span>
                <strong>R$ {formatarParaReal(pagamento.valor)}</strong>
              </div>
            ))}
            <div className="total-pago-row">
              <span>TOTAL RECEBIDO</span>
              <strong>R$ {formatarParaReal(valorPagoTotal)}</strong>
            </div>
          </div>
        )}

        <div className="painel-resultado">
          {!vendaIniciada ? (
            <div className="status-box aguardando">
              <div className="resultado-texto" style={{ color: "#aaa" }}>AGUARDANDO ITENS...</div>
            </div>
          ) : temPendencia ? (
            <div className="status-box pendente">
              <label>VALOR RESTANTE</label>
              <div className="resultado-valor">R$ {formatarParaReal(valorFaltando)}</div>
            </div>
          ) : temTroco ? (
            <div className="status-box troco">
              <label>TROCO</label>
              <div className="resultado-valor">R$ {formatarParaReal(valorTroco)}</div>
            </div>
          ) : (
            <div className="status-box pago">
              <div className="resultado-texto">PAGO INTEGRALMENTE</div>
            </div>
          )}
        </div>
      </div>

      <div className="container-botoes-rodape">
        <button
          type="button"
          onClick={cancelarVenda}
          className="btn-cancelar"
          title="Atalho: ESC"
        >
          CANCELAR [ESC]
        </button>

        <button
          type="button"
          onClick={finalizarVenda}
          className={`btn-finalizar ${podeFinalizarVenda ? "disponivel" : ""}`}
          disabled={!podeFinalizarVenda}
          title="Atalho: ENTER"
        >
          FINALIZAR [ENTER]
        </button>
      </div>
    </ResumoVendaStyled>
  );
};

export default ResumoVenda;