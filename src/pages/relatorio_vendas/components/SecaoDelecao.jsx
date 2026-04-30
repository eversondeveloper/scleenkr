import React from 'react';

export const SecaoDelecao = ({
  onNovaRetirada,
  onGerarPDF,
  gerandoPDF,
  vendasFiltradas,
  retiradasFiltradas,
  vendas,
  onDeletarFiltrados,
  onDeletarTudo,
  onAbrirObservacao,
  temObservacao
}) => {
  return (
    <div className="flex gap-3 justify-end mb-[30px] w-full flex-wrap">
      
      {/* BOTÃO NOVA RETIRADA (Laranja) */}
      <button 
        className="px-4 py-2 bg-[#FF9800] text-[#1e1e1e] font-semibold text-[13px] rounded border-none cursor-pointer transition-colors hover:bg-[#e68a00] active:scale-95" 
        onClick={onNovaRetirada}
      >
        Nova Retirada
      </button>

      {/* BOTÃO: OBSERVAÇÃO (Verde) */}
      <button 
        className="px-4 py-2 bg-[#4CAF50] text-white font-semibold text-[13px] rounded border-none cursor-pointer transition-colors hover:bg-[#43a047] active:scale-95" 
        onClick={onAbrirObservacao}
      >
        {temObservacao ? "Editar Observação" : "Adicionar Observação"}
      </button>

      {/* BOTÃO GERAR PDF (Azul) */}
      <button 
        className="px-4 py-2 bg-[#2196F3] text-[#1e1e1e] font-semibold text-[13px] rounded border-none cursor-pointer transition-colors hover:bg-[#1e88e5] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={onGerarPDF} 
        disabled={gerandoPDF || (vendasFiltradas.length === 0 && retiradasFiltradas.length === 0)}
      >
        {gerandoPDF ? "Gerando..." : "Gerar PDF"}
      </button>

      {/* BOTÃO DELETAR FILTRADOS (Vermelho/Escuro) */}
      <button 
        className="px-4 py-2 bg-[#E53935] text-[#1e1e1e] font-semibold text-[13px] rounded border-none cursor-pointer transition-colors hover:bg-[#d32f2f] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={onDeletarFiltrados}
        disabled={vendasFiltradas.length === 0}
      >
        Deletar Filtrados
      </button>

      {/* BOTÃO DELETAR TUDO (Vermelho Destaque com Borda) */}
      <button 
        className="px-4 py-2 bg-[#E53935] text-white font-bold text-[13px] rounded border border-[#b71c1c] cursor-pointer transition-colors hover:bg-[#c62828] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={onDeletarTudo}
        disabled={vendas.length === 0}
      >
        Deletar Tudo
      </button>
      
    </div>
  );
};