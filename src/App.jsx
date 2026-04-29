import { useState, useEffect, useCallback } from "react";
import { api } from "./api/client";
import { Routes, Route, Navigate } from "react-router-dom";
import { Relatorios } from "./pages/relatorio_vendas/Relatorios";
import { Produtos } from "./pages/cadastro_produtos/Produtos";
import { GerarCupom } from "./pages/gerar_cupom/GerarCupom";
import ComponenteVendas2 from "./pages/pdv/ComponenteVendas";
import { CadastroAtendentes } from "./pages/cadastro_atendentes/CadastroAtendentes";
import { useAtendentes } from "./pages/cadastro_atendentes/hooks/useAtendentes";
import { useSessoesCaixa } from "./pages/cadastro_atendentes/hooks/useSessoesCaixa";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";

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
      <div className="bg-background h-screen text-white flex items-center justify-center">
        Sincronizando $CLEENKR...
      </div>
    );
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-background flex flex-col font-sans">
      <Header 
        empresaSelecionada={empresaSelecionada}
        sessaoAtual={sessaoAtual}
        menuAberto={menuAberto}
        toggleMenu={toggleMenu}
        fecharMenu={fecharMenu}
      />

      <main className="w-screen h-[88%] flex items-center justify-center bg-background" onClick={fecharMenu}>
        <Routes>
          <Route path="/scleenkr/" element={<ComponenteVendas2 somStatus={statusSom} sessaoAtual={sessaoAtual} temAtendentes={temAtendentes} empresaGlobal={empresaSelecionada} />} />
          <Route path="/scleenkr/relatorios" element={<Relatorios empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
          <Route path="/scleenkr/produtos" element={<Produtos $empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
          <Route path="/scleenkr/gerarcupom" element={<GerarCupom empresaSelecionada={empresaSelecionada} somStatus={statusSom} />} />
          <Route path="/scleenkr/atendentes_sessao" element={<CadastroAtendentes empresaSelecionada={empresaSelecionada} somStatus={statusSom} onAtualizarEmpresa={carregarDadosEmpresa} onResetEstado={resetarSistemaLocal} buscarSessaoAtual={buscarSessaoAtual} />} />
          <Route path="*" element={<Navigate to="/scleenkr/" />} />
        </Routes>
      </main>

      <Footer />

    </div>
  );
};

export default App;