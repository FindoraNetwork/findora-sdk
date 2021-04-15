import { LedgerForNode } from './nodeLedger';
import { LedgerForWeb } from './webLedger';
declare type Ledger = LedgerForNode | LedgerForWeb;
export declare const getWebLedger: () => Promise<Ledger>;
export declare const getNodeLedger: () => Ledger;
export {};
