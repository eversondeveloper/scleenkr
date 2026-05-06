// src/pages/auth/AuthLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  const location = useLocation();

  const titulo: string =
    location.pathname === '/login'
      ? 'Acesso ao Sistema'
      : location.pathname === '/cadastro'
        ? 'Novo Atendente'
        : 'Recuperar Senha';

  return (
    <div className="relative flex items-center justify-center w-screen h-screen bg-background overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 w-[90%] max-w-105 bg-card border border-border shadow-2xl rounded-3xl p-8 md:p-10">
        {/* Cabeçalho comum */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-4xl font-black text-primary tracking-tighter mb-2 uppercase">
            $cleenkr
          </div>
          <h1 className="text-xl font-bold text-foreground">{titulo}</h1>
        </div>

        {/* Conteúdo injetado pela rota ativa */}
        <Outlet />
      </div>
      <div className="absolute bottom-6 text-xs text-muted-foreground font-medium">
        © {new Date().getFullYear()} EVERSCASH. Todos os direitos reservados.
      </div>
    </div>
  );
};