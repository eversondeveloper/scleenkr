import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../../../api/apiClient';
import clickSound from '/sounds/selecionar.mp3';

export const useCupom = () => {
  const [empresas, setEmpresas] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [detalhesVenda, setDetalhesVenda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [gerandoPDF, setGerandoPDF] = useState(false);

  const audioClick = useRef(new Audio(clickSound));

  const click = useCallback(() => {
    audioClick.current.currentTime = 0;
    audioClick.current.volume = 1.0;
    audioClick.current.play();
  }, []);

  const formatarMoeda = useCallback((valor) =>
    parseFloat(valor || 0).toFixed(2).replace('.', ','), []);

  const buscarDadosIniciais = useCallback(async () => {
    setCarregando(true);
    try {
      const [dadosVendas, dadosEmpresas] = await Promise.all([
        apiClient.get('/vendas'),
        apiClient.get('/empresas'),
      ]);
      setVendas(dadosVendas);
      setEmpresas(dadosEmpresas);
      if (dadosEmpresas.length > 0) setEmpresaSelecionada(dadosEmpresas[0]);
      if (dadosVendas.length > 0) {
        setVendaSelecionada(dadosVendas.find(v => v.status_venda === 'Finalizada') || dadosVendas[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Erro ao carregar dados das APIs.');
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarDetalhesVenda = useCallback(async (idVenda) => {
    setDetalhesVenda(null);
    try {
      const dados = await apiClient.get(`/vendas/${idVenda}`);
      setDetalhesVenda(dados);
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    }
  }, []);

  useEffect(() => { buscarDadosIniciais(); }, [buscarDadosIniciais]);

  useEffect(() => {
    if (vendaSelecionada) buscarDetalhesVenda(vendaSelecionada.id_venda);
  }, [vendaSelecionada, buscarDetalhesVenda]);

  const handleVendaChange = useCallback((id) => {
    setVendaSelecionada(vendas.find(v => v.id_venda === parseInt(id)) || null);
    click();
  }, [vendas, click]);

  const gerarPDFCupom = useCallback(async () => {
    if (!empresaSelecionada || !detalhesVenda) { alert('Dados incompletos para gerar o cupom.'); return; }
    setGerandoPDF(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 200] });
      const empresa = empresaSelecionada;
      const venda = detalhesVenda;
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 10;
      const LS = 4.5, IL = 4;

      doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.text(empresa.nome_fantasia || empresa.razao_social, pageWidth/2, y, { align: 'center' }); y += 5;
      doc.setFontSize(6); doc.setFont('helvetica', 'normal');
      doc.text(`CNPJ: ${empresa.cnpj} | IE: ${empresa.inscricao_estadual}`, pageWidth/2, y, { align: 'center' }); y += LS;
      doc.text(empresa.endereco || '', pageWidth/2, y, { align: 'center' }); y += LS;
      doc.text(`${empresa.cidade||''}/${empresa.estado||''}`, pageWidth/2, y, { align: 'center' }); y += LS;
      doc.text(`Tel: ${empresa.telefone||''}`, pageWidth/2, y, { align: 'center' }); y += 8;
      doc.line(5, y, pageWidth-5, y); y += LS+1;
      doc.setFontSize(8); doc.setFont('helvetica', 'bold');
      doc.text('Comprovante de Vendas', pageWidth/2, y, { align: 'center' }); y += LS+1;
      doc.setFont('helvetica', 'normal');
      doc.text(`Venda ID: ${venda.id_venda}`, 10, y); y += LS;
      doc.text(`Data: ${new Date(venda.data_hora).toLocaleString('pt-BR')}`, 10, y); y += 8;
      doc.line(5, y, pageWidth-5, y); y += LS;
      doc.setFont('helvetica', 'bold');
      doc.text('ITEM', 10, y); doc.text('QTD', 45, y); doc.text('TOTAL', 65, y); y += 4;
      doc.line(5, y, pageWidth-5, y); y += 3;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
      venda.itens?.forEach((item) => {
        const linhas = doc.splitTextToSize(`${item.descricao_item.toUpperCase()} (${item.categoria})`, 50);
        const iy = y;
        linhas.forEach(l => { doc.text(l, 10, y); y += IL; });
        doc.text(item.quantidade.toString(), 45, iy);
        doc.text(`R$ ${formatarMoeda(item.subtotal)}`, 65, iy);
        y += 1;
      });
      y += 3; doc.line(5, y, pageWidth-5, y); y += LS+2;
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL BRUTO: R$ ${formatarMoeda(venda.valor_total_bruto)}`, 10, y); y += LS+1;
      doc.setFontSize(7);
      venda.pagamentos?.forEach(p => { doc.text(`${p.metodo}: R$ ${formatarMoeda(p.valor_pago)}`, 10, y); y += 3; });
      y += 5; doc.line(5, y, pageWidth-5, y); y += 8;
      doc.setFontSize(6);
      doc.text('*** OBRIGADO PELA PREFERÊNCIA ***', pageWidth/2, y, { align: 'center' });
      doc.save(`cupom_venda_${venda.id_venda}.pdf`);
    } catch (error) {
      console.error('Erro PDF:', error);
    } finally {
      setGerandoPDF(false);
    }
  }, [empresaSelecionada, detalhesVenda, formatarMoeda]);

  return { empresas, vendas, vendaSelecionada, empresaSelecionada, detalhesVenda, carregando, erro, gerandoPDF, click, formatarMoeda, handleVendaChange, gerarPDFCupom };
};
