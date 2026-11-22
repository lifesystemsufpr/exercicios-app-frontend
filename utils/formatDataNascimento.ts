/**
 * Máscara de digitação DD/MM/AAAA (até 8 dígitos).
 */
export function formatDataNascimento(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);

  if (digitos.length <= 2) {
    return digitos;
  }
  if (digitos.length <= 4) {
    return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  }
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

/**
 * Valida DD/MM/AAAA completa e real (ex.: rejeita 31/02/2000).
 * Retorna a data em YYYY-MM-DD para o backend, ou `null` se inválida/incompleta.
 */
export function dataNascimentoParaIso(valorMascarado: string): string | null {
  const digitos = valorMascarado.replace(/\D/g, '');
  if (digitos.length !== 8) {
    return null;
  }

  const dia = Number(digitos.slice(0, 2));
  const mes = Number(digitos.slice(2, 4));
  const ano = Number(digitos.slice(4, 8));

  if (mes < 1 || mes > 12 || dia < 1 || dia > 31 || ano < 1900) {
    return null;
  }

  const data = new Date(Date.UTC(ano, mes - 1, dia));
  const valida =
    data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;

  if (!valida || data.getTime() > Date.now()) {
    return null;
  }

  const mesStr = String(mes).padStart(2, '0');
  const diaStr = String(dia).padStart(2, '0');
  return `${ano}-${mesStr}-${diaStr}`;
}
