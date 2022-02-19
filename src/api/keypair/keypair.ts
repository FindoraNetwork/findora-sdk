import { getLedger } from '../../services/ledger/ledgerWrapper';
import {
  AXfrKeyPair,
  AXfrPubKey,
  XfrKeyPair,
  XfrPublicKey,
  XPublicKey,
  XSecretKey,
} from '../../services/ledger/types';

/**
 * A `light` version of the WalletKeypar, containing only address and publickey
 *
 * @param address - FRA wallet address
 * @param publickey - FRA
 */
export interface LightWalletKeypair {
  address: string;
  publickey: string;
}

/**
 * A `full`, or **extended** version of the WalletKeypar, containing private key string as well
 *
 * @param keyStore - An encrypted keyStore
 * @param keypair - An instance of {@link https://git@github.com:FindoraNetwork/wasm-js-bindings.git | Ledger } **XfrKeyPair** keypair
 *
 * @remarks
 * A Findora key pair consists of a private and public key.
 *
 * The private key must remain secret while the public key can be safely shared with other users.
 * Users utilize key pairs to interact with the Findora network in a variety of interesting ways.
 *
 * For instance, users can use their private key to sign operations to define, issue, or transfer assets. Users can also use their private keys to access assets that have been sent to them.
 *
 * Findora's SDK exposes a key store object that makes it easy for users to manage their keys.
 *
 * To keep private keys secure, the key store is encrypted under a user-provided password.
 *
 * The key store contains an encrypted seed that deterministically generates new key pairs.
 *
 * Because key generation is deterministic, the key store only needs to encrypt one element of data, the seed!
 *
 * The seed is encrypted under a master key (PBKDF2 key) derived from the user-provided password. Because generating the master key is expensive, KeyStore exposes a utility for deriving it. Applications can derive the master key once on load and cache it for the duration of their lifetime.
 */
export interface WalletKeypar extends LightWalletKeypair {
  keyStore: Uint8Array;
  keypair: XfrKeyPair;
  privateStr?: string;
}

/**
 * Returns a private key
 * @rem
 * @remarks
 * Using a given {@link https://git@github.com:FindoraNetwork/wasm-js-bindings.git | Ledger } **XfrKeyPair** keypair it returns a private key.
 *
 * This method is used when user needs to retrieve a private key from the **XfrKeyPair** keypair
 *
 * @example
 *
 * ```ts
 * // We use Findora Ledger to generate a new keypair (in demo purposes)
 * const ledger = await getLedger();
 * const keypair = ledger.new_keypair();
 *
 * // Now, we use `getPrivateKeyStr` to return a provate key of this keypair
 * const privateStr = await getPrivateKeyStr(keypair);
 * ```
 * @param keypair - XfrKeyPair
 * @returns Private key
 *
 * @throws `An error returned by Ledger with a prefix added by SDK`
 */
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

export const getAXfrPublicKeyByBase64 = async (publicKey: string): Promise<AXfrPubKey> => {
  const ledger = await getLedger();
  try {
    const toPublickey = ledger.axfr_pubkey_from_string(publicKey);
    return toPublickey;
  } catch (err) {
    throw new Error(`could not get AXfrPubKey by base64 public key, "${err}" `);
  }
};

export const getAXfrPrivateKeyByBase64 = async (privateKey: string): Promise<AXfrKeyPair> => {
  const ledger = await getLedger();
  try {
    const aXfrKeyPair = ledger.axfr_keypair_from_string(privateKey);
    return aXfrKeyPair;
  } catch (err) {
    throw new Error(`could not get AXfrKeyPair from the string, "${err}" `);
  }
};

export const getXPublicKeyByBase64 = async (publicKey: string): Promise<XPublicKey> => {
  const ledger = await getLedger();
  try {
    const toPublickey = ledger.x_pubkey_from_string(publicKey);
    return toPublickey;
  } catch (err) {
    throw new Error(`could not get XPublicKey by base64 public key, "${err}" `);
  }
};

export const getXPrivateKeyByBase64 = async (privateKey: string): Promise<XSecretKey> => {
  const ledger = await getLedger();
  try {
    const toPrivateKey = ledger.x_secretkey_from_string(privateKey);
    return toPrivateKey;
  } catch (err) {
    throw new Error(`could not get XSecretKey by base64 private key, "${err}" `);
  }
};

export const getRandomizeAxfrKeypair = async (
  aXfrKeyPair: AXfrKeyPair,
  randomizer: string,
): Promise<string> => {
  const ledger = await getLedger();
  try {
    const randomizedAXfrKeyPair = ledger.randomize_axfr_keypair(aXfrKeyPair, randomizer);
    return randomizedAXfrKeyPair;
  } catch (err) {
    throw new Error(`could not get randomized string from the AXfrKeyPair, "${err}" `);
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

/**
 * Creates an instance of {@link WalletKeypar} using given private key and password.
 *
 * @remarks
 * This method is used to restore a `wallet keypair`.
 *
 * The **Keypair** contains some essential information, such as:
 * - address
 * - public key
 * - key store
 *
 * and so on, and it is used for pretty much any _personalized_ operation that user can do using FindoraSdk
 *
 * @example
 *
 * ```ts
 * const password = 'qsjEI%123';
 * const pkey = 'XXXXXXXXXX';
 *
 * // Create a wallet info object using given private key and password
 * const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 * ```
 * @param privateStr - Private key
 * @param password - Password to be used to generate an encrypted KeyStore
 * @returns An instance of {@link WalletKeypar}
 *
 */
export const restoreFromPrivateKey = async (privateStr: string, password: string): Promise<WalletKeypar> => {
  const ledger = await getLedger();

  const toSend = `"${privateStr}"`;

  let keypair;

  try {
    keypair = ledger.create_keypair_from_secret(toSend);
  } catch (error) {
    throw new Error(`could not restore keypair. details: "${(error as Error).message}"`);
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
  const keyPairStr = await getPrivateKeyStr(keypair);
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
    throw new Error(`could not restore keypair from the key string. Details: "${(err as Error).message}"`);
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
    throw new Error(
      `could not restore keypair from the key store string. Details: "${(err as Error).message}"`,
    );
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
