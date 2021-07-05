import { WalletKeypar } from '../keypair';
export declare const unDelegate: (walletInfo: WalletKeypar, amount: bigint, validator: string) => Promise<string>;
export declare const claim: (walletInfo: WalletKeypar, amount: bigint) => Promise<string>;
