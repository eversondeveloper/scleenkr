import React from 'react';

// Função auxiliar para calcular duração da sessão
const calcularDuracaoSessao = (dataAbertura) => {
  const agora = new Date();
  const abertura = new Date(dataAbertura);
  const diferenca = agora - abertura;
  
  const horas = Math.floor(diferenca / (1000 * 60 * 60));
  const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
  
  if (horas > 0) {
    return `${horas}h ${minutos}m`;
  } else {
    return `${minutos}m`;
  }
};

export const SecaoAcoesAtendentes = ({
  onNovoAtendente,
  onAbrirSessao,
  onFecharSessao,
  sessaoAtual,
  totalAtendentes
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        {/* Informações e Estatísticas */}
        <div className="flex flex-col">
          <h3 className="m-0 mb-3 text-foreground text-lg font-medium">
            📊 Resumo
          </h3>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Total de atendentes:</span>
              <span className="bg-info text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                  {totalAtendentes}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Sessão atual:</span>
              {sessaoAtual ? (
                <span className="bg-success text-black px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                  🔵 Aberta - {sessaoAtual.nome_atendente}
                </span>
              ) : (
                <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                  🔴 Fechada
                </span>
              )}
            </div>

            {sessaoAtual && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Aberta desde:</span>
                <span className="font-medium text-foreground text-[13px]">
                  {new Date(sessaoAtual.data_abertura).toLocaleString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={onNovoAtendente}
            title="Cadastrar novo atendente"
            className="flex-1 md:flex-none min-w-[140px] px-4 py-2.5 bg-primary text-primary-foreground border-none rounded-md font-medium cursor-pointer shadow-sm hover:brightness-110 active:scale-95 transition-all text-sm"
          >
            👤 Novo Atendente
          </button>

          {!sessaoAtual && (
            <button
              onClick={onAbrirSessao}
              title="Abrir nova sessão de caixa"
              className="flex-1 md:flex-none min-w-[140px] px-4 py-2.5 bg-success text-black border-none rounded-md font-bold cursor-pointer shadow-sm hover:brightness-110 active:scale-95 transition-all text-sm"
            >
              💰 Abrir Sessão
            </button>
          )}

          {sessaoAtual && (
            <button
              onClick={onFecharSessao}
              title="Fechar sessão de caixa atual"
              className="flex-1 md:flex-none min-w-[140px] px-4 py-2.5 bg-destructive text-destructive-foreground border-none rounded-md font-medium cursor-pointer shadow-sm hover:brightness-110 active:scale-95 transition-all text-sm"
            >
              🔒 Fechar Sessão
            </button>
          )}
        </div>
      </div>

      {/* Informações Adicionais da Sessão */}
      {sessaoAtual && (
        <div className="bg-success/10 border border-success p-4 rounded-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex flex-col">
              <strong className="text-foreground text-sm font-medium mb-1.5">
                  💰 Sessão em Andamento
              </strong>
              <div className="text-success text-[13px] flex flex-wrap gap-x-5 gap-y-1">
                <span><strong className="font-medium">Atendente:</strong> {sessaoAtual.nome_atendente}</span>
                <span><strong className="font-medium">Valor Inicial:</strong> R$ {parseFloat(sessaoAtual.valor_inicial || 0).toFixed(2)}</span>
                <span><strong className="font-medium">Duração:</strong> {calcularDuracaoSessao(sessaoAtual.data_abertura)}</span>
              </div>
            </div>
            
            <button
              onClick={onFecharSessao}
              className="bg-destructive text-destructive-foreground border-none px-3 py-1.5 rounded text-xs font-medium cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-sm shrink-0"
            >
              🔒 Finalizar Sessão
            </button>
          </div>
        </div>
      )}

      {/* Aviso quando não há sessão */}
      {!sessaoAtual && (
        <div className="bg-warning/10 border border-warning p-4 rounded-md flex items-center gap-3">
          <span className="text-warning text-xl">⚠️</span>
          <div className="flex flex-col">
            <strong className="text-foreground text-sm font-medium mb-0.5">
                Nenhuma sessão de caixa aberta
            </strong>
            <div className="text-warning text-[13px]">
              Para registrar vendas, é necessário abrir uma sessão de caixa
            </div>
          </div>
        </div>
      )}
    </div>
  );
};