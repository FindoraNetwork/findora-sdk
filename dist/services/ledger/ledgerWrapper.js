import nodeLedger from './nodeLedger';
import webLedger from './webLedger';
export const getWebLedger = async () => {
    const myLedger = await webLedger();
    return myLedger;
};
export const getNodeLedger = async () => {
    const myLedger = await nodeLedger();
    return myLedger;
};
//# sourceMappingURL=ledgerWrapper.js.map