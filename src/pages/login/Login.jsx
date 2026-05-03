import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../lib/modules/auth/service"; 

export const Login = () => {
  const navigate = useNavigate();
  const [credenciais, setCredenciais] = useState({ cpf: "", senha: "" });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await authService.login(credenciais);
      navigate("/scleenkr/pdv");
    } catch (error) {
      setErro(error.message || "Falha ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valorProcessado = value;

    // 2. Filtro inteligente: se o campo for o CPF, removemos letras e limitamos a 11 números
    if (name === "cpf") {
      valorProcessado = value.replace(/\D/g, "").slice(0, 11);
    }

    setCredenciais((prev) => ({ ...prev, [name]: valorProcessado }));
  };

  return (
    <div className="relative flex items-center justify-center w-screen h-screen bg-background overflow-hidden font-sans">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-[90%] max-w-[420px] bg-card border border-border shadow-2xl rounded-3xl p-8 md:p-10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="text-4xl font-black text-primary tracking-tighter mb-2 uppercase">
            $cleenkr
          </div>
          <h1 className="text-xl font-bold text-foreground m-0">
            Acesso ao Sistema
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Insira suas credenciais para abrir o caixa.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          {erro && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold text-center p-3 rounded-xl">
              {erro}
            </div>
          )}

          {/* 3. INPUT ATUALIZADO PARA CPF */}
          <div className="flex flex-col gap-2">
            <label htmlFor="cpf" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
              CPF do Operador
            </label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              inputMode="numeric" // Ajuda a abrir o teclado numérico no celular
              placeholder="Apenas números..."
              className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 tracking-widest"
              value={credenciais.cpf}
              onChange={handleChange}
              disabled={carregando}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="senha" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1 flex justify-between">
              <span>Senha</span>
              <span className="text-primary hover:underline cursor-pointer lowercase">Esqueci minha senha</span>
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 tracking-widest"
              value={credenciais.senha}
              onChange={handleChange}
              disabled={carregando}
            />
          </div>

          <button
            type="submit"
            disabled={carregando || credenciais.cpf.length !== 11 || !credenciais.senha}
            className="w-full bg-primary text-primary-foreground font-extrabold text-sm rounded-xl p-4 mt-2 cursor-pointer transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {carregando ? (
              <span className="animate-pulse tracking-widest">AUTENTICANDO...</span>
            ) : (
              "ENTRAR"
            )}
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 text-xs text-muted-foreground font-medium">
        © {new Date().getFullYear()} EVERSCASH. Todos os direitos reservados.
      </div>
    </div>
  );
};