import { Keypair } from '../../api';
import { log } from '../../services/utils';

export const runRestoreWallet = async (mnemonicString: string) => {
  const password = '123';
  log(`🚀 ~ mnemonic to be used: "${mnemonicString}"`);

  const mm = mnemonicString.split(' ');

  const walletInfo = await Keypair.restoreFromMnemonic(mm, password);

  log('🚀 ~ restored wallet info: ', walletInfo);
};
