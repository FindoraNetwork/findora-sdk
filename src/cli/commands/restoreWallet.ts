import { Keypair } from '../../api';
import { log } from '../../services/utils';

export const runRestoreWallet = async (mnemonicString: string, isFraAddress: boolean) => {
  const password = '123';
  log(`🚀 ~ mnemonic to be used: "${mnemonicString}"`);

  const mm = mnemonicString.split(' ');

  const walletInfo = await Keypair.restoreFromMnemonic(mm, password, isFraAddress);

  log('🚀 ~ restored wallet info: ', walletInfo);
};
