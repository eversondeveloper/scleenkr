# 🎨 Scleenkr - Design System e Cores

O sistema Scleenkr utiliza a biblioteca Tailwind CSS (v4) aliada à arquitetura de cores do **Shadcn UI**. Essa abordagem permite alternar facilmente entre Tema Claro e Tema Escuro, além de facilitar a importação de componentes pré-construídos.

## 🧠 Como Funciona a Nomenclatura (A Regra do Foreground)
Para cada cor de **Fundo**, existe uma cor correspondente de **Texto** (Foreground). Isso garante que o contraste sempre seja legível, independente se a tela está clara ou escura.

* **Exemplo de Botão:** Se você usar `bg-primary` (fundo laranja), o texto dentro dele OBRIGATORIAMENTE deve ser `text-primary-foreground` (que será escuro no dark mode e branco no light mode).

---

## 📚 Dicionário de Classes Tailwind

### 1. Fundos e Superfícies
Usadas para estruturar a página e separar elementos.
* `bg-background`: Fundo raiz da aplicação (a tela inteira).
* `bg-card`: Superfícies fixas sobre o fundo (Header, Footer, Painéis de relatórios).
* `bg-popover`: Superfícies flutuantes (Dropdowns, Modais de fechamento de caixa).

### 2. Ações e Botões
Cores de destaque para interações do usuário.
* `bg-primary`: Cor da marca (Laranja). Usar nos botões de ação principal ("Gerar Cupom").
* `bg-success`: Ação positiva concluída (Verde). Usar em "Venda Finalizada".
* `bg-destructive`: Ações perigosas (Vermelho). Usar em "Cancelar Venda" ou "Excluir Produto".
* `bg-secondary`: Botões de menor importância (Cinza escuro/claro). Ex: "Voltar".

### 3. Textos (Tipografia)
* `text-foreground`: Texto padrão para ser lido sobre o `bg-background`.
* `text-muted-foreground`: Texto com menos contraste (cinza). Usar para rótulos, dicas, ícones secundários ou textos de "copyright" no rodapé.
* `text-primary`: Usar para destacar uma palavra solta ou o ícone da logo Scleenkr.

### 4. Interatividade e Estados (Hover)
Como se comportam os elementos quando o mouse passa por cima.
* `bg-accent`: A cor de fundo quando o usuário passa o mouse (`hover:bg-accent`) em um item de menu ou linha de tabela.
* `text-accent-foreground`: A cor do texto quando o item está em hover (`hover:text-accent-foreground`).

### 5. Bordas e Formulários
* `border-border`: Cor padrão para todas as bordas e divisórias (`<hr>`).
* `border-input`: Cor da borda específica para campos de digitação (`<input>`).
* `ring-ring`: A cor do "brilho/foco" em volta do input quando o usuário clica para digitar.

---

## 🛠️ Exemplos Práticos de Código

**Um botão principal da marca:**
\`\`\`jsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
  Finalizar Venda
</button>
\`\`\`

**Um item de menu flutuante (Dropdown):**
\`\`\`jsx
<li className="bg-popover text-popover-foreground hover:bg-accent hover:text-accent-foreground border border-border p-2">
  Configurações do Caixa
</li>
\`\`\`