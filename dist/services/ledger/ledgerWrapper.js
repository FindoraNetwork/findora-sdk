import nodeLedger from './nodeLedger';
import webLedger from './webLedger';
// const ledgers = {
//   nodeLedger,
//   webLedger,
// };
export const getWebLedger = async () => {
    const myLedger = await webLedger();
    return myLedger;
};
export const getNodeLedger = () => {
    const myLedger = nodeLedger();
    return myLedger;
};
//# sourceMappingURL=ledgerWrapper.js.map