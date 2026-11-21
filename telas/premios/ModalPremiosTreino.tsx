import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { FaseTreino } from '../../types/engajamento';
import type { PremioSessao, ResultadoFeedback, ResumoSessaoDTO } from '../../types/premios';
import IlustracaoPremio, { coresPremio, type TipoIlustracao } from './IlustracoesPremio';

interface ModalPremiosTreinoProps {
  /** Resultado da avaliação do treino. Sem resumo (sessão que não conta), nada é mostrado. */
  resultado: ResultadoFeedback | null;
  onFechar: () => void;
}

const NOME_FASE: Record<FaseTreino, string> = {
  INICIANTE: 'Iniciante',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
};

const azul = '#3352e8';

type ItemLista = { ilustracao: TipoIlustracao; titulo: string; motivo: string };

type Conteudo = {
  etiqueta: string;
  ilustracoes: TipoIlustracao[];
  titulo: string;
  texto: string;
  /** Preenchida quando o treino rendeu vários prêmios: todos aparecem de uma vez. */
  lista: ItemLista[];
  /** Dica do próximo prêmio (incentivo). */
  dica: string | null;
  /** Aviso de novo nível ou de programa concluído. */
  avisoProgresso: string | null;
};

function plural(quantidade: number, singular: string, pluralTexto: string): string {
  return `${quantidade} ${quantidade === 1 ? singular : pluralTexto}`;
}

function itemDaLista(premio: PremioSessao): ItemLista {
  switch (premio.tipo) {
    case 'TREINO':
      return { ilustracao: 'moeda', titulo: `+${premio.pontos} pontos`, motivo: 'pelo treino de hoje' };
    case 'BONUS_SEGUNDO_TREINO':
      return { ilustracao: 'moedas', titulo: `+${premio.pontos} pontos de bônus`, motivo: '2º treino da semana' };
    case 'MEDALHA':
      return {
        ilustracao: 'medalha',
        titulo: `Medalha + ${premio.pontos} pontos`,
        motivo: 'você fez os 3 treinos da semana',
      };
    case 'ESTRELA':
      return {
        ilustracao: 'estrela',
        titulo: `Estrela + ${premio.pontos} pontos`,
        motivo: '3 semanas seguidas completas',
      };
    case 'TROFEU':
      return {
        ilustracao: 'trofeu',
        titulo: `Troféu + estrela + ${premio.pontos} pontos`,
        motivo: `Nível ${premio.nivel} do ${NOME_FASE[premio.fase]} concluído`,
      };
  }
}

/** Decide sozinho o que mostrar, a partir do que o treino rendeu. */
function montarConteudo(resumo: ResumoSessaoDTO): Conteudo {
  const { premios, ordemNaSemana, pontosGanhos, progressao } = resumo;
  const pontosDoTreino = premios.find((premio) => premio.tipo === 'TREINO')?.pontos ?? 0;
  const bonus = premios.find((premio) => premio.tipo === 'BONUS_SEGUNDO_TREINO');
  const medalha = premios.find((premio) => premio.tipo === 'MEDALHA');
  const trofeu = premios.find((premio) => premio.tipo === 'TROFEU');
  const grandes = premios.filter(
    (premio) => premio.tipo === 'MEDALHA' || premio.tipo === 'ESTRELA' || premio.tipo === 'TROFEU',
  );

  const etiquetaSemana =
    ordemNaSemana >= 3 ? '3º treino da semana · semana completa' : `${ordemNaSemana}º treino da semana`;

  let avisoProgresso: string | null = null;
  if (progressao?.tipo === 'NIVEL') {
    avisoProgresso = `Agora você está no ${NOME_FASE[progressao.novaFase]} – Nível ${progressao.novoNivel}. Seus próximos treinos já são do novo nível.`;
  } else if (progressao?.tipo === 'PROGRAMA_CONCLUIDO') {
    avisoProgresso = 'Você concluiu todos os níveis do programa. Que conquista!';
  }

  // Vários prêmios no mesmo treino: lista com tudo de uma vez.
  if (grandes.length >= 2 || (grandes.length === 1 && bonus)) {
    return {
      etiqueta: trofeu && trofeu.tipo === 'TROFEU' ? `Nível ${trofeu.nivel} concluído` : etiquetaSemana,
      ilustracoes: grandes.map((premio) => itemDaLista(premio).ilustracao),
      titulo: `+${pontosGanhos} pontos hoje`,
      texto: `e ${plural(grandes.length, 'prêmio novo', 'prêmios novos')}. Veja o que você ganhou:`,
      lista: premios.map(itemDaLista),
      dica: null,
      avisoProgresso,
    };
  }

  if (trofeu && trofeu.tipo === 'TROFEU') {
    return {
      etiqueta: `Nível ${trofeu.nivel} concluído`,
      ilustracoes: ['trofeu'],
      titulo: 'Troféu + estrela',
      texto: `Você concluiu o Nível ${trofeu.nivel} do ${NOME_FASE[trofeu.fase]} e ganhou um troféu, uma estrela e +${trofeu.pontos} pontos, além dos ${pontosDoTreino} pontos do treino de hoje.`,
      lista: [],
      dica: null,
      avisoProgresso,
    };
  }

  if (medalha) {
    return {
      etiqueta: etiquetaSemana,
      ilustracoes: ['medalha'],
      titulo: `Medalha + ${pontosGanhos} pontos`,
      texto: `Você fez os 3 treinos da semana! Ganhou ${pontosDoTreino} pontos pelo treino de hoje, mais ${medalha.pontos} pontos de bônus e uma medalha.`,
      lista: [],
      dica: 'Complete 3 semanas seguidas com 3 treinos para ganhar uma estrela.',
      avisoProgresso,
    };
  }

  if (bonus) {
    return {
      etiqueta: etiquetaSemana,
      ilustracoes: ['moedas'],
      titulo: `+${pontosGanhos} pontos`,
      texto: `Você ganhou ${pontosDoTreino} pontos pelo treino de hoje + ${bonus.pontos} pontos de bônus por ser o 2º treino da semana.`,
      lista: [],
      dica: 'Mais 1 treino nesta semana: uma medalha e +50 pontos.',
      avisoProgresso,
    };
  }

  return {
    etiqueta: etiquetaSemana,
    ilustracoes: ['moeda'],
    titulo: `+${pontosGanhos} pontos`,
    texto: `Você ganhou ${pontosDoTreino} pontos pelo treino de hoje.`,
    lista: [],
    dica: ordemNaSemana === 1 ? 'No próximo treino desta semana você ganha +10 pontos de bônus.' : null,
    avisoProgresso,
  };
}

