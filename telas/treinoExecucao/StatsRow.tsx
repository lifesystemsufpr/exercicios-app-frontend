import React from 'react';
import { StyleSheet, View } from 'react-native';

import StatBox from './StatBox';

type StatsRowProps = {
  serieAtual: number;
  totalSeries: number;
  duracaoSegundos: number;
  descansoSegundos: number;
  compacta?: boolean;
};

export default function StatsRow({
  serieAtual,
  totalSeries,
  duracaoSegundos,
  descansoSegundos,
  compacta = false,
}: StatsRowProps) {
  return (
    <View style={[styles.container, compacta && styles.containerCompacto]}>
      <StatBox label="Série" valor={`${serieAtual}/${totalSeries}`} compacta={compacta} />
      <StatBox label="Duração" valor={`${duracaoSegundos}s`} compacta={compacta} />
      <StatBox label="Descanso" valor={`${descansoSegundos}s`} compacta={compacta} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 6,
  },
  containerCompacto: {
    gap: 8,
    marginBottom: 4,
  },
});
