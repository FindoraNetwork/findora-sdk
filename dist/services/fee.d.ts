import { WalletKeypar } from '../api/keypair';
import * as AssetApi from '../api/sdkAsset';
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
export declare const getAssetTracingPolicies: (asset: FindoraWallet.IAsset) => Promise<import("findora-wallet-wasm/bundler").TracingPolicies | import("findora-wallet-wasm/nodejs").TracingPolicies>;
export declare const getTransferOperation: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo, recieversInfo: ReciverInfo[], assetCode: string) => Promise<TransferOperationBuilder>;
export declare const getPayloadForFeeInputs: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo) => Promise<FeeInputPayloadType[]>;
export declare const buildTransferOperationWithFee: (walletInfo: WalletKeypar, assetBlindRules?: {
    isAmountBlind?: boolean | undefined;
    isTypeBlind?: boolean | undefined;
} | undefined) => Promise<TransferOperationBuilder>;
export declare const getFeeInputs: (walletInfo: WalletKeypar, excludeSid: number, isBarToAbar: boolean) => Promise<FeeInputs>;
export declare const buildTransferOperation: (walletInfo: WalletKeypar, recieversInfo: ReciverInfo[], assetCode: string) => Promise<TransferOperationBuilder>;
export {};
