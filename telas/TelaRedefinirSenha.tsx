import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
} from 'react-native';

import { formatCpf } from '../utils/formatCpf';
import { dataNascimentoParaIso, formatDataNascimento } from '../utils/formatDataNascimento';
import { useDimensoesTela } from '../utils/layoutTela';

type TelaRedefinirSenhaProps = {
  onSubmit?: (cpf: string, novaSenha: string, dataNascimento: string) => void | Promise<void>;
  onBackPress?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

type CampoFoco = 'cpf' | 'nascimento' | 'novaSenha' | 'confirmarSenha' | null;

const REGRA_SENHA_MENSAGEM = 'A senha deve ter pelo menos 8 caracteres, com letras e números';

function senhaAtendeRegra(senha: string): boolean {
  return senha.length >= 8 && /[a-zA-Z]/.test(senha) && /[0-9]/.test(senha);
}

if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById('estilos-campo-senha')) {
  const estilo = document.createElement('style');
  estilo.id = 'estilos-campo-senha';
  estilo.textContent = 'input::-ms-reveal, input::-ms-clear { display: none; }';
  document.head.appendChild(estilo);
}

const semContornoWeb = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : null;

const cores = {
  destaque: '#3352e8',
  destaqueTexto: '#2f4ee0',
  fundo: '#f4f6fb',
  texto: '#1d2433',
  textoApoio: '#4b5366',
  textoSuave: '#5a6273',
  placeholder: '#7a8296',
  borda: '#cfd5e3',
  bordaFoco: '#3352e8',
  erro: '#c0392b',
  erroFundo: '#fdecec',
  erroBorda: '#e5a3a3',
  erroTexto: '#8a1c13',
  botaoMostrarFundo: '#eef1fb',
};

