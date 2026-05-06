// src/components/ui/Button.d.ts
import type { FC } from 'react';

interface ProdutoCatalogo {
  id_produto: number;
  descricao: string;
  categoria: string;
  preco: number;
  total_vendido?: number;
  estoque_atual?: number;
  tipo_item?: string;
}

interface ButtonProps {
  $index: number;
  $texto: string;
  $descricao: string;
  $id: number;
  $corTexto?: string;
  $btnClick: () => void;
  $produtosSelecionados: ProdutoCatalogo[];
  $preco: number;
  $totalVendido?: number;
  $estoqueAtual?: number;
  $tipoItem?: string;
  $btnHover?: () => void;   // ← agora opcional
}

declare const Button: FC<ButtonProps>;
export default Button;