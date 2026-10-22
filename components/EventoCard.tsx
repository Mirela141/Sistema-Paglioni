interface Evento {
  id: number;
  nome?: string;
  titulo?: string;
  title?: string;
  vagas: number;
}

interface Participante {
  id: number;
  nome: string;
  email?: string;
  turma?: string;
}

interface EventoCardProps {
  evento: Evento;
  inscritos?: Participante[];
}

export default function EventoCard({ evento, inscritos = [] }: EventoCardProps) {
  // Pega nome, titulo ou title (evita ficar em branco se a API usar outro nome de campo)
  const nomeEvento = evento?.nome || evento?.titulo || evento?.title || `Evento #${evento.id}`;
  const temVagas = evento.vagas > 0;
  const maxVagas = 30;
  const porcentagemPreenchida = Math.min(100, Math.max(0, ((maxVagas - evento.vagas) / maxVagas) * 100));

  return (
    <div className="card-interactive" style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Indicador Lateral */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '5px',
        height: '100%',
        backgroundColor: temVagas ? '#005693' : '#ef4444'
      }} />

      <div>
        {/* Título do Evento e Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, lineHeight: 1.3 }}>
            {nomeEvento}
          </h4>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            backgroundColor: temVagas ? '#ecfdf5' : '#fef2f2',
            color: temVagas ? '#047857' : '#b91c1c',
            whiteSpace: 'nowrap'
          }}>
            {temVagas ? 'Aberto' : 'Esgotado'}
          </span>
        </div>

        {/* Barra de Progresso */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '6px' }}>
            <span>Ocupação</span>
            <span style={{ fontWeight: 600, color: temVagas ? '#0f172a' : '#ef4444' }}>
              {evento.vagas} vaga(s) restante(s)
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${porcentagemPreenchida}%`,
              backgroundColor: temVagas ? '#005693' : '#ef4444',
              borderRadius: '3px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Lista de Participantes Inscritos */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
            👥 Inscritos ({inscritos.length}):
          </span>
        </div>

        {inscritos.length === 0 ? (
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
            Nenhum inscrito até o momento.
          </p>
        ) : (
          <ul style={{
            margin: 0,
            paddingLeft: '18px',
            fontSize: '0.85rem',
            color: '#475569',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            maxHeight: '100px',
            overflowY: 'auto'
          }}>
            {inscritos.map((p) => (
              <li key={p.id}>
                <strong style={{ color: '#0f172a' }}>{p.nome}</strong> {p.turma ? `(${p.turma})` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}