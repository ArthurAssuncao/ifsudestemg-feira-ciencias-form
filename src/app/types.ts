// types.ts
export interface Avaliador {
  id: string;
  nome: string;
  emailUsuario: string;
  emailProvedor: string;
}

export interface Trabalho {
  id: string;
  titulo: string;
  equipe: string; // G1, G2, etc.
  avaliadores: string[]; // IDs dos avaliadores
  hasObservacoes?: boolean;
}

export interface FormData {
  email: string;
  nomeAvaliador: string;
  titulo: string;
  numeroEquipe: string;
  dominioTema: string;
  exposicaoOral: string;
  usoRecursos: string;
  cumprimentoProposta: string;
  inovacaoCriatividade: string;
  observacoes: string;
}
