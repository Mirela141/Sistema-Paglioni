'use client';

import { useState } from 'react';

export interface Evento {
  id: number;
  nome?: string;
  titulo?: string;
  title?: string;
  vagas: number;
}

export interface Participante {
  id: number;
  nome: string;
  email?: string;
  turma?: string;
}

interface FormInscricaoProps {
  eventos: Evento[];
  participantes: Participante[];
  onInscrever: (eventoId: number, participanteId: number) => void;
}

export default function FormInscricao({ eventos, participantes, onInscrever }: FormInscricaoProps) {
  const [eventoId, setEventoId] = useState('');
  const [participanteId, setParticipanteId] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventoId || !participanteId) return;
    setEnviando(true);
    await onInscrever(Number(eventoId), Number(participanteId));
    setEventoId('');
    setParticipanteId('');
    setEnviando(false);
  };

  const selectStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    outline: 'none',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box' as const,
    marginTop: '6px'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', height: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.3rem' }}>✍️</span>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>
            Realizar Inscrição
          </h3>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Evento Desejado</label>
          <select
            value={eventoId}
            onChange={(e) => setEventoId(e.target.value)}
            required
            style={selectStyle}
          >
            <option value="">Selecione um evento...</option>
            {eventos.map((ev) => {
              const nomeEvento = ev.nome || ev.titulo || ev.title || `Evento #${ev.id}`;
              return (
                <option key={ev.id} value={ev.id} disabled={ev.vagas === 0}>
                  {nomeEvento} {ev.vagas === 0 ? '(Esgotado)' : `(${ev.vagas} vagas disponíveis)`}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Participante</label>
          <select
            value={participanteId}
            onChange={(e) => setParticipanteId(e.target.value)}
            required
            style={selectStyle}
          >
            <option value="">Selecione um participante...</option>
            {participantes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} — {p.turma}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="btn-action"
        style={{
          marginTop: '6px',
          padding: '12px',
          backgroundColor: '#059669',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: enviando ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
        }}
      >
        {enviando ? 'Inscrito...' : 'Confirmar Inscrição'}
      </button>
    </form>
  );
}