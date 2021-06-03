import { WalletKeypar } from '../api/keypair';
import { TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import { UtxoInputsInfo } from './utxoHelper';
export interface ReciverInfo {
    utxoNumbers: BigInt;
    toPublickey: XfrPublicKey;
}
/**
 * @todo - rename the whole file from Fee to smth like TransferHelper, which better represents its purpose
 */
export declare const getTransferOperation: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo, recieversInfo: ReciverInfo[], totalUtxoNumbers: BigInt, assetCode: string, assetBlindRules?: {
    isAmountBlind?: boolean | undefined;
    isTypeBlind?: boolean | undefined;
} | undefined) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperationWithFee: (walletInfo: WalletKeypar, assetBlindRules?: {
    isAmountBlind?: boolean | undefined;
    isTypeBlind?: boolean | undefined;
} | undefined) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperation: (walletInfo: WalletKeypar, recieversInfo: ReciverInfo[], assetCode: string, assetBlindRules?: {
    isAmountBlind?: boolean | undefined;
    isTypeBlind?: boolean | undefined;
} | undefined) => Promise<TransferOperationBuilder>;
