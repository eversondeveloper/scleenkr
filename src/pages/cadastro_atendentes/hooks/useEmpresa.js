import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../../../api/apiClient';

export const useEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [carregandoEmpresa, setCarregandoEmpresa] = useState(true);
  const [erroEmpresa, setErroEmpresa] = useState(null);

  const buscarEmpresa = useCallback(async () => {
    setCarregandoEmpresa(true);
    setErroEmpresa(null);
    try {
      const dados = await apiClient.get('/empresas');
      if (Array.isArray(dados) && dados.length > 0) {
        const emp = dados[0];
        setEmpresa({ ...emp, id_empresa: emp.id_empresa || emp.id });
      } else {
        setEmpresa(null);
      }
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      setErroEmpresa(error.message);
      setEmpresa(null);
    } finally {
      setCarregandoEmpresa(false);
    }
  }, []);

  const cadastrarEmpresa = async (dados) => {
    try {
      await apiClient.post('/empresas', dados);
      await buscarEmpresa();
      return { sucesso: true };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  };

  const atualizarEmpresa = async (id, dados) => {
    try {
      await apiClient.patch(`/empresas/${id}`, dados);
      await buscarEmpresa();
      return { sucesso: true };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  };

  const deletarEmpresa = async (id) => {
    if (!id) return { sucesso: false, erro: 'ID da empresa não informado.' };
    const confirmacao = window.confirm(
      '⚠️ AVISO CRÍTICO DE RESET ⚠️\n\n' +
      'Ao confirmar, você apagará permanentemente:\n' +
      '- Dados da Empresa\n- Todo o histórico de Vendas e Pagamentos\n' +
      '- Todas as Sessões de Caixa e Retiradas\n' +
      '- Todos os Atendentes e Produtos vinculados\n\n' +
      'Esta ação NÃO PODE SER DESFEITA. Deseja continuar?'
    );
    if (!confirmacao) return { sucesso: false };
    try {
      await apiClient.delete(`/empresas/${id}`);
      setEmpresa(null);
      await buscarEmpresa();
      alert('Sistema resetado com sucesso. Todos os dados foram apagados.');
      return { sucesso: true };
    } catch (error) {
      console.error('Erro na deleção:', error);
      alert(error.message);
      return { sucesso: false, erro: error.message };
    }
  };

  useEffect(() => { buscarEmpresa(); }, [buscarEmpresa]);

  return { empresa, carregandoEmpresa, erroEmpresa, cadastrarEmpresa, atualizarEmpresa, deletarEmpresa, buscarEmpresa };
};
