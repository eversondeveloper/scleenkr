import { useState, useEffect } from 'react';
import { apiClient } from '../../../api/apiClient';

export const useEmpresa = () => {
  const [dadosEmpresa, setDadosEmpresa] = useState(null);
  const [carregandoEmpresa, setCarregandoEmpresa] = useState(true);
  const [erroEmpresa, setErroEmpresa] = useState(null);

  useEffect(() => {
    const buscarEmpresa = async () => {
      setCarregandoEmpresa(true);
      setErroEmpresa(null);
      try {
        const dados = await apiClient.get('/empresas');
        if (dados.length > 0) {
          setDadosEmpresa(dados[0]);
        } else {
          setErroEmpresa('Nenhuma empresa encontrada na base de dados.');
        }
      } catch (error) {
        console.error('Erro ao buscar dados da empresa:', error);
        setErroEmpresa('❌ Erro ao carregar dados da empresa da API.');
      } finally {
        setCarregandoEmpresa(false);
      }
    };
    buscarEmpresa();
  }, []);

  return { dadosEmpresa, carregandoEmpresa, erroEmpresa };
};
