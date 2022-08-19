import { AXfrPubKey } from 'findora-wallet-wasm/web';
import { TransactionBuilder } from '../../services/ledger/types';
import * as Keypair from '../keypair';
interface BalanceInfo {
    assetType: string;
    amount: string;
}
interface AtxoMapItem {
    amount: string;
    atxoSid: string;
    assetType: string;
    commitment: string;
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
export declare const getAbarOwnerMemo: (atxoSid: string) => Promise<import("findora-wallet-wasm/nodejs").AxfrOwnerMemo | import("findora-wallet-wasm/bundler").AxfrOwnerMemo>;
export declare const getAnonKeypairFromJson: (anonKeys: FindoraWallet.FormattedAnonKeys) => Promise<{
    aXfrSpendKeyConverted: import("findora-wallet-wasm/web").AXfrKeyPair;
    axfrPublicKeyConverted: AXfrPubKey;
    axfrViewKeyConverted: import("findora-wallet-wasm/web").AXfrViewKey;
}>;
export declare const getAbarToAbarAmountPayload: (anonKeysSender: FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    commitmentsToSend: string[];
    commitmentsForFee: string[];
    additionalAmountForFee: string;
}>;
export declare const getAbarToBarAmountPayload: (anonKeysSender: FindoraWallet.FormattedAnonKeys, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    commitmentsToSend: string[];
    commitmentsForFee: string[];
    additionalAmountForFee: string;
}>;
export declare const abarToAbarAmount: (anonKeysSender: FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    anonTransferOperationBuilder: import("findora-wallet-wasm/web").AnonTransferOperationBuilder;
    abarToAbarData: FindoraWallet.AbarToAbarData;
}>;
export declare const abarToAbar: (anonKeysSender: FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<{
    anonTransferOperationBuilder: import("findora-wallet-wasm/web").AnonTransferOperationBuilder;
    abarToAbarData: FindoraWallet.AbarToAbarData;
}>;
export declare const prepareAnonTransferOperationBuilder: (anonKeysSender: FindoraWallet.FormattedAnonKeys, axfrPublicKeyReceiverString: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<import("findora-wallet-wasm/web").AnonTransferOperationBuilder>;
export declare const getAbarTransferFee: (anonKeysSender: FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<string>;
export declare const getTotalAbarTransferFee: (anonKeysSender: FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<string>;
export declare const barToAbarAmount: (walletInfo: Keypair.WalletKeypar, amount: string, assetCode: string, receiverAxfrPublicKey: string) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
export declare const barToAbar: (walletInfo: Keypair.WalletKeypar, sids: number[], receiverAxfrPublicKey: string) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
export declare const abarToBarAmount: (anonKeysSender: FindoraWallet.FormattedAnonKeys, receiverXfrPublicKey: string, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    remainderCommitements: string[];
    spentCommitments: string[];
    transactionBuilder: TransactionBuilder;
    abarToBarData: FindoraWallet.AbarToBarData;
    receiverXfrPublicKey: string;
}>;
export declare const abarToBar: (anonKeysSender: FindoraWallet.FormattedAnonKeys, receiverXfrPublicKey: string, additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[]) => Promise<{
    transactionBuilder: TransactionBuilder;
    abarToBarData: FindoraWallet.AbarToBarData;
    receiverXfrPublicKey: string;
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
    atxoMap: {
        [key: string]: AtxoMapItem[];
    };
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
export declare const getSendAtxo: (code: string, amount: BigInt, commitments: string[], anonKeys: FindoraWallet.FormattedAnonKeys) => Promise<{
    amount: bigint;
    sid: string;
    commitment: string;
}[]>;
export declare const getAmountFromCommitments: (code: string, commitments: string[], anonKeys: FindoraWallet.FormattedAnonKeys) => Promise<bigint | never[]>;
export {};
