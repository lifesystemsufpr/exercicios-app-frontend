import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
} from 'react-native';

import { formatCpf } from '../utils/formatCpf';
import { useDimensoesTela } from '../utils/layoutTela';

type TelaLoginProps = {
  onSubmit?: (cpf: string, senha: string) => void | Promise<void>;
  onForgotPasswordPress?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

// Só no navegador: o Edge coloca o próprio "olhinho" em campos de senha (::-ms-reveal),
// duplicando o botão "Mostrar". Pseudo-elementos não dá para estilizar pelo StyleSheet,
// então injetamos uma regra CSS uma única vez.
if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById('estilos-campo-senha')) {
  const estilo = document.createElement('style');
  estilo.id = 'estilos-campo-senha';
  estilo.textContent =
    'input::-ms-reveal, input::-ms-clear { display: none; }';
  document.head.appendChild(estilo);
}

// Só no navegador: tira o contorno de foco (borda preta) dos campos, que já ficam com a borda
// azul quando estão em uso. 'none' existe no CSS, mas não nos tipos do React Native.
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

export default function TelaLogin({
  onSubmit,
  onForgotPasswordPress,
  isSubmitting,
  errorMessage,
}: TelaLoginProps) {
  const { compacta } = useDimensoesTela();
  const [cpf, setCpf] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [senhaVisivel, setSenhaVisivel] = React.useState(false);
  const [campoEmFoco, setCampoEmFoco] = React.useState<'cpf' | 'senha' | null>(null);
  const senhaRef = React.useRef<TextInput>(null);

  const podeEnviar = Boolean(onSubmit) && !isSubmitting;
  const temErro = Boolean(errorMessage);

  const handleSubmit = () => {
    if (!podeEnviar || !onSubmit) {
      return;
    }

    const cpfSomenteDigitos = cpf.replace(/\D/g, '');
    void onSubmit(cpfSomenteDigitos, senha);
  };

  const estiloCampo = (campo: 'cpf' | 'senha') => [
    styles.campo,
    temErro && styles.campoErro,
    campoEmFoco === campo && styles.campoFoco,
  ];

  return (
    <View style={styles.card}>
      <ScrollView
        contentContainerStyle={styles.rolagem}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.cabecalho, compacta && styles.cabecalhoCompacto]}>
          <Image
            source={require('../assets/meraki_icone.png')}
            style={[styles.logo, compacta && styles.logoCompacta]}
            accessibilityLabel="Logo Meraki"
            resizeMode="cover"
          />
          <Text style={[styles.nomeApp, compacta && styles.nomeAppCompacto]} accessibilityRole="header">
            Meraki
          </Text>
          <Text style={styles.slogan}>Seu treino em casa, no seu ritmo</Text>
        </View>

        <View style={[styles.formulario, compacta && styles.formularioCompacto]}>
          {temErro ? (
            <View style={styles.alertaErro} accessibilityRole="alert" accessibilityLiveRegion="polite">
              <MaterialCommunityIcons name="alert-circle-outline" size={24} color={cores.erro} />
              <Text style={styles.alertaErroTexto}>{errorMessage}</Text>
            </View>
          ) : (
            <View style={styles.saudacao}>
              <Text style={[styles.titulo, compacta && styles.tituloCompacto]}>Bem-vindo(a)!</Text>
              <Text style={styles.subtitulo}>Entre com seu CPF e sua senha.</Text>
            </View>
          )}

          <View style={styles.grupoCampo}>
            <Text style={styles.rotulo} nativeID="rotulo-cpf">
              CPF
            </Text>
            <View style={estiloCampo('cpf')}>
              <MaterialCommunityIcons name="account-outline" size={26} color={cores.textoSuave} />
              <TextInput
                style={[styles.entrada, semContornoWeb]}
                placeholder="000.000.000-00"
                placeholderTextColor={cores.placeholder}
                value={cpf}
                onChangeText={(texto) => setCpf(formatCpf(texto))}
                keyboardType="numeric"
                maxLength={14}
                returnKeyType="next"
                onSubmitEditing={() => senhaRef.current?.focus()}
                onFocus={() => setCampoEmFoco('cpf')}
                onBlur={() => setCampoEmFoco(null)}
                accessibilityLabelledBy="rotulo-cpf"
                accessibilityLabel="CPF"
              />
            </View>
          </View>

          <View style={styles.grupoCampo}>
            <Text style={styles.rotulo} nativeID="rotulo-senha">
              Senha
            </Text>
            <View style={[estiloCampo('senha'), styles.campoSenha]}>
              <MaterialCommunityIcons name="lock-outline" size={26} color={cores.textoSuave} />
              <TextInput
                ref={senhaRef}
                style={[styles.entrada, semContornoWeb]}
                placeholder="Sua senha"
                placeholderTextColor={cores.placeholder}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
                onFocus={() => setCampoEmFoco('senha')}
                onBlur={() => setCampoEmFoco(null)}
                accessibilityLabelledBy="rotulo-senha"
                accessibilityLabel="Senha"
              />
              <Pressable
                onPress={() => setSenhaVisivel((atual) => !atual)}
                style={({ pressed }) => [styles.botaoMostrar, pressed && styles.pressionado]}
                accessibilityRole="button"
                accessibilityLabel={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <MaterialCommunityIcons
                  name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={cores.destaqueTexto}
                />
                <Text style={styles.botaoMostrarTexto}>{senhaVisivel ? 'Ocultar' : 'Mostrar'}</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.botaoEntrar,
              !podeEnviar && styles.botaoEntrarDesabilitado,
              pressed && styles.pressionado,
            ]}
            onPress={handleSubmit}
            disabled={!podeEnviar}
            accessibilityRole="button"
            accessibilityState={{ disabled: !podeEnviar, busy: Boolean(isSubmitting) }}
          >
            <Text style={styles.botaoEntrarTexto}>{isSubmitting ? 'Entrando...' : 'Entrar'}</Text>
            {!isSubmitting ? <MaterialCommunityIcons name="arrow-right" size={24} color="#ffffff" /> : null}
          </Pressable>

          <Pressable
            onPress={onForgotPasswordPress}
            style={styles.linkEsqueci}
            accessibilityRole="link"
            hitSlop={8}
          >
            <Text style={styles.linkEsqueciTexto}>Esqueci minha senha</Text>
          </Pressable>
        </View>
      </ScrollView>
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
  rolagem: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  cabecalho: {
    backgroundColor: cores.destaque,
    paddingTop: 36,
    paddingBottom: 52,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
    gap: 12,
  },
  cabecalhoCompacto: {
    paddingTop: 24,
    paddingBottom: 40,
    gap: 8,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: '#ffffff',
  },
  logoCompacta: {
    width: 72,
    height: 72,
    borderRadius: 18,
  },
  nomeApp: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: '#ffffff',
  },
  nomeAppCompacto: {
    fontSize: 28,
    lineHeight: 34,
  },
  slogan: {
    fontSize: 17,
    lineHeight: 24,
    color: '#ffffff',
    textAlign: 'center',
  },
  formulario: {
    marginTop: -28,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 18,
    shadowColor: '#121826',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  formularioCompacto: {
    marginTop: -20,
    paddingTop: 18,
    gap: 14,
  },
  saudacao: {
    gap: 4,
  },
  titulo: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: cores.texto,
  },
  tituloCompacto: {
    fontSize: 22,
    lineHeight: 28,
  },
  subtitulo: {
    fontSize: 17,
    lineHeight: 24,
    color: cores.textoApoio,
  },
  alertaErro: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: cores.erroBorda,
    backgroundColor: cores.erroFundo,
  },
  alertaErroTexto: {
    flex: 1,
    fontSize: 17,
    lineHeight: 23,
    color: cores.erroTexto,
  },
  grupoCampo: {
    gap: 8,
  },
  rotulo: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color: cores.texto,
  },
  campo: {
    height: 60,
    borderWidth: 2,
    borderColor: cores.borda,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#ffffff',
  },
  campoSenha: {
    paddingRight: 8,
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
    fontSize: 20,
    color: cores.texto,
  },
  botaoMostrar: {
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: cores.botaoMostrarFundo,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  botaoMostrarTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.destaqueTexto,
  },
  botaoEntrar: {
    height: 62,
    marginTop: 4,
    borderRadius: 31,
    backgroundColor: cores.destaque,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  botaoEntrarDesabilitado: {
    opacity: 0.7,
  },
  botaoEntrarTexto: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  pressionado: {
    opacity: 0.85,
  },
  linkEsqueci: {
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  linkEsqueciTexto: {
    fontSize: 17,
    fontWeight: '700',
    color: cores.destaqueTexto,
    textDecorationLine: 'underline',
  },
});
