import { WalletKeypar } from '../keypair';
export declare const sendTxToAddress: (walletInfo: WalletKeypar, toWalletInfo: WalletKeypar, numbers: number, isBlindAmount?: boolean, isBlindType?: boolean) => Promise<string>;
