import React from 'react';

export const TabelaVendasComponent = ({
  vendasFiltradas,
  quantidadeVendas,
  totalVendasBruto,
  onDeletarVenda,
  onEditarVenda,
}) => {
    
  const formatarDataHora = (dataString) => {
      if (!dataString) return '-';
      try {
          const data = new Date(dataString);
          return data.toLocaleString("pt-BR", {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
          });
      } catch (error) {
          return 'Data Inválida';
      }
  };

  const formatarIdentificacaoAtendente = (nome, cpf) => {
    if (!nome) return "Sistema";
    const primeiroNome = nome.split(' ')[0].toUpperCase();
    if (!cpf) return primeiroNome;

    const cpfLimpo = cpf.replace(/\D/g, '');
    const cpfFormatado = cpfLimpo.length === 11 
      ? `${cpfLimpo.substring(0, 3)}...${cpfLimpo.substring(9, 11)}` 
      : cpf;

    return `${primeiroNome} (${cpfFormatado})`;
  };

  return (
    <div className="mt-10 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="m-0 text-foreground text-xl font-semibold">
          Vendas Realizadas ({quantidadeVendas})
        </h2>
        <div className="text-lg font-bold text-success bg-secondary px-4 py-2 rounded-md border border-border shadow-sm">
          Total Bruto: R$ {totalVendasBruto.toFixed(2).replace(".", ",")}
        </div>
      </div>

      {vendasFiltradas.length === 0 ? (
        <p className="text-center p-5 text-muted-foreground bg-card rounded-lg border border-border">
          Nenhuma venda encontrada para o filtro aplicado.
        </p>
      ) : (
        <div className="w-full overflow-x-auto bg-card rounded-xl border border-border shadow-sm">
          <table className="w-full text-sm text-left text-foreground border-collapse">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium w-[100px]">ID / STATUS</th>
                <th className="px-4 py-3 font-medium">Data/Hora</th>
                <th className="px-4 py-3 font-medium">Atendente (CPF)</th>
                <th className="px-4 py-3 font-medium min-w-[250px]">Detalhamento da Transação</th>
                <th className="px-4 py-3 font-medium text-center w-[180px]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.map((venda, index) => (
                <tr 
                  key={venda.id_venda} 
                  className={`border-b border-border transition-colors hover:bg-muted/50 ${index % 2 === 0 ? 'bg-background' : 'bg-card'}`}
                >
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs font-mono">#{venda.id_venda}</span>
                      {venda.editada && (
                        <span className="text-[9px] bg-warning text-warning-foreground px-1.5 py-0.5 rounded font-bold text-center w-fit tracking-wider">
                          EDITADA
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 align-middle whitespace-nowrap text-muted-foreground">
                    {formatarDataHora(venda.data_venda || venda.data_cadastro || venda.data_hora)}
                  </td>
                  
                  <td className="px-4 py-4 align-middle font-semibold text-primary text-[13px]">
                    {formatarIdentificacaoAtendente(venda.nome_atendente, venda.cpf_atendente || venda.cpf)}
                  </td>
                  
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-col gap-2 min-w-[240px]">
                      
                      {/* CONTEÚDO DA VENDA */}
                      {venda.itens && venda.itens.length > 0 && (
                        <div className="bg-black/20 dark:bg-black/40 p-2 rounded border border-border">
                          <span className="text-[10px] text-muted-foreground font-bold block mb-1 tracking-widest uppercase">CONTEÚDO DA VENDA</span>
                          {venda.itens.map((item, iIdx) => {
                            const nomeExibir = (item.descricao_item || "PRODUTO DESCONHECIDO").toString().toUpperCase();
                            return (
                              <div key={iIdx} className={`flex justify-between text-xs py-1 ${iIdx !== venda.itens.length - 1 ? 'border-b border-border/50' : ''}`}>
                                <span className="text-foreground/80 wrap-break-word pr-2">
                                  <strong className="text-success mr-1.5">{item.quantidade}x</strong> 
                                  {nomeExibir}
                                </span>
                                <span className="text-muted-foreground whitespace-nowrap">R$ {parseFloat(item.subtotal || 0).toFixed(2).replace(".", ",")}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* MÉTODOS DE PAGAMENTO */}
                      <div className="flex flex-col gap-1">
                        {venda.pagamentos && Array.isArray(venda.pagamentos) && venda.pagamentos.map((p, idx) => (
                          <div key={idx} className="flex flex-col bg-accent/30 p-1.5 rounded border-l-2 border-primary">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{p.metodo}:</span>
                              <span className="text-foreground font-bold">
                                R$ {parseFloat(p.valor_pago || 0).toFixed(2).replace(".", ",")}
                              </span>
                            </div>
                            {p.referencia_metodo && (
                              <span className="text-[10px] text-muted-foreground/70 italic mt-0.5">
                                Ref: {p.referencia_metodo}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* RESUMO CONSOLIDADO */}
                      <div className="mt-1 p-2 border border-success/20 rounded-md bg-success/5">
                        <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                          <span>Itens: <strong className="text-foreground/80">{venda.quantidade_itens || 0}</strong></span>
                          <span>Soma Bruta: R$ {parseFloat(venda.valor_pago_total || 0).toFixed(2).replace(".", ",")}</span>
                        </div>
                        
                        {parseFloat(venda.valor_troco) > 0 && (
                          <div className="flex justify-between text-warning text-[11px] mb-1">
                            <span>Troco Devolvido:</span>
                            <span>- R$ {parseFloat(venda.valor_troco).toFixed(2).replace(".", ",")}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-success border-t border-success/20 mt-1 pt-1.5 text-sm font-bold">
                          <span>VALOR FINAL:</span>
                          <span>R$ {parseFloat(venda.valor_total_bruto || 0).toFixed(2).replace(".", ",")}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onEditarVenda(venda)}
                        className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDeletarVenda(venda.id_venda)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-sm"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};