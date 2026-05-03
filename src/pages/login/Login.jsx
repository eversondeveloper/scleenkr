import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../lib/modules/auth/service"; 
import { usersService } from "../../lib/modules/users/service";

export const Login = () => {
  const navigate = useNavigate();
  
  // Controle de qual tela estamos vendo
  const [modoTela, setModoTela] = useState("login"); // "login" | "cadastro"
  
  // Estados dos formulários
  const [credenciais, setCredenciais] = useState({ cpf: "", senha: "" });
  const [dadosCadastro, setDadosCadastro] = useState({ nome: "", cpf: "", senha: "" });
  
  // Estados de UI
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // ==========================================
  // HANDLERS DE LOGIN
  // ==========================================
  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    let valorProcessado = value;
    if (name === "cpf") valorProcessado = value.replace(/\D/g, "").slice(0, 11);
    setCredenciais((prev) => ({ ...prev, [name]: valorProcessado }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      await authService.login(credenciais);
      window.location.href = "/scleenkr/pdv";
    } catch (error) {
      setErro(error.message || "Falha ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  // ==========================================
  // HANDLERS DE CADASTRO
  // ==========================================
  const handleChangeCadastro = (e) => {
    const { name, value } = e.target;
    let valorProcessado = value;
    if (name === "cpf") valorProcessado = value.replace(/\D/g, "").slice(0, 11);
    setDadosCadastro((prev) => ({ ...prev, [name]: valorProcessado }));
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      // Usando o novo nome do serviço
      await usersService.cadastrar(dadosCadastro);
      
      setSucesso("Usuário cadastrado com sucesso! Faça seu login.");
      setDadosCadastro({ nome: "", cpf: "", senha: "" }); 
      setModoTela("login"); 
    } catch (error) {
      setErro(error.message || "Falha ao cadastrar usuário.");
    } finally {
      setCarregando(false);
    }
  };

  // ==========================================
  // RENDERIZAÇÃO
  // ==========================================
  return (
    <div className="relative flex items-center justify-center w-screen h-screen bg-background overflow-hidden font-sans">
      
      {/* EFEITO DE LUZ NO FUNDO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none transition-all duration-1000"></div>

      <div className="relative z-10 w-[90%] max-w-[420px] bg-card border border-border shadow-2xl rounded-3xl p-8 md:p-10 transition-all duration-500">
        
        {/* CABEÇALHO DINÂMICO */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-4xl font-black text-primary tracking-tighter mb-2 uppercase transition-all">
            $cleenkr
          </div>
          <h1 className="text-xl font-bold text-foreground m-0 transition-all">
            {modoTela === "login" ? "Acesso ao Sistema" : "Novo Atendente"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center transition-all">
            {modoTela === "login" 
              ? "Insira suas credenciais para abrir o caixa." 
              : "Preencha os dados para criar seu acesso."}
          </p>
        </div>

        {/* MENSAGENS DE FEEDBACK */}
        {erro && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold text-center p-3 rounded-xl mb-5 animate-in fade-in slide-in-from-top-2">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="bg-success/10 border border-success/30 text-success text-sm font-semibold text-center p-3 rounded-xl mb-5 animate-in fade-in slide-in-from-top-2">
            {sucesso}
          </div>
        )}

        {/* ========================================================= */}
        {/* FORMULÁRIO DE LOGIN */}
        {/* ========================================================= */}
        {modoTela === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col gap-2">
              <label htmlFor="cpf" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
                CPF do Operador
              </label>
              <input
                id="cpf" name="cpf" type="text" inputMode="numeric" placeholder="Apenas números..."
                className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 tracking-widest"
                value={credenciais.cpf} onChange={handleChangeLogin} disabled={carregando} autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="senha" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1 flex justify-between">
                <span>Senha</span>
                <span className="text-primary hover:underline cursor-pointer lowercase">Esqueci minha senha</span>
              </label>
              <input
                id="senha" name="senha" type="password" placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 tracking-widest"
                value={credenciais.senha} onChange={handleChangeLogin} disabled={carregando}
              />
            </div>

            <button
              type="submit"
              disabled={carregando || credenciais.cpf.length !== 11 || !credenciais.senha}
              className="w-full bg-primary text-primary-foreground font-extrabold text-sm rounded-xl p-4 mt-2 cursor-pointer transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {carregando ? <span className="animate-pulse tracking-widest">AUTENTICANDO...</span> : "ENTRAR"}
            </button>

            {/* BOTÃO PARA TROCAR PARA CADASTRO */}
            <div className="text-center mt-2">
              <span className="text-xs text-muted-foreground">Não possui acesso? </span>
              <button 
                type="button" 
                onClick={() => { setModoTela("cadastro"); setErro(""); setSucesso(""); }}
                className="bg-transparent border-none text-primary text-xs font-bold cursor-pointer hover:underline"
              >
                Cadastre-se
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* FORMULÁRIO DE CADASTRO */}
        {/* ========================================================= */}
        {modoTela === "cadastro" && (
          <form onSubmit={handleCadastro} className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
            
            <div className="flex flex-col gap-2">
              <label htmlFor="nomeCadastro" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
                Nome Completo
              </label>
              <input
                id="nomeCadastro" name="nome" type="text" placeholder="Ex: João da Silva"
                className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50"
                value={dadosCadastro.nome} onChange={handleChangeCadastro} disabled={carregando} autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cpfCadastro" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
                CPF
              </label>
              <input
                id="cpfCadastro" name="cpf" type="text" inputMode="numeric" placeholder="Apenas números..."
                className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 tracking-widest"
                value={dadosCadastro.cpf} onChange={handleChangeCadastro} disabled={carregando}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="senhaCadastro" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
                Senha de Acesso
              </label>
              <input
                id="senhaCadastro" name="senha" type="password" placeholder="Mínimo 6 caracteres"
                className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 tracking-widest"
                value={dadosCadastro.senha} onChange={handleChangeCadastro} disabled={carregando}
              />
            </div>

            <button
              type="submit"
              disabled={carregando || dadosCadastro.cpf.length !== 11 || !dadosCadastro.senha || !dadosCadastro.nome}
              className="w-full bg-primary text-primary-foreground font-extrabold text-sm rounded-xl p-4 mt-2 cursor-pointer transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {carregando ? <span className="animate-pulse tracking-widest">CRIANDO...</span> : "CRIAR ATENDENTE"}
            </button>

            {/* BOTÃO PARA VOLTAR PARA LOGIN */}
            <div className="text-center mt-2">
              <span className="text-xs text-muted-foreground">Já tem uma conta? </span>
              <button 
                type="button" 
                onClick={() => { setModoTela("login"); setErro(""); setSucesso(""); }}
                className="bg-transparent border-none text-primary text-xs font-bold cursor-pointer hover:underline"
              >
                Faça login
              </button>
            </div>
          </form>
        )}

      </div>

      <div className="absolute bottom-6 text-xs text-muted-foreground font-medium">
        © {new Date().getFullYear()} EVERSCASH. Todos os direitos reservados.
      </div>
    </div>
  );
};