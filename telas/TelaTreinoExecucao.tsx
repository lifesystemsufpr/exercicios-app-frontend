import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import AcoesTreino from './treinoExecucao/AcoesTreino';
import { cores } from './treinoExecucao/cores';
import ExercicioHeader from './treinoExecucao/ExercicioHeader';
import ExercicioMidia from './treinoExecucao/ExercicioMidia';
import InstrucoesExercicio from './treinoExecucao/InstrucoesExercicio';
import ModalFinalizarTreino from './treinoExecucao/ModalFinalizarTreino';
import StatsRow from './treinoExecucao/StatsRow';
import TelaDescanso from './treinoExecucao/TelaDescanso';
import TimerExecucao from './treinoExecucao/TimerExecucao';
import { DESCANSO_INICIAL_SEGUNDOS, useTreinoExecucao } from '../hooks/useTreinoExecucao';
import type { RegistroExecucao, TreinoDetalhadoDTO } from '../types/treino';
import { useDimensoesTela } from '../utils/layoutTela';

type TelaTreinoExecucaoProps = {
  treino: TreinoDetalhadoDTO;
  participanteId: number;
  onFinish?: (registro: RegistroExecucao, sessaoId: number | null) => void;
  onBackPress?: () => void;
};

export default function TelaTreinoExecucao({
  treino,
  participanteId,
  onFinish,
  onBackPress,
}: TelaTreinoExecucaoProps) {
  useKeepAwake();
  const { compacta, alturaShell } = useDimensoesTela();

  const {
    status,
    faseVisivel,
    exercicioIndex,
    serieAtual,
    exercicioAtual,
    proximoExercicio,
    remaining,
    registro,
    sessaoId,
    isConfirmModalOpen,
    percentualConcluido,
    descansoInicial,
    erroIniciar,
    pausar,
    retomar,
    pedirFinalizar,
    confirmarFinalizar,
    continuarTreino,
  } = useTreinoExecucao(treino, participanteId);

  const jaNotificouRef = React.useRef(false);
  const handleMensagemFinalizacaoConcluida = React.useCallback(() => {
    if (!jaNotificouRef.current) {
      jaNotificouRef.current = true;
      onFinish?.(registro, sessaoId);
    }
  }, [registro, onFinish, sessaoId]);

  const pausado = status === 'PAUSADO';

  // Altura mínima do vídeo proporcional à tela — em telas altas o flex ocupa o resto.
  const alturaMinimaMidia = compacta
    ? Math.round(alturaShell * 0.28)
    : Math.round(alturaShell * 0.34);

  if (erroIniciar) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.erroContainer}>
          <Text style={styles.erroTitulo}>Não foi possível iniciar o treino</Text>
          <Text style={styles.erroMensagem}>{erroIniciar}</Text>
          <Pressable style={styles.erroBotao} onPress={onBackPress}>
            <Text style={styles.erroBotaoTexto}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'CONCLUIDA' || status === 'INTERROMPIDA') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ModalFinalizarTreino
          visivel
          tipo={status === 'CONCLUIDA' ? 'concluido' : 'interrompido'}
          onContinuar={handleMensagemFinalizacaoConcluida}
        />
      </SafeAreaView>
    );
  }

  if (faseVisivel === 'DESCANSO') {
    const ultimaSerieDoExercicio = !descansoInicial && serieAtual >= exercicioAtual.series;
    const proximaSerieExibida = descansoInicial || ultimaSerieDoExercicio ? 1 : serieAtual + 1;
    const proximoItemExibido = ultimaSerieDoExercicio ? proximoExercicio : exercicioAtual;
    const nomeProximoExibido = proximoItemExibido?.exercicio.nome ?? exercicioAtual.exercicio.nome;
    const duracaoDescansoExibida = descansoInicial
      ? DESCANSO_INICIAL_SEGUNDOS
      : ultimaSerieDoExercicio
        ? exercicioAtual.descansoTransicaoSegundos
        : exercicioAtual.descansoSegundos;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <TelaDescanso
          segundosRestantes={remaining}
          duracaoTotalSegundos={duracaoDescansoExibida}
          proximaSerie={proximaSerieExibida}
          nomeProximoExercicio={nomeProximoExibido}
          pausado={pausado}
          compacta={compacta}
          onTogglePause={pausado ? retomar : pausar}
          onFinalizar={pedirFinalizar}
        />
        <ModalFinalizarTreino
          visivel={isConfirmModalOpen}
          percentualConcluido={percentualConcluido}
          onContinuar={continuarTreino}
          onEncerrar={confirmarFinalizar}
        />
      </SafeAreaView>
    );
  }

  const instrucoes = exercicioAtual.exercicio.instrucao ?? [];
  // Descanso exibido = o que virá após a série atual (entre séries ou transição
  // para o próximo exercício). Evita mostrar 0s quando só há 1 série e o
  // descanso real é o de transição.
  const ultimaSerieDoExercicioAtual = serieAtual >= exercicioAtual.series;
  const descansoExibido =
    ultimaSerieDoExercicioAtual && proximoExercicio
      ? exercicioAtual.descansoTransicaoSegundos
      : ultimaSerieDoExercicioAtual
        ? 0
        : exercicioAtual.descansoSegundos;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/*
        Vídeo (flex:1) preenche o espaço entre o cabeçalho e o bloco inferior.
        Assim não sobra “buraco” embaixo e o Finalizar permanece sempre visível.
        object-fit/contain no player evita distorção e corte do conteúdo.
      */}
      <View style={styles.corpo}>
        <ExercicioHeader
          indice={exercicioIndex + 1}
          total={treino.itens.length}
          nome={exercicioAtual.exercicio.nome}
          compacta={compacta}
          onBackPress={pedirFinalizar}
        />

        <View style={[styles.midiaWrap, { minHeight: Math.max(140, alturaMinimaMidia) }]}>
          <ExercicioMidia
            videoUrl={exercicioAtual.exercicio.videoUrl}
            velocidade={exercicioAtual.velocidadeExecucao}
            duracaoTotalSegundos={exercicioAtual.duracaoEstimadaSegundos}
            isPaused={pausado}
          />
        </View>

        <View style={styles.rodape}>
          <View style={[styles.timerWrap, compacta && styles.timerWrapCompacto]}>
            <TimerExecucao
              segundosRestantes={remaining}
              duracaoTotalSegundos={exercicioAtual.duracaoEstimadaSegundos}
            />
          </View>

          <StatsRow
            serieAtual={serieAtual}
            totalSeries={exercicioAtual.series}
            duracaoSegundos={exercicioAtual.duracaoEstimadaSegundos}
            descansoSegundos={descansoExibido}
            compacta={compacta}
          />

          <InstrucoesExercicio instrucoes={instrucoes} />

          <View style={styles.acoesWrap}>
            <AcoesTreino
              pausado={pausado}
              onTogglePause={pausado ? retomar : pausar}
              onFinalizar={pedirFinalizar}
            />
          </View>
        </View>
      </View>

      <ModalFinalizarTreino
        visivel={isConfirmModalOpen}
        percentualConcluido={percentualConcluido}
        onContinuar={continuarTreino}
        onEncerrar={confirmarFinalizar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  corpo: {
    flex: 1,
    minHeight: 0,
  },
  midiaWrap: {
    flex: 1,
    minHeight: 0,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  rodape: {
    flexShrink: 0,
  },
  timerWrap: {
    justifyContent: 'center',
    paddingVertical: 10,
  },
  timerWrapCompacto: {
    paddingVertical: 6,
  },
  acoesWrap: {
    paddingBottom: 10,
    paddingTop: 4,
  },
  erroContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  erroTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: cores.texto,
    marginBottom: 12,
    textAlign: 'center',
  },
  erroMensagem: {
    fontSize: 14,
    lineHeight: 20,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginBottom: 24,
  },
  erroBotao: {
    height: 46,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: cores.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  erroBotaoTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
