import { AnonTransferOperationBuilder, TransactionBuilder } from '../../services/ledger/types';
import * as FindoraWallet from '../../types/findoraWallet';
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
export declare const genAnonKeys: () => Promise<Keypair.WalletKeypar>;
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
/**
 * Transfer the exact amount of funds from a 'transparent' to 'anonymous' wallet
 *
 * @remarks
 * This function is used to transfer the exact amount of provided asset code from the sender to the receiver.
 * It is calling `sendToAddress` function to obtain an utxo with the exact amount, and then it is calling `barToAbar`
 * with a fetched utxo sid number
  *
 * @example
 *
 * ```ts
  // returns a tx builder to be submitted to the nextwork
  const { transactionBuilder } = await barToAbarAmount(senderWalletInfo, amount, fraAssetCode, receiverPublickey);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 * @returns a promise with an object that contains the TransactionBuilder, which should be used in `Transaction.submitTransaction`
 */
export declare const barToAbarAmount: (walletInfo: Keypair.WalletKeypar, amount: string, assetCode: string, receiverAxfrPublicKey: string) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
/**
 * Transfer funds from a 'transparent' to 'anonymous' wallet
 *
 * @remarks
 * Using a given array of utxo sids, this function fetches the associated utxo objects and confidentially transfers those
 * utxos (bars) to a given receiverPublicKey. After the transaction is submitted, the receiver will receive a list of one (or multiple)
 * atxos (aka abars).
 * Please note, this function is only meant to transfer the particularly provided utxos, and it is not used for transferring a custom
 * amount. To transfer the custom amount, please use `barToAbarAmount`
  *
 * @example
 *
 * ```ts
  // returns a tx builder to be submitted to the nextwork
  const { transactionBuilder } = await TripleMasking.barToAbar(senderWalletInfo, arrayOfUtxoSids, receiverPublickey);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```

    @throws `Could not fetch utxo for sids `
    @throws `Could not fetch memo data for sid `
    @throws `Could not get decode memo data or get assetRecord`
    @throws `Could not add bar to abar operation`
    @throws `Could not get fee inputs for bar to abar operation`
    @throws `Could not add fee for bar to abar operation`
    @throws `could not get a list of commitments strings `
    @throws `list of commitments strings is empty`
    @throws `could not build and sign txn`

 * @returns a promise with an object that contains the TransactionBuilder, which should be used in `Transaction.submitTransaction`
 */
