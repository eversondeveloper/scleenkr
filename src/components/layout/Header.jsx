import { Link, useNavigate } from "react-router-dom";
import LogoScleenkr from "../../assets/icons/LogoScleenkr.jsx";
import { authService } from "../../lib/modules/auth/service"; // Importando o nosso serviço

export function Header({ 
  empresaSelecionada, 
  sessaoAtual, 
  menuAberto, 
  toggleMenu, 
  fecharMenu 
}) {
  const navigate = useNavigate();

  // Função que executa o fluxo de logout
  const handleLogout = async () => {
    if (window.confirm("Deseja realmente sair do sistema?")) {
      await authService.logout(); // Limpa o token
      navigate("/scleenkr/login", { replace: true }); // Manda pro login e impede de voltar na setinha do navegador
    }
  };

  return (
    <header className="w-full h-[6%] min-h-[50px] flex items-center justify-center bg-card border-b border-border z-50">
      <div className="w-[98%] flex items-center justify-between">
        
        {/* LOGO */}
        <div className="h-[80%] w-[130px] flex items-center">
          <Link to="/scleenkr/" className="text-[18px] font-bold text-primary no-underline" onClick={fecharMenu}>
            <LogoScleenkr width="auto" color="#f3931a" />
          </Link>
        </div>

        {/* INFORMAÇÕES DO OPERADOR E EMPRESA */}
        {empresaSelecionada && (
          <div className="flex items-center gap-2.5">
            <div className="text-muted-foreground text-[13px] px-3 py-1 bg-muted rounded border border-border uppercase tracking-[0.5px]">
              {empresaSelecionada.nome_fantasia || empresaSelecionada.razao_social}
            </div>

            {sessaoAtual && (
              <div className="flex items-center gap-1.5 text-[#888] text-[13px]">
                <span className="font-light">| Operador:</span>
                <strong className="text-success font-semibold capitalize">
                  {sessaoAtual.nome_atendente}
                </strong>
              </div>
            )}
          </div>
        )}

        {/* NAVEGAÇÃO E LOGOUT */}
        <nav className="relative flex items-center h-full gap-4">
    
          {/* MENU HAMBÚRGUER */}
          <button
            className={`text-[24px] bg-transparent border-none cursor-pointer px-2.5 transition-colors duration-300 hover:text-primary ${menuAberto ? "text-primary" : "text-muted-foreground"}`}
            onClick={toggleMenu}
            aria-expanded={menuAberto}
            type="button"
          >
            {menuAberto ? "✕" : "☰"}
          </button>

          <ul 
            className={`absolute top-[90%] right-0 mt-2 bg-card border border-border rounded-[8px] shadow-[0_4px_15px_rgba(0,0,0,0.5)] 
            p-[10px] min-w-[200px] flex flex-col gap-[5px] z-50 transition-all duration-200 origin-top-right
            ${menuAberto ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}
          >
            {[
              { path: "/scleenkr/", label: "PDV" },
              { path: "/scleenkr/relatorios", label: "Vendas" },
              { path: "/scleenkr/produtos", label: "Produtos" },
              { path: "/scleenkr/gerarcupom", label: "Cupom" },
              { path: "/scleenkr/atendentes_sessao", label: "Atendentes/Sessão" },
            ].map((link, index) => (
              <li key={index} className="w-full">
                <Link
                  to={link.path}
                  className="block w-full text-left bg-secondary text-muted-foreground border border-border rounded-[6px] 
                  px-[15px] py-[10px] text-[14px] font-normal leading-normal transition-all duration-200 cursor-pointer 
                  hover:bg-accent hover:text-primary hover:border-primary active:translate-y-px"
                  onClick={fecharMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* BOTÃO DE LOGOUT COM ÍCONE */}
          <button
            onClick={handleLogout}
            title="Sair do Sistema"
            className="flex items-center justify-center bg-transparent border-none cursor-pointer text-muted-foreground transition-all duration-300 hover:text-destructive hover:scale-110"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </nav>

      </div>
    </header>
  );
}