export default function TelaRedefinirSenha({
  onSubmit,
  onBackPress,
  isSubmitting,
  errorMessage,
}: TelaRedefinirSenhaProps) {
  const { compacta } = useDimensoesTela();
  const [cpf, setCpf] = React.useState('');
  const [dataNascimento, setDataNascimento] = React.useState('');
  const [novaSenha, setNovaSenha] = React.useState('');
  const [confirmarSenha, setConfirmarSenha] = React.useState('');
  const [novaSenhaVisivel, setNovaSenhaVisivel] = React.useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = React.useState(false);
  const [erroValidacao, setErroValidacao] = React.useState<string | null>(null);
  const [campoEmFoco, setCampoEmFoco] = React.useState<CampoFoco>(null);

  const nascimentoRef = React.useRef<TextInput>(null);
  const novaSenhaRef = React.useRef<TextInput>(null);
  const confirmarSenhaRef = React.useRef<TextInput>(null);

  const podeEnviar = Boolean(onSubmit) && !isSubmitting;
  const mensagemErro = erroValidacao ?? errorMessage;
  const temErro = Boolean(mensagemErro);

  const handleSubmit = () => {
    if (!podeEnviar || !onSubmit) {
      return;
    }

    const cpfSomenteDigitos = cpf.replace(/\D/g, '');

    if (cpfSomenteDigitos.length !== 11) {
      setErroValidacao('Informe um CPF válido');
      return;
    }

    if (!dataNascimento.trim()) {
      setErroValidacao('Informe a data de nascimento');
      return;
    }

    const dataNascimentoIso = dataNascimentoParaIso(dataNascimento);
    if (!dataNascimentoIso) {
      setErroValidacao('Informe uma data de nascimento válida');
      return;
    }

    if (!senhaAtendeRegra(novaSenha)) {
      setErroValidacao(REGRA_SENHA_MENSAGEM);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroValidacao('As senhas não coincidem');
      return;
    }

    setErroValidacao(null);
    void onSubmit(cpfSomenteDigitos, novaSenha, dataNascimentoIso);
  };

  const estiloCampo = (campo: Exclude<CampoFoco, null>) => [
    styles.campo,
    compacta && styles.campoCompacto,
    temErro && styles.campoErro,
    campoEmFoco === campo && styles.campoFoco,
  ];

  return (
    <View style={styles.card}>
      <View style={[styles.cabecalho, compacta && styles.cabecalhoCompacto]}>
        {onBackPress ? (
          <Pressable
            onPress={onBackPress}
            hitSlop={12}
            style={styles.botaoVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <MaterialCommunityIcons name="arrow-left" size={26} color="#ffffff" />
          </Pressable>
        ) : null}
        <Text style={[styles.nomeApp, compacta && styles.nomeAppCompacto]} accessibilityRole="header">
          Meraki
        </Text>
        <Text style={styles.slogan}>Seu treino em casa, no seu ritmo</Text>
      </View>

      <View style={[styles.formulario, compacta && styles.formularioCompacto]}>
        {temErro ? (
          <View style={styles.alertaErro} accessibilityRole="alert" accessibilityLiveRegion="polite">
            <MaterialCommunityIcons name="alert-circle-outline" size={22} color={cores.erro} />
            <Text style={styles.alertaErroTexto}>{mensagemErro}</Text>
          </View>
        ) : (
          <View style={styles.saudacao}>
            <Text style={[styles.titulo, compacta && styles.tituloCompacto]}>Redefinir senha</Text>
            <Text style={styles.subtitulo}>Confirme seus dados para criar uma nova senha.</Text>
          </View>
        )}

        <View style={styles.grupoCampo}>
          <Text style={styles.rotulo}>CPF</Text>
          <View style={estiloCampo('cpf')}>
            <MaterialCommunityIcons name="account-outline" size={24} color={cores.textoSuave} />
            <TextInput
              style={[styles.entrada, semContornoWeb]}
              placeholder="000.000.000-00"
              placeholderTextColor={cores.placeholder}
              value={cpf}
              onChangeText={(texto) => setCpf(formatCpf(texto))}
              keyboardType="numeric"
              maxLength={14}
              returnKeyType="next"
              onSubmitEditing={() => nascimentoRef.current?.focus()}
              onFocus={() => setCampoEmFoco('cpf')}
              onBlur={() => setCampoEmFoco(null)}
              accessibilityLabel="CPF"
            />
          </View>
        </View>

        <View style={styles.grupoCampo}>
          <Text style={styles.rotulo}>Data de nascimento</Text>
          <View style={estiloCampo('nascimento')}>
            <MaterialCommunityIcons name="calendar-outline" size={24} color={cores.textoSuave} />
            <TextInput
              ref={nascimentoRef}
              style={[styles.entrada, semContornoWeb]}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={cores.placeholder}
              value={dataNascimento}
              onChangeText={(texto) => setDataNascimento(formatDataNascimento(texto))}
              keyboardType="numeric"
              maxLength={10}
              returnKeyType="next"
              onSubmitEditing={() => novaSenhaRef.current?.focus()}
              onFocus={() => setCampoEmFoco('nascimento')}
              onBlur={() => setCampoEmFoco(null)}
              accessibilityLabel="Data de nascimento"
            />
          </View>
        </View>

        <View style={styles.grupoCampo}>
          <Text style={styles.rotulo}>Nova senha</Text>
          <View style={[estiloCampo('novaSenha'), styles.campoSenha]}>
            <MaterialCommunityIcons name="lock-outline" size={24} color={cores.textoSuave} />
            <TextInput
              ref={novaSenhaRef}
              style={[styles.entrada, semContornoWeb]}
              placeholder="Sua senha"
              placeholderTextColor={cores.placeholder}
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry={!novaSenhaVisivel}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => confirmarSenhaRef.current?.focus()}
              onFocus={() => setCampoEmFoco('novaSenha')}
              onBlur={() => setCampoEmFoco(null)}
              accessibilityLabel="Nova senha"
            />
            <Pressable
              onPress={() => setNovaSenhaVisivel((atual) => !atual)}
              style={({ pressed }) => [styles.botaoMostrar, pressed && styles.pressionado]}
              accessibilityRole="button"
              accessibilityLabel={novaSenhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <MaterialCommunityIcons
                name={novaSenhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={cores.destaqueTexto}
              />
              <Text style={styles.botaoMostrarTexto}>{novaSenhaVisivel ? 'Ocultar' : 'Mostrar'}</Text>
            </Pressable>
          </View>
          <Text style={styles.dica}>{REGRA_SENHA_MENSAGEM}</Text>
        </View>

        <View style={styles.grupoCampo}>
          <Text style={styles.rotulo}>Confirmar senha</Text>
          <View style={[estiloCampo('confirmarSenha'), styles.campoSenha]}>
            <MaterialCommunityIcons name="lock-check-outline" size={24} color={cores.textoSuave} />
            <TextInput
              ref={confirmarSenhaRef}
              style={[styles.entrada, semContornoWeb]}
              placeholder="Sua senha"
              placeholderTextColor={cores.placeholder}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!confirmarSenhaVisivel}
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              onFocus={() => setCampoEmFoco('confirmarSenha')}
              onBlur={() => setCampoEmFoco(null)}
              accessibilityLabel="Confirmar senha"
            />
            <Pressable
              onPress={() => setConfirmarSenhaVisivel((atual) => !atual)}
              style={({ pressed }) => [styles.botaoMostrar, pressed && styles.pressionado]}
              accessibilityRole="button"
              accessibilityLabel={confirmarSenhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <MaterialCommunityIcons
                name={confirmarSenhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={cores.destaqueTexto}
              />
              <Text style={styles.botaoMostrarTexto}>{confirmarSenhaVisivel ? 'Ocultar' : 'Mostrar'}</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.botaoConfirmar,
            compacta && styles.botaoConfirmarCompacto,
            !podeEnviar && styles.botaoConfirmarDesabilitado,
            pressed && styles.pressionado,
          ]}
          onPress={handleSubmit}
          disabled={!podeEnviar}
          accessibilityRole="button"
          accessibilityState={{ disabled: !podeEnviar, busy: Boolean(isSubmitting) }}
        >
          <Text style={styles.botaoConfirmarTexto}>{isSubmitting ? 'Salvando...' : 'Confirmar'}</Text>
          {!isSubmitting ? <MaterialCommunityIcons name="check" size={22} color="#ffffff" /> : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: '100%',
    backgroundColor: cores.fundo,
    overflow: 'hidden',
  },
  cabecalho: {
    backgroundColor: cores.destaque,
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
    gap: 6,
  },
  cabecalhoCompacto: {
    paddingTop: 20,
    paddingBottom: 28,
    gap: 4,
  },
  botaoVoltar: {
    position: 'absolute',
    top: 22,
    left: 16,
    zIndex: 1,
    padding: 4,
  },
  nomeApp: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: '#ffffff',
  },
  nomeAppCompacto: {
    fontSize: 26,
    lineHeight: 32,
  },
  slogan: {
    fontSize: 15,
    lineHeight: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  formulario: {
    marginTop: -24,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 14,
    shadowColor: '#121826',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  formularioCompacto: {
    marginTop: -18,
    paddingTop: 14,
    paddingBottom: 14,
    gap: 10,
  },
  saudacao: {
    gap: 2,
    marginBottom: 2,
  },
  titulo: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: cores.texto,
  },
  tituloCompacto: {
    fontSize: 20,
    lineHeight: 26,
  },
  subtitulo: {
    fontSize: 15,
    lineHeight: 20,
    color: cores.textoApoio,
  },
  alertaErro: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: cores.erroBorda,
    backgroundColor: cores.erroFundo,
  },
  alertaErroTexto: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: cores.erroTexto,
  },
  grupoCampo: {
    gap: 6,
  },
  rotulo: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: cores.texto,
  },
  campo: {
    height: 52,
    borderWidth: 2,
    borderColor: cores.borda,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: '#ffffff',
  },
  campoCompacto: {
    height: 48,
  },
  campoSenha: {
    paddingRight: 6,
  },
  campoErro: {
    borderColor: cores.erro,
  },
  campoFoco: {
    borderColor: cores.bordaFoco,
  },
  entrada: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    fontSize: 17,
    color: cores.texto,
  },
  botaoMostrar: {
    height: 38,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: cores.botaoMostrarFundo,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  botaoMostrarTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: cores.destaqueTexto,
  },
  dica: {
    fontSize: 12,
    lineHeight: 16,
    color: cores.textoSuave,
  },
  botaoConfirmar: {
    height: 54,
    marginTop: 4,
    borderRadius: 27,
    backgroundColor: cores.destaque,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botaoConfirmarCompacto: {
    height: 50,
  },
  botaoConfirmarDesabilitado: {
    opacity: 0.7,
  },
  botaoConfirmarTexto: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  pressionado: {
    opacity: 0.85,
  },
});

