import { useState, useEffect, useCallback } from "react";
import { api } from "./api/client";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { Relatorios } from "./pages/relatorio_vendas/Relatorios";
import { Produtos } from "./pages/cadastro_produtos/Produtos";
import { GerarCupom } from "./pages/gerar_cupom/GerarCupom";
import ComponenteVendas2 from "./pages/pdv/ComponenteVendas";
import { CadastroAtendentes } from "./pages/cadastro_atendentes/CadastroAtendentes";
import { useAtendentes } from "./pages/cadastro_atendentes/hooks/useAtendentes";
import { useSessoesCaixa } from "./pages/cadastro_atendentes/hooks/useSessoesCaixa";
import LogoScleenkr from "./components/icons/LogoScleenkr";

const dataAnooAtual = new Date().getFullYear();

function App() {
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [carregandoSistema, setCarregandoSistema] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const [statusSom] = useState(false);

  const { atendentes, buscarAtendentes, setAtendentes } = useAtendentes();
  const { sessaoAtual, buscarSessaoAtual, setSessaoAtual } = useSessoesCaixa();

  const resetarSistemaLocal = useCallback(
    (tipo) => {
      if (tipo === "EMPRESA") {
        setEmpresaSelecionada(null);
        setSessaoAtual(null);
        setAtendentes([]);
      }
      if (tipo === "SESSAO" || tipo === "ATENDENTE") {
        setSessaoAtual(null);
        buscarAtendentes();
      }
    },
    [setSessaoAtual, setAtendentes, buscarAtendentes],
  );

  const carregarDadosEmpresa = useCallback(async () => {
    try {
      const dados = await api.get("/empresas");
      setEmpresaSelecionada(dados && dados.length > 0 ? dados[0] : null);
    } catch (erro) {
      console.error("Erro ao carregar empresas:", erro);
      setEmpresaSelecionada(null);
    } finally {
      setCarregandoSistema(false);
    }
  }, []);

  useEffect(() => {
    const inicializarSistema = async () => {
      await carregarDadosEmpresa();
      await buscarAtendentes();
      await buscarSessaoAtual();
    };

    inicializarSistema();
  }, [carregarDadosEmpresa, buscarAtendentes, buscarSessaoAtual]);

  useEffect(() => {
    const titulos01 = "Scleenkr";
    const titulos02 = [
      "$cleenkr",
      "Solução PDV",
      "Alta Performance",
      "Sincronização",
    ];
    let indice = 0;

    const temporizador = setInterval(() => {
      if (!document.hidden) {
        document.title = titulos01;
      } else {
        indice = (indice + 1) % titulos02.length;
        document.title = titulos02[indice];
      }
    }, 2000);

    return () => clearInterval(temporizador);
  }, []);

  const fecharMenu = () => setMenuAberto(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuAberto(!menuAberto);
  };

  const temAtendentes = atendentes && atendentes.length > 0;

  if (carregandoSistema) {
    return (
      <div className="bg-scleenkr-bg h-screen text-white flex items-center justify-center">
        Sincronizando $CLEENKR...
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#121212] flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="w-full h-[6%] flex items-center justify-center bg-[#1a1a1a] border-b border-[#333] z-50">
        <div className="w-[98%] flex items-center justify-between">
          
          <div className="h-[80%] w-[130px] flex items-center">
            <Link to="/scleenkr/" className="text-[18px] font-bold text-scleenkr-primary no-underline" onClick={fecharMenu}>
              <LogoScleenkr width="auto" color="#f3931a" />
            </Link>
          </div>

          {empresaSelecionada && (
            <div className="flex items-center gap-2.5">
              <div className="text-[#bacbd9] text-[13px] px-3 py-1 bg-[#252525] rounded border border-[#333] uppercase tracking-[0.5px]">
                {empresaSelecionada.nome_fantasia || empresaSelecionada.razao_social}
              </div>

              {sessaoAtual && (
                <div className="flex items-center gap-1.5 text-[#888] text-[13px]">
                  <span className="font-light">| Operador:</span>
                  <strong className="text-scleenkr-success font-semibold capitalize">
                    {sessaoAtual.nome_atendente}
                  </strong>
                </div>
              )}
            </div>
          )}

          {/* MENU FLUTUANTE */}
          <nav className="relative flex items-center h-full">
            <button
              className={`text-[24px] bg-transparent border-none cursor-pointer px-2.5 transition-colors duration-300 hover:text-scleenkr-primary ${menuAberto ? "text-scleenkr-primary" : "text-[#bacbd9]"}`}
              onClick={toggleMenu}
              aria-expanded={menuAberto}
              type="button"
            >
              {menuAberto ? "✕" : "☰"}
            </button>

            {/* Dropdown forçado a ter os valores EXATOS do AppStyled */}
            <ul 
              className={`absolute top-[90%] right-0 mt-2 bg-[#1a1a1a] border border-[#3b3b3b] rounded-[8px] shadow-[0_4px_15px_rgba(0,0,0,0.5)] 
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
                    className="block w-full text-left bg-[#2a2a2a] text-[#bacbd9] border border-[#3b3b3b] rounded-[6px] 
                    px-[15px] py-[10px] text-[14px] font-normal leading-normal transition-all duration-200 cursor-pointer 
                    hover:bg-[#3b3b3b] hover:text-scleenkr-primary hover:border-scleenkr-primary active:translate-y-px"
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

      {/* MAIN CONTENT */}
      <main className="w-screen h-[88%] flex items-center justify-center bg-scleenkr-bg" onClick={fecharMenu}>
        <Routes>
          <Route path="/scleenkr/" element={<ComponenteVendas2 somStatus={statusSom} sessaoAtual={sessaoAtual} temAtendentes={temAtendentes} empresaGlobal={empresaSelecionada} />} />
          <Route path="/scleenkr/relatorios" element={<Relatorios empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
          <Route path="/scleenkr/produtos" element={<Produtos $empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
          <Route path="/scleenkr/gerarcupom" element={<GerarCupom empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
          <Route path="/scleenkr/atendentes_sessao" element={<CadastroAtendentes empresaSelecionada={empresaSelecionada} somStatus={statusSom} onAtualizarEmpresa={carregarDadosEmpresa} onResetEstado={resetarSistemaLocal} buscarSessaoAtual={buscarSessaoAtual} />} />
          <Route path="*" element={<Navigate to="/scleenkr/" />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="w-full h-[6%] flex items-center justify-center bg-[#1a1a1a] border-t border-[#333]">
        <div className="flex justify-between items-center w-[98%] text-[#bacbd9] text-[14px]">
          <p>© $CLEENKR {dataAnooAtual} - Todos os direitos reservados</p>
        </div>
      </footer>

    </div>
  );
}

export default App;