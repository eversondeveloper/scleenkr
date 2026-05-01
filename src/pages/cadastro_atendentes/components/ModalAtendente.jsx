import React, { useState, useEffect } from 'react';

export const ModalAtendente = ({ mostrar, onClose, atendenteEditando, onSalvar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    ativo: true
  });

  // Efeito para carregar os dados caso seja edição
  useEffect(() => {
    if (atendenteEditando) {
      setFormData({
        nome: atendenteEditando.nome || '',
        email: atendenteEditando.email || '',
        telefone: atendenteEditando.telefone || '',
        cpf: atendenteEditando.cpf || '',
        ativo: atendenteEditando.ativo ?? true
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        ativo: true
      });
    }
  }, [atendenteEditando, mostrar]);

  if (!mostrar) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) {
      alert("Nome e Email são obrigatórios!");
      return;
    }
    onSalvar(formData);
  };

  return (
    <div className="fixed inset-0 z-3000 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card p-6 md:p-8 rounded-xl w-full max-w-[500px] border border-border shadow-2xl relative">
        
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
          <h2 className="text-primary m-0 text-xl md:text-2xl font-medium">
            {atendenteEditando ? '✏️ Editar Atendente' : '👤 Novo Atendente'}
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-muted-foreground text-3xl cursor-pointer hover:text-foreground transition-colors leading-none p-0"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="m-0">
          <div className="flex flex-col mb-4">
            <label className="text-foreground text-sm font-medium mb-1.5">Nome Completo *</label>
            <input 
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: João Silva"
              required
              className="w-full p-2.5 bg-background text-foreground border border-border rounded-md text-sm outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-foreground text-sm font-medium mb-1.5">E-mail *</label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@empresa.com"
              required
              className="w-full p-2.5 bg-background text-foreground border border-border rounded-md text-sm outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex flex-col flex-1">
              <label className="text-foreground text-sm font-medium mb-1.5">Telefone</label>
              <input 
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="w-full p-2.5 bg-background text-foreground border border-border rounded-md text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-foreground text-sm font-medium mb-1.5">CPF *</label>
              <input 
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
                className="w-full p-2.5 bg-background text-foreground border border-border rounded-md text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>

          {atendenteEditando && (
            <div className="flex items-center gap-2 mb-6">
              <input 
                type="checkbox" 
                id="ativo"
                name="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                className="w-[18px] h-[18px] cursor-pointer accent-primary"
              />
              <label htmlFor="ativo" className="text-foreground text-sm cursor-pointer select-none m-0">Atendente Ativo</label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-5 border-t border-border mt-4">
            <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 bg-muted text-foreground rounded-md text-sm font-medium border-none cursor-pointer hover:bg-muted-foreground/20 transition-colors"
            >
              Cancelar
            </button>
            <button 
                type="submit"
                className="px-4 py-2 bg-success text-black rounded-md text-sm font-bold border-none cursor-pointer hover:brightness-110 transition-colors shadow-sm active:scale-95"
            >
              {atendenteEditando ? 'Atualizar Dados' : 'Cadastrar Atendente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};