// src/App.tsx
import { useState, useEffect, useCallback, JSX } from 'react';
import { apiClient } from './api/apiClient';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Páginas do painel
import { Relatorios } from './pages/relatorio_vendas/Relatorios';
import { Produtos } from './pages/cadastro_produtos/Produtos';
import { GerarCupom } from './pages/gerar_cupom/GerarCupom';
import ComponenteVendas from './pages/pdv/ComponenteVendas';
import { CadastroAtendentes } from './pages/cadastro_atendentes/CadastroAtendentes';

// Hooks
import { useAtendentes } from './pages/cadastro_atendentes/hooks/useAtendentes';
import { useSessoesCaixa } from './pages/cadastro_atendentes/hooks/useSessoesCaixa';

// Layouts
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Páginas de autenticação e layout compartilhado
import { AuthLayout } from './pages/auth/AuthLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { CadastroPage } from './pages/auth/CadastroPage';
import { RecuperarSenhaPage } from './pages/auth/RecuperarSenhaPage';

// Tipos importados
import type { Empresa } from '@/lib/models/Empresa';
import type { SessaoCaixa } from '@/lib/models/SessaoCaixa';
import type { Atendente } from '@/lib/models/Atendente';

// Tipos das props do PainelLayout
interface PainelLayoutProps {
  empresaSelecionada: Empresa | null;
  sessaoAtual: SessaoCaixa | null;
  menuAberto: boolean;
  toggleMenu: (e: React.MouseEvent) => void;
  fecharMenu: () => void;
}

// Layout do painel (área logada)
const PainelLayout: React.FC<PainelLayoutProps> = ({
  empresaSelecionada,
  sessaoAtual,
  menuAberto,
  toggleMenu,
  fecharMenu,
}) => (
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

// Aplicação principal
export const App = (): JSX.Element => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
  const [carregandoSistema, setCarregandoSistema] = useState<boolean>(true);
  const [menuAberto, setMenuAberto] = useState<boolean>(false);
  const [statusSom] = useState<boolean>(false);

  const { atendentes, buscarAtendentes, setAtendentes } = useAtendentes();
  const { sessaoAtual, buscarSessaoAtual, setSessaoAtual } = useSessoesCaixa();

  const resetarSistemaLocal = useCallback(
    (tipo: 'EMPRESA' | 'SESSAO' | 'ATENDENTE') => {
      if (tipo === 'EMPRESA') {
        setEmpresaSelecionada(null);
        setSessaoAtual(null);
        setAtendentes([]);
      }
      if (tipo === 'SESSAO' || tipo === 'ATENDENTE') {
        setSessaoAtual(null);
        buscarAtendentes();
      }
    },
    [setSessaoAtual, setAtendentes, buscarAtendentes]
  );

  const carregarDadosEmpresa = useCallback(async () => {
    try {
      const dados = await apiClient.get<Empresa[]>('/empresas');
      setEmpresaSelecionada(dados && dados.length > 0 ? dados[0] : null);
    } catch (erro) {
      console.error('Erro ao carregar empresas:', erro);
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

  // Título dinâmico
  useEffect(() => {
    const titulos01 = 'Scleenkr';
    const titulos02 = ['$cleenkr', 'Solução PDV', 'Alta Performance', 'Sincronização'];
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
  const toggleMenu = (e: React.MouseEvent) => {
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
  }

  return (
    <Routes>
      {/* Rotas de autenticação */}
      <Route element={<AuthLayout />}>
        <Route path="/scleenkr/login" element={<LoginPage />} />
        <Route path="/scleenkr/cadastro" element={<CadastroPage />} />
        <Route path="/scleenkr/recuperar-senha" element={<RecuperarSenhaPage />} />
      </Route>

      {/* Rotas do painel */}
      <Route
        element={
          <PainelLayout
            empresaSelecionada={empresaSelecionada}
            sessaoAtual={sessaoAtual}
            menuAberto={menuAberto}
            toggleMenu={toggleMenu}
            fecharMenu={fecharMenu}
          />
        }
      >
        <Route path="/scleenkr/" element={<Navigate to="/scleenkr/pdv" replace />} />
        <Route
          path="/scleenkr/pdv"
          element={
            <ComponenteVendas
              somStatus={statusSom}
              sessaoAtual={sessaoAtual}
              temAtendentes={temAtendentes}
              empresaGlobal={empresaSelecionada}
            />
          }
        />
        <Route
          path="/scleenkr/relatorios"
          element={<Relatorios empresaSelecionada={empresaSelecionada} somStatus={statusSom} />}
        />
        <Route
          path="/scleenkr/produtos"
          element={<Produtos empresaSelecionada={empresaSelecionada} somStatus={statusSom} />}
        />
        <Route
          path="/scleenkr/gerarcupom"
          element={<GerarCupom empresaSelecionada={empresaSelecionada} somStatus={statusSom} />}
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
        <Route path="*" element={<Navigate to="/scleenkr/pdv" replace />} />
      </Route>

      {/* Redirecionamento raiz */}
      <Route path="/" element={<Navigate to="/scleenkr/login" replace />} />
    </Routes>
  );
};

export default App;