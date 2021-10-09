import { TxInfo } from '../network/types';
import * as Types from './types';
export declare const processTxInfoItem: (txItem: TxInfo) => Promise<Types.ProcessedTxInfo>;
export declare const processeTxInfoList: (txList: TxInfo[]) => Promise<Types.ProcessedTxInfo[]>;
