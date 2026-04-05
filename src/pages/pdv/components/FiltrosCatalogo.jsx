// components/Vendas/FiltrosCatalogo.jsx
import { useRef, useEffect } from "react";
import { FiltrosCatalogoStyled } from "./FiltrosCatalogoStyled";

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
  processarBuscaDireta, // Nova prop vinda do useVendas
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

  // Função para lidar com o Enter (Leitor de código de barras ou ID)
  const handleKeyDownBusca = (e) => {
    if (e.key === "Enter" && filtroBusca.trim() !== "") {
      const adicionado = processarBuscaDireta(filtroBusca, () => setFiltroBusca(""));
      if (adicionado) {
        // Opcional: tocar um som de sucesso aqui se desejar
      }
    }
  };

  const classeEstado = filtrosExpandidos ? "expandido" : "recolhido";

  return (
    <FiltrosCatalogoStyled
      ref={containerFiltrosRef}
      className={`container-filtros-pdv ${classeEstado}`}
      onMouseEnter={() => setFiltrosExpandidos(true)}
      onMouseLeave={() => setFiltrosExpandidos(false)}
    >
      <div className="cabecalho-filtros">
        <div className="titulo-wrapper">
          <span className="icone-busca">🔍</span>
          <h3 className="titulo-filtros">BUSCAR NO CATÁLOGO <small style={{fontSize: '9px', opacity: 0.5}}>[ESPAÇO]</small></h3>
        </div>
        {!filtrosExpandidos && (
          <div className={`badge-status ${temFiltrosAtivos ? "ativo" : ""}`}>
            {temFiltrosAtivos ? "FILTROS ATIVOS" : "PASSE O MOUSE"}
          </div>
        )}
      </div>

      <div className="conteudo-filtros-animado">
        <div className="grupo-busca-principal" style={{ position: 'relative' }}>
          <input
            ref={inputFiltroBuscaRef}
            type="text"
            placeholder="ID, Código ou Nome... [ENTER para add]"
            className="input-filtro-busca"
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            onKeyDown={handleKeyDownBusca} // Gatilho de adição direta
          />
          {filtroBusca && (
            <button 
              type="button"
              className="btn-limpar-input-interno"
              onClick={() => { setFiltroBusca(""); inputFiltroBuscaRef.current?.focus(); }}
            >✕</button>
          )}
        </div>

        <div className="secao-filtros-botoes">
          <div className="bloco-filtro">
            <label className="label-filtros">CATEGORIAS</label>
            <div className="lista-pills">
              {categoriasUnicas.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`pill-filtro ${filtroCategoriasSelecionadas.includes(cat) ? "ativo" : ""}`}
                  onClick={() => toggleCategoriaFiltro(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="bloco-filtro">
            <label className="label-filtros">TIPO</label>
            <div className="lista-pills">
              {["Todos", "Produto", "Serviço"].map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  className={`pill-filtro ${filtroTipoItem === tipo ? "ativo" : ""}`}
                  onClick={() => setFiltroTipoItem(tipo)}
                >
                  {tipo.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {temFiltrosAtivos && (
          <button type="button" className="btn-limpar-filtros-moderno" onClick={limparFiltros}>
            LIMPAR TUDO
          </button>
        )}
      </div>
    </FiltrosCatalogoStyled>
  );
};

export default FiltrosCatalogo;