export declare const barToAbar: (walletInfo: Keypair.WalletKeypar, sids: number[], receiverPublicKey: string) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
export declare const prepareAnonTransferOperationBuilder: (walletInfo: Keypair.WalletKeypar, receiverXfrPublicKey: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<AnonTransferOperationBuilder>;
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
/**
 * Transfer funds from an 'anonymous' to another 'anonymous' wallet
 *
 * @remarks
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note, that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remained abars could be either FRA asset, or other custom assets.
 *
 * @example
 *
 * ```ts
 * const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
 *    anonKeysSender,
 *    anonKeysReceiver.publickey,
 *    '2',
 *    additionalOwnedAbarItems,
 *  );

  // tx hash
 *  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);
 * ```
 *
 * @remarks

 Please also keep in mind, that this function returns an object `abarToBarData` which contains information about the new commitments,
 both for the sender (i.e. with the remainders from the transfer) and for the receiver (with a destination abar commitment value).

 Those commitments could be retrieved in this way.

* ```ts
*  const { commitmentsMap } = abarToAbarData;
*
*  const retrievedCommitmentsListReceiver = [];
*  const retrievedCommitmentsListSender= [];
*
*  for (const commitmentsMapEntry of commitmentsMap) {
*    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
*
*    if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
*      givenCommitmentsListSender.push(commitmentKey);
*    }
*
*    if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
*      retrievedCommitmentsListReceiver.push(commitmentKey);
*    }
*  }
* ```
*
* @throws 'The amount you are trying to send might be too big to be sent at once. Please try sending a smaller amount'
* @throws 'Could not process abar transfer. More fees are needed. Required amount at least "${calculatedFee} FRA"'
* @throws 'Could not build and sign abar transfer operation'
* @throws 'Could not get a list of commitments strings '
*
* @returns a promise with an object, containing the AnonTransferOperationBuilder, which should be used in `Transaction.submitAbarTransaction`
*/
export declare const abarToAbar: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<FindoraWallet.AbarToAbarResult<AnonTransferOperationBuilder>>;
/**
 * Transfer funds of the specific asset from an 'anonymous' to another 'anonymous' wallet
 *
 * @remarks
 * Using a given asset code and the amount, this function executes a confidential transfer. Abars for the transfer are
 * being retrieved using provided commitments array. The retrieved abars array must have enough FRA abars to cover the
 * transfer fee.
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 *
 * @example
 *
 * ```ts
 * const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbarAmount(
 *   anonKeysSender,
 *   anonKeysReceiver.publickey,
 *   amountToSend,
 *   assetCodeToUse,
 *   givenCommitmentsListSender,
 * );

 * // tx hash
 *  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);
 * ```
 *
 * @remarks

 Please also keep in mind that this function returns an object `abarToBarData` which contains information about the new commitments,
 both for the sender (i.e. with the remainders from the transfer) and for the receiver (with a destination abar commitment value).

 Those commitments could be retrieved in this way.

* ```ts
*  const { commitmentsMap } = abarToAbarData;
*
*  const retrievedCommitmentsListReceiver = [];
*  const retrievedCommitmentsListSender= [];
*
*  for (const commitmentsMapEntry of commitmentsMap) {
*    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
*
*    if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
*      givenCommitmentsListSender.push(commitmentKey);
*    }
*
*    if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
*      retrievedCommitmentsListReceiver.push(commitmentKey);
*    }
*  }
* ```
*
* @returns a promise with an object, containing the AnonTransferOperationBuilder, which should be used in `Transaction.submitAbarTransaction`
*/
export declare const abarToAbarAmount: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<FindoraWallet.AbarToAbarResult<AnonTransferOperationBuilder>>;
/**
 * Transfer funds from an 'anonymous' to a 'transparent' wallet
 *
 * @remarks
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer
 * those abars to the receiverPublickey.
 * Please note that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 * Also, by specifying `hideAmount` and `hideAssetType` parameters, user can have either (or both) of them hidden.
 *
 * @example
 *
 * ```ts
  const { transactionBuilder } = await TripleMasking.abarToBar(anonKeysSender, receiverPublickey, abarsList);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
  
 * ```
* @throws `Could not add abar to bar operation", Error - ${error as Error}`
* @throws `Could not add an additional input for abar to bar transfer operation`
* @throws `Could not build txn`
*
* @returns a promise with an object, containing the TransactionBuilder, which should be used in `Transaction.submitTransaction`
*/
export declare const abarToBar: (anonKeysSender: Keypair.WalletKeypar, receiverXfrPublicKey: string, additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[], hideAmount?: boolean, hideAssetType?: boolean) => Promise<FindoraWallet.AbarToBarResult<TransactionBuilder>>;
export declare const getAbarToBarAmountPayload: (anonKeysSender: Keypair.WalletKeypar, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    commitmentsToSend: string[];
    commitmentsForFee: string[];
    additionalAmountForFee: string;
}>;
/**
 * Transfer the exact amount of the provided asset from an 'anonymous' to a 'transparent' wallet
 *
 * @remarks
 * Using a given array of provided commitments, (and associated abars that are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note that the provided commitments must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 * Its return value also contains a list of commitments spent during this operation, and a list of commitments with the transfer remainders (if any).
 * Also, by specifying `hideAmount` and `hideAssetType` parameters, user can have either (or both) of them hidden.
 *
 * @example
 * ```ts
 * const { transactionBuilder, remainderCommitements, spentCommitments } = await TripleMasking.abarToBarAmount(
 *   anonKeysSender,
 *   toWalletInfo.publickey,
 *   amountToSend,
 *   assetCodeToUse,
 *   givenCommitmentsListSender,
 * );
 *
 * // tx hash
 * const resultHandle = await Transaction.submitTransaction(transactionBuilder);
  
 * ```
* @returns a promise with an object, containing the TransactionBuilder, which should be used in `Transaction.submitTransaction`
*/
export declare const abarToBarAmount: (anonKeysSender: Keypair.WalletKeypar, receiverXfrPublicKey: string, amount: string, assetCode: string, givenCommitmentsList: string[], hideAmount?: boolean, hideAssetType?: boolean) => Promise<Required<FindoraWallet.AbarToBarResult<TransactionBuilder>>>;
export declare const getNullifierHashesFromCommitments: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<string[]>;
export declare const decryptAbarMemo: (abarMemoItem: FindoraWallet.AbarMemoItem, anonKeys: Keypair.WalletKeypar) => Promise<FindoraWallet.DecryptedAbarMemoData | false>;
export declare const getCommitmentByAtxoSid: (atxoSid: string) => Promise<FindoraWallet.AtxoCommitmentItem>;
export {};
