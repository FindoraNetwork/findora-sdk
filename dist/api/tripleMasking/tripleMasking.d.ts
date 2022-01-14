import { AnonKeys, TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
interface FormattedAnonKeys {
    axfrPublicKey: string;
    axfrSecretKey: string;
    decKey: string;
    encKey: string;
}
export interface BarToAbarResult {
    transactionBuilder: TransactionBuilder;
    randomizers: string[];
}
export interface AnonKeysResponse {
    keysInstance: AnonKeys;
    formatted: FormattedAnonKeys;
}
export declare const genAnonKeys: () => Promise<AnonKeysResponse>;
export declare const barToAbar: (walletInfo: WalletKeypar, sid: number, anonKeys: AnonKeysResponse) => Promise<BarToAbarResult>;
export {};
