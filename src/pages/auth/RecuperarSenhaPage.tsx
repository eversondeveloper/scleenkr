// src/pages/auth/RecuperarSenhaPage.tsx
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

export const RecuperarSenhaPage: React.FC = () => {
  const [cpf, setCpf] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');
  const [sucesso, setSucesso] = useState<string>('');

  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCpf(e.target.value.replace(/\D/g, '').slice(0, 11));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      // Futura chamada ao serviço de recuperação
      // await authService.recuperarSenha(cpf);
      setSucesso('Se o CPF estiver cadastrado, você receberá um e-mail com instruções.');
      setCpf('');
    } catch (error: unknown) {
      const mensagem =
        error instanceof Error ? error.message : 'Erro ao processar a solicitação.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {erro && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold text-center p-3 rounded-xl">
          {erro}
        </div>
      )}
      {sucesso && (
        <div className="bg-success/10 border border-success/30 text-success text-sm font-semibold text-center p-3 rounded-xl">
          {sucesso}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="cpfRecuperar" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
          CPF do Operador
        </label>
        <input
          id="cpfRecuperar"
          name="cpf"
          type="text"
          inputMode="numeric"
          placeholder="Digite seu CPF"
          className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 tracking-widest"
          value={cpf}
          onChange={handleCpfChange}
          disabled={carregando}
          autoFocus
        />
      </div>

      <button
        type="submit"
        disabled={carregando || cpf.length !== 11}
        className="w-full bg-primary text-primary-foreground font-extrabold text-sm rounded-xl p-4 mt-2 cursor-pointer transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
      >
        {carregando ? (
          <span className="animate-pulse tracking-widest">ENVIANDO...</span>
        ) : (
          'RECUPERAR SENHA'
        )}
      </button>

      <div className="text-center mt-2">
        <Link to="/scleenkr/login" className="text-primary text-xs font-bold hover:underline">
          Voltar para o login
        </Link>
      </div>
    </form>
  );
};