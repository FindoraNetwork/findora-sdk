import { LedgerForNode } from './nodeLedger';
import { LedgerForWeb } from './webLedger';
declare type LedgerType = 'nodeLedger' | 'webLedger';
declare type Ledger = LedgerForNode | LedgerForWeb;
declare const _default: {
    getLedger: (ledger: LedgerType) => Promise<Ledger>;
};
export default _default;
