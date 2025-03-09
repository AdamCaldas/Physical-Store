import { Request, Response } from 'express';
import { getAllStores } from '../models/Store';
import { calculateDistance } from '../utils/distance';
import { getAddressFromCep } from '../services/viaCepService';
import logger from '../utils/logger';

export async function findStores(req: Request, res: Response) {
  const { cep } = req.query;
  const cepRegex = /^\d{8}$/;

  if (!cep || typeof cep !== 'string' || !cepRegex.test(cep)) {
    logger.error('CEP inválido', { cep });
    return res.status(400).json({ message: 'CEP deve ser um número de 8 dígitos' });
  }

  try {
    const { latitude, longitude } = await getAddressFromCep(cep);
    logger.info('Busca de lojas iniciada', { cep, latitude, longitude });

    const stores = await getAllStores();
    const storesWithDistance = stores
      .map(store => ({
        ...store,
        distance: calculateDistance(latitude, longitude, store.latitude, store.longitude)
      }))
      .sort((a, b) => a.distance - b.distance); 

    if (storesWithDistance.length === 0) {
      logger.warn('Nenhuma loja encontrada', { cep });
      return res.status(200).json({ message: 'Nenhuma loja encontrada' });
    }

    logger.info('Lojas encontradas', { count: storesWithDistance.length, cep });
    res.status(200).json(storesWithDistance); 
  } catch (error) {
    logger.error('Erro ao buscar lojas', { error: (error as Error).message, cep });
    res.status(500).json({ message: 'Erro ao processar a solicitação' });
  }
}