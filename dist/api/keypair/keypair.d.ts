import { AXfrKeyPair, AXfrPubKey, XfrKeyPair, XfrPublicKey } from '../../services/ledger/types';
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
export interface EvmWalletKeypair {
    keyStore?: Uint8Array | string;
    address?: string;
    privateKey?: string;
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
export declare const getPrivateKeyStr: (keypair: XfrKeyPair) => Promise<string>;
export declare const getMnemonic: (desiredLength: number, mnemonicLang?: string) => Promise<string[]>;
export declare const getPublicKeyStr: (keypair: XfrKeyPair) => Promise<string>;
export declare const getAddress: (keypair: XfrKeyPair) => Promise<string>;
export declare const getAddressByPublicKey: (publicKey: string) => Promise<string>;
/**
 * @todo Add unit test
 */
export declare const getXfrPublicKeyByBase64: (publicKey: string) => Promise<XfrPublicKey>;
/**
 * @todo Add unit test
 */
export declare const getPublicKeyByXfr: (publicKey: XfrPublicKey) => Promise<string>;
export declare const getAXfrPublicKeyByBase64: (publicKey: string) => Promise<AXfrPubKey>;
export declare const getAXfrPrivateKeyByBase64: (privateKey: string) => Promise<AXfrKeyPair>;
export declare const getAxfrPubKeyByBase64: (publicKey: string) => Promise<AXfrPubKey>;
export declare const getAddressPublicAndKey: (address: string) => Promise<LightWalletKeypair>;
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
export declare const restoreFromPrivateKey: (privateStr: string, password: string) => Promise<WalletKeypar>;
export declare const restoreEvmPrivate: (privateStr: string, password: string) => Promise<EvmWalletKeypair>;
export declare const restoreEvmKeyStore: (keyStore: Uint8Array, password: string) => Promise<EvmWalletKeypair>;
export declare const restoreFromMnemonic: (mnemonic: string[], password: string, isFraAddress?: boolean) => Promise<WalletKeypar>;
export declare const restoreFromKeystore: (keyStore: Uint8Array, ksPassword: string, password: string) => Promise<WalletKeypar>;
export declare const recoveryKeypairFromKeystore: (keyStore: Uint8Array, password: string) => Promise<Partial<WalletKeypar>>;
export declare const restoreFromKeystoreString: (keyStoreString: string, ksPassword: string, password: string) => Promise<WalletKeypar>;
export declare const createKeypair: (password: string, isFraAddress?: boolean) => Promise<WalletKeypar>;
