import { WalletKeypar } from '../api/keypair';
import * as AssetApi from '../api/sdkAsset';
import { TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import { UtxoInputsInfo } from './utxoHelper';
export interface ReciverInfo {
    utxoNumbers: BigInt;
    toPublickey: XfrPublicKey;
    assetBlindRules?: AssetApi.AssetBlindRules;
}
export declare const getTransferOperation: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo, recieversInfo: ReciverInfo[], assetCode: string) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperationWithFee: (walletInfo: WalletKeypar, assetBlindRules?: {
    isAmountBlind?: boolean | undefined;
    isTypeBlind?: boolean | undefined;
} | undefined) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperation: (walletInfo: WalletKeypar, recieversInfo: ReciverInfo[], assetCode: string) => Promise<TransferOperationBuilder>;
