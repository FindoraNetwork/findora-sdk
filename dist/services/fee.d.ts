import { WalletKeypar } from '../api/keypair';
import * as AssetApi from '../api/sdkAsset';
import * as FindoraWallet from '../types/findoraWallet';
import { ClientAssetRecord, FeeInputs, OwnerMemo, TransferOperationBuilder, TxoRef, XfrKeyPair, XfrPublicKey } from './ledger/types';
import { UtxoInputsInfo } from './utxoHelper';
interface FeeInputPayloadType {
    txoRef: TxoRef;
    assetRecord: ClientAssetRecord;
    ownerMemo: OwnerMemo | undefined;
    keypair: XfrKeyPair;
    amount: BigInt;
}
export interface ReciverInfo {
    utxoNumbers: BigInt;
    toPublickey: XfrPublicKey;
    assetBlindRules?: AssetApi.AssetBlindRules;
}
export declare const getEmptyTransferBuilder: () => Promise<TransferOperationBuilder>;
export declare const getAssetTracingPolicies: (asset: FindoraWallet.IAsset) => Promise<import("findora-wallet-wasm/nodejs").TracingPolicies | import("findora-wallet-wasm/bundler").TracingPolicies>;
export declare const getTransferOperation: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo, recieversInfo: ReciverInfo[], assetCode: string, transferOp: TransferOperationBuilder) => Promise<TransferOperationBuilder>;
export declare const getPayloadForFeeInputs: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo) => Promise<FeeInputPayloadType[]>;
export declare const buildTransferOperationWithFee: (walletInfo: WalletKeypar, assetBlindRules?: {
    isAmountBlind?: boolean;
    isTypeBlind?: boolean;
}) => Promise<TransferOperationBuilder>;
export declare const getFeeInputs: (walletInfo: WalletKeypar, excludeSids: number[], _isBarToAbar: boolean) => Promise<FeeInputs>;
export declare const buildTransferOperation: (walletInfo: WalletKeypar, recieversInfo: ReciverInfo[], assetCode: string) => Promise<TransferOperationBuilder>;
export interface ReciverInfoV2 {
    [key: string]: ReciverInfo[];
}
export declare const buildTransferOperationV2: (walletInfo: WalletKeypar, recieversInfo: ReciverInfoV2) => Promise<TransferOperationBuilder>;
export {};
