import nodeLedger from './nodeLedger';
import webLedger from './webLedger';
// type Ledger = LedgerForNode | LedgerForWeb;
const ledgers = {
    nodeLedger,
    webLedger,
};
export const getLedger = async (ledger) => {
    const loadledgerModule = ledgers[ledger];
    // const loadledgerModule = await import('./webLedger');
    console.log('loadledgerModule', loadledgerModule);
    const myLedger = await loadledgerModule();
    return myLedger;
};
//# sourceMappingURL=ledgerWrapper.js.map