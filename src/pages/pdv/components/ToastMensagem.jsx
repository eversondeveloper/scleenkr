import { useEffect, useState } from "react";
import { ToastMensagemStyled } from "./ToastMensagemStyled";
import { useNavigate } from "react-router-dom";

const ToastMensagem = ({ mensagem, onClose }) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (mensagem) {
      const startTimer = setTimeout(() => setVisible(true), 10);
      
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onClose(), 400); 
      }, 4500); 

      return () => {
        clearTimeout(startTimer);
        clearTimeout(timer);
      };
    }
  }, [mensagem, onClose]);

  if (!mensagem) return null;

  const getTipoToast = () => {
    if (mensagem.includes("❌")) return "erro";
    if (mensagem.includes("⚠️")) return "aviso";
    if (mensagem.includes("✅")) return "sucesso";
    return "info";
  };

  const getIcone = () => {
    if (mensagem.includes("❌")) return "✕";
    if (mensagem.includes("⚠️")) return "!";
    if (mensagem.includes("✅")) return "✓";
    return "i";
  };

  const ehVendaSucesso = mensagem.includes("Venda registrada");

  const handleNavegacao = () => {
    if (ehVendaSucesso) {
      setVisible(false); 
      setTimeout(() => {
        navigate("/scleenkr/relatorios"); 
        onClose();
      }, 200);
    }
  };

  const textoFormatado = mensagem.replace(/✅|❌|⚠️|ℹ️/g, "").trim();

  return (
    <ToastMensagemStyled 
      className={`toast-${getTipoToast()} ${visible ? "visible" : ""} ${ehVendaSucesso ? "clicavel" : ""}`}
      onClick={handleNavegacao}
      title={ehVendaSucesso ? "Clique para ver nos relatórios" : ""}
      style={{ cursor: ehVendaSucesso ? "pointer" : "default" }}
    >
      <div className="toast-corpo">
        <div className="toast-icone-wrapper">
          {getIcone()}
        </div>
        <div className="toast-texto">
          <label>{getTipoToast().toUpperCase()}</label>
          <span>{textoFormatado}</span>
          {ehVendaSucesso && (
            <small style={{ 
              display: 'block', 
              fontSize: '11px', 
              marginTop: '5px', 
              color: '#fff',
              textDecoration: 'underline',
              opacity: 0.9 
            }}>
              Ver detalhes no relatório →
            </small>
          )}
        </div>
        <button className="btn-fechar-toast" onClick={(e) => {
          e.stopPropagation(); 
          setVisible(false);
          setTimeout(() => onClose(), 400);
        }}>
          ✕
        </button>
      </div>
      <div className="barra-progresso" />
    </ToastMensagemStyled>
  );
};

export default ToastMensagem;