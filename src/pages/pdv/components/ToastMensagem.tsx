// src/pages/pdv/components/ToastMensagem.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ToastType = 'sucesso' | 'erro' | 'aviso' | 'info';

interface ToastMensagemProps {
  mensagem: string;
  onClose: () => void;
}

const CORES_TOAST: Record<ToastType, {
  borda: string;
  iconeBg: string;
  iconeText: string;
  barra: string;
  hoverClicavel: string;
}> = {
  sucesso: {
    borda: 'border-l-success',
    iconeBg: 'bg-success/20',
    iconeText: 'text-success',
    barra: 'bg-success',
    hoverClicavel: 'hover:border-success/40',
  },
  erro: {
    borda: 'border-l-destructive',
    iconeBg: 'bg-destructive/20',
    iconeText: 'text-destructive',
    barra: 'bg-destructive',
    hoverClicavel: '',
  },
  aviso: {
    borda: 'border-l-warning',
    iconeBg: 'bg-warning/20',
    iconeText: 'text-warning',
    barra: 'bg-warning',
    hoverClicavel: '',
  },
  info: {
    borda: 'border-l-primary',
    iconeBg: 'bg-primary/20',
    iconeText: 'text-primary',
    barra: 'bg-primary',
    hoverClicavel: '',
  },
};

const ToastMensagem: React.FC<ToastMensagemProps> = ({ mensagem, onClose }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mensagem) return;

    const startTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(), 400);
    }, 4500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(hideTimer);
    };
  }, [mensagem, onClose]);

  if (!mensagem) return null;

  const getTipoToast = (): ToastType => {
    if (mensagem.includes('❌')) return 'erro';
    if (mensagem.includes('⚠️')) return 'aviso';
    if (mensagem.includes('✅')) return 'sucesso';
    return 'info';
  };

  const getIcone = (): string => {
    if (mensagem.includes('❌')) return '✕';
    if (mensagem.includes('⚠️')) return '!';
    if (mensagem.includes('✅')) return '✓';
    return 'i';
  };

  const ehVendaSucesso = mensagem.includes('Venda registrada');

  const handleNavegacao = () => {
    if (ehVendaSucesso) {
      setVisible(false);
      setTimeout(() => {
        navigate('/scleenkr/relatorios');
        onClose();
      }, 200);
    }
  };

  const textoFormatado = mensagem.replace(/✅|❌|⚠️|ℹ️/g, '').trim();
  const tipo = getTipoToast();
  const corAtual = CORES_TOAST[tipo];

  return (
    <div
      className={`
        fixed top-5 right-5 min-w-70 max-w-100 bg-background/80 backdrop-blur-md rounded-xl border border-border shadow-[0_15px_35px_rgba(0,0,0,0.5)] z-9999 overflow-hidden
        transition-all duration-400 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] border-l-4 ${corAtual.borda}
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}
        ${ehVendaSucesso ? `cursor-pointer transition-all duration-300 hover:bg-secondary/90 ${corAtual.hoverClicavel} hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-95` : 'cursor-default'}
      `}
      onClick={handleNavegacao}
      title={ehVendaSucesso ? 'Clique para ver nos relatórios' : ''}
    >
      <div className="p-4 flex items-center gap-4 relative">
        {/* Ícone */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-base shrink-0 ${corAtual.iconeBg} ${corAtual.iconeText}`}
        >
          {getIcone()}
        </div>

        {/* Texto */}
        <div className="flex flex-col flex-1">
          <label className="text-[10px] font-black tracking-widest mb-0.5 opacity-60 uppercase text-foreground">
            {tipo}
          </label>
          <span className="text-[13px] text-foreground font-medium leading-relaxed">
            {textoFormatado}
          </span>
          {ehVendaSucesso && (
            <small className="block text-[11px] mt-1 text-foreground underline opacity-90 font-bold decoration-success underline-offset-2">
              Ver detalhes no relatório →
            </small>
          )}
        </div>

        {/* Botão Fechar */}
        <button
          className="bg-transparent border-none text-muted-foreground cursor-pointer text-sm p-1 transition-colors hover:text-foreground active:scale-90"
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            setTimeout(() => onClose(), 400);
          }}
        >
          ✕
        </button>
      </div>

      {/* Barra de Progresso */}
      <div
        className={`h-0.75 w-full ${corAtual.barra}`}
        style={{
          transition: visible ? 'width 4.5s linear' : 'none',
          width: visible ? '0%' : '100%',
        }}
      />
    </div>
  );
};

export default ToastMensagem;