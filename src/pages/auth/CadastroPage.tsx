// src/pages/auth/CadastroPage.tsx
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersService } from '@/lib/modules/users/service';

// Interface para o estado do formulário
interface DadosFormulario {
  nome: string;
  cpf: string;
  senha: string;
}

export const CadastroPage: React.FC = () => {
  const navigate = useNavigate();

  const [dados, setDados] = useState<DadosFormulario>({
    nome: '',
    cpf: '',
    senha: '',
  });
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');
  const [sucesso, setSucesso] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let valorProcessado: string = value;
    if (name === 'cpf') {
      valorProcessado = value.replace(/\D/g, '').slice(0, 11);
    }
    setDados((prev) => ({ ...prev, [name]: valorProcessado }));
  };

  const handleCadastro = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      await usersService.cadastrar(dados);
      // Redireciona para login com mensagem de sucesso
      navigate('/scleenkr/login', {
        state: { mensagem: 'Usuário cadastrado com sucesso! Faça seu login.' },
      });
    } catch (error: unknown) {
      const mensagem =
        error instanceof Error ? error.message : 'Falha ao cadastrar usuário.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleCadastro} className="flex flex-col gap-4">
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

      {/* ...restante do JSX permanece igual, sem necessidade de tipagem adicional nos elementos... */}
      <div className="flex flex-col gap-2">
        <label htmlFor="nomeCadastro" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
          Nome Completo
        </label>
        <input
          id="nomeCadastro"
          name="nome"
          type="text"
          placeholder="Ex: João da Silva"
          className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50"
          value={dados.nome}
          onChange={handleChange}
          disabled={carregando}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cpfCadastro" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
          CPF
        </label>
        <input
          id="cpfCadastro"
          name="cpf"
          type="text"
          inputMode="numeric"
          placeholder="Apenas números..."
          className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 tracking-widest"
          value={dados.cpf}
          onChange={handleChange}
          disabled={carregando}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="senhaCadastro" className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest pl-1">
          Senha de Acesso
        </label>
        <input
          id="senhaCadastro"
          name="senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          className="w-full bg-background border border-border rounded-xl p-3.5 text-foreground text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 tracking-widest"
          value={dados.senha}
          onChange={handleChange}
          disabled={carregando}
        />
      </div>

      <button
        type="submit"
        disabled={carregando || dados.cpf.length !== 11 || !dados.senha || !dados.nome}
        className="w-full bg-primary text-primary-foreground font-extrabold text-sm rounded-xl p-4 mt-2 cursor-pointer transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
      >
        {carregando ? (
          <span className="animate-pulse tracking-widest">CRIANDO...</span>
        ) : (
          'CRIAR ATENDENTE'
        )}
      </button>

      <div className="text-center mt-2">
        <span className="text-xs text-muted-foreground">Já tem uma conta? </span>
        <Link to="/scleenkr/login" className="text-primary text-xs font-bold hover:underline">
          Faça login
        </Link>
      </div>
    </form>
  );
};