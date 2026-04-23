import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../api/client';

export const useAtendentes = () => {
  const [atendentes, setAtendentes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const buscarAtendentes = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');
      const dados = await api.get('/atendentes');
      setAtendentes(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao buscar atendentes:', error);
      setErro(error.message);
      setAtendentes([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarAtendentes(); }, [buscarAtendentes]);

  const criarAtendente = async (dadosAtendente, idEmpresa) => {
    if (!idEmpresa) {
      return { sucesso: false, erro: 'ID da empresa não detectado. Cadastre a empresa primeiro.' };
    }
    try {
      const resultado = await api.post('/atendentes', { ...dadosAtendente, id_empresa: idEmpresa });
      await buscarAtendentes();
      return { sucesso: true, atendente: resultado.atendente };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  };

  const atualizarAtendente = async (id, dadosAtendente) => {
    try {
      const resultado = await api.put(`/atendentes/${id}`, dadosAtendente);
      await buscarAtendentes();
      return { sucesso: true, atendente: resultado.atendente };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  };

  const deletarAtendente = async (id) => {
    const confirmar = window.confirm('⚠️ ATENÇÃO: Deseja EXCLUIR permanentemente este atendente? Esta ação não pode ser desfeita.');
    if (!confirmar) return { sucesso: false };
    try {
      await api.delete(`/atendentes/${id}`);
      await buscarAtendentes();
      return { sucesso: true };
    } catch (error) {
      console.error('Erro ao deletar atendente:', error);
      return { sucesso: false, erro: error.message };
    }
  };

  return { atendentes, carregando, erro, criarAtendente, atualizarAtendente, deletarAtendente, buscarAtendentes };
};
