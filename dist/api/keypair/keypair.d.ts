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
export declare const restorePrivatekeypair: (privateStr: string, password: string) => Promise<WalletKeypar>;
