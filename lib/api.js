const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Função utilitária para garantir que recebemos sempre um Array
function extrairArray(resposta) {
  if (Array.isArray(resposta)) return resposta;
  if (resposta && typeof resposta === 'object') {
    return resposta.data || resposta.dados || resposta.inscricoes || resposta.eventos || resposta.participantes || [];
  }
  return [];
}

export async function getEventos() {
  const resposta = await fetch(`${API}/eventos`, { cache: 'no-store' });
  if (!resposta.ok) throw new Error('Erro ao buscar eventos');
  const dados = await resposta.json();
  return extrairArray(dados);
}

export async function getParticipantes() {
  const resposta = await fetch(`${API}/participantes`, { cache: 'no-store' });
  if (!resposta.ok) throw new Error('Erro ao buscar participantes');
  const dados = await resposta.json();
  return extrairArray(dados);
}

export async function getInscricoes() {
  try {
    const resposta = await fetch(`${API}/inscricoes`, { cache: 'no-store' });
    if (!resposta.ok) return [];
    const dados = await resposta.json();
    return extrairArray(dados);
  } catch (err) {
    console.error('Erro ao buscar inscrições:', err);
    return [];
  }
}

export async function cadastrarParticipante(dados) {
  const resposta = await fetch(`${API}/participantes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  const resData = await resposta.json();
  return { ok: resposta.ok, dados: resData };
}

export async function inscrever(evento_id, participante_id) {
  const resposta = await fetch(`${API}/inscricoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evento_id, participante_id })
  });
  const dados = await resposta.json();
  return { ok: resposta.ok, dados };
}