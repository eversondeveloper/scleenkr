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
    if (!nome) return "SISTEMA";
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
      const margin = 15;
      let y = 20;

      const cores = {
        texto: [44, 62, 80],
        suave: [127, 140, 141],
        accent: [52, 73, 94],
        fundoCard: [248, 250, 252],
        linha: [226, 232, 240],
        positivo: [39, 174, 96],
        negativo: [192, 57, 43],
        alerta: [243, 156, 18]
      };

      // Cálculos de Suporte
      const ticketMedio = quantidadeVendas > 0 ? totalVendasBruto / quantidadeVendas : 0;
      
      const consolidadoMetodos = {};
      vendasFiltradas.forEach(v => {
        v.pagamentos?.forEach(p => {
          consolidadoMetodos[p.metodo] = (consolidadoMetodos[p.metodo] || 0) + parseFloat(p.valor_pago || 0);
        });
      });

      const rankingProdutos = {};
      vendasFiltradas.forEach(v => {
        v.itens?.forEach(i => {
          const desc = i.descricao_item?.toUpperCase() || "NÃO IDENTIFICADO";
          rankingProdutos[desc] = (rankingProdutos[desc] || 0) + parseInt(i.quantidade || 0);
        });
      });
      const topProdutos = Object.entries(rankingProdutos).sort((a, b) => b[1] - a[1]).slice(0, 5);

      const checkPage = (heightNeeded) => {
        if (y + heightNeeded > pageHeight - 15) {
          doc.addPage();
          y = 20;
          return true;
        }
        return false;
      };

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...cores.accent);
      doc.text(dadosEmpresa?.nome_fantasia?.toUpperCase() || "$CLEENKR", margin, y);
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...cores.suave);
      doc.text(`AUDITORIA FINANCEIRA COMPLETA | CNPJ: ${dadosEmpresa?.cnpj || '---'}`, margin, y + 5);

      const periodo = `PERÍODO: ${filtroDataInicio ? formatarDataFiltro(filtroDataInicio) : 'INÍCIO'} - ${filtroDataFim ? formatarDataFiltro(filtroDataFim) : 'FIM'}`;
      doc.text(periodo, pageWidth - margin, y, { align: "right" });
      y += 15;

      // --- 1. DASHBOARD COM DESTAQUE PARA RETIRADAS ---
      doc.setFillColor(...cores.fundoCard);
      doc.roundedRect(margin, y, pageWidth - (margin * 2), 25, 2, 2, "F");
      
      const col = (pageWidth - (margin * 2)) / 5;
      const kpis = [
        { label: "VENDAS", val: quantidadeVendas },
        { label: "FATUR. BRUTO", val: `R$ ${totalVendasBruto.toFixed(2).replace('.', ',')}`, color: cores.texto },
        { label: "TOTAL RETIRADAS", val: `- R$ ${totalRetiradas.toFixed(2).replace('.', ',')}`, color: cores.negativo, bold: true },
        { label: "TICKET MÉDIO", val: `R$ ${ticketMedio.toFixed(2).replace('.', ',')}` },
        { label: "SALDO LÍQUIDO", val: `R$ ${totalLiquido.toFixed(2).replace('.', ',')}`, color: totalLiquido >= 0 ? cores.positivo : cores.negativo, bold: true }
      ];

      kpis.forEach((k, i) => {
        const posX = margin + (i * col) + 4;
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...cores.suave);
        doc.text(k.label, posX, y + 8);
        
        doc.setFontSize(k.bold ? 9.5 : 8.5);
        doc.setTextColor(...(k.color || cores.accent));
        doc.text(String(k.val), posX, y + 16);
      });
      y += 35;

      // --- 2. DISTRIBUIÇÃO E RANKING ---
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...cores.accent);
      doc.text("PAGAMENTOS POR MÉTODO", margin, y);
      doc.text("TOP PRODUTOS", pageWidth / 2 + 5, y);
      y += 5;

      const yStartStats = y;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      Object.entries(consolidadoMetodos).forEach(([metodo, valor]) => {
        doc.setTextColor(...cores.texto);
        doc.text(`${metodo}:`, margin, y);
        doc.setFont("helvetica", "bold");
        doc.text(`R$ ${valor.toFixed(2).replace('.', ',')}`, margin + 35, y);
        doc.setFont("helvetica", "normal");
        y += 5;
      });

      let yProd = yStartStats;
      topProdutos.forEach(([nome, qtd]) => {
        doc.setTextColor(...cores.texto);
        doc.text(`${qtd}x ${nome.substring(0, 22)}`, pageWidth / 2 + 5, yProd);
        yProd += 5;
      });

      y = Math.max(y, yProd) + 10;

      // --- 3. MOVIMENTAÇÕES DETALHADAS ---
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...cores.accent);
      doc.text("DETALHAMENTO DE TRANSAÇÕES", margin, y);
      y += 6;

      vendasFiltradas.forEach((venda) => {
        checkPage(35);
        doc.setFillColor(...cores.linha);
        doc.rect(margin, y, pageWidth - (margin * 2), 6, "F");
        doc.setFontSize(7.5);
        doc.setTextColor(...cores.texto);
        
        const status = venda.editada ? " [EDITADA]" : "";
        doc.text(`#${venda.id_venda}${status}`, margin + 2, y + 4.2);
        const dataH = new Date(venda.data_venda || venda.data_hora).toLocaleString("pt-BR");
        doc.text(dataH, margin + 35, y + 4.2);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...cores.alerta);
        doc.text(formatarIdentificacaoPDF(venda.nome_atendente, venda.cpf_atendente), pageWidth - margin - 2, y + 4.2, { align: "right" });
        y += 10;

        venda.itens?.forEach(item => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7);
          doc.setTextColor(...cores.texto);
          doc.text(`${item.quantity || item.quantidade}x ${(item.descricao_item || "PRODUTO").toUpperCase()}`, margin + 5, y);
          doc.text(`R$ ${parseFloat(item.subtotal || 0).toFixed(2).replace('.', ',')}`, pageWidth - margin - 40, y, { align: "right" });
          y += 4;
        });

        venda.pagamentos?.forEach(p => {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(6.5);
          doc.setTextColor(...cores.suave);
          const ref = p.referencia_metodo ? ` (Ref: ${p.referencia_metodo})` : "";
          doc.text(`${p.metodo}${ref}`, margin + 5, y);
          doc.text(`R$ ${parseFloat(p.valor_pago || 0).toFixed(2).replace('.', ',')}`, pageWidth - margin - 40, y, { align: "right" });
          y += 4;
        });

        if (parseFloat(venda.valor_troco) > 0) {
          doc.setFontSize(6.5);
          doc.setTextColor(...cores.alerta);
          doc.text(`TROCO: R$ ${parseFloat(venda.valor_troco).toFixed(2).replace('.', ',')}`, pageWidth - margin - 40, y, { align: "right" });
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...cores.positivo);
        doc.text(`TOTAL: R$ ${parseFloat(venda.valor_total_bruto).toFixed(2).replace('.', ',')}`, pageWidth - margin - 2, y, { align: "right" });
        
        y += 6;
        doc.setDrawColor(...cores.linha);
        doc.line(margin, y - 2, pageWidth - margin, y - 2);
        y += 4;
      });

      // --- 4. SEÇÃO DE RETIRADAS (SANGRIAS) ---
      if (retiradasFiltradas.length > 0) {
        checkPage(25);
        y += 5;
        doc.setFontSize(10);
        doc.setTextColor(...cores.negativo);
        doc.text("RETIRADAS DE CAIXA (SANGRIAS)", margin, y);
        y += 6;
        retiradasFiltradas.forEach(r => {
          checkPage(8);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...cores.texto);
          doc.text(`${new Date(r.data_retirada).toLocaleDateString('pt-BR')} - ${r.motivo || 'SEM MOTIVO'}`, margin + 2, y);
          doc.setFont("helvetica", "bold");
          doc.text(`- R$ ${parseFloat(r.valor).toFixed(2).replace('.', ',')}`, pageWidth - margin - 2, y, { align: "right" });
          y += 6;
        });
      }

      if (observacoes?.length > 0) {
        checkPage(20);
        y += 10;
        doc.setFontSize(10);
        doc.setTextColor(...cores.accent);
        doc.text("NOTAS DIÁRIAS", margin, y);
        y += 6;
        observacoes.forEach(obs => {
          const txt = processarHtmlParaTexto(obs.texto);
          const lines = doc.splitTextToSize(txt, pageWidth - (margin * 2));
          checkPage(lines.length * 5 + 10);
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.text(new Date(obs.data_observacao).toLocaleDateString('pt-BR'), margin, y);
          y += 4.5;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...cores.suave);
          doc.text(lines, margin, y);
          y += (lines.length * 5) + 5;
        });
      }

      const totalPaginas = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(...cores.suave);
        doc.text(`$CLEENKR — Gerado em ${new Date().toLocaleString()} — Página ${i} de ${totalPaginas}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      }

      doc.save(`Relatorio_Scleenkr_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Erro PDF:", error);
    } finally {
      setGerandoPDF(false);
    }
  };

  return { gerarPDF, gerandoPDF };
};