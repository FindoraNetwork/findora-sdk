import { TransactionBuilder } from '../../services/ledger/types';
export declare const getBlockHeight: () => Promise<bigint>;
export declare const getTransactionBuilder: () => Promise<TransactionBuilder>;
