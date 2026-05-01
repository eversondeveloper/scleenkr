import React from 'react';

export const SecaoFiltrosAtendentes = ({
  filtroNome,
  setFiltroNome,
  filtroAtivo,
  setFiltroAtivo,
  onLimparFiltros
}) => {
  const isFiltroAtivo = filtroNome || filtroAtivo !== 'todos';

  return (
    <div className="flex flex-col gap-5 w-full">
      <p className="text-muted-foreground text-sm m-0">
        Filtre os atendentes por nome e status para uma gestão mais rápida.
      </p>

      <div className="flex flex-col md:flex-row gap-5 items-end">
        {/* Filtro por Nome */}
        <div className="flex flex-col w-full">
          <label htmlFor="filtro-nome" className="text-muted-foreground text-sm font-light mb-1.5">
            Buscar por nome
          </label>
          <input
            id="filtro-nome"
            type="text"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            placeholder="Digite o nome..."
            className="w-full p-2.5 bg-background text-foreground border border-border rounded-md text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Filtro por Status */}
        <div className="flex flex-col w-full md:w-64 shrink-0">
          <label htmlFor="filtro-status" className="text-muted-foreground text-sm font-light mb-1.5">
            Status do Cadastro
          </label>
          <select
            id="filtro-status"
            value={filtroAtivo}
            onChange={(e) => setFiltroAtivo(e.target.value)}
            className="w-full p-2.5 bg-background text-foreground border border-border rounded-md text-sm outline-none focus:border-primary transition-colors cursor-pointer appearance-none bg-no-repeat bg-position-[right_10px_center] bg-size-[8px_10px]"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='%23E0E0E0' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")`
            }}
          >
            <option value="todos">Todos os status</option>
            <option value="ativos">Apenas ativos</option>
            <option value="inativos">Apenas inativos</option>
          </select>
        </div>

        {/* Botão Limpar Filtros */}
        <button
          onClick={onLimparFiltros}
          disabled={!isFiltroAtivo}
          className="h-[42px] px-5 bg-muted text-foreground border-none rounded-md text-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted-foreground/20 whitespace-nowrap shrink-0"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Badge de Filtros Ativos */}
      {isFiltroAtivo && (
        <div className="flex justify-between items-center mt-2 p-3 bg-background border-l-4 border-warning rounded-md text-sm">
          <div>
            <span className="text-muted-foreground">Filtros ativos: </span>
            {filtroNome && (
              <span className="text-warning ml-2 font-medium">Nome: "{filtroNome}"</span>
            )}
            {filtroAtivo !== 'todos' && (
              <span className="text-success ml-2 font-medium">
                Status: {filtroAtivo === 'ativos' ? 'Ativos' : 'Inativos'}
              </span>
            )}
          </div>
          <button
            onClick={onLimparFiltros}
            className="bg-transparent border-none text-destructive cursor-pointer text-xs font-bold hover:brightness-125 transition-all p-0 ml-4 shrink-0"
          >
            REMOVER TODOS
          </button>
        </div>
      )}
    </div>
  );
};