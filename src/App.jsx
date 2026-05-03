import { useState, useEffect, useCallback } from "react";
import { apiClient } from "./api/apiClient";
import { Routes, Route, Navigate, Outlet } from "react-router-dom"; 
import { Relatorios } from "./pages/relatorio_vendas/Relatorios";
import { Produtos } from "./pages/cadastro_produtos/Produtos";
import { GerarCupom } from "./pages/gerar_cupom/GerarCupom";
import ComponenteVendas from "./pages/pdv/ComponenteVendas";
import { CadastroAtendentes } from "./pages/cadastro_atendentes/CadastroAtendentes";
import { Login } from "./pages/login/Login";
import { useAtendentes } from "./pages/cadastro_atendentes/hooks/useAtendentes";
import { useSessoesCaixa } from "./pages/cadastro_atendentes/hooks/useSessoesCaixa";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

const PainelLayout = ({ 
  empresaSelecionada, 
  sessaoAtual, 
  menuAberto, 
  toggleMenu, 
  fecharMenu 
}) => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-background flex flex-col font-sans">
      <Header 
        empresaSelecionada={empresaSelecionada}
        sessaoAtual={sessaoAtual}
        menuAberto={menuAberto}
        toggleMenu={toggleMenu}
        fecharMenu={fecharMenu}
      />
      <div 
        className="flex-1 w-full flex justify-center overflow-hidden pt-5 pb-5 px-2 md:px-5" 
        onClick={fecharMenu}
      >
        <main className="w-full h-full bg-card rounded-xl shadow-2xl border border-border overflow-y-auto box-border [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50">
          <Outlet /> 
        </main>
      </div>

      <Footer />
    </div>
  );
};

// APLICAÇÃO PRINCIPAL  
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
      const dados = await apiClient.get("/empresas");
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
      <div className="bg-background h-screen text-white flex items-center justify-center animate-pulse">
        Sincronizando $CLEENKR...
      </div>
    );
  };

  return (
    <Routes>
      {/* ROTA DE LOGIN (Fora da Casca - Layout Limpo) */}
      <Route path="/scleenkr/login" element={<Login />} />

      {/* ROTAS DO PAINEL (Dentro do PainelLayout) */}
      <Route element={
        <PainelLayout 
          empresaSelecionada={empresaSelecionada}
          sessaoAtual={sessaoAtual}
          menuAberto={menuAberto}
          toggleMenu={toggleMenu}
          fecharMenu={fecharMenu}
        />
      }>
        
        <Route path="/scleenkr/" element={<Navigate to="/scleenkr/pdv" replace />} />
        <Route path="/scleenkr/pdv" element={<ComponenteVendas somStatus={statusSom} sessaoAtual={sessaoAtual} temAtendentes={temAtendentes} empresaGlobal={empresaSelecionada} />} />
        <Route path="/scleenkr/relatorios" element={<Relatorios empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
        <Route path="/scleenkr/produtos" element={<Produtos $empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
        <Route path="/scleenkr/gerarcupom" element={<GerarCupom empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
        <Route path="/scleenkr/atendentes_sessao" element={<CadastroAtendentes empresaSelecionada={empresaSelecionada} somStatus={statusSom} onAtualizarEmpresa={carregarDadosEmpresa} onResetEstado={resetarSistemaLocal} buscarSessaoAtual={buscarSessaoAtual} />} />
      
        <Route path="*" element={<Navigate to="/scleenkr/pdv" />} />
      </Route>
    </Routes>
  );
};

export default App;