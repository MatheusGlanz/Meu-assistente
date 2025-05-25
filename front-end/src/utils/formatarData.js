export function formatarDataBrasilia(data) {
  return new Date(data).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
}

export function formatarDataHoraBrasilia(data) {
  return new Date(data).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
}
