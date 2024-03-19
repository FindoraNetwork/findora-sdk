import { log, readFile, writeFile } from '../../services/utils';

type SenderWallet = { index: number; privateKey: string | undefined; address: string };

// arbitrary values to get a getRandomNumber between 10 an 25 sec of waiting between next buy operation
const rndSecMin = 10;
const rndSecMax = 25;

const createFile = async (
  fileName: string,
  tick: string,
  totalFraToSpend: number,
  maxAmtToBuy: number,
  sendersWallets: SenderWallet[],
) => {
  const fileData = ['pKey,tick,totalFraToSpend,maxAmtToBuy,rndSecMin,rndSecMax'];

  sendersWallets.forEach(el => {
    const dataRow = `${el.privateKey},${tick},${totalFraToSpend},${maxAmtToBuy},${rndSecMin},${rndSecMax}`;
    fileData.push(dataRow);
  });

  const resultFundFile = await writeFile(`${fileName}_to_buy.csv`, fileData.join('\n'));

  if (resultFundFile) {
    log(`${fileName}_to_buy.csv has written successfully`);
  }
};

export const runCreateBuyFileFromeWallets = async (
  filePath: string,
  tick: string,
  totalFraToSpend: number,
  maxAmtToBuy: number,
) => {
  let data;
  try {
    data = await readFile(filePath);
  } catch (err) {
    throw Error(`Could not read file "${filePath}" `);
  }

  try {
    await createFile(filePath.replace('.json', ''), tick, totalFraToSpend, maxAmtToBuy, JSON.parse(data));
  } catch (error) {
    console.log('could not create a buyer file', error);
  }
};
