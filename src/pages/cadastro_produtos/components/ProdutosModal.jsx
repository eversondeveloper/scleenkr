import React from 'react';

export const ProdutosModal = ({
    produtoEditando,
    exibirFormulario,
    dadosFormulario,
    manipularMudanca,
    salvarProduto,
    resetarFormulario,
    podeSalvar, 
}) => {

    if (!exibirFormulario) return null;

    const tituloModal = produtoEditando 
        ? `Editando Produto ID: ${produtoEditando.id_produto}` 
        : 'Cadastrar Novo Produto';

    const textoBotaoSalvar = produtoEditando ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR';

    return (
        <div 
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur-sm p-5 animate-in fade-in duration-200"
            onClick={resetarFormulario}
        >
            <div 
                className="bg-card p-8 rounded-xl w-full max-w-[650px] max-h-[95vh] overflow-y-auto relative shadow-2xl border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header do Modal */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                    <h2 className="m-0 text-foreground text-2xl font-normal">
                        {tituloModal}
                    </h2>
                    <button 
                        type="button" 
                        onClick={resetarFormulario}
                        className="bg-transparent border-none text-3xl cursor-pointer text-muted-foreground leading-none hover:text-foreground transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Corpo do Formulário */}
                <form onSubmit={salvarProduto} className="m-0 p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* Descrição */}
                        <div className="flex flex-col md:col-span-2">
                            <label htmlFor="descricao" className="mb-2 font-medium text-foreground text-sm">Descrição (Nome):</label>
                            <input
                                id="descricao"
                                name="descricao"
                                type="text"
                                value={dadosFormulario.descricao || ''}
                                onChange={manipularMudanca}
                                required
                                autoFocus
                                placeholder="Ex: Letreiro em Acrílico"
                                className="p-2.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        
                        {/* Categoria */}
                        <div className="flex flex-col md:col-span-2">
                            <label htmlFor="categoria" className="mb-2 font-medium text-foreground text-sm">Categoria:</label>
                            <input
                                id="categoria"
                                name="categoria"
                                type="text"
                                value={dadosFormulario.categoria || ''}
                                onChange={manipularMudanca}
                                required
                                placeholder="Ex: Comunicação Visual"
                                className="p-2.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        
                        {/* Preço */}
                        <div className="flex flex-col">
                            <label htmlFor="preco" className="mb-2 font-medium text-foreground text-sm">Preço de Venda (R$):</label>
                            <input
                                id="preco"
                                name="preco"
                                type="number"
                                step="0.01"
                                min="0"
                                value={dadosFormulario.preco !== undefined ? dadosFormulario.preco : 0} 
                                onChange={manipularMudanca}
                                required
                                className="p-2.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        {/* Tipo */}
                        <div className="flex flex-col">
                            <label htmlFor="tipoItem" className="mb-2 font-medium text-foreground text-sm">Tipo de Item:</label>
                            <select
                                id="tipoItem"
                                name="tipoItem"
                                value={dadosFormulario.tipoItem || 'Serviço'}
                                onChange={manipularMudanca}
                                required
                                className="p-2.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="Serviço">Serviço</option>
                                <option value="Produto">Produto</option>
                            </select>
                        </div>
                        
                        {/* Campos específicos de PRODUTO */}
                        {dadosFormulario.tipoItem === 'Produto' && (
                            <>
                                <div className="flex flex-col">
                                    <label htmlFor="estoqueAtual" className="mb-2 font-medium text-foreground text-sm">Estoque Atual:</label>
                                    <input
                                        id="estoqueAtual"
                                        name="estoqueAtual"
                                        type="number"
                                        min="0"
                                        value={dadosFormulario.estoqueAtual !== undefined ? dadosFormulario.estoqueAtual : 0}
                                        onChange={manipularMudanca}
                                        className="p-2.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="custoUnitario" className="mb-2 font-medium text-foreground text-sm">Custo Unitário (R$):</label>
                                    <input
                                        id="custoUnitario"
                                        name="custoUnitario"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={dadosFormulario.custoUnitario !== undefined ? dadosFormulario.custoUnitario : 0}
                                        onChange={manipularMudanca}
                                        className="p-2.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                <div className="flex flex-col md:col-span-2">
                                    <label htmlFor="codigoBarra" className="mb-2 font-medium text-foreground text-sm">Código de Barras:</label>
                                    <input
                                        id="codigoBarra"
                                        name="codigoBarra"
                                        type="text"
                                        value={dadosFormulario.codigoBarra || ''}
                                        onChange={manipularMudanca}
                                        placeholder="Código de barras opcional"
                                        className="p-2.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Rodapé e Botões de Ação */}
                    <div className="flex justify-end gap-4 mt-8 pt-5 border-t border-border">
                        <button 
                            type="button" 
                            onClick={resetarFormulario} 
                            className="px-4 py-2 bg-muted text-foreground rounded-md text-sm font-medium border-none cursor-pointer hover:bg-muted-foreground/20 transition-colors"
                        >
                            CANCELAR
                        </button>
                        <button 
                            type="submit" 
                            disabled={!podeSalvar} 
                            className="px-4 py-2 bg-success text-black rounded-md text-sm font-bold border-none cursor-pointer hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {textoBotaoSalvar}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};