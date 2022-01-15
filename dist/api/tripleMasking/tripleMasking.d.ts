import { CacheItem } from '../../services/cacheStore/types';
import { AnonKeys, TransactionBuilder } from '../../services/ledger/types';
import * as Keypair from '../keypair';
interface FormattedAnonKeys {
    axfrPublicKey: string;
    axfrSecretKey: string;
    decKey: string;
    encKey: string;
}
export interface BarToAbarResult {
    transactionBuilder: TransactionBuilder;
    barToAbarData: CacheItem;
}
export interface AnonKeysResponse {
    keysInstance: AnonKeys;
    formatted: FormattedAnonKeys;
}
export declare const genAnonKeys: () => Promise<AnonKeysResponse>;
export declare const saveBarToAbarToCache: (walletInfo: Keypair.WalletKeypar, sid: number, randomizers: string[], anonKeys: AnonKeysResponse) => Promise<CacheItem>;
export declare const barToAbar: (walletInfo: Keypair.WalletKeypar, sid: number, anonKeys: AnonKeysResponse) => Promise<BarToAbarResult>;
export {};
