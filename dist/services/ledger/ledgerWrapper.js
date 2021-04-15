import nodeLedger from './nodeLedger';
import webLedger from './webLedger';
const ledgers = {
    nodeLedger,
    webLedger,
};
export const getLedger = async (ledger) => {
    const loadledgerModule = ledgers[ledger];
    const myLedger = await loadledgerModule();
    return myLedger;
};
//# sourceMappingURL=ledgerWrapper.js.map