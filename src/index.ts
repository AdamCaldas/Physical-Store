import express from 'express';
import storeRoutes from './routes/storeRoutes';
import logger from './utils/logger';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', storeRoutes);

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
  console.log(`Servidor rodando na porta ${PORT}`);
});