import { AnonKeys } from '../../services/ledger/types';
interface FormattedAnonKeys {
    axfrPublicKey: string;
    axfrSecretKey: string;
    decKey: string;
    encKey: string;
}
interface KeysResponse {
    keysInstance: AnonKeys;
    formatted: FormattedAnonKeys;
}
export declare const genAnonKeys: () => Promise<KeysResponse>;
export {};
