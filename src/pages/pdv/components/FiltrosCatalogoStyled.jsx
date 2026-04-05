import styled from "styled-components";

export const FiltrosCatalogoStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #121212;
  border: 1px solid #222;
  border-radius: 12px;
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  flex-shrink: 0 !important;
  margin: 0 0 20px 0 !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  contain: layout style paint;

  &.container-filtros-pdv.recolhido {
    height: 48px !important;
    min-height: 48px !important;
    max-height: 48px !important;
    overflow: hidden !important;
    transition: none !important;
  }

  &.container-filtros-pdv.expandido {
    height: auto !important;
    min-height: 48px !important;
    max-height: 800px !important;
    border-color: #333;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;

    .conteudo-filtros-animado {
      max-height: 700px !important;
      padding: 20px !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }
  }

  .cabecalho-filtros {
    padding: 0 18px !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    background-color: #1a1a1a !important;
    height: 48px !important;
    min-height: 48px !important;
    max-height: 48px !important;
    box-sizing: border-box !important;
    flex-shrink: 0 !important;
    position: relative !important;
    z-index: 10 !important;
    transition: none !important;
  }

  .conteudo-filtros-animado {
    padding: 0 18px !important;
    max-height: 0 !important;
    opacity: 0 !important;
    transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.3s ease 0.1s, padding 0s linear 0.4s !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 20px !important;
    pointer-events: none !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }

  &.container-filtros-pdv.expandido .conteudo-filtros-animado {
    transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease,
      padding 0s linear !important;
  }

  .titulo-wrapper {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    transition: none !important;
  }

  .titulo-filtros {
    color: #888 !important;
    font-size: 12px !important;
    font-weight: 800 !important;
    margin: 0 !important;
    letter-spacing: 1.2px !important;
    text-transform: uppercase !important;
    flex-shrink: 0 !important;
    transition: none !important;
  }

  .badge-status {
    font-size: 10px !important;
    font-weight: 800 !important;
    color: #4caf50 !important;
    background: rgba(76, 175, 80, 0.12) !important;
    padding: 3px 10px !important;
    border-radius: 6px !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    position: relative !important;
    display: inline-block !important;
    opacity: 1 !important;
    visibility: visible !important;
    transition: none !important;
  }

  /* --- AJUSTE NO CONTAINER DA BUSCA --- */
  .grupo-busca-principal {
    position: relative !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
  }

  .input-filtro-busca {
    width: 100% !important;
    background-color: #1a1a1a !important;
    border: 1px solid #333 !important;
    padding: 12px 40px 12px 16px !important; /* Aumentado padding direita para o botão */
    border-radius: 10px !important;
    color: #fff !important;
    font-size: 14px !important;
    box-sizing: border-box !important;
    outline: none !important;
    margin-top: 4px !important;
    transition: border-color 0.15s ease, box-shadow 0.15s ease !important;

    &:focus {
      border-color: #646cff !important;
      box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.1) !important;
    }
  }

  /* --- AJUSTE NO BOTÃO DE LIMPAR (X) --- */
  .btn-limpar-input-interno {
    position: absolute !important;
    right: 12px !important;
    top: calc(50% + 2px) !important; /* Ajustado para compensar o margin-top do input */
    transform: translateY(-50%) !important;
    background: #333 !important;
    border: none !important;
    color: #fff !important;
    width: 20px !important;
    height: 20px !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 10px !important;
    cursor: pointer !important;
    padding: 0 !important;
    z-index: 5 !important;

    &:hover {
      background: #ff5252 !important;
    }
  }

  .secao-filtros-botoes {
    display: flex !important;
    flex-direction: column !important;
    gap: 18px !important;
    transition: none !important;
  }

  .bloco-filtro {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    transition: none !important;
  }

  .label-filtros {
    color: #666 !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    letter-spacing: 1px !important;
    text-transform: uppercase !important;
    margin: 0 !important;
    transition: none !important;
  }

  .lista-pills {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
    transition: none !important;
  }

  .pill-filtro {
    padding: 6px 14px !important;
    background-color: #1a1a1a !important;
    border: 1px solid #282828 !important;
    border-radius: 24px !important;
    color: #888 !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
    flex-shrink: 0 !important;

    &:hover {
      border-color: #444 !important;
      transform: translateY(-1px) !important;
    }

    &.ativo {
      background-color: #4caf50 !important;
      border-color: #4caf50 !important;
      color: #000 !important;
      font-weight: 800 !important;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2) !important;
    }
  }

  .btn-limpar-filtros-moderno {
    background: transparent !important;
    border: 1px dashed #444 !important;
    color: #666 !important;
    padding: 10px 16px !important;
    border-radius: 8px !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    flex-shrink: 0 !important;
    margin-top: 8px !important;
    transition: all 0.15s ease !important;

    &:hover {
      color: #ff5252 !important;
      border-color: #ff5252 !important;
      background: rgba(255, 82, 82, 0.05) !important;
      transform: translateY(-1px) !important;
    }
  }

  .seta-expansao {
    font-size: 12px !important;
    color: #888 !important;
    flex-shrink: 0 !important;
    opacity: 1 !important;
    visibility: visible !important;
    transition: none !important;
  }

  .icone-busca {
    font-size: 14px !important;
    opacity: 0.7 !important;
    transition: none !important;
  }

  &.container-filtros-pdv {
    transform: translateZ(0) !important;
    backface-visibility: hidden !important;
    perspective: 1000px !important;
    will-change: max-height !important;
    isolation: isolate !important;
  }

  &.container-filtros-pdv.recolhido,
  &.container-filtros-pdv.expandido {
    opacity: 1 !important;
    visibility: visible !important;
  }
`;