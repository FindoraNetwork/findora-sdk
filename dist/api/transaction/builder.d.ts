import { AnonTransferOperationBuilder, TransactionBuilder } from '../../services/ledger/types';
export declare const getBlockHeight: () => Promise<bigint>;
export declare const getTransactionBuilder: () => Promise<TransactionBuilder>;
export declare const getAnonTransferOperationBuilder: () => Promise<AnonTransferOperationBuilder>;
