import { log, readFile, writeFile } from '../../services/utils';

type SenderWallet = { index: number; privateKey: string | undefined; address: string };

const createFile = async (fileName: string, amountToFund: number, sendersWallets: SenderWallet[]) => {
  const fileData = ['tokenAllocated,tokenReceiveAddress'];

  sendersWallets.forEach(el => {
    const dataRow = `${amountToFund},${el.address}`;
    fileData.push(dataRow);
  });

  const resultFundFile = await writeFile(`${fileName}_to_fund.csv`, fileData.join('\n'));

  if (resultFundFile) {
    log(`${fileName}_to_fund.csv has written successfully`);
  }
};

export const runCreateFundFileFromeWallets = async (filePath: string, amountToFund = 10) => {
  let data;
  try {
    data = await readFile(filePath);
  } catch (err) {
    throw Error(`Could not read file "${filePath}" `);
  }

  try {
    await createFile(filePath.replace('.json', ''), amountToFund, JSON.parse(data));
  } catch (error) {
    console.log('could not create a fund file', error);
  }
};
