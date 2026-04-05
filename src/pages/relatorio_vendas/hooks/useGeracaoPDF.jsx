/* eslint-disable no-unused-vars */
import { useState } from 'react';

export const useGeracaoPDF = () => {
  const [gerandoPDF, setGerandoPDF] = useState(false);

  const formatarDataFiltro = (dataString) => {
    if (!dataString) return '';
    const partes = dataString.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const processarHtmlParaTexto = (html) => {
    if (!html) return "";
    let texto = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<li>/gi, "  • ")
      .replace(/<[^>]+>/g, ""); 
    return texto.replace(/&nbsp;/g, ' ').trim();
  };

  const formatarIdentificacaoPDF = (nome, cpf) => {
    if (!nome) return "Sistema";
    const primeiroNome = nome.split(' ')[0].toUpperCase();
    const cpfLimpo = cpf?.replace(/\D/g, '') || "";
    const cpfFormatado = cpfLimpo.length === 11 
      ? `${cpfLimpo.substring(0, 3)}...${cpfLimpo.substring(9, 11)}` 
      : "";
    return cpfFormatado ? `${primeiroNome} (${cpfFormatado})` : primeiroNome;
  };

  const gerarPDF = async ({
    vendasFiltradas,
    retiradasFiltradas,
    totalVendasBruto,
    totalRetiradas,
    totalLiquido,
    quantidadeVendas,
    filtroDataInicio,
    filtroDataFim,
    dadosEmpresa,
    observacoes, 
  }) => {
    setGerandoPDF(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let y = 25;

      const cores = {
        texto: [44, 62, 80],
        suave: [127, 140, 141],
        accent: [52, 73, 94],
        fundoCard: [248, 250, 252],
        linha: [226, 232, 240],
        positivo: [39, 174, 96],
        negativo: [192, 57, 43]
      };

      const drawHeader = () => {
        // Logotipo / Nome Empresa
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(...cores.accent);
        doc.text(dadosEmpresa?.nome_fantasia?.toUpperCase() || "RELATÓRIO", margin, y);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...cores.suave);
        doc.text(dadosEmpresa?.cnpj ? `CNPJ: ${dadosEmpresa.cnpj}` : "", margin, y + 5);

        // Badge do Período (Alinhado à direita)
        const inicio = filtroDataInicio ? formatarDataFiltro(filtroDataInicio) : 'Início';
        const fim = filtroDataFim ? formatarDataFiltro(filtroDataFim) : 'Fim';
        const periodo = `PERÍODO: ${inicio} - ${fim}`;
        doc.setFontSize(8);
        doc.text(periodo, pageWidth - margin, y, { align: "right" });

        y += 15;
        doc.setDrawColor(...cores.linha);
        doc.line(margin, y, pageWidth - margin, y);
        y += 12;
      };

      const checkPage = (heightNeeded) => {
        if (y + heightNeeded > pageHeight - 20) {
          doc.addPage();
          y = 20;
          return true;
        }
        return false;
      };

      drawHeader();

      // --- 1. DASHBOARD DE RESUMO (CARDS MODERNOS) ---
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...cores.accent);
      doc.text("RESUMO EXECUTIVO", margin, y);
      y += 6;

      const cardW = (pageWidth - (margin * 2) - 10) / 3;
      const cards = [
        { label: "VENDAS", val: `${quantidadeVendas}`, sub: "transações" },
        { label: "BRUTO", val: `R$ ${totalVendasBruto.toFixed(2).replace('.', ',')}`, sub: "faturamento" },
        { label: "LÍQUIDO", val: `R$ ${totalLiquido.toFixed(2).replace('.', ',')}`, sub: "em caixa", color: totalLiquido >= 0 ? cores.positivo : cores.negativo }
      ];

      cards.forEach((c, i) => {
        const x = margin + (i * (cardW + 5));
        doc.setFillColor(...cores.fundoCard);
        doc.roundedRect(x, y, cardW, 22, 2, 2, "F");
        
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...cores.suave);
        doc.text(c.label, x + 4, y + 6);
        
        doc.setFontSize(11);
        doc.setTextColor(...(c.color || cores.accent));
        doc.text(c.val, x + 4, y + 13);
        
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...cores.suave);
        doc.text(c.sub, x + 4, y + 18);
      });

      y += 35;

      // --- 2. TABELA DE VENDAS (DESIGN CLEAN) ---
      if (vendasFiltradas.length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...cores.accent);
        doc.text("DETALHAMENTO DE VENDAS", margin, y);
        y += 6;

        // Header da Tabela
        doc.setFillColor(...cores.accent);
        doc.roundedRect(margin, y, pageWidth - (margin * 2), 8, 1, 1, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text("DATA/HORA", margin + 4, y + 5.5);
        doc.text("ATENDENTE", margin + 45, y + 5.5);
        doc.text("PAGAMENTO", margin + 95, y + 5.5);
        doc.text("TOTAL", pageWidth - margin - 4, y + 5.5, { align: "right" });
        y += 13;

        doc.setTextColor(...cores.texto);
        vendasFiltradas.forEach((v, i) => {
          checkPage(10);
          doc.setFont("helvetica", "normal");
          const dt = new Date(v.data_hora || v.data_venda).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
          doc.text(dt, margin + 4, y);
          doc.text(formatarIdentificacaoPDF(v.nome_atendente, v.cpf_atendente).substring(0, 22), margin + 45, y);
          
          const metodos = (v.pagamentos || []).map(p => p.metodo).join(', ');
          doc.text(metodos.substring(0, 25), margin + 95, y);
          
          doc.setFont("helvetica", "bold");
          doc.text(`R$ ${parseFloat(v.valor_total_bruto).toFixed(2).replace('.', ',')}`, pageWidth - margin - 4, y, { align: "right" });
          
          y += 4;
          doc.setDrawColor(...cores.linha);
          doc.line(margin + 2, y, pageWidth - margin - 2, y);
          y += 6;
        });
      }

      // --- 3. RETIRADAS ---
      if (retiradasFiltradas.length > 0) {
        y += 5;
        checkPage(30);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("RETIRADAS DE CAIXA", margin, y);
        y += 6;

        retiradasFiltradas.forEach(r => {
          checkPage(10);
          doc.setFillColor(255, 245, 245);
          doc.rect(margin, y - 4, pageWidth - (margin * 2), 7, "F");
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          const dr = new Date(r.data_retirada).toLocaleDateString('pt-BR');
          doc.text(`${dr} - ${r.motivo}`, margin + 4, y + 0.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...cores.negativo);
          doc.text(`- R$ ${parseFloat(r.valor).toFixed(2).replace('.', ',')}`, pageWidth - margin - 4, y + 0.5, { align: "right" });
          doc.setTextColor(...cores.texto);
          y += 9;
        });
      }

      // --- 4. NOTAS ---
      if (observacoes?.length > 0) {
        y += 5;
        checkPage(30);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("NOTAS E OBSERVAÇÕES", margin, y);
        y += 8;

        observacoes.forEach(obs => {
          const txt = processarHtmlParaTexto(obs.texto);
          const lines = doc.splitTextToSize(txt, pageWidth - (margin * 2) - 10);
          checkPage(lines.length * 5 + 10);
          
          doc.setDrawColor(...cores.accent);
          doc.setLineWidth(0.5);
          doc.line(margin, y - 4, margin, y + (lines.length * 5)); // Linha vertical de destaque
          
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.text(new Date(obs.data_observacao).toLocaleDateString('pt-BR'), margin + 5, y);
          y += 5;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...cores.suave);
          doc.text(lines, margin + 5, y);
          y += (lines.length * 5) + 5;
        });
      }

      // Rodapé com numeração
      const totalPaginas = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(...cores.suave);
        doc.text(`Documento gerado em ${new Date().toLocaleString()} — Página ${i} de ${totalPaginas}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      }

      doc.save(`Relatorio_${filtroDataInicio || 'Geral'}.pdf`);
    } catch (error) {
      console.error(error);
    } finally {
      setGerandoPDF(false);
    }
  };

  return { gerarPDF, gerandoPDF };
};