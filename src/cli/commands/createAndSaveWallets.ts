import { Keypair } from '../../api';
import { log, writeFile } from '../../services/utils';

const defaultWalletsFileName = './senders';

type SenderWallet = { index: number; privateKey: string | undefined; address: string };

const createFundFile = async (fileName: string, amountToFund: number, sendersWallets: SenderWallet[]) => {
  const fileData = ['tokenAllocated,tokenReceiveAddress'];

  sendersWallets.forEach(el => {
    fileData.push(`${amountToFund},${el.address}`);
  });

  const resultFundFile = await writeFile(`${fileName}_to_fund.csv`, fileData.join('\n'));

  if (resultFundFile) {
    log(`${fileName}_to_fund.csv has written successfully`);
  }
};

export const runCreateAndSaveWallets = async (
  amount = 5,
  fileName = defaultWalletsFileName,
  generateFundFile = false,
  amountToFund = 10,
) => {
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

  const resultSenders = await writeFile(`${fileName}.json`, JSON.stringify(sendersWallets, null, 2));

  if (resultSenders) {
    log('senders.json has written successfully');
  }

  if (generateFundFile) {
    await createFundFile(fileName, amountToFund, sendersWallets);
  }
};
