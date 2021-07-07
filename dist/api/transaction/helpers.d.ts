import { TxInfo, TxListDataResult } from '../network/types';
import * as Types from './types';
export declare const getTxListFromResponse: (result: TxListDataResult) => null | TxInfo[];
export declare const getTxOperationsList: (parsedTx: Types.ParsedTx) => Types.TxOperation[];
export declare const getBlockTime: (height: number) => Promise<string | undefined>;
