import { DefineAssetOperation, TxOperation } from '../types';
export interface ProcessedDefineAsset {
    defineAsset: DefineAssetOperation;
    from: string[];
    to: string[];
    type: string;
    assetRules: FindoraWallet.IAssetRules;
}
export declare const processDefineAsset: (operationItem: TxOperation) => Promise<ProcessedDefineAsset>;
