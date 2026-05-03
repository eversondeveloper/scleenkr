import React from 'react';

export const SecaoPagina = ({ 
  titulo, 
  subtitulo, 
  children, 
  semPadding = false,
  layout = 'col',
  semScrollGlobal = false
}) => {
  
  const direcaoConteudo = layout === 'row' ? 'flex-col lg:flex-row' : 'flex-col';
  
  // Se semScrollGlobal for true, a página trava exatamente no tamanho da tela (h-full overflow-hidden)
  const classeAltura = semScrollGlobal ? 'h-full overflow-hidden' : 'min-h-full';

  return (
    <section className={`flex flex-col w-full ${classeAltura} ${semPadding ? '' : 'p-6 md:p-8'}`}>
      
      {(titulo || subtitulo) && (
        <header className="w-full text-center mb-8 pb-4 border-b border-border shrink-0">
          {titulo && <h1 className="text-3xl font-light text-foreground mb-2 m-0">{titulo}</h1>}
          {subtitulo && <p className="text-base text-muted-foreground m-0">{subtitulo}</p>}
        </header>
      )}

      {/* O min-h-0 aqui é crucial para o flexbox entender que não deve estourar a tela */}
      <div className={`flex flex-1 w-full gap-6 min-h-0 ${direcaoConteudo}`}>
        {children}
      </div>
      
    </section>
  );
};