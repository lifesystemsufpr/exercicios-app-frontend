export interface TreinoRealizadoResumoDTO {
  nome: string;
  fase: string;
  nivel: number;
  quantidadeExercicios: number;
  duracaoMinutos: number;
}

export interface PerguntaRefazerDTO {
  sessaoId: number;
  mensagem: string;
}

export interface InicioParticipanteDTO {
  participanteId: number;
  mes: number;
  ano: number;
  diasComTreino: number[];
  /**
   * Resumo do treino feito em cada dia do mês (chave = dia). Alimenta o card
   * "Treino realizado" da tela Início, que só aparece quando o participante
   * toca num dia marcado no calendário.
   */
  treinosPorDia: Record<number, TreinoRealizadoResumoDTO>;
  /** Se o participante já realizou um treino que conta (ver filtroSessoesQueContam) hoje. */
  treinouHoje: boolean;
  /** Se o participante já completou as 3 sessões de treino da semana atual. */
  semanaCompleta: boolean;
  /**
   * Opção opcional "deseja refazer esse treino?", exibida uma única vez quando
   * a última sessão ficou com ≥50% (já conta). Abaixo de 50% o refazer é
   * obrigatório e este campo fica nulo.
   */
  perguntaRefazer: PerguntaRefazerDTO | null;
}
