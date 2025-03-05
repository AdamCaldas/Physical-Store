import db from '../config/database';

export interface Store {
  id: number;
  name: string;
  street: string;
  number: string;
  cep: string;
  latitude: number;
  longitude: number;
}

export function getAllStores(): Promise<Store[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM stores', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows as Store[]);
    });
  });
}