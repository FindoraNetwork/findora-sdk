import * as Types from './types';
export declare const processDefineAsset: (operationItem: Types.TxOperation) => Promise<Types.ProcessedTx>;
export declare const getProcessor: (operationItem: Types.TxOperation) => Types.ProcessorType;
