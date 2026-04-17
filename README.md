# $cleenkr Frontend 💻

O **$cleenkr Frontend** (pronuncia-se *Clín-quer*) é uma aplicação Single Page Application (SPA) desenvolvida em **React**, projetada para ser a "máquina que trabalha" pelo negócio. Oferece uma experiência de Ponto de Venda (PDV) ágil, intuitiva e focada na sonoridade do lucro e na precisão da gestão financeira.

## 🚀 Principais Funcionalidades

### 🛒 Ponto de Venda (PDV)
* **Catálogo Inteligente:** Listagem de produtos com busca em tempo real e interface otimizada.
* **Carrinho Dinâmico:** Gerenciamento de itens, quantidades e cálculos automáticos de subtotais.
* **Smart Change:** Sistema inteligente de cálculo de troco com atalhos para valores comuns.
* **Atalhos de Teclado:** Operação de alta performance para finalizar vendas com agilidade total.

### 📊 Gestão e Relatórios
* **Fluxo de Caixa:** Dashboard com resumo de vendas brutas, sangrias e saldo líquido estimado.
* **Filtros Avançados:** Busca por período e múltiplos métodos de pagamento simultâneos.
* **Auditoria de Vendas:** Identificação visual de vendas editadas e referências de transação (Pix/Cartão).
* **Exportação PDF:** Geração de relatórios profissionais para fechamento de caixa e conferência.
* **Notas Diárias:** Registro de ocorrências via editor Rich Text (WYSIWYG).

## 🏗️ Estrutura do Projeto

A organização dos principais arquivos e diretórios reflete a robustez do sistema:

### `src/components/`
* **Relatórios:**
    * `TabelaVendasComponent.jsx`: Exibição detalhada de vendas e métodos.
    * `TabelaRetiradasComponent.jsx`: Gestão de sangrias/retiradas de caixa.
    * `SecaoResumo.jsx`: Cards financeiros com totalização por método.
    * `SecaoFiltros.jsx`: Controles dinâmicos de data e forma de pagamento.
* **Modais & UI:**
    * `ModalEdicaoVenda.jsx`: Ajuste de métodos de pagamento pós-venda.
    * `LogoScleenkr.jsx`: Componente SVG dinâmico da marca.
    * `ModalObservacao.jsx`: Editor de notas para registros diários.

### `src/hooks/`
* `useVendas.js`: Comunicação com a API de vendas e lógica de deleção.
* `useCalculos.js`: Processamento de totais, saldo líquido e métricas financeiras.
* `useGeracaoPDF.js`: Configuração e exportação de documentos (jspdf).
* `useSessoesCaixa.js`: Gerenciamento de abertura e fechamento de operadores.

## 🛠️ Tecnologias Utilizadas

* **React.js:** Estrutura principal da aplicação.
* **Styled Components:** Estilização moderna e encapsulada.
* **Axios:** Cliente HTTP para consumo da API $cleenkr.
* **jsPDF / AutoTable:** Motor de geração de relatórios.
* **Lucide React:** Ícones minimalistas e modernos.

## 🔧 Como Executar

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/eversondeveloper/scleenkr.git
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure o ambiente:**
    Crie um arquivo `.env` na raiz:
    ```env
    REACT_APP_API_URL=http://localhost:3000
    ```
4.  **Inicie a aplicação:**
    ```bash
    npm start
    ```

---

© 2026 $cleenkr - Gestão Comercial e Automação Inteligente.