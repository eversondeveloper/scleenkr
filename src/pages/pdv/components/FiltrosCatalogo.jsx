import { useRef, useEffect } from "react";

const FiltrosCatalogo = ({
  filtroBusca = "",
  setFiltroBusca,
  filtrosExpandidos,
  setFiltrosExpandidos,
  categoriasUnicas = [],
  filtroCategoriasSelecionadas = [],
  toggleCategoriaFiltro,
  filtroTipoItem = "Todos",
  setFiltroTipoItem,
  temFiltrosAtivos,
  limparFiltros,
  inputFiltroBuscaRef,
  processarBuscaDireta, 
}) => {
  const containerFiltrosRef = useRef(null);

  useEffect(() => {
    if (filtrosExpandidos) {
      const timer = setTimeout(() => {
        inputFiltroBuscaRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [filtrosExpandidos, inputFiltroBuscaRef]);

  const handleKeyDownBusca = (e) => {
    if (e.key === "Enter" && filtroBusca.trim() !== "") {
      const adicionado = processarBuscaDireta(filtroBusca, () => setFiltroBusca(""));
      if (adicionado) {
        // Opcional: tocar um som de sucesso aqui se desejar
      }
    }
  };

  return (
    <div
      ref={containerFiltrosRef}
      className={`
        w-full flex flex-col bg-[#121212] rounded-xl mb-5 overflow-hidden shrink-0 transform-gpu
        transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${filtrosExpandidos 
          ? "max-h-[800px] border border-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
          : "max-h-[48px] border border-[#222]"
        }
      `}
      onMouseEnter={() => setFiltrosExpandidos(true)}
      onMouseLeave={() => setFiltrosExpandidos(false)}
    >
      {/* Cabeçalho Fixo */}
      <div className="px-[18px] flex justify-between items-center bg-[#1a1a1a] h-[48px] min-h-[48px] z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-70">🔍</span>
          <h3 className="text-[#888] text-xs font-extrabold m-0 tracking-[1.2px] uppercase">
            BUSCAR NO CATÁLOGO <small className="text-[9px] opacity-50 ml-1">[ESPAÇO]</small>
          </h3>
        </div>
        
        {!filtrosExpandidos && (
          <div className={`
            text-[10px] font-extrabold px-2.5 py-1 rounded-md whitespace-nowrap
            ${temFiltrosAtivos ? "text-success bg-success/15" : "text-[#4caf50] bg-[#4caf50]/10"}
          `}>
            {temFiltrosAtivos ? "FILTROS ATIVOS" : "PASSE O MOUSE"}
          </div>
        )}
      </div>

      {/* Conteúdo Expansível Animado */}
      <div className={`
        px-[18px] flex flex-col gap-5 overflow-hidden
        transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${filtrosExpandidos ? "max-h-[700px] opacity-100 py-5 pointer-events-auto" : "max-h-0 opacity-0 py-0 pointer-events-none"}
      `}>
        
        {/* Input de Busca */}
        <div className="relative w-full flex items-center mt-1">
          <input
            ref={inputFiltroBuscaRef}
            type="text"
            placeholder="ID, Código ou Nome... [ENTER para add]"
            className="w-full bg-[#1a1a1a] border border-[#333] pl-4 pr-10 py-3 rounded-lg text-white text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            onKeyDown={handleKeyDownBusca}
          />
          {filtroBusca && (
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#333] hover:bg-destructive text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors z-10"
              onClick={() => { setFiltroBusca(""); inputFiltroBuscaRef.current?.focus(); }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Pílulas de Filtro (Categorias e Tipos) */}
        <div className="flex flex-col gap-[18px]">
          {/* Categorias */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[#666] text-[11px] font-bold tracking-widest uppercase m-0">CATEGORIAS</label>
            <div className="flex flex-wrap gap-2">
              {categoriasUnicas.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`
                    px-3.5 py-1.5 border rounded-full text-[11px] transition-all hover:-translate-y-px shrink-0
                    ${filtroCategoriasSelecionadas.includes(cat) 
                      ? "bg-success border-success text-black font-extrabold shadow-[0_4px_12px_rgba(76,175,80,0.2)]" 
                      : "bg-[#1a1a1a] border-[#282828] text-[#888] font-semibold hover:border-[#444]"
                    }
                  `}
                  onClick={() => toggleCategoriaFiltro(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Tipos */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[#666] text-[11px] font-bold tracking-widest uppercase m-0">TIPO</label>
            <div className="flex flex-wrap gap-2">
              {["Todos", "Produto", "Serviço"].map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  className={`
                    px-3.5 py-1.5 border rounded-full text-[11px] transition-all hover:-translate-y-px shrink-0
                    ${filtroTipoItem === tipo 
                      ? "bg-success border-success text-black font-extrabold shadow-[0_4px_12px_rgba(76,175,80,0.2)]" 
                      : "bg-[#1a1a1a] border-[#282828] text-[#888] font-semibold hover:border-[#444]"
                    }
                  `}
                  onClick={() => setFiltroTipoItem(tipo)}
                >
                  {tipo.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botão Limpar Tudo */}
        {temFiltrosAtivos && (
          <button 
            type="button" 
            className="mt-2 bg-transparent border border-dashed border-[#444] text-[#666] px-4 py-2.5 rounded-lg text-[11px] font-bold transition-all hover:text-destructive hover:border-destructive hover:bg-destructive/10 hover:-translate-y-px shrink-0" 
            onClick={limparFiltros}
          >
            LIMPAR TUDO
          </button>
        )}

      </div>
    </div>
  );
};

export default FiltrosCatalogo;