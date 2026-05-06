// src/pages/pdv/components/ListaProdutos.tsx
import Button from '@/components/ui/Button.jsx';

// ---------------------------------------------------------
// Tipos locais (futuramente podem migrar para models/produto.ts)
// ---------------------------------------------------------
export interface ProdutoCatalogo {
  id_produto: number;
  descricao: string;
  categoria: string;
  preco: number;
  total_vendido?: number;
  estoque_atual?: number;
  tipo_item?: string;
  // outros campos que o Button possa precisar
}

export interface OpcaoOrganizacao {
  valor: string;
  label: string;
}

interface ListaProdutosProps {
  carregandoProdutos: boolean;
  produtosFiltrados: ProdutoCatalogo[];
  produtosSelecionados: ProdutoCatalogo[];  // usado pelo Button para destacar selecionados
  adicionarProduto: (produto: ProdutoCatalogo) => void;
  corTextoBtn?: string;
  somClick?: () => void;
  modoOrganizacao: string;
  setModoOrganizacao: (modo: string) => void;
  OPCOES_ORGANIZACAO: OpcaoOrganizacao[];
}

// ---------------------------------------------------------
// Componente
// ---------------------------------------------------------
const ListaProdutos: React.FC<ListaProdutosProps> = ({
  carregandoProdutos,
  produtosFiltrados,
  produtosSelecionados,
  adicionarProduto,
  corTextoBtn = '#cecece',
  somClick,
  modoOrganizacao,
  setModoOrganizacao,
  OPCOES_ORGANIZACAO,
}) => {
  if (carregandoProdutos) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <p className="text-[#666] text-center mt-12.5 text-sm italic">
          Carregando catálogo...
        </p>
      </div>
    );
  }

  const ordenarProdutos = (lista: ProdutoCatalogo[]): ProdutoCatalogo[] => {
    return lista.slice().sort((a, b) => {
      switch (modoOrganizacao) {
        case 'mais_vendidos': {
          const vendasA = a.total_vendido || 0;
          const vendasB = b.total_vendido || 0;
          if (vendasA !== vendasB) return vendasB - vendasA;
          return a.descricao.toLowerCase().localeCompare(b.descricao.toLowerCase());
        }
        case 'alfabetica': {
          const catA = a.categoria.toLowerCase();
          const catB = b.categoria.toLowerCase();
          if (catA < catB) return -1;
          if (catA > catB) return 1;
          return a.descricao.toLowerCase().localeCompare(b.descricao.toLowerCase(), 'pt', { sensitivity: 'base' });
        }
        case 'cadastro':
          return a.id_produto - b.id_produto;
        default:
          return 0;
      }
    });
  };

  const produtosOrdenados = ordenarProdutos(produtosFiltrados);

  if (produtosOrdenados.length === 0) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <p className="text-[#666] text-center mt-12.5 text-sm italic">
          Nenhum produto encontrado com os filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Barra de Ferramentas / Cabeçalho da Lista */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-[#1a1a1a] border-b border-[#282828] shrink-0">
        <div className="flex items-center gap-2.5">
          <label className="text-[10px] font-extrabold text-[#555] tracking-widest">
            ORDENAR POR:
          </label>
          <select
            value={modoOrganizacao}
            onChange={(e) => setModoOrganizacao(e.target.value)}
            className="bg-[#252525] text-white border border-[#333] px-3 py-1.5 rounded-md text-[11px] font-semibold outline-none cursor-pointer transition-colors focus:border-[#646cff]"
          >
            {OPCOES_ORGANIZACAO.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        
        {/* Badge Contagem */}
        <div className="text-[10px] font-extrabold text-[#888] bg-[#121212] px-2.5 py-1 rounded-full border border-[#282828]">
          {produtosOrdenados.length} PRODUTOS
        </div>
      </div>

      {/* Grid de Produtos com Scroll Customizado */}
      <div className="flex-1 overflow-y-auto p-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#333] [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="grid grid-cols-3 gap-2 w-full justify-items-stretch items-start">
          {produtosOrdenados.map((item, i) => (
            <Button
              key={item.id_produto}
              $index={i + 1}
              $texto={item.categoria}
              $descricao={item.descricao}
              $id={item.id_produto}
              $corTexto={corTextoBtn}
              $btnClick={() => {
                adicionarProduto(item);
                if (somClick) somClick();
              }}
              $produtosSelecionados={produtosSelecionados}
              $preco={item.preco}
              $totalVendido={item.total_vendido}
              $estoqueAtual={item.estoque_atual}
              $tipoItem={item.tipo_item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListaProdutos;