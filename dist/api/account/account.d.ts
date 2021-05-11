import { BigNumberValue } from '../../services/bigNumber';
import { WalletKeypar } from '../keypair';
export declare const getAssetBalance: (walletKeypair: WalletKeypar, assetCode: string, sids: number[]) => Promise<BigNumberValue>;
export declare const getBalance: (walletKeypair: WalletKeypar, assetCode?: string | undefined) => Promise<string>;
