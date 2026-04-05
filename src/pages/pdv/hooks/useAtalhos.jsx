/* eslint-disable react-hooks/exhaustive-deps */
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

      // F2: Alterna método de pagamento e já foca no valor
      if (event.key === "F2") {
        event.preventDefault();
        alternarMetodoPagamento?.();
        // O Hook useVendas já cuidará do foco automático via useEffect
        return; 
      }

      // ENTER: A tecla mestre de fluxo
      if (event.key === "Enter") {
        // 1. Se estiver na Busca de Produtos e o carrinho não estiver vazio, pula para o pagamento
        if (elementoAtivo === inputFiltroBuscaRef.current && produtosSelecionados.length > 0) {
            event.preventDefault();
            const inputDinheiro = document.querySelector(".valorrecebido");
            const primeiroMisto = document.querySelector(".input-misto-valor");
            const alvo = inputDinheiro || primeiroMisto;
            if (alvo) {
                alvo.focus();
                alvo.select();
            }
            return;
        }

        // 2. Se estiver editando Quantidade -> Pula para o Valor do Pagamento
        if (elementoAtivo.className.includes("input-quantidade-campo")) {
          event.preventDefault();
          const inputDinheiro = document.querySelector(".valorrecebido");
          const primeiroMisto = document.querySelector(".input-misto-valor");
          const alvo = inputDinheiro || primeiroMisto;
          if (alvo) {
            alvo.focus();
            alvo.select();
          }
          return;
        }

        // 3. Navegação em Pagamento Misto
        if (elementoAtivo.className.includes("input-misto-valor")) {
          event.preventDefault();
          const todosInputsMistos = Array.from(document.querySelectorAll(".input-misto-valor"));
          const indexAtual = todosInputsMistos.indexOf(elementoAtivo);

          if (indexAtual !== -1 && indexAtual < todosInputsMistos.length - 1) {
            const proximo = todosInputsMistos[indexAtual + 1];
            proximo.focus();
            proximo.select(); 
            return;
          } 
          
          if (indexAtual === todosInputsMistos.length - 1) {
            if (podeFinalizarVenda) {
              finalizarVenda();
            } else {
              // Loop para o primeiro caso o valor ainda não bata
              todosInputsMistos[0].focus();
              todosInputsMistos[0].select();
            }
            return;
          }
        }

        // 4. Pagamento em Dinheiro Único -> Finaliza ou Seleciona para corrigir
        if (elementoAtivo.className.includes("valorrecebido")) {
          event.preventDefault();
          if (podeFinalizarVenda) {
            finalizarVenda();     
          } else {
            elementoAtivo.select();
          }
          return;
        }

        // 5. Se não estiver em input nenhum mas puder finalizar, finaliza
        if (!ehInput && podeFinalizarVenda) {
            event.preventDefault();
            finalizarVenda();
            return;
        }
      }

      // ESCAPE: Cancela ou Limpa
      if (event.key === "Escape") {
        event.preventDefault();
        if (produtosSelecionados.length > 0) {
            cancelarVenda();
        } else {
            limparFiltros();
            inputFiltroBuscaRef.current?.focus();
        }
      }

      // ESPAÇO: Atalho rápido para voltar à busca
      if (event.key === " " && !ehInput) {
        event.preventDefault();
        inputFiltroBuscaRef.current?.focus();
      }
      
      // DELETE/BACKSPACE: Remove o último item se não estiver digitando
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