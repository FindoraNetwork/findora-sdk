import * as FW from '../../../types/findoraWallet';
import { DefineAssetOperation, TxOperation } from '../types';
export interface ProcessedDefineAsset {
    defineAsset: DefineAssetOperation;
    from: string[];
    to: string[];
    type: string;
    assetRules: FW.FindoraWallet.IAssetRules;
    originalOperation?: TxOperation;
}
export declare const processDefineAsset: (operationItem: TxOperation) => Promise<ProcessedDefineAsset>;
