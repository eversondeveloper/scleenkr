// src/pages/cadastro_atendentes/components/FormAtendente.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/internal/Button';
import { Input } from '@/components/ui/internal/input';
import { Field, FieldLabel } from '@/components/ui/internal/field';
import { Separator } from '@/components/ui/internal/separator';

// Tipos (podem ser movidos para um arquivo types.ts depois)
interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  ativo: boolean;
}

interface AtendenteEditando {
  id_atendente?: string | number;
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  ativo?: boolean;
}

interface FormAtendenteProps {
  atendenteEditando: AtendenteEditando | null;
  onClose: () => void;
  onSalvar: (dados: FormData) => void;
}

export const FormAtendente: React.FC<FormAtendenteProps> = ({
  atendenteEditando,
  onClose,
  onSalvar,
}) => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    ativo: true,
  });

  useEffect(() => {
    if (atendenteEditando) {
      setFormData({
        nome: atendenteEditando.nome || '',
        email: atendenteEditando.email || '',
        telefone: atendenteEditando.telefone || '',
        cpf: atendenteEditando.cpf || '',
        ativo: atendenteEditando.ativo ?? true,
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        ativo: true,
      });
    }
  }, [atendenteEditando]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) {
      alert('Nome e Email são obrigatórios!');
      return;
    }
    onSalvar(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
      <Field>
        <FieldLabel>Nome Completo *</FieldLabel>
        <Input
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Ex: João Silva"
          required
        />
      </Field>

      <Field>
        <FieldLabel>E-mail *</FieldLabel>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@empresa.com"
          required
        />
      </Field>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Telefone</FieldLabel>
          <Input
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
        </Field>
        <Field>
          <FieldLabel>CPF *</FieldLabel>
          <Input
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            required
          />
        </Field>
      </div>
      
      {atendenteEditando && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ativo"
            checked={formData.ativo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, ativo: e.target.checked }))
            }
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor="ativo" className="text-sm cursor-pointer">
            Atendente Ativo
          </label>
        </div>
      )}
      
      <div className="flex justify-end gap-3 pt-4">
        
        <Button type="button" variant="outline" onClick={onClose} size="default">
          Cancelar
        </Button>
        <Button type="submit" variant="success" size="default">
          {atendenteEditando ? 'Atualizar Dados' : 'Cadastrar Atendente'}
        </Button>
      </div>
    </form>
  );
};