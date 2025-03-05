import fetch from 'node-fetch';

export async function getAddressFromCep(cep: string): Promise<{ latitude: number; longitude: number }> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json() as { erro?: boolean };
  if (data.erro) throw new Error('CEP inválido');
  return { latitude: -23.5505, longitude: -46.6333 }; // Mock para São Paulo
}