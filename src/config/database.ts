import sqlite3 from 'sqlite3';
import logger from '../utils/logger';

const db = new sqlite3.Database('./stores.db', (err) => {
  if (err) {
    logger.error('Erro ao conectar ao banco de dados SQLite', { error: err.message });
  } else {
    logger.info('Conectado ao banco de dados SQLite');
  }
});

// Criar a tabela e inserir dados iniciais
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      street TEXT NOT NULL,
      number TEXT NOT NULL,
      cep TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    )
  `);

  // Inserir 5 lojas de exemplo (cidades brasileiras)
  const initialStores = [
    ['Loja Centro', 'Rua Principal', '123', '01001000', -23.5505, -46.6333], // São Paulo
    ['Loja Norte', 'Avenida Norte', '456', '02020000', -23.4869, -46.6132], // São Paulo (Zona Norte)
    ['Loja Sul', 'Rua do Sul', '789', '90850000', -30.0346, -51.2177], // Porto Alegre
    ['Loja Leste', 'Avenida Leste', '101', '80010000', -25.4284, -49.2733], // Curitiba
    ['Loja Oeste', 'Rua Oeste', '202', '30140000', -19.9191, -43.9386] // Belo Horizonte
  ];

  const stmt = db.prepare('INSERT INTO stores (name, street, number, cep, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)');
  initialStores.forEach(store => stmt.run(store));
  stmt.finalize();
});

export default db;