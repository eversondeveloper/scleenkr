import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../api/apiClient';

const getDataAtualFormatada = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const getTimeAtualFormatada = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};
const formatarDataDB = (dataString) => {
  if (!dataString) return getDataAtualFormatada();
  const date = new Date(dataString);
  if (isNaN(date.getTime())) return getDataAtualFormatada();
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
};
const formatarHoraDB = (dataString) => {
  if (!dataString) return getTimeAtualFormatada();
  const date = new Date(dataString);
  if (isNaN(date.getTime())) return getTimeAtualFormatada();
  return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
};

export const useRetiradas = () => {
  const [retiradas, setRetiradas] = useState([]);
  const [retiradasFiltradas, setRetiradasFiltradas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [retiradaEditando, setRetiradaEditando] = useState(null);
  const [novaRetirada, setNovaRetirada] = useState({
    valorRetirado: '', motivo: '', observacao: '',
    dataRetirada: getDataAtualFormatada(), timeRetirada: getTimeAtualFormatada(),
  });

  const buscarRetiradas = useCallback(async (dataInicio = '', dataFim = '') => {
    try {
      const params = new URLSearchParams();
      if (dataInicio) params.append('inicio', dataInicio);
      if (dataFim) params.append('fim', dataFim);
      const query = params.toString() ? `?${params.toString()}` : '';
      const dados = await apiClient.get(`/retiradas-caixa${query}`);
      const lista = Array.isArray(dados) ? dados : [];
      setRetiradas(lista);
      setRetiradasFiltradas(lista);
    } catch (erro) {
      console.error('Erro de conexão ao buscar retiradas:', erro);
      setRetiradas([]);
      setRetiradasFiltradas([]);
    }
  }, []);

  const filtrarRetiradasLocalmente = useCallback((dataInicio, dataFim) => {
    if (!retiradas.length) return;
    const filtradas = retiradas.filter((r) => {
      const dataStr = formatarDataDB(r.data_retirada || r.data_corrigida);
      if (!dataInicio && !dataFim) return true;
      if (dataInicio && dataFim && dataInicio === dataFim) return dataStr === dataInicio;
      if (dataInicio && !dataFim) return dataStr >= dataInicio;
      if (!dataInicio && dataFim) return dataStr <= dataFim;
      return dataStr >= dataInicio && dataStr <= dataFim;
    });
    setRetiradasFiltradas(filtradas);
  }, [retiradas]);

  const combinarDataHora = useCallback((data, hora) => `${data}T${hora}:00`, []);

  const registrarRetirada = useCallback(async () => {
    if (!novaRetirada.valorRetirado || !novaRetirada.motivo) throw new Error('Preencha o valor e o motivo da retirada.');
    const valor = parseFloat(String(novaRetirada.valorRetirado).replace(',', '.'));
    if (isNaN(valor) || valor <= 0) throw new Error('Digite um valor numérico válido.');
    const resultado = await apiClient.post('/retiradas-caixa', {
      valor,
      motivo: novaRetirada.motivo,
      observacao: novaRetirada.observacao || '',
      dataRetirada: combinarDataHora(novaRetirada.dataRetirada, novaRetirada.timeRetirada),
    });
    await buscarRetiradas(getDataAtualFormatada(), getDataAtualFormatada());
    return resultado;
  }, [novaRetirada, combinarDataHora, buscarRetiradas]);

  const atualizarRetirada = useCallback(async (id, dados) => {
    const resultado = await apiClient.patch(`/retiradas-caixa/${id}`, {
      valor: parseFloat(String(dados.valorRetirado).replace(',', '.')),
      motivo: dados.motivo,
      observacao: dados.observacao || '',
      dataRetirada: combinarDataHora(dados.dataRetirada, dados.timeRetirada),
    });
    await buscarRetiradas(getDataAtualFormatada(), getDataAtualFormatada());
    return resultado;
  }, [combinarDataHora, buscarRetiradas]);

  const deletarRetirada = useCallback(async (id) => {
    await api.delete(`/retiradas-caixa/${id}`);
    await buscarRetiradas(getDataAtualFormatada(), getDataAtualFormatada());
    return true;
  }, [buscarRetiradas]);

  const resetarFormulario = useCallback(() => {
    setNovaRetirada({ valorRetirado: '', motivo: '', observacao: '', dataRetirada: getDataAtualFormatada(), timeRetirada: getTimeAtualFormatada() });
  }, []);

  const abrirModalEdicao = useCallback((retirada) => {
    setRetiradaEditando(retirada);
    const dataHoraDB = retirada.data_retirada || retirada.data_corrigida;
    setNovaRetirada({
      valorRetirado: retirada.valor.toString(), motivo: retirada.motivo,
      observacao: retirada.observacao || '',
      dataRetirada: formatarDataDB(dataHoraDB), timeRetirada: formatarHoraDB(dataHoraDB),
    });
    setModalEdicao(true);
  }, []);

  const fecharModalEdicao = useCallback(() => {
    setModalEdicao(false);
    setRetiradaEditando(null);
    resetarFormulario();
  }, [resetarFormulario]);

  useEffect(() => {
    const dataAtual = getDataAtualFormatada();
    buscarRetiradas(dataAtual, dataAtual);
  }, [buscarRetiradas]);

  return {
    retiradas, retiradasFiltradas, mostrarModal, setMostrarModal,
    modalEdicao, setModalEdicao, retiradaEditando, novaRetirada, setNovaRetirada,
    buscarRetiradas, filtrarRetiradasLocalmente, registrarRetirada,
    atualizarRetirada, deletarRetirada, abrirModalEdicao, fecharModalEdicao, resetarFormulario,
  };
};
