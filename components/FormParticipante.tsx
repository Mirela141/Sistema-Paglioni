'use client';

import { useState } from 'react';

interface FormParticipanteProps {
  onCadastrar: (dados: { nome: string; email: string; turma: string }) => void;
}

export default function FormParticipante({ onCadastrar }: FormParticipanteProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [turma, setTurma] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    await onCadastrar({ nome, email, turma });
    setNome('');
    setEmail('');
    setTurma('');
    setEnviando(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginTop: '6px',
    backgroundColor: '#f8fafc',
    transition: 'border-color 0.2s, background-color 0.2s'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.3rem' }}>👤</span>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>
          Cadastrar Participante
        </h3>
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Nome Completo</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Guilherme Silva"
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ex: guilherme@senai.br"
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Turma / Código</label>
        <input
          type="text"
          value={turma}
          onChange={(e) => setTurma(e.target.value)}
          placeholder="Ex: DEV-A"
          required
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="btn-action"
        style={{
          marginTop: '6px',
          padding: '12px',
          backgroundColor: '#005693',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: enviando ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 12px rgba(0, 86, 147, 0.2)'
        }}
      >
        {enviando ? 'Cadastrando...' : 'Cadastrar Participante'}
      </button>
    </form>
  );
}