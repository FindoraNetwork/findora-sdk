import { getLedger } from '../../services/ledger/ledgerWrapper';
import { XfrKeyPair, XfrPublicKey } from '../../services/ledger/types';

export interface LightWalletKeypair {
  address: string;
  publickey: string;
}

export interface WalletKeypar extends LightWalletKeypair {
  keyStore: Uint8Array;
  keypair: XfrKeyPair;
  privateStr?: string;
}

export const getPrivateKeyStr = async (keypair: XfrKeyPair): Promise<string> => {
  const ledger = await getLedger();

  try {
    const privateStr = ledger.get_priv_key_str(keypair).replace(/^"|"$/g, '');
    return privateStr;
  } catch (err) {
    throw new Error(`could not get priv key string, "${err}" `);
  }
};

export const getPublicKeyStr = async (keypair: XfrKeyPair): Promise<string> => {
  const ledger = await getLedger();

  try {
    const publickey = ledger.get_pub_key_str(keypair).replace(/"/g, '');
    // other option is
    //  const publickey = ledger.public_key_to_base64(ledger.get_pk_from_keypair(keypair));
    //
    return publickey;
  } catch (err) {
    throw new Error(`could not get pub key string, "${err}" `);
  }
};

export const getAddress = async (keypair: XfrKeyPair): Promise<string> => {
  const ledger = await getLedger();
  try {
    const address = ledger.public_key_to_bech32(ledger.get_pk_from_keypair(keypair));
    return address;
  } catch (err) {
    throw new Error(`could not get address string, "${err}" `);
  }
};

export const getAddressByPublicKey = async (publicKey: string): Promise<string> => {
  const ledger = await getLedger();
  try {
    const address = ledger.base64_to_bech32(publicKey);
    return address;
  } catch (err) {
    throw new Error(`could not get address by public key, "${err}" `);
  }
};

/**
 * @todo Add unit test
 */
export const getXfrPublicKeyByBase64 = async (publicKey: string): Promise<XfrPublicKey> => {
  const ledger = await getLedger();
  try {
    const toPublickey = ledger.public_key_from_base64(publicKey);
    return toPublickey;
  } catch (err) {
    throw new Error(`could not get xfr public key by base64, "${err}" `);
  }
};

/**
 * @todo Add unit test
 */
export const getPublicKeyByXfr = async (publicKey: XfrPublicKey): Promise<string> => {
  const ledger = await getLedger();
  try {
    const toPublickey = ledger.public_key_to_base64(publicKey);
    return toPublickey;
  } catch (err) {
    throw new Error(`could not get base64 public key by xfr, "${err}" `);
  }
};

export const getAddressPublicAndKey = async (address: string): Promise<LightWalletKeypair> => {
  const ledger = await getLedger();

  try {
    const publickey = ledger.bech32_to_base64(address);

    return {
      address,
      publickey,
    };
  } catch (err) {
    throw new Error(`could not create a LightWalletKeypair, "${err}" `);
  }
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

  try {
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
  } catch (err) {
    throw new Error(`could not create a WalletKeypar, "${err}" `);
  }
};

export const getMnemonic = async (desiredLength: number, mnemonicLang = 'en'): Promise<string[]> => {
  const ledger = await getLedger();

  try {
    const ledgerMnemonicString = ledger.generate_mnemonic_custom(desiredLength, mnemonicLang);
    const result = String(ledgerMnemonicString).split(' ');
    return result;
  } catch (err) {
    throw new Error(`could not generate custom mnemonic. Details are: "${err}"`);
  }
};
