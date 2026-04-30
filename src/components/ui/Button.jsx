import { memo } from "react";
import imgFavorito from "/favorito.svg";
import { formatarParaReal } from "../../pages/pdv/hooks/useVendas";

const CATEGORIA_CORES = {
  "Impressão": "#006064",    
  "Cópia": "#303F9F",        
  "Revelação": "#388E3C",    
  "Scan": "#B71C1C",         
  "Encadernação": "#512DA8",  
  "Papelaria": "#F57C00",     
  "Apostila Color": "#7CB342",
  "Documento": "#5D4037",    
  "Serviço": "#0097A7",       
  "Foto Produto": "#0D47A1",  
  "Plástico": "#455A64",      
  "Material": "#C2185B",      
};

const COR_PADRAO_DEFAULT = "#263238"; 
const COR_SELECIONADO = "#1e1e1e"; 
const LIMITE_MAIS_VENDIDO = 50; 

const Button = ({
  $index,
  $texto, 
  $descricao,
  $id,
  $corTexto,
  $btnClick,
  $produtosSelecionados,
  $preco,
  $totalVendido = 0,
  $estoqueAtual,
  $tipoItem,
  $btnHover 
}) => {
  
  // Refatoração Sênior: Calculamos a cor diretamente, sem precisar de useState/useEffect
  const corCategoria = CATEGORIA_CORES[$texto] || COR_PADRAO_DEFAULT;

  const produtoNoCarrinho = $produtosSelecionados.find(
    (p) => p.id_produto === $id
  );
  
  const estaSelecionado = !!produtoNoCarrinho;
  const quantidadeNoCarrinho = produtoNoCarrinho ? produtoNoCarrinho.quantidade : 0;

  const isMaisVendido = $totalVendido >= LIMITE_MAIS_VENDIDO;
  const isEstoqueBaixo = $tipoItem === 'Produto' && $estoqueAtual < 5;
  const isEsgotado = $tipoItem === 'Produto' && $estoqueAtual <= quantidadeNoCarrinho;

  // Lógica das cores dinâmicas inline
  const bgAtual = estaSelecionado ? COR_SELECIONADO : corCategoria;
  const textoAtual = $corTexto || '#FFFFFF';

  return (
    <div
      onClick={() => !isEsgotado && $btnClick()}
      onMouseEnter={() => $btnHover && $btnHover()}
      style={{ backgroundColor: bgAtual, color: textoAtual }}
      className={`
        relative flex flex-col justify-center items-center w-full aspect-square p-2.5 rounded-2xl select-none overflow-hidden transition-all duration-200
        bg-linear-to-br from-white/5 to-black/10 border border-white/10
        ${isEsgotado 
          ? 'border-red-500 grayscale-[0.8] opacity-50 cursor-not-allowed pointer-events-none' 
          : 'cursor-pointer hover:-translate-y-1 hover:from-white/10 hover:to-black/20 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:z-10 active:scale-95 active:duration-100'
        }
        ${isEstoqueBaixo && !isEsgotado ? 'border-orange-500 shadow-[0_0_10px_rgba(255,152,0,0.2)]' : ''}
        ${estaSelecionado ? 'border-2! border-success! shadow-[0_0_15px_rgba(100,255,138,0.3)]' : ''}
      `}
    >
      {/* Badge Superior (Índice e Ícone de Fogo) */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center pointer-events-none">
        <span className="text-[11px] font-extrabold bg-black/30 px-1.5 py-0.5 rounded-md opacity-60">
          {$index}
        </span>
        {isMaisVendido && (
          <span title={`Top Vendas: ${$totalVendido} vendidos`}>
            <img 
              src={imgFavorito} 
              alt="Favorito" 
              className="w-4 h-4 drop-shadow-[0_0_5px_rgba(255,215,0,0.5)] animate-pulse" 
            />
          </span>
        )}
      </div>
      
      {/* Conteúdo Principal (Textos e Preço) */}
      <div className="text-center w-full mt-2.5">
        <label className="block text-[10px] font-extrabold uppercase tracking-widest opacity-70 mb-1">
          {$texto}
        </label>
        
        <h4 className="text-[13px] font-semibold m-0 leading-tight text-white line-clamp-2 min-h-[31px]">
          {$descricao.toUpperCase()}
        </h4>
        
        {/* Adicionei um estilo legal para o contador de quantidade que antes não tinha CSS definido */}
        {estaSelecionado && (
          <div className="mt-1 font-bold text-xs bg-black/40 text-success inline-block px-2 py-0.5 rounded-full">
            {quantidadeNoCarrinho}x
          </div>
        )}

        <div className="mt-2 text-success">
          <small className="text-[10px] font-semibold mr-0.5">R$</small>
          <strong className="text-lg font-black">{formatarParaReal($preco)}</strong>
        </div>
      </div>

      {/* Overlay de Esgotado */}
      {isEsgotado && (
        <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center text-white text-xs font-black tracking-widest -rotate-15 scale-125 z-20">
          {quantidadeNoCarrinho > 0 ? "LIMITE ESTOQUE" : "ESGOTADO"}
        </div>
      )}
      
      {/* Alerta Rodapé de Baixo Estoque */}
      {isEstoqueBaixo && !isEsgotado && (
        <div 
          className="absolute bottom-0 left-0 right-0 bg-orange-500 text-black text-[9px] font-extrabold p-0.5 text-center shadow-[0_-2px_10px_rgba(0,0,0,0.2)]" 
          title={`Estoque Baixo: ${$estoqueAtual} restantes`}
        >
          ⚠️ BAIXO ESTOQUE
        </div>
      )}
    </div>
  );
};

const comparadorDeProps = (prev, next) => {
  const pAnterior = prev.$produtosSelecionados.find(p => p.id_produto === prev.$id);
  const pAtual = next.$produtosSelecionados.find(p => p.id_produto === next.$id);

  if (pAnterior?.quantidade !== pAtual?.quantidade) return false;

  return (
    prev.$id === next.$id &&
    prev.$index === next.$index &&
    prev.$texto === next.$texto &&
    prev.$descricao === next.$descricao &&
    prev.$preco === next.$preco && 
    prev.$totalVendido === next.$totalVendido && 
    prev.$estoqueAtual === next.$estoqueAtual
  );
};

export default memo(Button, comparadorDeProps);