import { LedgerForNode } from './nodeLedger';
import { LedgerForWeb } from './webLedger';
declare type LedgerType = 'nodeLedger' | 'webLedger';
declare type Ledger = LedgerForNode | LedgerForWeb;
export declare const getLedger: (ledger: LedgerType) => Promise<Ledger>;
export {};
