// src/components/layout/SecaoPagina.tsx
import React, { JSX } from 'react';

interface SecaoPaginaProps {
  titulo?: string;
  subtitulo?: string;
  children: React.ReactNode;
  semPadding?: boolean;
  layout?: 'col' | 'row';
  semScrollGlobal?: boolean;
}

export const SecaoPagina: React.FC<SecaoPaginaProps> = ({
  titulo,
  subtitulo,
  children,
  semPadding = false,
  layout = 'col',
  semScrollGlobal = false,
}): JSX.Element => {
  const direcaoConteudo = layout === 'row' ? 'flex-col lg:flex-row' : 'flex-col';
  const classeAltura = semScrollGlobal ? 'h-full overflow-hidden' : 'min-h-full';

  return (
    <section
      className={`flex flex-col w-full ${classeAltura} ${semPadding ? '' : 'p-6 md:p-8'}`}
    >
      {(titulo || subtitulo) && (
        <header className="w-full text-center mb-8 pb-4 border-b border-border shrink-0">
          {titulo && (
            <h1 className="text-3xl font-light text-foreground mb-2 m-0">{titulo}</h1>
          )}
          {subtitulo && (
            <p className="text-base text-muted-foreground m-0">{subtitulo}</p>
          )}
        </header>
      )}

      <div className={`flex flex-1 w-full gap-6 min-h-0 ${direcaoConteudo}`}>
        {children}
      </div>
    </section>
  );
};