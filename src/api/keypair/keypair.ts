import { getLedger } from '../../services/ledger/ledgerWrapper';
import { XfrKeyPair } from '../../services/ledger/types';

export interface LightWalletKeypair {
  address: string;
  publickey: string;
}

export interface WalletKeypar extends LightWalletKeypair {
  keyStore: Uint8Array;
  keypair: XfrKeyPair;
  privateStr: string;
}

export const getPrivateKeyStr = async (keypair: XfrKeyPair): Promise<string> => {
  const ledger = await getLedger();
  const privateStr = ledger.get_priv_key_str(keypair).replace(/^"|"$/g, '');
  return privateStr;
};

export const getPublicKeyStr = async (keypair: XfrKeyPair): Promise<string> => {
  const ledger = await getLedger();
  const publickey = ledger.get_pub_key_str(keypair).replace(/"/g, '');
  return publickey;
};

export const getPublicKeyBase64 = async (keypair: XfrKeyPair): Promise<string> => {
  const ledger = await getLedger();

  const publickey = ledger.public_key_to_base64(ledger.get_pk_from_keypair(keypair));
  return publickey;
};

export const getAddress = async (keypair: XfrKeyPair): Promise<string> => {
  const ledger = await getLedger();
  const address = ledger.public_key_to_bech32(ledger.get_pk_from_keypair(keypair));
  return address;
};

export const getAddressByPublicKey = async (publicKey: string): Promise<string> => {
  const ledger = await getLedger();
  const address = ledger.base64_to_bech32(publicKey);
  return address;
};

export const getAddressPublicAndKey = async (address: string): Promise<LightWalletKeypair> => {
  const ledger = await getLedger();

  const publickey = ledger.bech32_to_base64(address);

  return {
    address,
    publickey,
  };
};

export const restoreFromPrivateKey = async (privateStr: string, password: string): Promise<WalletKeypar> => {
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

  const publickey = await getPublicKeyStr(keypair);
  const address = await getAddress(keypair);

  return {
    keyStore: encrypted,
    publickey,
    address,
    keypair,
    privateStr,
  };
};

export const restoreFromMnemonic = async (mnemonic: string[], password: string): Promise<WalletKeypar> => {
  const ledger = await getLedger();

  const keypair = ledger.restore_keypair_from_mnemonic_default(mnemonic.join(' '));
  const keyPairStr = ledger.keypair_to_str(keypair);
  const encrypted = ledger.encryption_pbkdf2_aes256gcm(keyPairStr, password);

  const publickey = await getPublicKeyStr(keypair);
  const address = await getAddress(keypair);

  return {
    keyStore: encrypted,
    publickey,
    address,
    keypair,
    privateStr: keyPairStr,
  };
};

export const restoreFromKeystore = async (keyStore: Uint8Array, password: string): Promise<WalletKeypar> => {
  const ledger = await getLedger();

  try {
    const keyPairStr = ledger.decryption_pbkdf2_aes256gcm(keyStore, password);
    const keypair = ledger.keypair_from_str(keyPairStr);
    const encrypted = ledger.encryption_pbkdf2_aes256gcm(keyPairStr, password);

    const publickey = await getPublicKeyStr(keypair);
    const address = await getAddress(keypair);
    const privateStr = await getPrivateKeyStr(keypair);

    return {
      keyStore: encrypted,
      publickey,
      address,
      keypair,
      privateStr,
    };
  } catch (err) {
    throw new Error(`could not restore keypair from the key string. Details: "${err.message}"`);
  }
};

export const restoreFromKeystoreString = async (
  keyStoreString: string,
  password: string,
): Promise<WalletKeypar> => {
  try {
    const keyStoreObject = JSON.parse(keyStoreString).encryptedKey;
    const keyStore: Uint8Array = new Uint8Array(Object.values(keyStoreObject));

    const result = await restoreFromKeystore(keyStore, password);

    return result;
  } catch (err) {
    throw new Error(`could not restore keypair from the key store string. Details: "${err.message}"`);
  }
};

export const createKeypair = async (password: string): Promise<WalletKeypar> => {
  const ledger = await getLedger();

  const keypair = ledger.new_keypair();
  const keyPairStr = ledger.keypair_to_str(keypair);
  const encrypted = ledger.encryption_pbkdf2_aes256gcm(keyPairStr, password);

  const privateStr = await getPrivateKeyStr(keypair);
  const publickey = await getPublicKeyStr(keypair);
  const address = await getAddress(keypair);

  return {
    keyStore: encrypted,
    publickey,
    address,
    keypair,
    privateStr,
  };
};

export const getMnemonic = async (desiredLength: number, mnemonicLang = 'EN'): Promise<string[]> => {
  const ledger = await getLedger();
  const result = String(ledger.generate_mnemonic_custom(desiredLength, mnemonicLang)).split(' ');
  return result;
};
