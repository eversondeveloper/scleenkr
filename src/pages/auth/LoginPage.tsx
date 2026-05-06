// src/pages/auth/LoginPage.tsx
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/lib/modules/auth/service';
import { setToken } from '@/lib/utils/token';

interface Credenciais {
  cpf: string;
  senha: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mensagem de sucesso vinda do cadastro (via state)
  const mensagemSucesso = (location.state as { mensagem?: string })?.mensagem;

  const [credenciais, setCredenciais] = useState<Credenciais>({ cpf: '', senha: '' });
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let valorProcessado: string = value;
    if (name === 'cpf') valorProcessado = value.replace(/\D/g, '').slice(0, 11);
    setCredenciais((prev) => ({ ...prev, [name]: valorProcessado }));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await authService.login(credenciais);

      // Salva o token usando a utilidade centralizada
      if (resposta?.token) {
        setToken(resposta.token);
      }

      // Redireciona para o PDV
      navigate('/scleenkr/pdv');
    } catch (error: unknown) {
      const mensagem =
        error instanceof Error ? error.message : 'Falha ao conectar com o servidor.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5">
      {/* MENSAGEM DE SUCESSO (vinda do cadastro) */}
      {mensagemSucesso && (
        <div className="bg-success/10 border border-success/30 text-success text-sm font-semibold text-center p-3 rounded-xl">
          {mensagemSucesso}
        </div>
      )}

      {/* MENSAGEM DE ERRO */}
      {erro && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold text-center p-3 rounded-xl">
          {erro}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="cpf" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
          CPF do Operador
        </label>
        <input
          id="cpf"
          name="cpf"
          type="text"
          inputMode="numeric"
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
          <Link to="/scleenkr/recuperar-senha" className="text-primary hover:underline cursor-pointer lowercase">
            Esqueci minha senha
          </Link>
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
          'ENTRAR'
        )}
      </button>

      <div className="text-center mt-2">
        <span className="text-xs text-muted-foreground">Não possui acesso? </span>
        <Link to="/scleenkr/cadastro" className="text-primary text-xs font-bold hover:underline">
          Cadastre-se
        </Link>
      </div>
    </form>
  );
};