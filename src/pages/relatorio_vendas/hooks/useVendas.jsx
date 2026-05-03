import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../api/apiClient';

export const useVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarVendas = useCallback(async (inicio = null, fim = null) => {
    setCarregando(true);
    setErro(null);
    try {
      const params = new URLSearchParams();
      if (inicio) params.append('inicio', inicio);
      if (fim) params.append('fim', fim);
      const query = params.toString() ? `?${params.toString()}` : '';
      const dados = await apiClient.get(`/vendas${query}`);
      setVendas(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      setErro('Erro ao carregar dados. Verifique a conexão com a API.');
    } finally {
      setCarregando(false);
    }
  }, []);

  const deletarVenda = useCallback(async (id) => {
    try {
      await apiClient.delete(`/vendas/${id}`);
      await buscarVendas();
      return true;
    } catch (error) {
      console.error('Erro ao deletar venda:', error);
      return false;
    }
  }, [buscarVendas]);

  const deletarTudoPorPeriodo = useCallback(async (inicio, fim) => {
    try {
      await api.post('/vendas/deletar-periodo', { idsVendas: [] });
      await buscarVendas(inicio, fim);
      return true;
    } catch (error) {
      console.error('Erro ao deletar período em massa:', error);
      return false;
    }
  }, [buscarVendas]);

  const limparHistoricoTotal = useCallback(async () => {
    try {
      await apiClient.delete('/limpar-dados/total');
      setVendas([]);
      return true;
    } catch (error) {
      console.error('Erro ao limpar histórico total:', error);
      return false;
    }
  }, []);

  const atualizarPagamentosVenda = useCallback(async (idVenda, novosPagamentos) => {
    try {
      const vendaAtual = vendas.find(v => v.id_venda === idVenda);
      if (!vendaAtual) return false;
      const pagamentosParaEnviar = (novosPagamentos || []).map(p => ({
        metodo: String(p.metodo || 'Dinheiro'),
        valor_pago: parseFloat(p.valor_pago ?? p.valorPago ?? 0),
        referencia_metodo: p.referencia_metodo ?? p.referenciaMetodo ?? '',
      }));
      const novoValorPagoTotal = pagamentosParaEnviar.reduce((acc, p) => acc + p.valor_pago, 0);
      const valorBruto = parseFloat(vendaAtual.valor_total_bruto || 0);
      await apiClient.patch(`/vendas/${idVenda}/pagamentos`, {
        pagamentos: pagamentosParaEnviar,
        valor_pago_total: novoValorPagoTotal,
        valor_troco: Math.max(0, novoValorPagoTotal - valorBruto),
      });
      await buscarVendas();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar pagamentos:', error);
      return false;
    }
  }, [vendas, buscarVendas]);

  const atualizarVenda = useCallback(async (idVenda, dadosVenda) => {
    try {
      await apiClient.patch(`/vendas/${idVenda}`, dadosVenda);
      await buscarVendas();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      return false;
    }
  }, [buscarVendas]);

  useEffect(() => { buscarVendas(); }, [buscarVendas]);

  return { vendas, carregando, erro, buscarVendas, deletarVenda, deletarTudoPorPeriodo, limparHistoricoTotal, atualizarPagamentosVenda, atualizarVenda };
};
