import fetch from 'node-fetch';
import logger from '../utils/logger';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface NominatimResponse {
  lat: string;
  lon: string;
}

export async function getAddressFromCep(cep: string): Promise<{ latitude: number; longitude: number }> {
  
  const viaCepUrl = `https://viacep.com.br/ws/${cep}/json/`;
  const viaCepResponse = await fetch(viaCepUrl);
  const viaCepData: ViaCepResponse = await viaCepResponse.json();

  if (viaCepData.erro) {
    logger.error('CEP não encontrado no ViaCEP', { cep });
    throw new Error('CEP não encontrado');
  }

  const { logradouro, bairro, localidade, uf } = viaCepData;
  const addressQuery = `${logradouro}, ${bairro}, ${localidade}, ${uf}, Brasil`;

  const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery)}&format=json&limit=1`;
  const nominatimResponse = await fetch(nominatimUrl, {
    headers: { 'User-Agent': 'PhysicalStoreApp/1.0' } 
  });
  const nominatimData: NominatimResponse[] = await nominatimResponse.json();

  if (!nominatimData.length) {
    logger.error('Coordenadas não encontradas para o endereço', { cep, addressQuery });
    throw new Error('Não foi possível obter coordenadas para o CEP');
  }

  const { lat, lon } = nominatimData[0];
  logger.info('Coordenadas obtidas', { cep, latitude: lat, longitude: lon });

  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon)
  };
}