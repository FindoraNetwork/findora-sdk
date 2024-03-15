import { Keypair } from '../../api';
import { log, writeFile, readFile } from '../../services/utils';

type SenderWallet = { index: number; privateKey: string | undefined; address: string };

const createFundFile = async (fileName: string, amountToFund: number, sendersWallets: SenderWallet[]) => {
  const fileData = ['tokenAllocated,tokenReceiveAddress'];

  sendersWallets.forEach(el => {
    fileData.push(`${amountToFund},${el.address}`);
  });

  const resultFundFile = await writeFile(`${fileName.replace('.json', '')}_to_fund.csv`, fileData.join('\n'));

  if (resultFundFile) {
    log(`\n\n\n${fileName.replace('.json', '')}_to_fund.csv has written successfully\n\n\n`);
  }
};

export const runCreateAndSaveWallets = async (
  fileName: string,
  amount = 5,
  generateFundFile = false,
  amountToFund = 10,
) => {
  let data;

  try {
    data = await readFile(fileName);
  } catch (err) {
    log(`New file "${fileName}" does not exist yet and it will be created.`);
  }

  if (data) {
    throw Error(`Error! file "${fileName}" already exists! Chose a different name! `);
  }

  const sendersWallets = [];

  const password = '123';

  for (let i = 0; i < amount; i += 1) {
    const mm = await Keypair.getMnemonic(24);

    const newWalletInfo = await Keypair.restoreFromMnemonic(mm, password);

    log(`"${i}". Created sender wallet "${newWalletInfo.address}" ("${newWalletInfo.privateStr}")`);

    const data: SenderWallet = {
      index: i,
      privateKey: newWalletInfo.privateStr,
      address: newWalletInfo.address,
    };

    sendersWallets.push(data);
  }

  const resultSenders = await writeFile(`${fileName}`, JSON.stringify(sendersWallets, null, 2));

  if (resultSenders) {
    log(`${fileName} has written successfully`);
  }

  if (generateFundFile) {
    await createFundFile(fileName, amountToFund, sendersWallets);
  }
};
