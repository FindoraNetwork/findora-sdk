import { AXfrPubKey } from 'findora-wallet-wasm/web';
import { TransactionBuilder } from '../../services/ledger/types';
import * as FW from '../../types/FindoraWallet';
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
export declare const genAnonKeys: () => Promise<FW.FindoraWallet.FormattedAnonKeys>;
export declare const saveBarToAbarToCache: (walletInfo: Keypair.WalletKeypar, sid: number, commitments: string[], receiverAxfrPublicKey: string) => Promise<FW.FindoraWallet.BarToAbarData>;
export declare const saveOwnedAbarsToCache: (walletInfo: Keypair.WalletKeypar, ownedAbars: FW.FindoraWallet.OwnedAbarItem[], savePath?: string | undefined) => Promise<boolean>;
export declare const getAbarOwnerMemo: (atxoSid: string) => Promise<import("findora-wallet-wasm/nodejs").AxfrOwnerMemo | import("findora-wallet-wasm/bundler").AxfrOwnerMemo>;
export declare const getAnonKeypairFromJson: (anonKeys: FW.FindoraWallet.FormattedAnonKeys) => Promise<{
    aXfrSpendKeyConverted: import("findora-wallet-wasm/web").AXfrKeyPair;
    axfrPublicKeyConverted: AXfrPubKey;
    axfrViewKeyConverted: import("findora-wallet-wasm/web").AXfrViewKey;
}>;
export declare const getAbarToAbarAmountPayload: (anonKeysSender: FW.FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    commitmentsToSend: string[];
    commitmentsForFee: string[];
    additionalAmountForFee: string;
}>;
export declare const getAbarToBarAmountPayload: (anonKeysSender: FW.FindoraWallet.FormattedAnonKeys, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    commitmentsToSend: string[];
    commitmentsForFee: string[];
    additionalAmountForFee: string;
}>;
export declare const abarToAbarAmount: (anonKeysSender: FW.FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    anonTransferOperationBuilder: import("findora-wallet-wasm/web").AnonTransferOperationBuilder;
    abarToAbarData: FW.FindoraWallet.AbarToAbarData;
}>;
export declare const abarToAbar: (anonKeysSender: FW.FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FW.FindoraWallet.OwnedAbarItem[]) => Promise<{
    anonTransferOperationBuilder: import("findora-wallet-wasm/web").AnonTransferOperationBuilder;
    abarToAbarData: FW.FindoraWallet.AbarToAbarData;
}>;
export declare const prepareAnonTransferOperationBuilder: (anonKeysSender: FW.FindoraWallet.FormattedAnonKeys, axfrPublicKeyReceiverString: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FW.FindoraWallet.OwnedAbarItem[]) => Promise<import("findora-wallet-wasm/web").AnonTransferOperationBuilder>;
export declare const getAbarTransferFee: (anonKeysSender: FW.FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FW.FindoraWallet.OwnedAbarItem[]) => Promise<string>;
export declare const getTotalAbarTransferFee: (anonKeysSender: FW.FindoraWallet.FormattedAnonKeys, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FW.FindoraWallet.OwnedAbarItem[]) => Promise<string>;
export declare const barToAbarAmount: (walletInfo: Keypair.WalletKeypar, amount: string, assetCode: string, receiverAxfrPublicKey: string) => Promise<FW.FindoraWallet.BarToAbarResult<TransactionBuilder>>;
export declare const barToAbar: (walletInfo: Keypair.WalletKeypar, sids: number[], receiverAxfrPublicKey: string) => Promise<FW.FindoraWallet.BarToAbarResult<TransactionBuilder>>;
export declare const abarToBarAmount: (anonKeysSender: FW.FindoraWallet.FormattedAnonKeys, receiverXfrPublicKey: string, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    remainderCommitements: string[];
    spentCommitments: string[];
    transactionBuilder: TransactionBuilder;
    abarToBarData: FW.FindoraWallet.AbarToBarData;
    receiverXfrPublicKey: string;
}>;
export declare const abarToBar: (anonKeysSender: FW.FindoraWallet.FormattedAnonKeys, receiverXfrPublicKey: string, additionalOwnedAbarItems: FW.FindoraWallet.OwnedAbarItem[]) => Promise<{
    transactionBuilder: TransactionBuilder;
    abarToBarData: FW.FindoraWallet.AbarToBarData;
    receiverXfrPublicKey: string;
}>;
export declare const isNullifierHashSpent: (hash: string) => Promise<boolean>;
export declare const getNullifierHashesFromCommitments: (anonKeys: FW.FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<string[]>;
export declare const getUnspentAbars: (anonKeys: FW.FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<FW.FindoraWallet.OwnedAbarItem[]>;
export declare const getSpentAbars: (anonKeys: FW.FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<FW.FindoraWallet.OwnedAbarItem[]>;
export declare const openAbar: (abar: FW.FindoraWallet.OwnedAbarItem, anonKeys: FW.FindoraWallet.FormattedAnonKeys) => Promise<FW.FindoraWallet.OpenedAbarInfo>;
export declare const getBalanceMaps: (unspentAbars: FW.FindoraWallet.OwnedAbarItem[], anonKeys: FW.FindoraWallet.FormattedAnonKeys) => Promise<{
    assetDetailsMap: {
        [key: string]: FW.FindoraWallet.IAsset;
    };
    balancesMap: {
        [key: string]: string;
    };
    usedAssets: string[];
    atxoMap: {
        [key: string]: AtxoMapItem[];
    };
}>;
export declare const getBalance: (anonKeys: FW.FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<AnonWalletBalanceInfo>;
export declare const getSpentBalance: (anonKeys: FW.FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<AnonWalletBalanceInfo>;
export declare const getAllAbarBalances: (anonKeys: FW.FindoraWallet.FormattedAnonKeys, givenCommitmentsList: string[]) => Promise<{
    spentBalances: AnonWalletBalanceInfo;
    unSpentBalances: AnonWalletBalanceInfo;
    givenCommitmentsList: string[];
}>;
export declare const getAbarBalance: (unspentAbars: FW.FindoraWallet.OwnedAbarItem[], anonKeys: FW.FindoraWallet.FormattedAnonKeys) => Promise<AnonWalletBalanceInfo>;
export declare const getOwnedAbars: (givenCommitment: string) => Promise<FW.FindoraWallet.OwnedAbarItem[]>;
export declare const genNullifierHash: (atxoSid: string, ownedAbar: FW.FindoraWallet.OwnedAbar, axfrSpendKey: string) => Promise<string>;
export declare const getSendAtxo: (code: string, amount: BigInt, commitments: string[], anonKeys: FW.FindoraWallet.FormattedAnonKeys) => Promise<{
    amount: bigint;
    sid: string;
    commitment: string;
}[]>;
export declare const getAmountFromCommitments: (code: string, commitments: string[], anonKeys: FW.FindoraWallet.FormattedAnonKeys) => Promise<bigint | never[]>;
export {};
