import { useState, useCallback } from 'react';
import { apiClient } from '../../../api/apiClient';

export const useObservacoes = () => {
  const [observacoes, setObservacoes] = useState([]);
  const [carregandoObs, setCarregandoObs] = useState(false);

  const buscarObservacoesNoPeriodo = useCallback(async (dataBusca) => {
    if (!dataBusca) return;
    setCarregandoObs(true);
    try {
      const dados = await apiClient.get(`/observacoes-diarias?data=${dataBusca}`);
      if (dados && !Array.isArray(dados)) {
        setObservacoes([dados]);
      } else {
        setObservacoes(Array.isArray(dados) ? dados : []);
      }
    } catch {
      setObservacoes([]);
    } finally {
      setCarregandoObs(false);
    }
  }, []);

  const salvarObservacao = async (data, texto, idEmpresa = null) => {
    if (!data || !texto.trim()) { alert('⚠️ Digite um texto para a observação.'); return false; }
    setCarregandoObs(true);
    try {
      await apiClient.post('/observacoes-diarias', { data, texto, id_empresa: idEmpresa });
      alert('✅ Observação salva com sucesso!');
      await buscarObservacoesNoPeriodo(data);
      return true;
    } catch (error) {
      alert(`❌ Erro ao salvar: ${error.message}`);
      return false;
    } finally {
      setCarregandoObs(false);
    }
  };

  const apagarObservacao = async (data) => {
    if (!data) return false;
    if (!window.confirm('Deseja realmente excluir esta observação?')) return false;
    try {
      await apiClient.delete(`/observacoes-diarias?data=${data}`);
      alert('✅ Observação removida.');
      setObservacoes([]);
      return true;
    } catch {
      alert('❌ Erro ao excluir.');
      return false;
    }
  };

  return { observacoes, setObservacoes, carregandoObs, buscarObservacoesNoPeriodo, salvarObservacao, apagarObservacao };
};
