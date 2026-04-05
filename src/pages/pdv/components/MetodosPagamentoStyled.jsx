import styled from "styled-components";

export const MetodosPagamentoStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  /* --- GRADE DE BOTÕES (TOPO) --- */
  .grade-metodos-pagamento-topo {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    width: 100%;
    flex-shrink: 0;
  }

  .botao-metodo-moderno {
    height: 55px;
    background: #1a1a1a;
    border: 1px solid #282828;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #666;

    .icone-metodo-img { width: 18px; height: 18px; opacity: 0.4; filter: grayscale(1); }
    strong { font-size: 8px; letter-spacing: 0.5px; }

    &:hover { background: #222; border-color: #444; }

    &.ativo {
      background: #646cff;
      border-color: #646cff;
      color: white;
      box-shadow: 0 4px 12px rgba(100, 108, 255, 0.2);
      .icone-metodo-img { opacity: 1; filter: grayscale(0) brightness(2); }
    }
  }

  /* --- PAINEL DE CONFIGURAÇÃO --- */
  .painel-configuracao-pagamento {
    flex: 1;
    background: #121212;
    border: 1px solid #222;
    border-radius: 16px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* --- LAYOUTS HORIZONTAIS --- */
  .layout-dinheiro-horizontal,
  .layout-misto-horizontal {
    display: flex;
    flex-wrap: wrap; 
    gap: 20px;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
  }

  .coluna-input-principal,
  .coluna-lista-mista {
    flex: 1;
    min-width: 250px;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .label-moderna { 
    font-size: 10px; 
    color: #4caf50; 
    font-weight: 800; 
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  /* --- SELETOR PADRONIZADO (MÁSCARA MONETÁRIA) --- */
  .seletor-valor-pill {
    display: flex;
    align-items: center;
    background: #0a0a0a;
    border-radius: 20px;
    border: 1px solid #222;
    padding: 2px;
    height: 50px;

    button { 
      background: transparent;
      border: none;
      color: #4caf50;
      font-weight: bold;
      cursor: pointer;
      width: 45px;
      height: 100%;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover { color: #64ff8a; }
      &:active { transform: scale(0.9); }
    }

    input { 
      flex: 1; 
      width: 100%;
      background: transparent !important; 
      border: none !important; 
      color: #fff !important;
      text-align: center; 
      font-size: 18px; 
      font-weight: 700; 
      outline: none; 
    }
  }

  .seletor-valor-pill.pequeno {
    height: 36px;
    max-width: 130px;
    button { width: 30px; font-size: 16px; }
    input { font-size: 13px; }
  }

  /* --- MISTO - BOTÃO ADICIONAR (RESTAURADO) --- */
  .cabecalho-misto-moderno { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 10px; 
    h4 { color: #888; font-size: 11px; margin: 0; font-weight: 800; } 
  }
  
  .btn-adicionar-metodo-misto { 
    background: #4caf50 !important; 
    color: #000 !important; 
    border: none !important; 
    padding: 6px 12px !important; 
    border-radius: 8px !important; 
    font-size: 10px !important; 
    font-weight: 900 !important; 
    cursor: pointer !important;
    text-transform: uppercase;
    transition: background 0.2s;
    &:hover { background: #64ff8a !important; }
    &:active { transform: scale(0.95); }
  }

  /* --- LISTA E CARDS MISTOS --- */
  .lista-itens-mistos {
    display: flex; 
    flex-direction: column; 
    gap: 8px;
  }

  .item-misto-card {
    background: #1a1a1a; 
    border-radius: 12px; 
    padding: 10px; 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    border: 1px solid #282828;

    .select-moderno { 
      flex: 1; 
      background: #121212; 
      border: 1px solid #333; 
      color: #fff; 
      padding: 8px; 
      border-radius: 10px; 
      font-size: 11px;
      outline: none;
      &:focus { border-color: #4caf50; }
    }
  }

  .btn-remover-misto { 
    background: transparent; border: none; color: #444; cursor: pointer; font-size: 16px;
    &:hover { color: #ff5252; }
  }

  /* --- COLUNA DE VALORES RÁPIDOS --- */
  .coluna-cedulas-rapidas {
    flex: 1;
    min-width: 220px;
    max-width: 300px;
    background: #181818;
    padding: 12px;
    border-radius: 14px;
    border: 1px solid #282828;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .grade-cedulas {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
    gap: 6px;
  }

  .btn-cedula-rapida {
    height: 38px;
    background: #1a1a1a;
    border: 1px solid #252525;
    border-radius: 8px;
    color: #888;
    font-weight: 800;
    font-size: 10px;
    cursor: pointer;
    &:hover { background: #333; border-color: #4caf50; color: #64ff8a; }
    &.limpar {
      grid-column: 1 / -1;
      background: #2a1a1a;
      color: #ff5252;
      border-color: #4a2121;
      &:hover { background: #ff5252; color: #fff; }
    }
  }

  .acoes-sugestao-container {
    display: flex;
    gap: 8px;
    margin-top: 5px;
    .btn-sugestao {
      flex: 1; height: 40px; border-radius: 10px; border: none; font-weight: 800; font-size: 10px; cursor: pointer;
      &.exato { background: #1b5e20; color: #64ff8a; }
      &.arredondar { background: #0d47a1; color: #64b5f6; }
    }
  }

  .resumo-misto-moderno {
    padding-top: 12px; 
    border-top: 1px solid #222;
    margin-top: 10px;
    .linha-resumo-mista { 
      display: flex; 
      justify-content: space-between; 
      font-size: 12px; 
      color: #888; 
      margin-bottom: 5px;
      strong { color: #fff; }
    }
  }

  .status-metodo-simples {
    text-align: center; margin: auto;
    p { color: #888; font-size: 13px; }
    h2 { font-size: 32px; font-weight: 800; color: #fff; }
  }
`;