import { useState, useEffect, useCallback } from "react";
import { AppStyled } from "./AppStyled";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { Relatorios } from "./pages/relatorio_vendas/Relatorios";
import { Produtos } from "./pages/cadastro_produtos/Produtos";
import { GerarCupom } from "./pages/gerar_cupom/GerarCupom";
import ComponenteVendas2 from "./pages/pdv/ComponenteVendas";
import { CadastroAtendentes } from "./pages/cadastro_atendentes/CadastroAtendentes";
import { useAtendentes } from "./pages/cadastro_atendentes/hooks/useAtendentes";
import { useSessoesCaixa } from "./pages/cadastro_atendentes/hooks/useSessoesCaixa";
import LogoScleenkr from "./components/icons/LogoScleenkr"; // Correto

const dataAnooAtual = new Date().getFullYear();

function App() {
  const URL_API_EMPRESAS = "http://localhost:3000/empresas";
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
      const resposta = await fetch(URL_API_EMPRESAS);
      if (!resposta.ok) throw new Error("Erro API");
      const dados = await resposta.json();

      if (dados && dados.length > 0) {
        setEmpresaSelecionada(dados[0]);
      } else {
        setEmpresaSelecionada(null);
      }
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
      "$cleenkr", "Solução PDV",
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
      <div
        style={{
          background: "#1e1e1e",
          height: "100vh",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Sincronizando $CLEENKR...
      </div>
    );
  }

  return (
    <AppStyled>
      <header>
        <div className="logomenu">
          <div className="logodiv">
            <Link to="/scleenkr/" className="logo" onClick={fecharMenu}>
              <LogoScleenkr width="auto" color="#f3931a" />
            </Link>
          </div>

          {empresaSelecionada && (
            <div className="nomeempresa">
              <div className="nome-empresa-texto">
                {empresaSelecionada.nome_fantasia ||
                  empresaSelecionada.razao_social}
              </div>

              {sessaoAtual && (
                <div className="nome-atendente-header">
                  <span>| Operador:</span>{" "}
                  <strong>{sessaoAtual.nome_atendente}</strong>
                </div>
              )}
            </div>
          )}

          <nav className={`menu-flutuante ${menuAberto ? "ativo" : ""}`}>
            <button
              className="menuButton"
              onClick={toggleMenu}
              aria-expanded={menuAberto}
              type="button"
            >
              {menuAberto ? "✕" : "☰"}
            </button>

            <ul className={`menuItems ${menuAberto ? "visivel" : "oculto"}`}>
              <li>
                <Link to="/scleenkr/" className="btns" onClick={fecharMenu}>
                  PDV
                </Link>
              </li>
              <li>
                <Link
                  to="/scleenkr/relatorios"
                  className="btns"
                  onClick={fecharMenu}
                >
                  Vendas
                </Link>
              </li>
              <li>
                <Link
                  to="/scleenkr/produtos"
                  className="btns"
                  onClick={fecharMenu}
                >
                  Produtos
                </Link>
              </li>
              <li>
                <Link
                  to="/scleenkr/gerarcupom"
                  className="btns"
                  onClick={fecharMenu}
                >
                  Cupom
                </Link>
              </li>
              <li>
                <Link
                  to="/scleenkr/atendentes_sessao"
                  className="btns"
                  onClick={fecharMenu}
                >
                  Atendentes/Sessão
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main onClick={fecharMenu}>
        <Routes>
          <Route
            path="/scleenkr/"
            element={
              <ComponenteVendas2
                somStatus={statusSom}
                sessaoAtual={sessaoAtual}
                temAtendentes={temAtendentes}
                empresaGlobal={empresaSelecionada}
              />
            }
          />

          <Route
            path="/scleenkr/relatorios"
            element={
              <Relatorios
                empresaSelecionada={empresaSelecionada}
                somStatus={statusSom}
              />
            }
          />
          <Route
            path="/scleenkr/produtos"
            element={
              <Produtos
                $empresaSelecionada={empresaSelecionada}
                somStatus={statusSom}
              />
            }
          />
          <Route
            path="/scleenkr/gerarcupom"
            element={
              <GerarCupom
                empresaSelecionada={empresaSelecionada}
                somStatus={statusSom}
              />
            }
          />

          <Route
            path="/scleenkr/atendentes_sessao"
            element={
              <CadastroAtendentes
                empresaSelecionada={empresaSelecionada}
                somStatus={statusSom}
                onAtualizarEmpresa={carregarDadosEmpresa}
                onResetEstado={resetarSistemaLocal}
                buscarSessaoAtual={buscarSessaoAtual}
              />
            }
          />

          <Route path="*" element={<Navigate to="/scleenkr/" />} />
        </Routes>
      </main>

      <footer>
        <div className="footer">
          <p>© $CLEENKR {dataAnooAtual} - Todos os direitos reservados</p>
        </div>
      </footer>
    </AppStyled>
  );
}

export default App;
