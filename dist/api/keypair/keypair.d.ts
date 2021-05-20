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
export declare const getPrivateKeyStr: (keypair: XfrKeyPair) => Promise<string>;
export declare const getPublicKeyStr: (keypair: XfrKeyPair) => Promise<string>;
export declare const getAddress: (keypair: XfrKeyPair) => Promise<string>;
export declare const getAddressPublicAndKey: (address: string) => Promise<LightWalletKeypair>;
export declare const restoreFromPrivateKey: (privateStr: string, password: string) => Promise<WalletKeypar>;
export declare const restoreFromMnemonic: (mnemonic: string[], password: string) => Promise<WalletKeypar>;
export declare const restoreFromKeystore: (keyStore: Uint8Array, password: string) => Promise<WalletKeypar>;
export declare const restoreFromKeystoreString: (keyStoreString: string, password: string) => Promise<WalletKeypar>;
export declare const createKeypair: (password: string) => Promise<WalletKeypar>;
export declare const getMnemonic: (desiredLength: number, mnemonicLang?: string) => Promise<string[]>;
