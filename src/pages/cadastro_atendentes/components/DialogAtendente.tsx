// src/pages/cadastro_atendentes/components/DialogAtendente.tsx
import { ReactNode } from 'react';
import { AppDialog } from '@/components/ui/AppDialog';

interface AtendenteEditando {
  id_atendente?: string | number;
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  ativo?: boolean;
}

interface DialogAtendenteProps {
  mostrar: boolean;
  onClose: () => void;
  atendenteEditando: AtendenteEditando | null;
  children: ReactNode;
}

export const DialogAtendente: React.FC<DialogAtendenteProps> = ({
  mostrar,
  onClose,
  atendenteEditando,
  children,
}) => {
  return (
    <AppDialog
      aberto={mostrar}
      onClose={onClose}
      titulo={atendenteEditando ? '✏️ Editar Atendente' : '👤 Novo Atendente'}
      descricao="Preencha os dados abaixo para salvar no sistema."
      size="lg"
    >
      {children}
    </AppDialog>
  );
};