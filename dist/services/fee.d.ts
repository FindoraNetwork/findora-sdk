import { WalletKeypar } from '../api/keypair';
import { TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import { UtxoInputsInfo } from './utxoHelper';
export declare const getTransferOperationWithFee: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo) => Promise<TransferOperationBuilder>;
/**
 * @todo Refactor and merge w getTransferOperationWithFee
 */
export declare const getTransferOperation: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo, numbers: number, utxoNumbers: BigInt, toPublickey: XfrPublicKey, assetBlindRules: {
    isAmountBlind?: boolean;
    isTypeBlind?: boolean;
}) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperationWithFee: (walletInfo: WalletKeypar, fraCode: string) => Promise<TransferOperationBuilder>;
/**
 * @todo merge w buildTransferOperationWithFee
 * */
export declare const buildTransferOperation: (walletInfo: WalletKeypar, numbers: number, toPublickey: XfrPublicKey, assetBlindRules: {
    isAmountBlind?: boolean;
    isTypeBlind?: boolean;
}) => Promise<TransferOperationBuilder>;
