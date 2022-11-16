import { Keypair } from '../../api';
import { log } from '../../services/utils';

export const runCreateWallet = async (fra_address: boolean) => {
  const password = '123';

  const mm = await Keypair.getMnemonic(24);

  log(`🚀 ~ new mnemonic: "${mm.join(' ')}"`);

  const walletInfo = await Keypair.restoreFromMnemonic(mm, password, fra_address);

  log('🚀 ~ new wallet info: ', walletInfo);
};
