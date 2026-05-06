import React, { useState } from 'react';

interface Empresa {
  id_empresa?: number;
  id?: number;
  razao_social?: string;
  nome_fantasia?: string;
  cnpj?: string;
  inscricao_estadual?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
}

interface SecaoEmpresaProps {
  empresa: Empresa | null;
  onCadastrar: (dados: FormData) => Promise<{ sucesso: boolean }>;
  onAtualizar?: (id: number, dados: FormData) => Promise<{ sucesso: boolean }>;
  onDeletar?: (id: number) => void;
}

interface FormData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
}

export const SecaoEmpresa: React.FC<SecaoEmpresaProps> = ({ empresa, onCadastrar, onAtualizar, onDeletar }) => {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<FormData>({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    inscricaoEstadual: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: '',
  });

  // --- MÁSCARAS BLINDADAS (REGEX CORRIGIDO) ---
  const aplicarMascaraCNPJ = (valor: string): string => {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const aplicarMascaraCEP = (valor: string): string => {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const aplicarMascaraTelefone = (valor: string): string => {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };

  // --- BUSCA CEP AUTOMÁTICA ---
  const buscarCEP = async (cepLimpo: string) => {
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setForm(prev => ({
            ...prev,
            endereco: data.logradouro,
            cidade: data.localidade,
            estado: data.uf,
          }));
        }
      } catch (err) {
        console.error('Erro ao buscar CEP');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let valorFormatado = value;

    if (name === 'cnpj') valorFormatado = aplicarMascaraCNPJ(value);
    if (name === 'cep') {
      valorFormatado = aplicarMascaraCEP(value);
      buscarCEP(value.replace(/\D/g, ''));
    }
    if (name === 'telefone') valorFormatado = aplicarMascaraTelefone(value);

    setForm(prev => ({ ...prev, [name]: valorFormatado }));
  };

  const prepararEdicao = () => {
    setForm({
      razaoSocial: empresa?.razao_social || '',
      nomeFantasia: empresa?.nome_fantasia || '',
      cnpj: empresa?.cnpj || '',
      inscricaoEstadual: empresa?.inscricao_estadual || '',
      endereco: empresa?.endereco || '',
      cidade: empresa?.cidade || '',
      estado: empresa?.estado || '',
      cep: empresa?.cep || '',
      telefone: empresa?.telefone || '',
      email: empresa?.email || '',
    });
    setEditando(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const idEmpresa = empresa?.id_empresa || empresa?.id;
    if (idEmpresa && onAtualizar) {
      const res = await onAtualizar(idEmpresa, form);
      if (res?.sucesso) setEditando(false);
    } else {
      const res = await onCadastrar(form);
      if (res?.sucesso) setEditando(false);
    }
  };

  if (empresa && !editando) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm w-full">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <span className="bg-success/20 text-success px-2.5 py-1 rounded text-[11px] font-bold tracking-wide">
              EMPRESA ATIVA
            </span>
            <h2 className="text-foreground text-xl mt-3 mb-1 font-medium">
              {empresa.nome_fantasia || empresa.razao_social}
            </h2>
            <p className="text-muted-foreground text-sm m-0 mt-1">
              <strong className="text-foreground font-medium">CNPJ:</strong> {empresa.cnpj}
            </p>
            <p className="text-muted-foreground text-sm m-0 mt-1">
              📍 {empresa.endereco}, {empresa.cidade}-{empresa.estado}
            </p>
          </div>
          <div className="flex gap-3 mt-2 md:mt-0">
            <button
              onClick={prepararEdicao}
              className="bg-info text-info-foreground border-none px-5 py-2.5 rounded-md cursor-pointer font-bold hover:brightness-110 active:scale-95 transition-all text-sm shadow-sm"
            >
              Editar
            </button>
            {onDeletar && (
              <button
                onClick={() => onDeletar(empresa.id_empresa || empresa.id!)}
                className="bg-transparent text-destructive border border-destructive px-4 py-2.5 rounded-md cursor-pointer hover:bg-destructive/10 active:scale-95 transition-all text-sm font-medium"
              >
                Apagar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card p-6 md:p-8 rounded-xl w-full border ${editando ? 'border-info' : 'border-dashed border-primary'} shadow-sm`}>
      {!editando && !empresa ? (
        <div className="text-center py-5">
          <p className="text-warning text-base m-0 mb-4 font-medium">
            ⚠️ Nenhuma empresa emissora configurada.
          </p>
          <button
            onClick={() => setEditando(true)}
            className="bg-primary text-primary-foreground border-none px-8 py-3.5 rounded-lg font-bold cursor-pointer mt-2 hover:brightness-110 active:scale-95 transition-all text-sm shadow-md tracking-wide"
          >
            + CONFIGURAR AGORA
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 m-0">
          <h3 className="md:col-span-6 text-info text-lg font-medium m-0 mb-2 border-b border-border pb-2">
            {editando ? '📝 Editar Cadastro' : '🏢 Novo Cadastro de Empresa'}
          </h3>

          <div className="md:col-span-4 flex flex-col">
            <label className="text-muted-foreground text-xs font-medium tracking-wide mb-1.5 uppercase">
              RAZÃO SOCIAL
            </label>
            <input
              name="razaoSocial"
              required
              value={form.razaoSocial}
              onChange={handleChange}
              className="p-3 bg-background border border-border text-foreground rounded-md text-sm outline-none focus:border-primary transition-colors w-full"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="text-muted-foreground text-xs font-medium tracking-wide mb-1.5 uppercase">
              CNPJ
            </label>
            <input
              name="cnpj"
              required
              value={form.cnpj}
              onChange={handleChange}
              className="p-3 bg-background border border-border text-foreground rounded-md text-sm outline-none focus:border-primary transition-colors w-full"
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div className="md:col-span-3 flex flex-col">
            <label className="text-muted-foreground text-xs font-medium tracking-wide mb-1.5 uppercase">
              NOME FANTASIA
            </label>
            <input
              name="nomeFantasia"
              value={form.nomeFantasia}
              onChange={handleChange}
              className="p-3 bg-background border border-border text-foreground rounded-md text-sm outline-none focus:border-primary transition-colors w-full"
            />
          </div>

          <div className="md:col-span-3 flex flex-col">
            <label className="text-muted-foreground text-xs font-medium tracking-wide mb-1.5 uppercase">
              INSCRIÇÃO ESTADUAL
            </label>
            <input
              name="inscricaoEstadual"
              value={form.inscricaoEstadual}
              onChange={handleChange}
              className="p-3 bg-background border border-border text-foreground rounded-md text-sm outline-none focus:border-primary transition-colors w-full"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="text-muted-foreground text-xs font-medium tracking-wide mb-1.5 uppercase">
              CEP
            </label>
            <input
              name="cep"
              value={form.cep}
              onChange={handleChange}
              className="p-3 bg-background border border-border text-foreground rounded-md text-sm outline-none focus:border-primary transition-colors w-full"
              placeholder="00000-000"
            />
          </div>

          <div className="md:col-span-4 flex flex-col">
            <label className="text-muted-foreground text-xs font-medium tracking-wide mb-1.5 uppercase">
              ENDEREÇO
            </label>
            <input
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              className="p-3 bg-background border border-border text-foreground rounded-md text-sm outline-none focus:border-primary transition-colors w-full"
            />
          </div>

          <div className="md:col-span-3 flex flex-col">
            <label className="text-muted-foreground text-xs font-medium tracking-wide mb-1.5 uppercase">
              CIDADE
            </label>
            <input
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              className="p-3 bg-background border border-border text-foreground rounded-md text-sm outline-none focus:border-primary transition-colors w-full"
            />
          </div>

          <div className="md:col-span-1 flex flex-col">
            <label className="text-muted-foreground text-xs font-medium tracking-wide mb-1.5 uppercase">
              UF
            </label>
            <input
              name="estado"
              maxLength={2}
              value={form.estado}
              onChange={handleChange}
              className="p-3 bg-background border border-border text-foreground rounded-md text-sm outline-none focus:border-primary transition-colors w-full"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="text-muted-foreground text-xs font-medium tracking-wide mb-1.5 uppercase">
              TELEFONE
            </label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              className="p-3 bg-background border border-border text-foreground rounded-md text-sm outline-none focus:border-primary transition-colors w-full"
            />
          </div>

          <div className="md:col-span-6 flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="bg-muted text-foreground border-none p-3.5 sm:flex-1 rounded-lg cursor-pointer hover:bg-muted-foreground/20 font-medium active:scale-95 transition-all text-sm"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="bg-success text-black border-none p-3.5 sm:flex-2 rounded-lg font-bold cursor-pointer hover:brightness-110 active:scale-95 transition-all text-sm shadow-sm"
            >
              {editando ? 'ATUALIZAR DADOS' : 'CONCLUIR CADASTRO'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};