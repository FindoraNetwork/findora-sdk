import { LedgerForNode } from './nodeLedger';
import { LedgerForWeb } from './webLedger';
export type Ledger = LedgerForNode | LedgerForWeb;
export declare const isItNodeEnv: () => boolean;
export declare const getWebLedger: () => Promise<Ledger>;
export declare const getNodeLedger: () => Promise<Ledger>;
export declare const getLedger: () => Promise<Ledger>;
