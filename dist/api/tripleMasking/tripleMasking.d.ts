import * as FindoraWallet from '../../types/findoraWallet';
import * as Keypair from '../keypair';
import { TransactionBuilder } from '../../services/ledger/types';
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
    publickey: string;
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
export declare const getAbarOwnerMemo: (atxoSid: string) => Promise<import("findora-wallet-wasm/nodejs").AxfrOwnerMemo | import("findora-wallet-wasm/bundler").AxfrOwnerMemo>;
export declare const getAnonKeypairFromJson: (anonKeys: Keypair.WalletKeypar) => Promise<{
    aXfrSecretKeyConverted: import("findora-wallet-wasm/web").XfrKeyPair;
    axfrPublicKeyConverted: import("findora-wallet-wasm/web").XfrPublicKey;
}>;
export declare const openAbar: (abar: FindoraWallet.OwnedAbarItem, anonKeys: Keypair.WalletKeypar) => Promise<FindoraWallet.OpenedAbarInfo>;
export declare const isNullifierHashSpent: (hash: string) => Promise<boolean>;
export declare const genNullifierHash: (atxoSid: string, ownedAbar: FindoraWallet.OwnedAbar, axfrSpendKey: string) => Promise<string>;
export declare const getOwnedAbars: (givenCommitment: string) => Promise<FindoraWallet.OwnedAbarItem[]>;
export declare const getSpentAbars: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<FindoraWallet.OwnedAbarItem[]>;
export declare const getBalanceMaps: (unspentAbars: FindoraWallet.OwnedAbarItem[], anonKeys: Keypair.WalletKeypar) => Promise<{
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
export declare const getAbarBalance: (unspentAbars: FindoraWallet.OwnedAbarItem[], anonKeys: Keypair.WalletKeypar) => Promise<AnonWalletBalanceInfo>;
export declare const getUnspentAbars: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<FindoraWallet.OwnedAbarItem[]>;
export declare const getBalance: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<AnonWalletBalanceInfo>;
export declare const getSpentBalance: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<AnonWalletBalanceInfo>;
export declare const getAllAbarBalances: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<{
    spentBalances: AnonWalletBalanceInfo;
    unSpentBalances: AnonWalletBalanceInfo;
    givenCommitmentsList: string[];
}>;
export declare const barToAbarAmount: (walletInfo: Keypair.WalletKeypar, amount: string, assetCode: string, receiverAxfrPublicKey: string) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
export declare const barToAbar: (walletInfo: Keypair.WalletKeypar, sids: number[], receiverXfrPublicKey: string) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
export declare const prepareAnonTransferOperationBuilder: (walletInfo: Keypair.WalletKeypar, receiverXfrPublicKey: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<import("findora-wallet-wasm/web").AnonTransferOperationBuilder>;
export declare const getAbarTransferFee: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<string>;
export declare const getSendAtxo: (code: string, amount: BigInt, commitments: string[], anonKeys: Keypair.WalletKeypar) => Promise<{
    amount: bigint;
    sid: string;
    commitment: string;
}[]>;
export declare const getTotalAbarTransferFee: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<string>;
export declare const getAbarToAbarAmountPayload: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    commitmentsToSend: string[];
    commitmentsForFee: string[];
    additionalAmountForFee: string;
}>;
export declare const abarToAbar: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<{
    anonTransferOperationBuilder: import("findora-wallet-wasm/web").AnonTransferOperationBuilder;
    abarToAbarData: FindoraWallet.AbarToAbarData;
}>;
export declare const abarToAbarAmount: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    anonTransferOperationBuilder: import("findora-wallet-wasm/web").AnonTransferOperationBuilder;
    abarToAbarData: FindoraWallet.AbarToAbarData;
}>;
export declare const abarToBar: (anonKeysSender: Keypair.WalletKeypar, receiverXfrPublicKey: string, additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[]) => Promise<{
    transactionBuilder: TransactionBuilder;
    abarToBarData: FindoraWallet.AbarToBarData;
    receiverXfrPublicKey: string;
}>;
export {};
