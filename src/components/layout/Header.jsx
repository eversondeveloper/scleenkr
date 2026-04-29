import { Link } from "react-router-dom";
import LogoScleenkr from "../icons/LogoScleenkr";

export function Header({ 
  empresaSelecionada, 
  sessaoAtual, 
  menuAberto, 
  toggleMenu, 
  fecharMenu 
}) {
  return (
    <header className="w-full h-[6%] flex items-center justify-center bg-card border-b border-border z-50">
      <div className="w-[98%] flex items-center justify-between">
        
        <div className="h-[80%] w-[130px] flex items-center">
          <Link to="/scleenkr/" className="text-[18px] font-bold text-primary no-underline" onClick={fecharMenu}>
            <LogoScleenkr width="auto" color="#f3931a" />
          </Link>
        </div>

        {empresaSelecionada && (
          <div className="flex items-center gap-2.5">
            {/* Mantive o fundo #252525 exclusivo desta badge para não perder o contraste original */}
            <div className="text-text-muted-foreground text-[13px] px-3 py-1 bg-[#252525] rounded border border-border uppercase tracking-[0.5px]">
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

        {/* MENU FLUTUANTE */}
        <nav className="relative flex items-center h-full">
          <button
            className={`text-[24px] bg-transparent border-none cursor-pointer px-2.5 transition-colors duration-300 hover:text-primary ${menuAberto ? "text-primary" : "text-text-muted-foreground"}`}
            onClick={toggleMenu}
            aria-expanded={menuAberto}
            type="button"
          >
            {menuAberto ? "✕" : "☰"}
          </button>

          <ul 
            className={`absolute top-[90%] right-0 mt-2 bg-card border border-surface-hover rounded-[8px] shadow-[0_4px_15px_rgba(0,0,0,0.5)] 
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
                  className="block w-full text-left bg-secondary text-text-muted-foreground border border-surface-hover rounded-[6px] 
                  px-[15px] py-[10px] text-[14px] font-normal leading-normal transition-all duration-200 cursor-pointer 
                  hover:bg-accent hover:text-primary hover:border-primary active:translate-y-px"
                  onClick={fecharMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </header>
  );
}