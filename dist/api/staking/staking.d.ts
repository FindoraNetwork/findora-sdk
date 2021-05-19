import { WalletKeypar } from '../keypair';
export declare const getFraAssetCode: () => Promise<string>;
export declare const unDelegate: (walletInfo: WalletKeypar) => Promise<string>;
export declare const claim: (walletInfo: WalletKeypar, amount: BigInt) => Promise<string>;
