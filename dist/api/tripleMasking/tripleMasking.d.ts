import { AnonKeys, TransactionBuilder } from '../../services/ledger/types';
import * as Keypair from '../keypair';
export declare const genAnonKeys: () => Promise<FindoraWallet.AnonKeysResponse<AnonKeys>>;
export declare const saveBarToAbarToCache: (walletInfo: Keypair.WalletKeypar, sid: number, randomizers: string[], anonKeys: FindoraWallet.AnonKeysResponse<AnonKeys>) => Promise<FindoraWallet.BarToAbarData>;
export declare const barToAbar: (walletInfo: Keypair.WalletKeypar, sid: number, anonKeys: FindoraWallet.AnonKeysResponse<AnonKeys>) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
export declare const getOwnedAbars: (formattedAxfrPublicKey: string, givenRandomizer: string) => Promise<{
    atxoSid: number;
    ownedAbar: {
        amount_type_commitment: string;
        public_key: string;
    };
}[]>;
