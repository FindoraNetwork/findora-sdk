import { WalletKeypar } from '../api/keypair';
import { TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import { UtxoInputsInfo } from './utxoHelper';
export declare const getTransferOperationWithFee: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo, assetBlindRules?: {
    isAmountBlind?: boolean | undefined;
    isTypeBlind?: boolean | undefined;
} | undefined) => Promise<TransferOperationBuilder>;
/**
 * @todo Refactor and merge w getTransferOperationWithFee
 */
export declare const getTransferOperation: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo, utxoNumbers: BigInt, toPublickey: XfrPublicKey, assetCode: string, assetBlindRules?: {
    isAmountBlind?: boolean | undefined;
    isTypeBlind?: boolean | undefined;
} | undefined) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperationWithFee: (walletInfo: WalletKeypar, fraCode: string, assetBlindRules?: {
    isAmountBlind?: boolean | undefined;
    isTypeBlind?: boolean | undefined;
} | undefined) => Promise<TransferOperationBuilder>;
/**
 * @todo merge w buildTransferOperationWithFee
 * */
export declare const buildTransferOperation: (walletInfo: WalletKeypar, numbers: number, toPublickey: XfrPublicKey, assetCode: string, assetBlindRules?: {
    isAmountBlind?: boolean | undefined;
    isTypeBlind?: boolean | undefined;
} | undefined) => Promise<TransferOperationBuilder>;
