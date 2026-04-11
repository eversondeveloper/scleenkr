import { useEffect } from "react"; 

export const useAtalhos = ({
  podeFinalizarVenda,
  finalizarVenda, 
  cancelarVenda,
  produtosSelecionados,
  removerProduto,
  limparFiltros,
  alternarMetodoPagamento,
  inputFiltroBuscaRef,
}) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      const elementoAtivo = document.activeElement;
      const ehInput = elementoAtivo.tagName === "INPUT" || elementoAtivo.tagName === "TEXTAREA";

      if (event.key === "F2") {
        event.preventDefault();
        alternarMetodoPagamento?.();
        return; 
      }

      if (event.key === "Enter") {
        if (podeFinalizarVenda) {
          event.preventDefault();
          finalizarVenda();
          return;
        }

        if (elementoAtivo === inputFiltroBuscaRef.current && produtosSelecionados.length > 0) {
            event.preventDefault();
            const alvo = document.querySelector(".valorrecebido") || document.querySelector(".input-misto-valor");
            if (alvo) {
                alvo.focus();
                alvo.select();
            }
            return;
        }

        if (elementoAtivo.className && typeof elementoAtivo.className === 'string' && elementoAtivo.className.includes("input-quantidade-campo")) {
          return;
        }

        if (elementoAtivo.className && typeof elementoAtivo.className === 'string' && (elementoAtivo.className.includes("input-misto-valor") || elementoAtivo.className.includes("valorrecebido"))) {
          return;
        }

        if (!ehInput && podeFinalizarVenda) {
            event.preventDefault();
            finalizarVenda();
            return;
        }
      }

      if (event.key === "Escape") {
        event.preventDefault();
        if (produtosSelecionados.length > 0) {
            cancelarVenda();
        } else {
            limparFiltros();
            inputFiltroBuscaRef.current?.focus();
        }
      }

      if (event.key === " " && !ehInput) {
        event.preventDefault();
        inputFiltroBuscaRef.current?.focus();
      }
      
      if ((event.key === "Delete" || event.key === "Backspace") && !ehInput && produtosSelecionados.length > 0) {
          event.preventDefault();
          const ultimoItem = produtosSelecionados[produtosSelecionados.length - 1];
          removerProduto(ultimoItem.idUnico);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
    
  }, [podeFinalizarVenda, finalizarVenda, cancelarVenda, produtosSelecionados, removerProduto, limparFiltros, alternarMetodoPagamento, inputFiltroBuscaRef]);
};