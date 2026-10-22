'use client';

import { useEffect, useState, useMemo } from 'react';
import { getEventos, getParticipantes, getInscricoes, cadastrarParticipante, inscrever } from '@/lib/api';
import FormParticipante from '@/components/FormParticipante';
import FormInscricao, { Evento, Participante } from '@/components/FormInscricao';
import EventoCard from '@/components/EventoCard';

interface Inscricao {
  id?: number | string;
  evento_id?: number | string;
  eventoId?: number | string;
  id_evento?: number | string;
  participante_id?: number | string;
  participanteId?: number | string;
  id_participante?: number | string;
  evento?: any;
  participante?: any;
}

export default function Home() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  async function carregarDados() {
    try {
      const [evs, parts, inscs] = await Promise.all([
        getEventos(),
        getParticipantes(),
        getInscricoes()
      ]);
      
      console.log('--- DADOS CARREGADOS DA API ---');
      console.log('Eventos:', evs);
      console.log('Participantes:', parts);
      console.log('Inscrições:', inscs);

      setEventos(evs || []);
      setParticipantes(parts || []);
      setInscricoes(inscs || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function handleCadastrarParticipante(dados: { nome: string; email: string; turma: string }) {
    setMensagem(null);
    const { ok, dados: resData } = await cadastrarParticipante(dados);
    if (!ok) {
      setMensagem({ tipo: 'erro', texto: resData.erro || 'Erro ao cadastrar participante.' });
      return;
    }
    setMensagem({ tipo: 'sucesso', texto: 'Participante cadastrado com sucesso!' });
    carregarDados();
  }

  async function handleInscrever(eventoId: number, participanteId: number) {
    setMensagem(null);
    const { ok, dados: resData } = await inscrever(eventoId, participanteId);
    if (!ok) {
      setMensagem({ tipo: 'erro', texto: resData.erro || 'Erro ao realizar inscrição.' });
      return;
    }
    setMensagem({ tipo: 'sucesso', texto: 'Inscrição realizada com sucesso!' });
    carregarDados();
  }

  // Lógica universal para encontrar inscritos de um evento
  function obterInscritosDoEvento(eventoId: number | string): Participante[] {
    if (!Array.isArray(inscricoes)) return [];

    // 1. Filtra as inscrições pertencentes a este evento (convertendo tudo para String)
    const inscricoesDoEvento = inscricoes.filter((i: any) => {
      const evId = i?.evento_id ?? i?.eventoId ?? i?.id_evento ?? i?.evento?.id ?? i?.evento;
      return String(evId) === String(eventoId);
    });

    // 2. Mapeia os participantes encontrados
    const listaFinal: Participante[] = [];

    inscricoesDoEvento.forEach((i: any) => {
      // Caso 1: O objeto participante vem diretamente na inscrição
      if (i?.participante && typeof i.participante === 'object' && i.participante.nome) {
        listaFinal.push(i.participante);
      } else {
        // Caso 2: A inscrição guarda apenas o ID do participante
        const partId = i?.participante_id ?? i?.participanteId ?? i?.id_participante ?? i?.participante;
        const participanteEncontrado = participantes.find((p) => String(p.id) === String(partId));
        if (participanteEncontrado) {
          listaFinal.push(participanteEncontrado);
        }
      }
    });

    return listaFinal;
  }

  const eventosFiltrados = useMemo(() => {
    if (!Array.isArray(eventos)) return [];
    return eventos.filter((ev) => {
      const nomeOuTitulo = ev?.nome || ev?.titulo || ev?.title || '';
      return nomeOuTitulo.toLowerCase().includes((busca || '').toLowerCase());
    });
  }, [eventos, busca]);

  const totalVagasDisponiveis = eventos.reduce((acc, ev) => acc + (ev.vagas || 0), 0);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", color: '#0f172a' }}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade { animation: fadeIn 0.3s ease-out forwards; }
        .card-interactive { transition: all 0.25s ease; }
        .card-interactive:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0, 86, 147, 0.12) !important; }
        .btn-action { transition: all 0.2s ease; }
        .btn-action:hover { filter: brightness(1.08); transform: translateY(-1px); }
      `}</style>

      <header style={{ background: 'linear-gradient(135deg, #005693 0%, #003a64 100%)', color: '#ffffff', padding: '32px 0 48px 0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>🎓</span>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Eventos SENAI</h1>
            </div>
            <p style={{ margin: '6px 0 0 0', opacity: 0.85, fontSize: '0.95rem' }}>Plataforma Integrada de Inscrições e Vagas</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem' }}>
            🟢 API Online
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1080px', margin: '-28px auto 48px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="card-interactive" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Eventos Ativos</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#005693', marginTop: '4px' }}>{eventos.length}</div>
          </div>
          <div className="card-interactive" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Participantes</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>{participantes.length}</div>
          </div>
          <div className="card-interactive" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Vagas Abertas</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>{totalVagasDisponiveis}</div>
          </div>
        </div>

        {mensagem && (
          <div className="animate-fade" style={{
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '28px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: mensagem.tipo === 'sucesso' ? '#ecfdf5' : '#fef2f2',
            color: mensagem.tipo === 'sucesso' ? '#065f46' : '#991b1b',
            border: `1px solid ${mensagem.tipo === 'sucesso' ? '#a7f3d0' : '#fecaca'}`
          }}>
            <span>{mensagem.tipo === 'sucesso' ? '🎉' : '⚠️'} {mensagem.texto}</span>
            <button onClick={() => setMensagem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div className="card-interactive" style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
            <FormParticipante onCadastrar={handleCadastrarParticipante} />
          </div>
          <div className="card-interactive" style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
            <FormInscricao eventos={eventos} participantes={participantes} onInscrever={handleInscrever} />
          </div>
        </div>

        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a', fontWeight: 700 }}>
              Eventos Disponíveis
            </h2>
            <input
              type="text"
              placeholder="🔍 Buscar evento..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', width: '260px' }}
            />
          </div>

          {carregando ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>Carregando eventos...</div>
          ) : eventosFiltrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
              Nenhum evento encontrado.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {eventosFiltrados.map((evt) => (
                <EventoCard
                  key={evt.id}
                  evento={evt}
                  inscritos={obterInscritosDoEvento(evt.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}