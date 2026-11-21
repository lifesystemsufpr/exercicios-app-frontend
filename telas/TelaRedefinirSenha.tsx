import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { formatCpf } from '../utils/formatCpf';
import { useDimensoesTela } from '../utils/layoutTela';
import IconeOlho from './IconeOlho';

type TelaRedefinirSenhaProps = {
  onSubmit?: (cpf: string, novaSenha: string) => void | Promise<void>;
  onBackPress?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

const REGRA_SENHA_MENSAGEM = 'A senha deve ter pelo menos 8 caracteres, com letras e números';

function senhaAtendeRegra(senha: string): boolean {
  return senha.length >= 8 && /[a-zA-Z]/.test(senha) && /[0-9]/.test(senha);
}

export default function TelaRedefinirSenha({
  onSubmit,
  onBackPress,
  isSubmitting,
  errorMessage,
}: TelaRedefinirSenhaProps) {
  const { compacta } = useDimensoesTela();
  const [cpf, setCpf] = React.useState('');
  const [novaSenha, setNovaSenha] = React.useState('');
  const [confirmarSenha, setConfirmarSenha] = React.useState('');
  const [novaSenhaVisivel, setNovaSenhaVisivel] = React.useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = React.useState(false);
  const [erroValidacao, setErroValidacao] = React.useState<string | null>(null);

  const podeEnviar = Boolean(onSubmit) && !isSubmitting;

  const handleSubmit = () => {
    if (!podeEnviar || !onSubmit) {
      return;
    }

    const cpfSomenteDigitos = cpf.replace(/\D/g, '');

    if (cpfSomenteDigitos.length !== 11) {
      setErroValidacao('Informe um CPF válido');
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
    void onSubmit(cpfSomenteDigitos, novaSenha);
  };

  const mensagemErro = erroValidacao ?? errorMessage;

  return (
    <View style={styles.card}>
      <ScrollView
        contentContainerStyle={styles.rolagem}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, compacta && styles.headerCompacto]}>
          {onBackPress ? (
            <Pressable onPress={onBackPress} hitSlop={12} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
          ) : null}
          <Text style={[styles.headerTitle, compacta && styles.headerTitleCompacto]}>Meraki</Text>
          <Text style={styles.headerSubtitle}>Poder cuidar a partir do conforto da sua casa</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, compacta && styles.titleCompacto]}>Redefinir senha</Text>

          <View style={styles.field}>
            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              placeholderTextColor="#9aa1af"
              value={cpf}
              onChangeText={(texto) => setCpf(formatCpf(texto))}
              keyboardType="numeric"
              maxLength={14}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nova senha</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Sua senha"
                placeholderTextColor="#9aa1af"
                value={novaSenha}
                onChangeText={setNovaSenha}
                secureTextEntry={!novaSenhaVisivel}
              />
              <Pressable onPress={() => setNovaSenhaVisivel((atual) => !atual)} hitSlop={10}>
                <IconeOlho visivel={novaSenhaVisivel} />
              </Pressable>
            </View>
            <Text style={styles.hintText}>{REGRA_SENHA_MENSAGEM}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirmar senha</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Sua senha"
                placeholderTextColor="#9aa1af"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!confirmarSenhaVisivel}
              />
              <Pressable onPress={() => setConfirmarSenhaVisivel((atual) => !atual)} hitSlop={10}>
                <IconeOlho visivel={confirmarSenhaVisivel} />
              </Pressable>
            </View>
          </View>

          {mensagemErro ? <Text style={styles.errorText}>{mensagemErro}</Text> : null}

          <View style={styles.spacer} />

          <Pressable
            style={[styles.submitButton, !podeEnviar && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!podeEnviar}
          >
            <Text style={styles.submitButtonText}>{isSubmitting ? 'Salvando...' : 'Confirmar'}</Text>
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
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  rolagem: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#4467f2',
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerCompacto: {
    paddingTop: 20,
    paddingBottom: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingRight: 12,
    marginBottom: 8,
  },
  backArrow: {
    color: '#ffffff',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  headerTitleCompacto: {
    fontSize: 28,
    lineHeight: 34,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#4467f2',
    marginBottom: 24,
  },
  titleCompacto: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    color: '#20222b',
    marginBottom: 8,
  },
  input: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e8f0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    fontSize: 17,
    color: '#20222b',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e8f0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  inputFlex: {
    flex: 1,
    minWidth: 0,
    fontSize: 17,
    color: '#20222b',
  },
  hintText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 17,
    color: '#8a90a0',
  },
  errorText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#e5484d',
    textAlign: 'center',
    marginTop: 8,
  },
  spacer: {
    flexGrow: 1,
    minHeight: 16,
  },
  submitButton: {
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4467f2',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
});
