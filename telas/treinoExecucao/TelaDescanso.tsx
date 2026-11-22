import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AcoesTreino from './AcoesTreino';
import AnelProgresso from './AnelProgresso';
import { cores } from './cores';

type TelaDescansoProps = {
  segundosRestantes: number;
  duracaoTotalSegundos: number;
  proximaSerie: number;
  nomeProximoExercicio: string;
  pausado: boolean;
  compacta?: boolean;
  onTogglePause: () => void;
  onFinalizar: () => void;
};

export default function TelaDescanso({
  segundosRestantes,
  duracaoTotalSegundos,
  proximaSerie,
  nomeProximoExercicio,
  pausado,
  compacta = false,
  onTogglePause,
  onFinalizar,
}: TelaDescansoProps) {
  const progresso = duracaoTotalSegundos > 0 ? segundosRestantes / duracaoTotalSegundos : 0;
  const tamanhoAnel = compacta ? 180 : 240;

  return (
    <View style={styles.container}>
      <Text style={[styles.titulo, compacta && styles.tituloCompacto]}>Descanso</Text>

      <View style={styles.centroWrap}>
        <View style={styles.anelWrap}>
          <AnelProgresso valor={segundosRestantes} progresso={progresso} tamanho={tamanhoAnel} />
        </View>

        <Text style={styles.proximoLegenda}>{`Próximo: Série ${proximaSerie}`}</Text>
        <Text style={styles.proximoNome} numberOfLines={2}>
          {nomeProximoExercicio}
        </Text>
      </View>

      <View style={styles.acoesWrap}>
        <AcoesTreino pausado={pausado} onTogglePause={onTogglePause} onFinalizar={onFinalizar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    paddingTop: 12,
  },
  titulo: {
    flexShrink: 0,
    fontSize: 20,
    color: cores.textoSecundario,
    marginBottom: 8,
  },
  tituloCompacto: {
    fontSize: 17,
    marginBottom: 4,
  },
  centroWrap: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  anelWrap: {
    marginBottom: 16,
  },
  proximoLegenda: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginBottom: 2,
  },
  proximoNome: {
    fontSize: 16,
    fontWeight: '800',
    color: cores.texto,
    textAlign: 'center',
  },
  acoesWrap: {
    flexShrink: 0,
    width: '100%',
    paddingBottom: 8,
  },
});
