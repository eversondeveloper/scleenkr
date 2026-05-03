import React from 'react';
import { useProdutos } from './hooks/useProdutos';
import { useArrastaSolta } from './hooks/useArrastaSolta'; 
import { ProdutosModal } from './components/ProdutosModal';

export const Produtos = () => {
    // 1. Hook de Lógica Central (Estados e CRUD)
    const {
        produtos, setProdutos,
        filtroBusca, setFiltroBusca,
        carregando, erro,
        produtoEditando,
        dadosFormulario,
        exibirFormulario,
        resetarFormulario,
        iniciarNovoCadastro,
        salvarProduto,
        desativarProduto,
        iniciarEdicao,
        manipularMudanca,
        produtosFiltrados,
        podeSalvar, 
    } = useProdutos();

    // 2. Hook de Drag-and-Drop (Reordenação)
    const {
        arrastandoId,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    } = useArrastaSolta(produtos, setProdutos);

    return (
        <div className="flex flex-col w-full h-full gap-5">
            
            <h1 className="text-3xl font-light text-center mb-8 text-foreground m-0">
                Gestão de Produtos e Serviços
            </h1>

            {/* Seção de Cadastro */}
            <div className="flex justify-end mb-6">
                <button 
                    onClick={iniciarNovoCadastro} 
                    className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md text-sm hover:brightness-110 active:scale-95 transition-all shadow-sm border-none cursor-pointer whitespace-nowrap"
                >
                    + NOVO PRODUTO
                </button>
            </div>

            {/* Seção de Busca */}
            <div className="flex gap-5 mb-8 p-4 bg-card rounded-lg border border-border">
                <input
                    type="text"
                    placeholder="Buscar por ID, Nome ou Categoria..."
                    value={filtroBusca}
                    onChange={(e) => setFiltroBusca(e.target.value)}
                    className="flex-1 p-2.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                />
            </div>

            <hr className="my-8 border-t border-border" />

            {/* Mensagens de Status */}
            {carregando && <p className="text-muted-foreground text-center animate-pulse">Buscando dados...</p>}
            {erro && <p className="text-destructive text-center font-medium">Erro: {erro}</p>}
            
            {/* Tabela de Produtos */}
            {!carregando && produtosFiltrados.length > 0 && (
                <div className="w-full overflow-x-auto pb-4">
                    <table className="w-full border-collapse text-sm mt-5 table-auto text-left">
                        <thead className="bg-card text-muted-foreground font-medium uppercase border-y border-border">
                            <tr>
                                <th className="p-3 w-10 whitespace-nowrap">#</th>
                                <th className="p-3 whitespace-nowrap">ID</th>
                                <th className="p-3 w-full min-w-[200px]">Descrição</th>
                                <th className="p-3 whitespace-nowrap">Categoria</th>
                                <th className="p-3 whitespace-nowrap">Preço</th>
                                <th className="p-3 whitespace-nowrap">Estoque</th>
                                <th className="p-3 whitespace-nowrap">Tipo</th>
                                <th className="p-3 whitespace-nowrap text-right min-w-[180px]">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtosFiltrados.map((produto, index) => (
                                <tr 
                                    key={produto.id_produto}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, produto.id_produto)}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, produto.id_produto)}
                                    className={`
                                        cursor-grab transition-all border-b border-border hover:bg-muted/30 even:bg-muted/10
                                        ${arrastandoId === produto.id_produto ? 'opacity-50' : 'opacity-100'}
                                        ${produtoEditando?.id_produto === produto.id_produto ? 'bg-info/20' : ''}
                                    `}
                                >
                                    <td className="p-3 whitespace-nowrap">{index + 1}</td>
                                    <td className="p-3 whitespace-nowrap">{produto.id_produto}</td>
                                    <td className="p-3 whitespace-normal leading-tight">{produto.descricao}</td>
                                    <td className="p-3 whitespace-nowrap">{produto.categoria}</td>
                                    <td className="p-3 whitespace-nowrap">R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}</td>
                                    <td className="p-3 whitespace-nowrap">{produto.estoque_atual}</td>
                                    <td className="p-3 whitespace-nowrap">{produto.tipo_item}</td>
                                    <td className="p-3">
                                        <div className="flex gap-2 justify-end">
                                            <button 
                                                onClick={() => iniciarEdicao(produto)} 
                                                className="px-3 py-1.5 bg-info text-info-foreground rounded text-xs font-medium border-none cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-sm"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => desativarProduto(produto.id_produto)} 
                                                className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded text-xs font-medium border-none cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-sm"
                                            >
                                                Desativar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* Mensagem de Sem Resultados */}
            {!carregando && produtosFiltrados.length === 0 && !erro && (
                <p className="text-center text-muted-foreground mt-10">Nenhum produto encontrado para o filtro.</p>
            )}

            {/* Modal de Edição/Cadastro */}
            <ProdutosModal
                produtoEditando={produtoEditando}
                exibirFormulario={exibirFormulario}
                dadosFormulario={dadosFormulario}
                manipularMudanca={manipularMudanca}
                salvarProduto={salvarProduto}
                resetarFormulario={resetarFormulario}
                podeSalvar={podeSalvar} 
            />
        </div>
    );
};