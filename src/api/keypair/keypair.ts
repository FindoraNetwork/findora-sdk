import { getLedger } from '_src/services/ledger/ledgerWrapper';
import { XfrKeyPair } from '_src/services/ledger/types';

export interface LightWalletKeypair {
  address: string;
  publickey: string;
}

export interface WalletKeypar extends LightWalletKeypair {
  keyStore: Uint8Array;
  keypair: XfrKeyPair;
  privateStr: string;
}

export const restorePrivatekeypair = async (privateStr: string, password: string): Promise<WalletKeypar> => {
  const ledger = await getLedger();

  const toSend = `"${privateStr}"`;

  let keypair;

  try {
    keypair = ledger.create_keypair_from_secret(toSend);
  } catch (error) {
    throw new Error(`could not restore keypair. details: "${error.message}"`);
  }

  if (!keypair) {
    throw new Error('could not restore keypair. Keypair is empty');
  }

  const keypairStr = ledger.keypair_to_str(keypair);
  const encrypted = ledger.encryption_pbkdf2_aes256gcm(keypairStr, password);

  return {
    keyStore: encrypted,
    publickey: ledger.get_pub_key_str(keypair).replace(/"/g, ''),
    address: ledger.public_key_to_bech32(ledger.get_pk_from_keypair(keypair)),
    keypair,
    privateStr,
  };
};
