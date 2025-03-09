import sqlite3 from 'sqlite3';
import logger from '../utils/logger';

const db = new sqlite3.Database('./stores.db', (err) => {
  if (err) logger.error('Erro ao conectar ao banco de dados SQLite', { error: err.message });
  else logger.info('Conectado ao banco de dados SQLite');
});

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS stores');
  db.run(`
    CREATE TABLE stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      street TEXT NOT NULL,
      number TEXT NOT NULL,
      cep TEXT NOT NULL,
      city TEXT NOT NULL,
      neighborhood TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    )
  `);

  const initialStores = [
    ['Shopping Patteo Olinda', 'Rua Carmelita Muniz de Araújo', '225', '53110000', 'Olinda', 'Casa Caiada', -8.0028, -34.8450],
    ['Mercado da Ribeira', 'Rua Bernardo Vieira de Melo', 's/n', '53120010', 'Olinda', 'Bairro Novo', -7.9960, -34.8380],
    ['Atacadão Olinda', 'Av. Gov. Carlos de Lima Cavalcanti', '3500', '53130530', 'Olinda', 'Casa Caiada', -8.0100, -34.8500],
    ['Supermercado Extra', 'Av. Pres. Kennedy', '1000', '53230630', 'Olinda', 'Peixinhos', -8.0250, -34.8650],
    ['Shopping Recife', 'Rua Padre Carapuceiro', '777', '51020280', 'Recife', 'Boa Viagem', -8.1198, -34.9048],
    ['Shopping Tacaruna', 'Av. Gov. Agamenon Magalhães', '153', '50110900', 'Recife', 'Santo Amaro', -8.0367, -34.8722],
    ['Caruaru Shopping', 'Av. Adjar da Silva Casé', '800', '55024740', 'Caruaru', 'Indianópolis', -8.2826, -35.9759],
    ['Shopping Manaíra', 'Av. Gov. Flávio Ribeiro Coutinho', '805', '58037000', 'João Pessoa', 'Manaíra', -7.0988, -34.8386],
    ['Shopping Guararapes', 'Av. Barreto de Menezes', '800', '54410100', 'Jaboatão dos Guararapes', 'Piedade', -8.1638, -34.9256],
    ['Mercado de Casa Amarela', 'Rua Padre Lemos', '101', '52070200', 'Recife', 'Casa Amarela', -8.0278, -34.9167],
    ['Shopping Plaza Casa Forte', 'Av. Dezessete de Agosto', '1693', '52061540', 'Recife', 'Casa Forte', -8.0345, -34.9180],
    ['Atacadão Caruaru', 'Av. José Pinheiro dos Santos', '500', '55034640', 'Caruaru', 'Agamenon Magalhães', -8.2750, -35.9700],
    ['Magazine Luiza João Pessoa', 'Av. Dom Pedro II', '567', '58013420', 'João Pessoa', 'Centro', -7.1178, -34.8820]
  ];

  const stmt = db.prepare('INSERT INTO stores (name, street, number, cep, city, neighborhood, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  initialStores.forEach(store => stmt.run(store));
  stmt.finalize();
});

export default db;