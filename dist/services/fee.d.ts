import { WalletKeypar } from '../api/keypair';
import * as AssetApi from '../api/sdkAsset';
import { TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import { UtxoInputsInfo } from './utxoHelper';
export interface ReciverInfo {
    utxoNumbers: BigInt;
    toPublickey: XfrPublicKey;
    assetBlindRules?: AssetApi.AssetBlindRules;
}
export declare const getEmptyTransferBuilder: () => Promise<TransferOperationBuilder>;
export declare const getAssetTracingPolicies: (asset: FindoraWallet.IAsset) => Promise<import("findora-wallet-wasm/nodejs").TracingPolicies | import("findora-wallet-wasm/bundler").TracingPolicies>;
export declare const getTransferOperation: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo, recieversInfo: ReciverInfo[], assetCode: string) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperationWithFee: (walletInfo: WalletKeypar, assetBlindRules?: {
    isAmountBlind?: boolean | undefined;
    isTypeBlind?: boolean | undefined;
} | undefined) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperation: (walletInfo: WalletKeypar, recieversInfo: ReciverInfo[], assetCode: string) => Promise<TransferOperationBuilder>;
