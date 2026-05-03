import React from 'react';
import { useCupom } from "./hooks/useCupom";
import ControlesSelecao from "./components/ControlesSelecao";
import CupomVisualizacao from "./components/CupomVisualizacao";

export const GerarCupom = () => {
  const {
    empresas,
    vendas,
    vendaSelecionada,
    empresaSelecionada,
    detalhesVenda,
    carregando,
    erro,
    gerandoPDF,
    
    // Funções do hook
    formatarMoeda,
    handleVendaChange,
    gerarPDFCupom
  } = useCupom();

  // --- ESTADO DE CARREGAMENTO ---
  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center w-[98%] h-[calc(100vh-120px)] mt-24 mb-5 mx-auto bg-card rounded-xl shadow-2xl border border-border text-foreground">
        <h1 className="text-muted-foreground animate-pulse text-2xl font-light">
          Carregando dados...
        </h1>
      </div>
    );
  }

  // --- ESTADO DE ERRO ---
  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center w-[98%] h-[calc(100vh-120px)] mt-24 mb-5 mx-auto bg-card rounded-xl shadow-2xl border border-border text-foreground">
        <h1 className="text-destructive text-2xl font-light text-center px-4">
          {erro}
        </h1>
      </div>
    );
  }

  // --- RENDERIZAÇÃO PRINCIPAL ---
  return (
    <div className="flex flex-col w-full h-full gap-5">
      
      <div className="w-full text-center mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-light text-foreground m-0">
          Geração de Comprovante
        </h1>
      </div>

      <ControlesSelecao
        empresas={empresas}
        empresaSelecionada={empresaSelecionada}
        vendas={vendas}
        vendaSelecionada={vendaSelecionada}
        handleVendaChange={handleVendaChange}
        formatarMoeda={formatarMoeda}
      />

      <CupomVisualizacao
        empresaSelecionada={empresaSelecionada}
        detalhesVenda={detalhesVenda}
        formatarMoeda={formatarMoeda}
        gerarPDFCupom={gerarPDFCupom}
        gerandoPDF={gerandoPDF}
      />
      
    </div>
  );
};