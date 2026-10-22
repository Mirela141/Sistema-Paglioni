'use client';

export interface Evento {
  id: number;
  titulo?: string;
  nome?: string;
  descricao?: string;
  data_evento?: string;
  local?: string;
  vagas: number;
  categoria?: string;
}

export interface Participante {
  id: number;
  nome: string;
  email?: string;
  turma?: string;
}

interface EventoCardProps {
  evento: Evento;
  inscritos: Participante[];
}

export default function EventoCard({ evento, inscritos }: EventoCardProps) {
  const titulo = evento.titulo || evento.nome || 'Evento sem título';

  // Formata a data vinda do MySQL (Ex: 10/11/2026 19:00)
  const dataFormatada = evento.data_evento
    ? new Date(evento.data_evento).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  const vagasRestantes = evento.vagas;
  const totalInscritos = inscritos.length;
  const temVagas = vagasRestantes > 0;

  return (
    <div
      className="card-interactive"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div>
        {/* Cabeçalho do Card: Categoria e Status de Vagas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          {evento.categoria ? (
            <span
              style={{
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              🏷️ {evento.categoria}
            </span>
          ) : <span />}

          <span
            style={{
              backgroundColor: temVagas ? '#dcfce7' : '#fee2e2',
              color: temVagas ? '#15803d' : '#b91c1c',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            {temVagas ? 'ABERTO' : 'ESGOTADO'}
          </span>
        </div>

        {/* Título do Evento */}
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
          {titulo}
        </h3>

        {/* Descrição do Banco de Dados */}
        {evento.descricao && (
          <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {evento.descricao}
          </p>
        )}

        {/* Informações de Data, Local e Vagas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '0.88rem', color: '#334155' }}>
          {dataFormatada && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📅</span>
              <span><strong>Data:</strong> {dataFormatada}</span>
            </div>
          )}
          
          {evento.local && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📍</span>
              <span><strong>Local:</strong> {evento.local}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎟️</span>
            <span><strong>Vagas disponíveis:</strong> {vagasRestantes}</span>
          </div>
        </div>
      </div>

      {/* Seção de Participantes Inscritos */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '12px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
          👥 Inscritos ({totalInscritos})
        </div>

        {totalInscritos === 0 ? (
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
            Nenhum inscrito ainda.
          </span>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#334155' }}>
            {inscritos.map((p, index) => (
              <li key={p.id || index} style={{ marginBottom: '4px' }}>
                {p.nome} {p.turma ? `(${p.turma})` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}