import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import type { FaseTreino } from '../../types/engajamento';

/** Cores das ilustrações por fase: bronze, prata e ouro. */
export const coresPremio: Record<
  FaseTreino,
  { principal: string; clara: string; fundo: string; texto: string; adjetivo: string }
> = {
  INICIANTE: { principal: '#b8732f', clara: '#f3c995', fundo: '#faeeda', texto: '#633806', adjetivo: 'de bronze' },
  INTERMEDIARIO: { principal: '#7d8a96', clara: '#d9dee3', fundo: '#eef1f4', texto: '#3d4852', adjetivo: 'prateados' },
  AVANCADO: { principal: '#c9971a', clara: '#f6dc8c', fundo: '#fdf4d8', texto: '#5c4306', adjetivo: 'dourados' },
};

export type TipoIlustracao = 'moeda' | 'moedas' | 'medalha' | 'estrela' | 'trofeu' | 'degraus';

interface IlustracaoProps {
  tipo: TipoIlustracao;
  fase: FaseTreino;
  /** Largura em px; a altura acompanha a proporção do desenho. */
  tamanho: number;
}

const ESTRELA_PEQUENA = 'M52 34l4.1 8.4 9.2 1.3-6.7 6.5 1.6 9.2-8.2-4.3-8.2 4.3 1.6-9.2-6.7-6.5 9.2-1.3z';

/** Desenhos dos prêmios (decorativos: o texto ao lado já diz qual é o prêmio). */
export default function IlustracaoPremio({ tipo, fase, tamanho }: IlustracaoProps) {
  const { principal, clara } = coresPremio[fase];
  const comum = { accessible: false, importantForAccessibility: 'no' as const };

  if (tipo === 'moeda') {
    return (
      <Svg width={tamanho} height={tamanho} viewBox="0 0 104 104" {...comum}>
        <Ellipse cx={52} cy={84} rx={34} ry={9} fill={principal} opacity={0.35} />
        <Circle cx={52} cy={48} r={34} fill={clara} stroke={principal} strokeWidth={5} />
        <Circle cx={52} cy={48} r={23} fill="none" stroke={principal} strokeWidth={3} />
        <Path d={ESTRELA_PEQUENA} fill={principal} />
      </Svg>
    );
  }

  if (tipo === 'moedas') {
    return (
      <Svg width={tamanho} height={(tamanho * 104) / 112} viewBox="0 0 112 104" {...comum}>
        <Ellipse cx={56} cy={90} rx={44} ry={8} fill={principal} opacity={0.3} />
        <Circle cx={40} cy={54} r={28} fill={clara} stroke={principal} strokeWidth={5} />
        <Circle cx={40} cy={54} r={18} fill="none" stroke={principal} strokeWidth={3} />
        <Circle cx={72} cy={42} r={28} fill={clara} stroke={principal} strokeWidth={5} />
        <Circle cx={72} cy={42} r={18} fill="none" stroke={principal} strokeWidth={3} />
        <Path d="M72 31v22M61 42h22" stroke={principal} strokeWidth={5} strokeLinecap="round" />
      </Svg>
    );
  }

  if (tipo === 'medalha') {
    return (
      <Svg width={(tamanho * 104) / 112} height={tamanho} viewBox="0 0 104 112" {...comum}>
        <Path d="M30 4h18l10 30H40z" fill="#3352e8" />
        <Path d="M74 4H56L46 34h18z" fill="#e2574c" />
        <Circle cx={52} cy={70} r={34} fill={clara} stroke={principal} strokeWidth={5} />
        <Circle cx={52} cy={70} r={23} fill="none" stroke={principal} strokeWidth={3} />
        <Path
          d="M52 55l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3-9.3-4.9-9.3 4.9 1.8-10.3-7.5-7.3 10.4-1.5z"
          fill={principal}
        />
      </Svg>
    );
  }

  if (tipo === 'estrela') {
    return (
      <Svg width={tamanho} height={(tamanho * 104) / 108} viewBox="0 0 108 104" {...comum}>
        <Path
          d="M54 6l14.4 29.2 32.2 4.7-23.3 22.7 5.5 32.1L54 79.5 25.2 94.7l5.5-32.1L7.4 39.9l32.2-4.7z"
          fill={clara}
          stroke={principal}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <Path
          d="M54 30l6.6 13.4 14.8 2.2-10.7 10.4 2.5 14.7L54 63.7l-13.2 7 2.5-14.7-10.7-10.4 14.8-2.2z"
          fill={principal}
        />
      </Svg>
    );
  }

  if (tipo === 'trofeu') {
    return (
      <Svg width={(tamanho * 104) / 108} height={tamanho} viewBox="0 0 104 108" {...comum}>
        <Path
          d="M28 20c-14 0-18 8-16 16 2 9 10 15 20 17"
          fill="none"
          stroke={principal}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <Path
          d="M76 20c14 0 18 8 16 16-2 9-10 15-20 17"
          fill="none"
          stroke={principal}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <Path
          d="M26 10h52v22c0 16-11 30-26 30S26 48 26 32z"
          fill={clara}
          stroke={principal}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <Path d="M52 22l3.8 7.7 8.5 1.2-6.2 6 1.5 8.5-7.6-4-7.6 4 1.5-8.5-6.2-6 8.5-1.2z" fill={principal} />
        <Path d="M45 62h14v16H45z" fill={principal} />
        <Rect x={30} y={78} width={44} height={12} rx={4} fill={clara} stroke={principal} strokeWidth={5} />
        <Rect x={24} y={92} width={56} height={10} rx={4} fill={principal} />
      </Svg>
    );
  }

  // degraus: subida de fase
  return (
    <Svg width={tamanho} height={(tamanho * 92) / 96} viewBox="0 0 96 92" {...comum}>
      <Rect x={6} y={58} width={26} height={28} rx={4} fill={clara} stroke={principal} strokeWidth={4} />
      <Rect x={35} y={42} width={26} height={44} rx={4} fill={clara} stroke={principal} strokeWidth={4} />
      <Rect x={64} y={24} width={26} height={62} rx={4} fill={principal} stroke={principal} strokeWidth={4} />
      <Path d="M14 40L44 18" stroke="#3352e8" strokeWidth={5} strokeLinecap="round" />
      <Path
        d="M33 14l13 3-4 13"
        fill="none"
        stroke="#3352e8"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
