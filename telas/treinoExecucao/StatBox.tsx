import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from './cores';

type StatBoxProps = {
  label: string;
  valor: string;
  compacta?: boolean;
};

export default function StatBox({ label, valor, compacta = false }: StatBoxProps) {
  return (
    <View style={[styles.container, compacta && styles.containerCompacto]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.valor, compacta && styles.valorCompacto]}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.cartao,
    paddingVertical: 10,
    alignItems: 'center',
  },
  containerCompacto: {
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginBottom: 2,
  },
  valor: {
    fontSize: 16,
    fontWeight: '800',
    color: cores.texto,
  },
  valorCompacto: {
    fontSize: 14,
  },
});
