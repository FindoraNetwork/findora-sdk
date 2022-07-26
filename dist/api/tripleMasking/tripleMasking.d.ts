import { TransactionBuilder } from '../../services/ledger/types';
import * as Keypair from '../keypair';
interface BalanceInfo {
    assetType: string;
    amount: string;
}
interface AnonWalletBalanceInfo {
    axfrPublicKey: string;
    balances: BalanceInfo[];
}
export interface CommitmentsResponseMap {
    [key: string]: [string, number[], number];
}
export interface ProcessedCommitmentsMap {
    commitmentKey: string;
    commitmentAxfrPublicKey: string;
    commitmentAssetType: string;
    commitmentAmount: string;
}
export declare const genAnonKeys: () => Promise<FindoraWallet.FormattedAnonKeys>;
export declare const saveBarToAbarToCache: (walletInfo: Keypair.WalletKeypar, sid: number, commitments: string[], receiverAxfrPublicKey: string) => Promise<FindoraWallet.BarToAbarData>;
export declare const saveOwnedAbarsToCache: (walletInfo: Keypair.WalletKeypar, ownedAbars: FindoraWallet.OwnedAbarItem[], savePath?: string | undefined) => Promise<boolean>;
export declare const abarToAbar: (anonKeysSender: FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, abarAmountToTransfer: string, ownedAbarToUseAsSource: FindoraWallet.OwnedAbarItem, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<{
    anonTransferOperationBuilder: import("findora-wallet-wasm/web").AnonTransferOperationBuilder;
    abarToAbarData: FindoraWallet.AbarToAbarData;
}>;
export declare const prepareAnonTransferOperationBuilder: (anonKeysSender: FindoraWallet.FormattedAnonKeys, axfrPublicKeyReceiverString: string, abarAmountToTransfer: string, ownedAbarToUseAsSource: FindoraWallet.OwnedAbarItem, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<import("findora-wallet-wasm/web").AnonTransferOperationBuilder>;
export declare const getAbarTransferFee: (anonKeysSender: FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, abarAmountToTransfer: string, ownedAbarToUseAsSource: FindoraWallet.OwnedAbarItem, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<string>;
export declare const barToAbar: (walletInfo: Keypair.WalletKeypar, sid: number, receiverAxfrPublicKey: string) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
export declare const abarToBar: (anonKeysSender: FindoraWallet.FormattedAnonKeys, receiverWalletInfo: Keypair.WalletKeypar, ownedAbarToUseAsSource: FindoraWallet.OwnedAbarItem) => Promise<{
    transactionBuilder: TransactionBuilder;
    abarToBarData: FindoraWallet.AbarToBarData;
    receiverWalletInfo: Keypair.WalletKeypar;
}>;
export declare const isNullifierHashSpent: (hash: string) => Promise<boolean>;
export declare const getNullifierHashesFromCommitments: (anonKeys: FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<string[]>;
export declare const getUnspentAbars: (anonKeys: FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<FindoraWallet.OwnedAbarItem[]>;
export declare const getSpentAbars: (anonKeys: FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<FindoraWallet.OwnedAbarItem[]>;
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
export declare const getBalance: (anonKeys: FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<AnonWalletBalanceInfo>;
export declare const getSpentBalance: (anonKeys: FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<AnonWalletBalanceInfo>;
export declare const getAllAbarBalances: (anonKeys: FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<{
    spentBalances: AnonWalletBalanceInfo;
    unSpentBalances: AnonWalletBalanceInfo;
    givenCommitmentsList: string[];
}>;
export declare const getAbarBalance: (unspentAbars: FindoraWallet.OwnedAbarItem[], anonKeys: FindoraWallet.FormattedAnonKeys) => Promise<AnonWalletBalanceInfo>;
export declare const getOwnedAbars: (givenCommitment: string) => Promise<FindoraWallet.OwnedAbarItem[]>;
export declare const genNullifierHash: (atxoSid: string, ownedAbar: FindoraWallet.OwnedAbar, axfrSpendKey: string) => Promise<string>;
export {};
