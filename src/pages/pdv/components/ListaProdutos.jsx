/* eslint-disable no-case-declarations */
import Button from "../../../components/ui/Button";
import { ListaProdutosStyled } from "./ListaProdutosStyled";

const ListaProdutos = ({
  carregandoProdutos,
  produtosFiltrados,
  produtosSelecionados,
  adicionarProduto,
  corTextoBtn = "#cecece",
  somClick,
  modoOrganizacao,
  setModoOrganizacao,
  OPCOES_ORGANIZACAO,
}) => {
  
  if (carregandoProdutos) {
    return (
      <ListaProdutosStyled>
        <p className="mensagem-carregando">Carregando catálogo...</p>
      </ListaProdutosStyled>
    );
  }

  const ordenarProdutos = (lista) => {
    return lista.slice().sort((a, b) => {
      switch (modoOrganizacao) {
        case "mais_vendidos":
          const vendasA = a.total_vendido || 0;
          const vendasB = b.total_vendido || 0;
          if (vendasA !== vendasB) return vendasB - vendasA;
          return a.descricao.toLowerCase().localeCompare(b.descricao.toLowerCase());

        case "alfabetica":
          const catA = a.categoria.toLowerCase();
          const catB = b.categoria.toLowerCase();
          if (catA < catB) return -1;
          if (catA > catB) return 1;
          return a.descricao.toLowerCase().localeCompare(b.descricao.toLowerCase(), "pt", { sensitivity: "base" });

        case "cadastro":
          return a.id_produto - b.id_produto;

        default:
          return 0;
      }
    });
  };

  const produtosOrdenados = ordenarProdutos(produtosFiltrados);

  if (produtosOrdenados.length === 0) {
    return (
      <ListaProdutosStyled>
        <p className="mensagem-sem-produtos">
          Nenhum produto encontrado com os filtros aplicados.
        </p>
      </ListaProdutosStyled>
    );
  }

  return (
    <ListaProdutosStyled>
      <div className="barra-ferramentas-catalogo">
        <div className="seletor-organizacao-container">
          <label>ORDENAR POR:</label>
          <select
            value={modoOrganizacao}
            onChange={(e) => setModoOrganizacao(e.target.value)}
            className="select-organizacao"
          >
            {OPCOES_ORGANIZACAO.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="badge-contagem">
          {produtosOrdenados.length} PRODUTOS
        </div>
      </div>

      <div className="grid-produtos-scroll">
        <div className="buttons-catalogo">
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
    </ListaProdutosStyled>
  );
};

export default ListaProdutos;