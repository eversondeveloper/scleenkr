import React from 'react';

export const SecaoFiltrosAtendentes = ({
  filtroNome,
  setFiltroNome,
  filtroAtivo,
  setFiltroAtivo,
  onLimparFiltros
}) => {
  // Estilo padronizado para os inputs conforme sua paleta
  const inputStyle = {
    padding: '10px 12px',
    backgroundColor: '#1e1e1e', // Ultra escuro
    color: '#E0E0E0',
    border: '1px solid #444',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    marginTop: '5px'
  };

  const labelStyle = {
    color: '#A0A0A0',
    fontSize: '13px',
    fontWeight: '300'
  };

  return (
    <div className="secao-filtros" style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px' }}>
      <div className="titulo-secao" style={{ color: '#FF9800', fontSize: '16px', fontWeight: '500', marginBottom: '5px' }}>
        🔍 Filtros de Busca
      </div>
      <p style={{ color: '#888', margin: '0 0 20px 0', fontSize: '13px' }}>
        Filtre os atendentes por nome e status para uma gestão mais rápida.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'end' }}>
        {/* Filtro por Nome */}
        <div className="input-group">
          <label htmlFor="filtro-nome" style={labelStyle}>Buscar por nome</label>
          <input
            id="filtro-nome"
            type="text"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            placeholder="Digite o nome..."
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#FF9800'}
            onBlur={(e) => e.target.style.borderColor = '#444'}
          />
        </div>

        {/* Filtro por Status */}
        <div className="input-group">
          <label htmlFor="filtro-status" style={labelStyle}>Status do Cadastro</label>
          <select
            id="filtro-status"
            value={filtroAtivo}
            onChange={(e) => setFiltroAtivo(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#FF9800'}
            onBlur={(e) => e.target.style.borderColor = '#444'}
          >
            <option value="todos">Todos os status</option>
            <option value="ativos">Apenas ativos</option>
            <option value="inativos">Apenas inativos</option>
          </select>
        </div>

        {/* Botão Limpar Filtros */}
        <button
          onClick={onLimparFiltros}
          disabled={!filtroNome && filtroAtivo === 'todos'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#444',
            color: '#E0E0E0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            height: '40px',
            fontSize: '13px',
            transition: '0.2s',
            opacity: (!filtroNome && filtroAtivo === 'todos') ? 0.5 : 1
          }}
          onMouseOver={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#555')}
          onMouseOut={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#444')}
        >
          Limpar Filtros
        </button>
      </div>

      {/* Badge de Filtros Ativos */}
      {(filtroNome || filtroAtivo !== 'todos') && (
        <div style={{ 
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#1e1e1e',
          borderLeft: '4px solid #FF9800',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '13px' }}>
            <span style={{ color: '#888' }}>Filtros ativos: </span>
            {filtroNome && <span style={{ color: '#FF9800', marginLeft: '10px' }}>Nome: "{filtroNome}"</span>}
            {filtroAtivo !== 'todos' && (
              <span style={{ color: '#64ff8a', marginLeft: '10px' }}>
                Status: {filtroAtivo === 'ativos' ? 'Ativos' : 'Inativos'}
              </span>
            )}
          </div>
          <button
            onClick={onLimparFiltros}
            style={{ background: 'none', border: 'none', color: '#E53935', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
          >
            REMOVER TODOS
          </button>
        </div>
      )}
    </div>
  );
};