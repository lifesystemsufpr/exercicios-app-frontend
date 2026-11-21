import type { FaseTreino } from './engajamento';

/** O que UM treino rendeu (resposta de POST /avaliacoes → resumoSessao). */
export type PremioSessao =
  | { tipo: 'TREINO'; pontos: number }
  | { tipo: 'BONUS_SEGUNDO_TREINO'; pontos: number }
  | { tipo: 'MEDALHA'; pontos: number }
  | { tipo: 'ESTRELA'; pontos: number }
  /** Nível concluído: troféu + estrela + pontos. */
  | { tipo: 'TROFEU'; pontos: number; fase: FaseTreino; nivel: number };

export type ProgressaoSessao =
  | { tipo: 'NIVEL'; novaFase: FaseTreino; novoNivel: number }
  | { tipo: 'FASE'; faseAnterior: FaseTreino; novaFase: FaseTreino; novoNivel: number }
  | { tipo: 'PROGRAMA_CONCLUIDO' };

export interface ResumoSessaoDTO {
  /** Fase do treino feito: define a cor dos prêmios (bronze, prata, ouro). */
  fase: FaseTreino;
  nivel: number;
  /** 1, 2 ou 3: qual treino da semana foi este. */
  ordemNaSemana: number;
  pontosGanhos: number;
  premios: PremioSessao[];
  progressao: ProgressaoSessao | null;
}

export interface ResultadoFeedback {
  /** null quando a sessão não conta (interrompida antes de 50%) ou o servidor é antigo. */
  resumoSessao: ResumoSessaoDTO | null;
  /** Totais do participante depois deste treino. */
  totais: { estrelas: number; trofeus: number } | null;
}
