import { AnonTransferOperationBuilder, TransactionBuilder } from '../../services/ledger/types';
import * as Keypair from '../keypair';
interface BalanceInfo {
    assetType: string;
    amount: string;
}
interface AnonWalletBalanceInfo {
    axfrPublicKey: string;
    balances: BalanceInfo[];
}
export declare const genAnonKeys: () => Promise<FindoraWallet.FormattedAnonKeys>;
export declare const saveBarToAbarToCache: (walletInfo: Keypair.WalletKeypar, sid: number, randomizers: string[], anonKeys: FindoraWallet.FormattedAnonKeys) => Promise<FindoraWallet.BarToAbarData>;
export declare const saveOwnedAbarsToCache: (walletInfo: Keypair.WalletKeypar, ownedAbars: FindoraWallet.OwnedAbarItem[], savePath?: string | undefined) => Promise<boolean>;
export declare const abarToAbar: (anonKeysSender: FindoraWallet.FormattedAnonKeys, anonKeysReceiver: FindoraWallet.FormattedAnonKeys, abarAmountToTransfer: string, ownedAbarToUseAsSource: FindoraWallet.OwnedAbarItem, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<{
    anonTransferOperationBuilder: AnonTransferOperationBuilder;
    abarToAbarData: FindoraWallet.AbarToAbarData;
}>;
export declare const barToAbar: (walletInfo: Keypair.WalletKeypar, sid: number, anonKeys: FindoraWallet.FormattedAnonKeys) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
export declare const isNullifierHashSpent: (hash: string) => Promise<boolean>;
export declare const getUnspentAbars: (anonKeys: FindoraWallet.FormattedAnonKeys, givenRandomizersList: string[]) => Promise<FindoraWallet.OwnedAbarItem[]>;
export declare const openAbar: (abar: FindoraWallet.OwnedAbarItem, anonKeys: FindoraWallet.FormattedAnonKeys) => Promise<FindoraWallet.OpenedAbarInfo>;
export declare const getBalanceMaps: (unspentAbars: FindoraWallet.OwnedAbarItem[], anonKeys: FindoraWallet.FormattedAnonKeys) => Promise<{
    assetDetailsMap: {
        [key: string]: FindoraWallet.IAsset;
    };
    balancesMap: {
        [key: string]: string;
    };
    usedAssets: string[];
}>;
export declare const getBalance: (anonKeys: FindoraWallet.FormattedAnonKeys, givenRandomizersList: string[]) => Promise<AnonWalletBalanceInfo>;
export declare const getAbarBalance: (unspentAbars: FindoraWallet.OwnedAbarItem[], anonKeys: FindoraWallet.FormattedAnonKeys) => Promise<AnonWalletBalanceInfo>;
export declare const getOwnedAbars: (formattedAxfrPublicKey: string, givenRandomizer: string) => Promise<FindoraWallet.OwnedAbarItem[]>;
export declare const genNullifierHash: (atxoSid: string, ownedAbar: FindoraWallet.OwnedAbar, axfrSecretKey: string, decKey: string, randomizer: string) => Promise<string>;
export {};
