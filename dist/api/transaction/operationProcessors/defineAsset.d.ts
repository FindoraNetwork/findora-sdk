import { DefineAssetOperation, TxOperation } from '../types';
import { FindoraWallet } from 'types/findoraWallet';
export interface ProcessedDefineAsset {
    defineAsset: DefineAssetOperation;
    from: string[];
    to: string[];
    type: string;
    assetRules: FindoraWallet.IAssetRules;
    originalOperation?: TxOperation;
}
export declare const processDefineAsset: (operationItem: TxOperation) => Promise<ProcessedDefineAsset>;
