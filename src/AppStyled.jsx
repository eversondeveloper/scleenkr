import styled, { keyframes } from "styled-components";

const fadeInSlide = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const AppStyled = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #121212;

  header {
    width: 100%;
    height: 6%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a1a1a;
    border-bottom: 1px solid #333;
    z-index: 1000;
  }

  .logomenu {
    width: 98%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logodiv{
    height: 80%;
    width: 130px;
  }

  .logo {
    font-size: 18px;
    font-weight: bold;
    text-decoration: none;
    color: #ff9500;
  }

  .nomeempresa {
    display: flex;
    align-items: center;
    gap: 10px; /* Espaço entre empresa e atendente */

    .nome-empresa-texto {
      color: #bacbd9;
      font-size: 13px;
      padding: 4px 12px;
      background: #252525;
      border-radius: 4px;
      border: 1px solid #333;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .nome-atendente-header {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #888;
      font-size: 13px;
      
      span {
        font-weight: 300;
      }

      strong {
        color: #64ff8a; /* Verde suave para destacar o operador */
        font-weight: 600;
        text-transform: capitalize;
      }
    }
  }

  .menu-flutuante {
    position: relative;
    display: flex;
    align-items: center;
    &.ativo .menuButton { color: #ff9500; }
  }

  .menuButton {
    font-size: 24px;
    color: #bacbd9;
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px 10px;
    transition: color 0.3s;
    &:hover { color: #ff9500; }
  }

  .menuItems {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #1a1a1a;
    border: 1px solid #3b3b3b;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    padding: 10px;
    min-width: 200px;
    list-style: none;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    gap: 5px;

    &.oculto { display: none; }
    &.visivel { 
      display: flex; 
      animation: ${fadeInSlide} 0.2s ease-out;
    }
  }

  .menuItems li {
    width: 100%;
  }

  .btns {
    display: block;
    width: 100%;
    text-decoration: none;
    background-color: #2a2a2a;
    color: #bacbd9;
    border: 1px solid #3b3b3b;
    border-radius: 6px;
    padding: 10px 15px;
    font-size: 14px;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      background-color: #3b3b3b;
      color: #ff9500;
      border-color: #ff9500;
    }

    &:active {
      transform: translateY(1px);
    }
  }

  main {
    width: 100vw;
    height: 88%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  footer {
    width: 100%;
    height: 6%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a1a1a;
    border-top: 1px solid #333;
  }

  .footer {
    color: #bacbd9;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    width: 98%;
    align-items: center;
  }
`;