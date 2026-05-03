import { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '../../../api/apiClient';

export const useProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtroBusca, setFiltroBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [dadosFormulario, setDadosFormulario] = useState({});
  const [exibirFormulario, setExibirFormulario] = useState(false);

  const resetarFormulario = useCallback(() => {
    setProdutoEditando(null);
    setDadosFormulario({ categoria: '', descricao: '', preco: 0.00, tipoItem: 'Serviço', custoUnitario: 0.00, estoqueAtual: 0, codigoBarra: '' });
    setExibirFormulario(false);
  }, []);

  const iniciarNovoCadastro = useCallback(() => {
    resetarFormulario();
    setExibirFormulario(true);
  }, [resetarFormulario]);

  const buscarProdutos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await apiClient.get('/produtos');
      setProdutos(dados);
    } catch {
      setErro('Erro ao carregar produtos. API fora do ar ou URL incorreta.');
    } finally {
      setCarregando(false);
    }
  }, []);

  const salvarProduto = useCallback(async (evento) => {
    evento.preventDefault();
    const metodo = produtoEditando ? 'patch' : 'post';
    const path = produtoEditando ? `/produtos/${produtoEditando.id_produto}` : '/produtos';
    try {
      await apiClient[metodo](path, {
        ...dadosFormulario,
        estoqueAtual: parseFloat(dadosFormulario.estoqueAtual) || 0,
        custoUnitario: parseFloat(dadosFormulario.custoUnitario) || 0,
      });
      alert(`Produto ${produtoEditando ? 'atualizado' : 'cadastrado'} com sucesso!`);
      resetarFormulario();
      buscarProdutos();
    } catch (error) {
      alert(`Erro ao salvar produto: ${error.message}`);
    }
  }, [produtoEditando, dadosFormulario, resetarFormulario, buscarProdutos]);

  const desativarProduto = useCallback(async (idProduto) => {
    if (!window.confirm('Tem certeza que deseja desativar este produto?')) return;
    try {
      await apiClient.delete(`/produtos/${idProduto}`);
      alert('Produto desativado com sucesso.');
      buscarProdutos();
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  }, [buscarProdutos]);

  useEffect(() => { buscarProdutos(); resetarFormulario(); }, [buscarProdutos, resetarFormulario]);

  const iniciarEdicao = useCallback((produto) => {
    setProdutoEditando(produto);
    setDadosFormulario({
      categoria: produto.categoria, descricao: produto.descricao, preco: parseFloat(produto.preco),
      tipoItem: produto.tipo_item, custoUnitario: parseFloat(produto.custo_unitario),
      estoqueAtual: produto.estoque_atual, codigoBarra: produto.codigo_barra,
    });
    setExibirFormulario(true);
  }, []);

  const manipularMudanca = useCallback((evento) => {
    const { name, value } = evento.target;
    const parsedValue = (['preco', 'custoUnitario', 'estoqueAtual'].includes(name)) ? parseFloat(value) || 0 : value;
    setDadosFormulario(prev => ({ ...prev, [name]: parsedValue }));
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = filtroBusca.toLowerCase().trim();
    if (!termo) return produtos;
    return produtos.filter(p =>
      p.descricao.toLowerCase().includes(termo) ||
      p.categoria.toLowerCase().includes(termo) ||
      p.id_produto.toString().includes(termo)
    );
  }, [produtos, filtroBusca]);

  const isFormularioValido = useMemo(() =>
    dadosFormulario.descricao && dadosFormulario.categoria && (dadosFormulario.preco >= 0),
  [dadosFormulario]);

  const temDadosAlterados = useMemo(() => {
    if (!produtoEditando) return isFormularioValido;
    const original = {
      categoria: produtoEditando.categoria, descricao: produtoEditando.descricao,
      preco: parseFloat(produtoEditando.preco), tipoItem: produtoEditando.tipo_item,
      custoUnitario: parseFloat(produtoEditando.custo_unitario), estoqueAtual: produtoEditando.estoque_atual,
      codigoBarra: produtoEditando.codigo_barra,
    };
    return Object.keys(dadosFormulario).some(key => String(dadosFormulario[key]) !== String(original[key]));
  }, [produtoEditando, dadosFormulario, isFormularioValido]);

  const podeSalvar = useMemo(() => isFormularioValido && temDadosAlterados, [isFormularioValido, temDadosAlterados]);

  useEffect(() => {
    const handleEscKey = (e) => { if (e.keyCode === 27 && exibirFormulario) resetarFormulario(); };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [exibirFormulario, resetarFormulario]);

  useEffect(() => {
    document.body.style.overflow = exibirFormulario ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [exibirFormulario]);

  return {
    produtos, setProdutos, filtroBusca, setFiltroBusca, carregando, erro,
    produtoEditando, setProdutoEditando, dadosFormulario, exibirFormulario, setExibirFormulario,
    podeSalvar, resetarFormulario, iniciarNovoCadastro, salvarProduto, desativarProduto,
    iniciarEdicao, manipularMudanca, produtosFiltrados, buscarProdutos,
  };
};
