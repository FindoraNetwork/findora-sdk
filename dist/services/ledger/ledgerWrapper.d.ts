import { LedgerForNode } from './nodeLedger';
import { LedgerForWeb } from './webLedger';
export declare type Ledger = LedgerForNode | LedgerForWeb;
export declare const getWebLedger: () => Promise<Ledger>;
export declare const getNodeLedger: () => Promise<Ledger>;
export declare const getLedger: () => Promise<Ledger>;
