import React from 'react';

export const ModalEdicaoRetirada = ({
  mostrar,
  onClose,
  novaRetirada,
  setNovaRetirada,
  onAtualizar,
  retiradaEditando,
}) => {
  if (!mostrar || !retiradaEditando) return null;

  const handleAtualizar = () => {
    if (!novaRetirada.valorRetirado || !novaRetirada.motivo || !novaRetirada.dataRetirada || !novaRetirada.timeRetirada) {
      alert('Preencha o valor, o motivo, a data e a hora da retirada.');
      return;
    }

    const valor = parseFloat(novaRetirada.valorRetirado);
    if (isNaN(valor) || valor <= 0) {
      alert('Valor inválido. Digite um valor numérico positivo.');
      return;
    }

    onAtualizar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-5 animate-in fade-in duration-200">
      <div className="bg-[#2d2d2d] p-6 rounded-lg w-full max-w-[500px] border border-[#444] shadow-2xl">
        <h3 className="text-[#E0E0E0] mt-0 mb-5 pb-3 border-b border-[#333] text-[20px] font-medium">
          Editar Retirada do Caixa
        </h3>

        <div className="mb-5 p-4 bg-[#2a2a2a] rounded-[5px]">
          <h4 className="m-0 mb-2.5 text-[#64ff8a] font-bold text-sm">Informações da Retirada</h4>
          <p className="m-0 mb-1.5 text-[14px] text-muted-foreground">
            <strong className="text-foreground">Registro Original:</strong> {new Date(retiradaEditando.data_retirada).toLocaleString("pt-BR")}
          </p>
          <p className="m-0 text-[14px] text-muted-foreground">
            <strong className="text-foreground">Valor Original:</strong> R$ {parseFloat(retiradaEditando.valor).toFixed(2)}
          </p>
        </div>

        {/* CONTROLE DE DATA E HORA AGRUPADO */}
        <div className="flex gap-4 mb-4">
            {/* SELETOR DE DATA */}
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-[13px] text-muted-foreground">Data:</label>
              <input
                type="date"
                value={novaRetirada.dataRetirada}
                onChange={(e) =>
                  setNovaRetirada({
                    ...novaRetirada,
                    dataRetirada: e.target.value,
                  })
                }
                className="w-full p-2 bg-[#1e1e1e] text-[#BACBD9] border border-[#555] rounded outline-none focus:border-[#FF9800] transition-colors"
              />
            </div>
            
            {/* SELETOR DE HORA */}
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-[13px] text-muted-foreground">Hora:</label>
              <input
                type="time"
                value={novaRetirada.timeRetirada}
                onChange={(e) =>
                  setNovaRetirada({
                    ...novaRetirada,
                    timeRetirada: e.target.value,
                  })
                }
                className="w-full p-2 bg-[#1e1e1e] text-[#BACBD9] border border-[#555] rounded outline-none focus:border-[#FF9800] transition-colors"
              />
            </div>
        </div>
        
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-[13px] text-muted-foreground">Novo Valor Retirado:</label>
          <input
            type="number"
            step="0.01"
            value={novaRetirada.valorRetirado}
            onChange={(e) =>
              setNovaRetirada({
                ...novaRetirada,
                valorRetirado: e.target.value,
              })
            }
            placeholder="0.00"
            className="w-full p-2 bg-[#1e1e1e] text-[#BACBD9] border border-[#555] rounded outline-none focus:border-[#FF9800] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-[13px] text-muted-foreground">Motivo:</label>
          <input
            type="text"
            value={novaRetirada.motivo}
            onChange={(e) =>
              setNovaRetirada({ ...novaRetirada, motivo: e.target.value })
            }
            placeholder="Ex: Compra de material, Pagamento de conta..."
            className="w-full p-2 bg-[#1e1e1e] text-[#BACBD9] border border-[#555] rounded outline-none focus:border-[#FF9800] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1 mb-5">
          <label className="text-[13px] text-muted-foreground">Observação (opcional):</label>
          <textarea
            value={novaRetirada.observacao}
            onChange={(e) =>
              setNovaRetirada({ ...novaRetirada, observacao: e.target.value })
            }
            className="w-full p-2 bg-[#1e1e1e] text-[#BACBD9] border border-[#555] rounded min-h-[80px] resize-y outline-none focus:border-[#FF9800] transition-colors"
          />
        </div>

        <div className="flex gap-3 justify-end pt-5 border-t border-[#333]">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-[#444] text-[#E0E0E0] font-medium rounded border-none cursor-pointer transition-colors hover:bg-[#555] active:scale-95 text-[14px]"
          >
            Cancelar
          </button>
          <button 
            onClick={handleAtualizar} 
            className="px-4 py-2 bg-[#FF9800] text-[#1e1e1e] font-bold rounded border-none cursor-pointer transition-colors hover:bg-[#e68a00] active:scale-95 text-[14px]"
          >
            Atualizar Retirada
          </button>
        </div>
      </div>
    </div>
  );
};