export default function ModalPremiosTreino({ resultado, onFechar }: ModalPremiosTreinoProps) {
  const resumo = resultado?.resumoSessao ?? null;
  const temPremios = Boolean(resumo && resumo.premios.length > 0);
  const novaFase = resumo?.progressao?.tipo === 'FASE' ? resumo.progressao : null;
  const [etapa, setEtapa] = React.useState<'premios' | 'novaFase'>('premios');

  React.useEffect(() => {
    setEtapa('premios');
  }, [resultado]);

  const avancar = React.useCallback(() => {
    if (etapa === 'premios' && novaFase) {
      setEtapa('novaFase');
      return;
    }
    onFechar();
  }, [etapa, novaFase, onFechar]);

  // Botão "voltar" do Android avança/fecha o pop-up.
  React.useEffect(() => {
    if (!temPremios) {
      return undefined;
    }
    const assinatura = BackHandler.addEventListener('hardwareBackPress', () => {
      avancar();
      return true;
    });
    return () => assinatura.remove();
  }, [temPremios, avancar]);

  if (!resumo || !temPremios) {
    return null;
  }

  // Camada absoluta (e não <Modal>): na web o <Modal> sairia da moldura do celular.
  return (
    <View style={styles.fundo}>
      <View style={styles.caixa} accessibilityViewIsModal accessibilityLiveRegion="polite">
        <ScrollView contentContainerStyle={styles.conteudo} bounces={false}>
          {etapa === 'novaFase' && novaFase ? (
            <ConteudoNovaFase
              novaFase={novaFase.novaFase}
              faseAnterior={novaFase.faseAnterior}
              totais={resultado?.totais ?? null}
            />
          ) : (
            <ConteudoPremios resumo={resumo} />
          )}
        </ScrollView>

        <Pressable
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
          onPress={avancar}
          accessibilityRole="button"
        >
          <Text style={styles.botaoTexto}>{etapa === 'novaFase' ? 'Ver meu novo ranking' : 'Continuar'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ConteudoPremios({ resumo }: { resumo: ResumoSessaoDTO }) {
  const conteudo = montarConteudo(resumo);
  const cor = coresPremio[resumo.fase];
  const variasIlustracoes = conteudo.ilustracoes.length > 1;
  const diametro = conteudo.ilustracoes.length >= 3 ? 76 : variasIlustracoes ? 92 : 140;

  return (
    <>
      <View style={[styles.etiqueta, { backgroundColor: cor.fundo }]}>
        <Text style={[styles.etiquetaTexto, { color: cor.texto }]}>{conteudo.etiqueta}</Text>
      </View>

      <View style={styles.ilustracoes}>
        {conteudo.ilustracoes.map((tipo) => (
          <View
            key={tipo}
            style={[
              styles.circulo,
              { width: diametro, height: diametro, borderRadius: diametro / 2, backgroundColor: cor.fundo },
            ]}
          >
            <IlustracaoPremio tipo={tipo} fase={resumo.fase} tamanho={diametro * 0.7} />
          </View>
        ))}
      </View>

      <Text style={styles.titulo} accessibilityRole="header">
        {conteudo.titulo}
      </Text>
      <Text style={styles.texto}>{conteudo.texto}</Text>

      {conteudo.lista.length > 0 && (
        <View style={styles.lista}>
          {conteudo.lista.map((item) => (
            <View key={item.titulo} style={styles.itemLista}>
              <View style={[styles.itemIcone, { backgroundColor: cor.fundo }]}>
                <IlustracaoPremio tipo={item.ilustracao} fase={resumo.fase} tamanho={28} />
              </View>
              <View style={styles.itemTextos}>
                <Text style={styles.itemTitulo}>{item.titulo}</Text>
                <Text style={styles.itemMotivo}>{item.motivo}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {conteudo.avisoProgresso && (
        <View style={styles.avisoProgresso}>
          <View style={styles.avisoProgressoIcone}>
            <MaterialCommunityIcons name="arrow-up" size={24} color="#ffffff" />
          </View>
          <Text style={styles.avisoProgressoTexto}>{conteudo.avisoProgresso}</Text>
        </View>
      )}

      {conteudo.dica && (
        <View style={styles.dica}>
          <MaterialCommunityIcons name="arrow-right" size={22} color={azul} />
          <Text style={styles.dicaTexto}>{conteudo.dica}</Text>
        </View>
      )}
    </>
  );
}

function ConteudoNovaFase({
  novaFase,
  faseAnterior,
  totais,
}: {
  novaFase: FaseTreino;
  faseAnterior: FaseTreino;
  totais: ResultadoFeedback['totais'];
}) {
  const cor = coresPremio[novaFase];
  const nome = NOME_FASE[novaFase];
  const guardados = totais
    ? `: ${plural(totais.trofeus, 'troféu', 'troféus')} e ${plural(totais.estrelas, 'estrela', 'estrelas')}`
    : '';

  const itens: { icone: React.ComponentProps<typeof MaterialCommunityIcons>['name']; negrito: string; resto: string }[] = [
    { icone: 'account-group-outline', negrito: 'Novo ranking', resto: `: agora você está junto com quem também está no ${nome}.` },
    { icone: 'restart', negrito: 'Pontos e medalhas recomeçam', resto: ' do zero nesta fase.' },
    { icone: 'star-outline', negrito: 'Estrelas e troféus continuam', resto: ` com você${guardados}.` },
  ];

  return (
    <>
      <View style={[styles.etiqueta, { backgroundColor: cor.fundo }]}>
        <Text style={[styles.etiquetaTexto, { color: cor.texto }]}>Nova fase</Text>
      </View>

      <View style={[styles.circulo, { width: 124, height: 124, borderRadius: 62, backgroundColor: cor.fundo }]}>
        <IlustracaoPremio tipo="degraus" fase={novaFase} tamanho={88} />
      </View>

      <Text style={[styles.titulo, styles.tituloNovaFase]} accessibilityRole="header">
        Você chegou ao {nome}!
      </Text>
      <Text style={styles.texto}>
        Você concluiu toda a fase {NOME_FASE[faseAnterior]}. Veja o que muda agora:
      </Text>

      <View style={styles.mudancas}>
        {itens.map((item) => (
          <View key={item.negrito} style={styles.mudanca}>
            <MaterialCommunityIcons name={item.icone} size={24} color={azul} />
            <Text style={styles.mudancaTexto}>
              <Text style={styles.negrito}>{item.negrito}</Text>
              {item.resto}
            </Text>
          </View>
        ))}
        <View style={styles.mudanca}>
          <View style={[styles.amostraCor, { backgroundColor: cor.principal }]} />
          <Text style={styles.mudancaTexto}>
            Os prêmios desta fase são <Text style={styles.negrito}>{cor.adjetivo}</Text>.
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fundo: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    backgroundColor: 'rgba(15, 20, 35, 0.55)',
    justifyContent: 'center',
    padding: 16,
  },
  caixa: {
    maxHeight: '96%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
  },
  conteudo: {
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
  },
  etiqueta: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  etiquetaTexto: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  ilustracoes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: '#1d2433',
    textAlign: 'center',
  },
  tituloNovaFase: {
    fontSize: 28,
    lineHeight: 34,
  },
  texto: {
    fontSize: 17,
    lineHeight: 25,
    color: '#3d4556',
    textAlign: 'center',
  },
  lista: {
    alignSelf: 'stretch',
    gap: 8,
  },
  itemLista: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#f5f6fa',
  },
  itemIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTextos: {
    flex: 1,
  },
  itemTitulo: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    color: '#1d2433',
  },
  itemMotivo: {
    fontSize: 15,
    lineHeight: 20,
    color: '#4b5366',
  },
  avisoProgresso: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#e8eeff',
  },
  avisoProgressoIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avisoProgressoTexto: {
    flex: 1,
    fontSize: 17,
    lineHeight: 23,
    color: '#24307a',
  },
  dica: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#f3f5fb',
  },
  dicaTexto: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#2a3142',
  },
  mudancas: {
    alignSelf: 'stretch',
    gap: 10,
  },
  mudanca: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  mudancaTexto: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#2a3142',
  },
  negrito: {
    fontWeight: '800',
  },
  amostraCor: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginHorizontal: 1,
  },
  botao: {
    height: 60,
    borderRadius: 30,
    backgroundColor: azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPressionado: {
    opacity: 0.85,
  },
  botaoTexto: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
});
