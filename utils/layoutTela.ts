import { Platform, useWindowDimensions } from 'react-native';

/** Largura máxima do “frame” de celular (web e telas largas). */
export const LARGURA_MAX_TELA = 390;

/** Altura de referência do frame em monitores; em telas menores encolhe. */
export const ALTURA_REF_TELA = 720;

/** Padding externo do frame (horizontal/vertical). */
export const PADDING_SHELL = 16;

export type DimensoesTela = {
  larguraShell: number;
  alturaShell: number;
  /** Telas baixas: reduzir paddings e tipografia generosa. */
  compacta: boolean;
};

/**
 * Dimensões do shell das telas do app.
 * - No dispositivo nativo: usa quase toda a área útil (sem altura fixa que corta).
 * - Na web: mantém o frame de celular, mas adapta à janela para não estourar.
 */
export function useDimensoesTela(): DimensoesTela {
  const { width, height } = useWindowDimensions();

  const larguraDisponivel = Math.max(280, width - PADDING_SHELL * 2);
  const alturaDisponivel = Math.max(480, height - PADDING_SHELL * 2);

  const larguraShell = Math.min(LARGURA_MAX_TELA, larguraDisponivel);
  const alturaShell =
    Platform.OS === 'web'
      ? Math.min(ALTURA_REF_TELA, alturaDisponivel)
      : alturaDisponivel;

  return {
    larguraShell,
    alturaShell,
    compacta: alturaShell < 640 || larguraShell < 360,
  };
}
