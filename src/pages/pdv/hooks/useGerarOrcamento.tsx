// src/pages/pdv/hooks/useGerarOrcamento.ts
import { useState } from 'react';
import type { Empresa } from '@/lib/models/Empresa';

// ---------------------------------------------------------
// Tipos
// ---------------------------------------------------------
interface ProdutoSelecionado {
  idUnico?: string | number;
  id_produto?: number;
  categoria?: string;
  descricao: string;
  quantidade: number;
  preco: number;
}

interface GerarOrcamentoParams {
  produtosSelecionados: ProdutoSelecionado[];
  totalGeral: number;
  nomeCliente?: string;
  emailCliente?: string;
  telefoneCliente?: string;
  observacoes?: string;
  dadosEmpresa: Empresa | null;
}

interface UseGerarOrcamentoReturn {
  gerarOrcamentoPDF: (params: GerarOrcamentoParams) => Promise<void>;
  gerandoOrcamento: boolean;
  erroPDF: string | null;
}

// ---------------------------------------------------------
// Função auxiliar (não precisa ser exportada)
// ---------------------------------------------------------
function formatarMoeda(valor: number | string | undefined | null): string {
  return parseFloat(String(valor ?? 0))
    .toFixed(2)
    .replace('.', ',');
}

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------
export function useGerarOrcamento(): UseGerarOrcamentoReturn {
  const [gerandoOrcamento, setGerandoOrcamento] = useState<boolean>(false);
  const [erroPDF, setErroPDF] = useState<string | null>(null);

  const gerarOrcamentoPDF = async (params: GerarOrcamentoParams) => {
    const {
      produtosSelecionados,
      totalGeral,
      nomeCliente = '',
      emailCliente = '',
      telefoneCliente = '',
      observacoes = '',
      dadosEmpresa,
    } = params;

    if (!produtosSelecionados || produtosSelecionados.length === 0) {
      setErroPDF('Não há produtos selecionados para gerar orçamento.');
      console.warn('Não há produtos selecionados para gerar orçamento.');
      return;
    }

    setGerandoOrcamento(true);
    setErroPDF(null);

    try {
      const produtosValidos = produtosSelecionados.filter(
        (produto) => produto && produto.descricao && produto.preco !== undefined
      );

      if (produtosValidos.length === 0) {
        throw new Error('Nenhum produto válido para gerar orçamento.');
      }

      // Importação dinâmica do jsPDF com tipagem básica
      let jsPDF: any;
      try {
        const jspdfModule = await import('jspdf');
        jsPDF = jspdfModule.jsPDF;
      } catch (importError) {
        throw new Error('Biblioteca de PDF não disponível. Tente instalar: npm install jspdf');
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 20;
      let currentPage = 1;

      const cores = {
        primaria: [25, 25, 25],
        secundaria: [100, 100, 100],
        destaque: [41, 128, 185],
        sucesso: [39, 174, 96],
        alerta: [230, 126, 34],
        fundo: [250, 250, 250],
        borda: [230, 230, 230],
      };

      const adicionarTexto = (
        texto: string | null | undefined,
        x: number,
        yPos: number,
        options?: Record<string, unknown>
      ) => {
        try {
          const textoFinal = texto || '-';
          doc.text(String(textoFinal), x, yPos, options);
        } catch (textError) {
          console.warn('Erro ao adicionar texto:', textError, { texto, x, yPos });
          doc.text('(erro)', x, yPos, options);
        }
      };

      const adicionarCabecalhoPagina = () => {
        doc.setFillColor(...cores.primaria);
        doc.rect(0, 0, pageWidth, 15, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text('ORÇAMENTO', 20, 10);

        doc.setFontSize(9);
        doc.setTextColor(200, 200, 200);
        doc.text(`Página ${currentPage}`, pageWidth - 20, 10, { align: 'right' });

        doc.setDrawColor(...cores.destaque);
        doc.setLineWidth(0.5);
        doc.line(20, 17, pageWidth - 20, 17);

        y = 25;
      };

      adicionarCabecalhoPagina();

      // Informações da empresa
      try {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...cores.destaque);
        adicionarTexto('INFORMAÇÕES DA EMPRESA', 20, y);
        y += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...cores.primaria);

        if (dadosEmpresa) {
          const nomePrincipal = dadosEmpresa.nome_fantasia || dadosEmpresa.razao_social || 'Empresa Não Cadastrada';

          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          adicionarTexto(nomePrincipal.toUpperCase(), 20, y);
          y += 5;
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');

          if (dadosEmpresa.cnpj) {
            adicionarTexto(`CNPJ: ${dadosEmpresa.cnpj}`, 20, y);
            y += 4;
          }
          if (dadosEmpresa.inscricao_estadual) {
            adicionarTexto(`IE: ${dadosEmpresa.inscricao_estadual}`, 20, y);
            y += 4;
          }

          const enderecoCompleto = [
            dadosEmpresa.endereco,
            dadosEmpresa.cidade,
            dadosEmpresa.estado,
            dadosEmpresa.cep ? `CEP: ${dadosEmpresa.cep}` : null,
          ]
            .filter(Boolean)
            .join(' - ');

          if (enderecoCompleto) {
            adicionarTexto(`Endereço: ${enderecoCompleto}`, 20, y);
            y += 4;
          }

          const telefoneEmail = [
            dadosEmpresa.telefone ? `Tel: ${dadosEmpresa.telefone}` : null,
            dadosEmpresa.email ? `Email: ${dadosEmpresa.email}` : null,
          ]
            .filter(Boolean)
            .join(' | ');

          if (telefoneEmail) {
            adicionarTexto(telefoneEmail, 20, y);
            y += 4;
          }
        } else {
          adicionarTexto('Dados da Empresa indisponíveis.', 20, y);
          y += 4;
        }

        y += 6;
        doc.setDrawColor(...cores.borda);
        doc.setLineWidth(0.3);
        doc.line(20, y, pageWidth - 20, y);
        y += 8;
      } catch (sectionError) {
        console.error('Erro na seção da empresa:', sectionError);
        y += 30;
      }

      // Informações do cliente
      try {
        if (nomeCliente || emailCliente || telefoneCliente || observacoes) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...cores.destaque);
          adicionarTexto('INFORMAÇÕES DO CLIENTE', 20, y);
          y += 7;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(...cores.primaria);

          if (nomeCliente) {
            adicionarTexto(`Nome: ${nomeCliente}`, 20, y);
            y += 4;
          }
          if (emailCliente) {
            adicionarTexto(`E-mail: ${emailCliente}`, 20, y);
            y += 4;
          }
          if (telefoneCliente) {
            adicionarTexto(`Telefone: ${telefoneCliente}`, 20, y);
            y += 4;
          }
          if (observacoes && observacoes.trim()) {
            doc.setFont('helvetica', 'italic');
            adicionarTexto(`Observações: ${observacoes}`, 20, y);
            y += 4;
            doc.setFont('helvetica', 'normal');
          }

          y += 6;
          doc.line(20, y, pageWidth - 20, y);
          y += 8;
        }
      } catch (clientError) {
        console.error('Erro na seção do cliente:', clientError);
        y += 20;
      }

      // Tabela de produtos
      try {
        if (y > pageHeight - 50) {
          doc.addPage();
          currentPage++;
          adicionarCabecalhoPagina();
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...cores.destaque);
        adicionarTexto('DETALHES DOS PRODUTOS / SERVIÇOS', 20, y);
        y += 7;

        doc.setFillColor(...cores.primaria);
        doc.rect(20, y, pageWidth - 40, 6, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('Descrição', 25, y + 4);
        doc.text('Qtd.', 125, y + 4);
        doc.text('Unitário', 145, y + 4);
        doc.text('Total', pageWidth - 25, y + 4, { align: 'right' });
        y += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        produtosValidos.forEach((produto, index) => {
          const preco = parseFloat(String(produto.preco ?? 0));
          const totalItem = preco * produto.quantidade;

          const descricao = `${produto.categoria || ''} - ${produto.descricao || ''}`.trim();
          const descricaoLinhas = doc.splitTextToSize(descricao, 95);

          const alturaNecessaria = descricaoLinhas.length * 4 + 2;

          if (y + alturaNecessaria > pageHeight - 20) {
            doc.addPage();
            currentPage++;
            adicionarCabecalhoPagina();
            y += 10;

            doc.setFillColor(...cores.primaria);
            doc.rect(20, y, pageWidth - 40, 6, 'F');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text('Descrição', 25, y + 4);
            doc.text('Qtd.', 125, y + 4);
            doc.text('Unitário', 145, y + 4);
            doc.text('Total', pageWidth - 25, y + 4, { align: 'right' });
            y += 7;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
          }

          if (index % 2 === 0) {
            doc.setFillColor(...cores.fundo);
            doc.rect(20, y - 1, pageWidth - 40, alturaNecessaria, 'F');
          }

          doc.setTextColor(...cores.primaria);
          let linhaY = y + 4;
          descricaoLinhas.forEach((linha: string) => {
            adicionarTexto(linha, 25, linhaY);
            linhaY += 4;
          });

          const yBase = y + 4;
          doc.setTextColor(...cores.secundaria);
          adicionarTexto(String(produto.quantidade), 125, yBase);

          doc.setTextColor(...cores.primaria);
          adicionarTexto(`R$ ${formatarMoeda(preco)}`, 145, yBase);

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...cores.sucesso);
          adicionarTexto(`R$ ${formatarMoeda(totalItem)}`, pageWidth - 25, yBase, { align: 'right' });
          doc.setFont('helvetica', 'normal');

          y += alturaNecessaria;
        });

        y += 10;
      } catch (productsError) {
        console.error('Erro na tabela de produtos:', productsError);
        y += produtosValidos.length * 15;
      }

      // Resumo financeiro
      if (y > pageHeight - 60) {
        doc.addPage();
        currentPage++;
        adicionarCabecalhoPagina();
      }

      try {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...cores.destaque);
        adicionarTexto('RESUMO FINANCEIRO', 20, y);
        y += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        doc.setTextColor(...cores.primaria);
        adicionarTexto('Subtotal:', 25, y + 4);
        doc.setTextColor(...cores.secundaria);
        adicionarTexto(`R$ ${formatarMoeda(totalGeral)}`, pageWidth - 25, y + 4, { align: 'right' });
        y += 6;

        doc.setDrawColor(...cores.borda);
        doc.line(20, y, pageWidth - 20, y);
        y += 6;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...cores.sucesso);
        adicionarTexto('TOTAL DO ORÇAMENTO:', 25, y + 5);
        adicionarTexto(`R$ ${formatarMoeda(totalGeral)}`, pageWidth - 25, y + 5, { align: 'right' });
        y += 10;

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(...cores.alerta);
        const dataValidade = new Date();
        dataValidade.setDate(dataValidade.getDate() + 30);
        adicionarTexto(`Validade da Proposta: ${dataValidade.toLocaleDateString('pt-BR')} (30 dias)`, 20, y + 4);
        y += 10;
      } catch (summaryError) {
        console.error('Erro no resumo financeiro:', summaryError);
      }

      // Rodapé de páginas
      const totalPaginas = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);

        doc.setDrawColor(...cores.borda);
        doc.setLineWidth(0.3);
        doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...cores.secundaria);
        doc.text(`Orçamento • Página ${i} de ${totalPaginas}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

        const dataImpressao = new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        doc.text(`Impresso: ${dataImpressao}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
      }

      try {
        const dataAtual = new Date().toISOString().split('T')[0];
        const nomeClienteFormatado = nomeCliente
          ? `_${nomeCliente.replace(/\s+/g, '_').substring(0, 20)}`
          : '';
        const nomeArquivo = `orcamento${nomeClienteFormatado}_${dataAtual}.pdf`;
        doc.save(nomeArquivo);
      } catch (saveError) {
        throw new Error('Erro ao salvar arquivo PDF. Verifique as permissões do navegador.');
      }
    } catch (error: unknown) {
      console.error('Erro crítico ao gerar orçamento PDF:', error);
      const mensagem =
        error instanceof Error ? error.message : 'Erro desconhecido ao gerar PDF';
      setErroPDF(mensagem);
      alert(`Não foi possível gerar o PDF:\n${mensagem}\n\nVerifique o console para mais detalhes.`);
    } finally {
      setGerandoOrcamento(false);
    }
  };

  return {
    gerarOrcamentoPDF,
    gerandoOrcamento,
    erroPDF,
  };
}