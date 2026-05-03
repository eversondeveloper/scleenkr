import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../api/apiClient';

export const useSessoesCaixa = () => {
  const [sessoes, setSessoes] = useState([]);
  const [sessaoAtual, setSessaoAtual] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const buscarSessaoAtual = useCallback(async () => {
    try {
      const sessao = await apiClient.get('/sessoes-caixa/atual');
      setSessaoAtual(sessao || null);
      return sessao;
    } catch {
      setSessaoAtual(null);
      return null;
    }
  }, []);

  const buscarSessoes = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await apiClient.get('/sessoes-caixa');
      setSessoes(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro buscarSessoes:', error);
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  const abrirSessaoCaixa = async (dadosSessao) => {
    const idEmpresaFinal = dadosSessao.id_empresa;
    if (!idEmpresaFinal) return { sucesso: false, erro: 'ID da empresa não detectado no envio.' };
    try {
      setErro('');
      const resultado = await apiClient.post('/sessoes-caixa', {
        id_atendente: dadosSessao.id_atendente,
        valor_inicial: parseFloat(dadosSessao.valor_inicial) || 0,
        id_empresa: idEmpresaFinal,
      });
      setSessaoAtual(resultado.sessao);
      await buscarSessaoAtual();
      await buscarSessoes();
      return { sucesso: true, sessao: resultado.sessao };
    } catch (error) {
      setErro(error.message);
      return { sucesso: false, erro: error.message };
    }
  };

  const fecharSessaoCaixa = async (idSessao, dadosFechamento = {}) => {
    try {
      setErro('');
      await apiClient.put(`/sessoes-caixa/${idSessao}/fechar`, {
        valor_final: parseFloat(dadosFechamento.valor_final) || 0,
      });
      setSessaoAtual(null);
      await buscarSessaoAtual();
      await buscarSessoes();
      return { sucesso: true };
    } catch (error) {
      setErro(error.message);
      return { sucesso: false, erro: error.message };
    }
  };

  useEffect(() => {
    buscarSessaoAtual();
    const intervalo = setInterval(() => buscarSessaoAtual(), 30000);
    return () => clearInterval(intervalo);
  }, [buscarSessaoAtual]);

  useEffect(() => { buscarSessoes(); }, [buscarSessoes]);

  return { sessoes, sessaoAtual, carregando, erro, buscarSessoes, buscarSessaoAtual, abrirSessaoCaixa, fecharSessaoCaixa };
};
