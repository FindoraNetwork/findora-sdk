import { BigNumberValue } from '_src/services/bigNumber';
import { WalletKeypar } from '_src/api/keypair';
export declare const getAssetBalance: (walletKeypair: WalletKeypar, assetCode: string, sids: number[]) => Promise<BigNumberValue>;
export declare const getBalance: (walletKeypair: WalletKeypar, assetCode?: string | undefined) => Promise<string>;
