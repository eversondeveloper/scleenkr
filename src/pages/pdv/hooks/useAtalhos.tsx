// src/pages/pdv/hooks/useAtalhos.ts
import { useEffect } from 'react';

// ---------------------------------------------------------
// Tipos
// ---------------------------------------------------------
interface ProdutoSelecionado {
  idUnico: string | number;
  // outras propriedades não são necessárias aqui
}

interface UseAtalhosProps {
  podeFinalizarVenda: boolean;
  finalizarVenda: () => void;
  cancelarVenda: () => void;
  produtosSelecionados: ProdutoSelecionado[];
  removerProduto: (idUnico: string | number) => void;
  limparFiltros: () => void;
  alternarMetodoPagamento?: () => void;
  inputFiltroBuscaRef: React.RefObject<HTMLInputElement>;
  setMetodoPagamento: (metodo: string) => void;
  inputValorRecebidoRef?: React.RefObject<HTMLInputElement>;
}

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------
export function useAtalhos({
  podeFinalizarVenda,
  finalizarVenda,
  cancelarVenda,
  produtosSelecionados,
  removerProduto,
  limparFiltros,
  alternarMetodoPagamento,
  inputFiltroBuscaRef,
}: UseAtalhosProps): void {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const elementoAtivo = document.activeElement;
      const ehInput =
        elementoAtivo?.tagName === 'INPUT' || elementoAtivo?.tagName === 'TEXTAREA';

      // F2 – alternar método de pagamento
      if (event.key === 'F2') {
        event.preventDefault();
        alternarMetodoPagamento?.();
        return;
      }

      // ENTER
      if (event.key === 'Enter') {
        // Se pode finalizar, prioriza finalização
        if (podeFinalizarVenda) {
          event.preventDefault();
          finalizarVenda();
          return;
        }

        // Se o foco está no campo de busca e há produtos selecionados
        if (
          elementoAtivo === inputFiltroBuscaRef.current &&
          produtosSelecionados.length > 0
        ) {
          event.preventDefault();
          const alvo: HTMLElement | null = document.querySelector(
            '.valorrecebido, .input-misto-valor'
          );
          if (alvo) {
            (alvo as HTMLInputElement).focus();
            (alvo as HTMLInputElement).select();
          }
          return;
        }

        // Se o foco está em um input de quantidade, não faz nada
        if (
          elementoAtivo?.className &&
          typeof elementoAtivo.className === 'string' &&
          (elementoAtivo.className.includes('input-quantidade-campo') ||
            elementoAtivo.className.includes('input-misto-valor') ||
            elementoAtivo.className.includes('valorrecebido'))
        ) {
          return;
        }

        // Se não é input e pode finalizar, finaliza
        if (!ehInput && podeFinalizarVenda) {
          event.preventDefault();
          finalizarVenda();
          return;
        }
      }

      // ESC – cancelar venda ou limpar filtros
      if (event.key === 'Escape') {
        event.preventDefault();
        if (produtosSelecionados.length > 0) {
          cancelarVenda();
        } else {
          limparFiltros();
          inputFiltroBuscaRef.current?.focus();
        }
      }

      // Espaço – focar no campo de busca (se não for input)
      if (event.key === ' ' && !ehInput) {
        event.preventDefault();
        inputFiltroBuscaRef.current?.focus();
      }

      // Delete / Backspace – remover último produto (se não for input e houver itens)
      if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        !ehInput &&
        produtosSelecionados.length > 0
      ) {
        event.preventDefault();
        const ultimoItem = produtosSelecionados[produtosSelecionados.length - 1];
        removerProduto(ultimoItem.idUnico);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [
    podeFinalizarVenda,
    finalizarVenda,
    cancelarVenda,
    produtosSelecionados,
    removerProduto,
    limparFiltros,
    alternarMetodoPagamento,
    inputFiltroBuscaRef,
  ]);
}