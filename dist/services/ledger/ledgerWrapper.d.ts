declare type LedgerType = 'nodeLedger' | 'webLedger';
export declare const getLedger: (ledger: LedgerType) => Promise<any>;
export {};
