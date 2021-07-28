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
export interface ITransferOperationFee {
    walletInfo: WalletKeypar;
    assetBlindRules?: {
        isAmountBlind?: boolean;
        isTypeBlind?: boolean;
    };
    utxoInput?: UtxoInputsInfo;
}
export declare const buildTransferOperationWithFee: ({ walletInfo, assetBlindRules, utxoInput, }: ITransferOperationFee) => Promise<TransferOperationBuilder>;
export interface ITransferOperation {
    walletInfo: WalletKeypar;
    recieversInfo: ReciverInfo[];
    assetCode: string;
    utxoInput?: UtxoInputsInfo;
}
export declare const buildTransferOperation: ({ walletInfo, recieversInfo, assetCode, utxoInput, }: ITransferOperation) => Promise<TransferOperationBuilder>;
