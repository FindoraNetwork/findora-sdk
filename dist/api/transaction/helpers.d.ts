import * as Types from './types';
import { TxListDataResult, TxInfo } from '../network/types';
export declare const getTxListFromResponse: (result: TxListDataResult) => null | TxInfo[];
export declare const getTxOperationsList: (parsedTx: Types.ParsedTx) => Types.TxOperation[];
export declare const getBlockTime: (height: number) => Promise<string | undefined>;
