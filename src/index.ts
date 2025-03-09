import readline from 'readline';
import { findStores } from './controllers/storeController';
import logger from './utils/logger';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function askForCep() {
  rl.question('Qual é o seu CEP? (ou "sair" para encerrar): ', async (input) => {
    if (input.toLowerCase() === 'sair') {
      console.log('Encerrando o programa...');
      rl.close();
      return;
    }

    const cep = input;
    logger.info(`CEP informado: ${cep}`);
    
    const req = { query: { cep } } as any;
    let storesWithDistance: any[] = [];
    
    const res = {
      status: (code: number) => ({
        json: (data: any) => {
          if (code === 200) {
            if (Array.isArray(data)) {
              storesWithDistance = data;
              showStoreList(cep, storesWithDistance);
            } else {
              console.log(data.message);
              showMainMenu();
            }
          } else {
            console.log(`Erro (${code}): ${data.message}`);
            showMainMenu();
          }
        }
      })
    } as any;

    try {
      await findStores(req, res);
      await delay(1000); 
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
      showMainMenu();
    }
  });
}

function showStoreList(cep: string, stores: any[]) {
  console.log('\nLojas próximas ao CEP', cep, ':');
  
  const raios = [50, 100, 200]; 
  raios.forEach(raio => {
    const lojasNoRaio = stores.filter((store: any) => store.distance <= raio);
    console.log(`\nDentro de ${raio} km (${lojasNoRaio.length} lojas):`);
    lojasNoRaio.forEach((store: any) => {
      console.log(`- ${store.name} (${store.street}, ${store.number}) - ${store.distance.toFixed(2)} km`);
    });
  });
  
  askForStoreOrBack(cep, stores);
}


function askForStoreOrBack(cep: string, stores: any[]) {
  rl.question(
    '\nO que você quer fazer?\n1. Escolher uma loja\n2. Voltar à lista\n3. Digitar novo CEP\n4. Sair\nDigite o número da opção: ',
    (option) => {
      switch (option) {
        case '1':
          askForStore(stores);
          break;
        case '2':
          showStoreList(cep, stores);
          break;
        case '3':
          showMainMenu();
          break;
        case '4':
          console.log('Encerrando o programa...');
          rl.close();
          break;
        default:
          console.log('Opção inválida, tente novamente.');
          askForStoreOrBack(cep, stores);
      }
    }
  );
}


function askForStore(stores: any[]) {
  rl.question('Qual loja você deseja achar? (Digite o nome exato): ', (storeName) => {
    const selectedStore = stores.find((store: any) => store.name.toLowerCase() === storeName.toLowerCase());
    
    if (selectedStore) {
      console.log('\nLocalização da loja:', selectedStore.name);
      console.log(`- Cidade: ${selectedStore.city}`);
      console.log(`- Bairro: ${selectedStore.neighborhood}`);
      console.log(`- Rua: ${selectedStore.street}`);
      console.log(`- Número: ${selectedStore.number}`);
      console.log(`- Distância: ${selectedStore.distance.toFixed(2)} km`);
    } else {
      console.log(`Loja "${storeName}" não encontrada na lista.`);
    }
    
    askForStoreOrBack(selectedStore?.cep || stores[0].cep, stores); 
  });
}


function showMainMenu() {
  console.log('\nVoltando ao menu principal...');
  askForCep();
}


console.log('Iniciando Physical Store...');
logger.info('Aplicação iniciada');
askForCep();