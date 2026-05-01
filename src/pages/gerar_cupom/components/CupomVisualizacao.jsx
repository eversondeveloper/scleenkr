import React from 'react';

const CupomVisualizacao = ({
  empresaSelecionada,
  detalhesVenda,
  formatarMoeda,
  gerarPDFCupom,
  gerandoPDF
}) => {
  if (!empresaSelecionada || !detalhesVenda) {
    return (
      <div className="text-center p-5 text-muted-foreground text-sm">
        Selecione uma <strong className="text-foreground font-medium">Empresa</strong> e uma <strong className="text-foreground font-medium">Venda</strong> para gerar o cupom.
      </div>
    );
  }

  const empresa = empresaSelecionada;
  const venda = detalhesVenda;

  return (
    <div className="flex justify-center w-full mt-8">
      {/* Container do "Papel" do Cupom */}
      <div className="relative border border-dashed border-gray-500 p-6 bg-white text-black w-full max-w-xs shadow-lg font-mono">
        
        {/* Botão de exportar PDF */}
        <button
          onClick={gerarPDFCupom}
          disabled={gerandoPDF}
          className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-blue-500 text-white font-sans font-medium border-none rounded text-xs cursor-pointer disabled:opacity-60 hover:bg-blue-600 transition-colors shadow-sm active:scale-95"
        >
          {gerandoPDF ? "Gerando..." : "📄 PDF"}
        </button>

        {/* Cabeçalho da Empresa */}
        <h3 className="text-center mb-1 mt-5 text-base font-bold leading-tight">
          {empresa.nome_fantasia || empresa.razao_social}
        </h3>
        <p className="text-xs text-center mb-3 leading-relaxed text-gray-800">
          CNPJ: {empresa.cnpj} | IE: {empresa.inscricao_estadual}
        </p>
        <p className="text-xs text-center leading-relaxed text-gray-800">
          Endereço: {empresa.endereco}, {empresa.cidade}/{empresa.estado}
        </p>
        <p className="text-xs text-center mb-4 leading-relaxed text-gray-800">
          Telefone: {empresa.telefone}
        </p>

        {/* Detalhes da Venda */}
        <div className="border-y border-black py-3 mb-4">
          <p className="text-sm font-semibold mb-1">
            COMPROVANTE - VENDA ID: {venda.id_venda}
          </p>
          <p className="text-sm">
            Data: {new Date(venda.data_hora).toLocaleString("pt-BR")}
          </p>
        </div>

        {/* Tabela de Itens */}
        <table className="w-full text-xs mb-4">
          <thead>
            <tr>
              <th className="text-left pb-2 font-semibold w-1/2">Item</th>
              <th className="text-center pb-2 font-semibold">Qtd. x Preço</th>
              <th className="text-right pb-2 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {venda.itens?.map((item, index) => (
              <tr key={index} className="align-top">
                <td className="text-left py-1 pr-2 leading-tight">
                  {item.descricao_item || 'N/D'} <br/> 
                  <span className="text-[10px] text-gray-500 tracking-tighter">({item.categoria || "Item"})</span>
                </td>
                <td className="text-center py-1 whitespace-nowrap">
                  {item.quantidade} x {formatarMoeda(item.preco_unitario)}
                </td>
                <td className="text-right py-1 whitespace-nowrap">
                  {formatarMoeda(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Área de Totais e Pagamento */}
        <div className="border-t border-black pt-3">
          <p className="font-bold text-base flex justify-between mb-2">
            <span>TOTAL BRUTO:</span>
            <span>R$ {formatarMoeda(venda.valor_total_bruto)}</span>
          </p>
          
          {venda.pagamentos?.map((pag, index) => (
            <p key={index} className="text-sm flex justify-between mb-1 text-gray-800">
              <span>{pag.metodo}:</span>
              <span>R$ {formatarMoeda(pag.valor_pago)}</span>
            </p>
          ))}
          
          <p className="text-sm flex justify-between font-bold mt-2 pt-2 border-t border-dashed border-gray-400">
            <span>TROCO:</span>
            <span>R$ {formatarMoeda(venda.valor_troco)}</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default CupomVisualizacao;