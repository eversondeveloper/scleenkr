# EversCash Frontend 💻

O **EversCash Frontend** é uma aplicação Single Page Application (SPA) desenvolvida em **React**, projetada para oferecer uma experiência de Ponto de Venda (PDV) ágil, intuitiva e com ferramentas avançadas de gestão financeira.

## 🚀 Principais Funcionalidades

### 🛒 Ponto de Venda (PDV)
* **Catálogo Inteligente:** Listagem de produtos com busca em tempo real.
* **Carrinho Dinâmico:** Gerenciamento de itens, quantidades e subtotais.
* **Smart Change:** Sistema de cálculo de troco com atalhos de valores comuns.
* **Atalhos de Teclado:** Operação rápida para finalizar vendas sem o uso do mouse.

### 📊 Gestão e Relatórios
* **Fluxo de Caixa:** Dashboard com resumo de vendas brutas, sangrias e saldo líquido estimado.
* **Filtros Avançados:** Busca por período de datas e múltiplos métodos de pagamento simultâneos.
* **Auditoria de Vendas:** Identificação visual de vendas editadas e referências de transação (Pix/Cartão).
* **Exportação PDF:** Geração de relatórios profissionais para fechamento de caixa.
* **Notas Diárias:** Editor Rich Text (WYSIWYG) para registrar ocorrências do dia.

## 🏗️ Estrutura do Projeto

Abaixo, a organização dos principais arquivos e diretórios:

### `components/`
* **Relatórios:**
    * `TabelaVendasComponent.jsx`: Exibição detalhada de vendas e métodos.
    * `TabelaRetiradasComponent.jsx`: Gestão de sangrias/retiradas.
    * `SecaoResumo.jsx`: Cartões financeiros e totalização por método.
    * `SecaoFiltros.jsx`: Controles de data e pagamento.
    * `SecaoDelecao.jsx`: Ações de massa e exportação.
* **Modais:**
    * `ModalEdicaoVenda.jsx`: Correção de métodos de pagamento pós-venda.
    * `ModalRetirada.jsx`: Registro de novas saídas de caixa.
    * `ModalObservacao.jsx`: Editor de texto rico para notas diárias.

### `hooks/`
* `useVendas.js`: Integração com API de vendas e deleção.
* `useCalculos.js`: Lógica de processamento de totais e saldo líquido.
* `useGeracaoPDF.js`: Configuração e geração do documento PDF (jspdf/jspdf-autotable).
* `useObservacoes.js`: Gerenciamento do CRUD de notas diárias.

## 🛠️ Tecnologias Utilizadas

* **React.js:** Biblioteca principal.
* **Styled Components:** Estilização encapsulada e temas (Dark Mode).
* **Axios:** Consumo da API REST.
* **jsPDF:** Geração de relatórios em PDF.
* **Lucide React / FontAwesome:** Ícones de interface.

## 🔧 Como Executar

1.  Clone o repositório:
    ```bash
    git clone https://github.com/eversondeveloper/projeto_everscash.git
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure o arquivo `.env` com a URL da API:
    ```env
    REACT_APP_API_URL=http://localhost:3000
    ```
4.  Inicie a aplicação:
    ```bash
    npm start
    ```

© 2026 Everscript - Ponto de Venda e Gestão Inteligente.
