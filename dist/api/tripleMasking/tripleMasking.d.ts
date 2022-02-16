import { AnonKeys, TransactionBuilder } from '../../services/ledger/types';
import * as Keypair from '../keypair';
export declare const genAnonKeys: () => Promise<FindoraWallet.AnonKeysResponse<AnonKeys>>;
export declare const saveBarToAbarToCache: (walletInfo: Keypair.WalletKeypar, sid: number, randomizers: string[], anonKeys: FindoraWallet.AnonKeysResponse<AnonKeys>) => Promise<FindoraWallet.BarToAbarData>;
export declare const saveOwnedAbarsToCache: (walletInfo: Keypair.WalletKeypar, ownedAbars: FindoraWallet.OwnedAbarItem[], savePath?: string | undefined) => Promise<boolean>;
export declare const barToAbar: (walletInfo: Keypair.WalletKeypar, sid: number, anonKeys: FindoraWallet.AnonKeysResponse<AnonKeys>) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
export declare const getOwnedAbars: (formattedAxfrPublicKey: string, givenRandomizer: string) => Promise<FindoraWallet.OwnedAbarItem[]>;
export declare const isNullifierHashSpent: (hash: string) => Promise<boolean>;
export declare const genNullifierHash: (atxoSid: number, ownedAbar: FindoraWallet.OwnedAbar, axfrSecretKey: string, decKey: string, randomizer: string) => Promise<string>;
