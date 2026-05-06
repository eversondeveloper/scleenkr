// src/pages/pdv/hooks/useFiltros.ts
import { useState, useMemo } from 'react';

// ---------------------------------------------------------
// Tipos
// ---------------------------------------------------------
export interface ProdutoDB {
  id_produto: number;
  descricao: string;
  categoria: string;
  tipo_item?: string;
  total_vendido?: number;
  estoque_atual?: number;
  // outros campos opcionais...
}

export interface UseFiltrosReturn {
  filtroCategoriasSelecionadas: string[];
  filtroTipoItem: string;
  filtroBusca: string;
  filtrosExpandidos: boolean;
  setFiltroBusca: (busca: string) => void;
  setFiltrosExpandidos: (expandido: boolean) => void;
  categoriasUnicas: string[];
  produtosFiltrados: ProdutoDB[];
  temFiltrosAtivos: boolean;
  toggleCategoriaFiltro: (categoria: string) => void;
  setFiltroTipoItem: (tipo: string) => void;
  limparFiltros: () => void;
}

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------
export function useFiltros(produtosDB: ProdutoDB[]): UseFiltrosReturn {
  const [filtroCategoriasSelecionadas, setFiltroCategoriasSelecionadas] = useState<string[]>([]);
  const [filtroTipoItem, setFiltroTipoItem] = useState<string>('Todos');
  const [filtroBusca, setFiltroBusca] = useState<string>('');
  const [filtrosExpandidos, setFiltrosExpandidos] = useState<boolean>(false);

  // Categorias únicas ordenadas com localeCompare para português
  const categoriasUnicas = useMemo<string[]>(() => {
    if (!produtosDB || produtosDB.length === 0) return [];
    return [...new Set(produtosDB.map((p) => p.categoria))].sort((a, b) =>
      a.localeCompare(b, 'pt', { sensitivity: 'base' })
    );
  }, [produtosDB]);

  // Produtos filtrados
  const produtosFiltrados = useMemo<ProdutoDB[]>(() => {
    let lista = produtosDB;
    const termoBusca = filtroBusca.toLowerCase().trim();

    // Filtro por categorias
    if (filtroCategoriasSelecionadas.length > 0) {
      lista = lista.filter((p) =>
        filtroCategoriasSelecionadas.includes(p.categoria)
      );
    }

    // Filtro por tipo de item
    if (filtroTipoItem !== 'Todos') {
      lista = lista.filter((p) => p.tipo_item === filtroTipoItem);
    }

    // Filtro por busca (descricao, categoria ou id_produto)
    if (termoBusca) {
      lista = lista.filter(
        (p) =>
          p.descricao.toLowerCase().includes(termoBusca) ||
          p.categoria.toLowerCase().includes(termoBusca) ||
          p.id_produto.toString().includes(termoBusca)
      );
    }

    return lista;
  }, [produtosDB, filtroCategoriasSelecionadas, filtroTipoItem, filtroBusca]);

  const toggleCategoriaFiltro = (categoria: string) => {
    setFiltroCategoriasSelecionadas((prev) => {
      if (prev.includes(categoria)) {
        return prev.filter((c) => c !== categoria);
      } else {
        return [...prev, categoria];
      }
    });
  };

  const limparFiltros = () => {
    setFiltroCategoriasSelecionadas([]);
    setFiltroTipoItem('Todos');
    setFiltroBusca('');
  };

  const temFiltrosAtivos = useMemo<boolean>(() => {
    return (
      filtroCategoriasSelecionadas.length > 0 ||
      filtroTipoItem !== 'Todos' ||
      filtroBusca.trim() !== ''
    );
  }, [filtroCategoriasSelecionadas, filtroTipoItem, filtroBusca]);

  return {
    filtroCategoriasSelecionadas,
    filtroTipoItem,
    filtroBusca,
    filtrosExpandidos,
    setFiltroBusca,
    setFiltrosExpandidos,
    categoriasUnicas,
    produtosFiltrados,
    temFiltrosAtivos,
    toggleCategoriaFiltro,
    setFiltroTipoItem,
    limparFiltros,
  };
}