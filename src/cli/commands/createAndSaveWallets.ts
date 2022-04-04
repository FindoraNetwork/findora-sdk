import { Keypair } from '../../api';
import { log, writeFile } from '../../services/utils';

export const runCreateAndSaveWallets = async (amount = 5) => {
  const sendersWallets = [];

  const password = '123';

  for (let i = 0; i < amount; i += 1) {
    const mm = await Keypair.getMnemonic(24);

    const newWalletInfo = await Keypair.restoreFromMnemonic(mm, password);

    log(`"${i}". Created sender wallet "${newWalletInfo.address}" ("${newWalletInfo.privateStr}")`);

    const data = {
      index: i,
      privateKey: newWalletInfo.privateStr,
      address: newWalletInfo.address,
    };

    sendersWallets.push(data);
  }

  const resultSenders = await writeFile('./cache/senders.json', JSON.stringify(sendersWallets, null, 2));

  if (resultSenders) {
    log('senders.json has written successfully');
  }
};
