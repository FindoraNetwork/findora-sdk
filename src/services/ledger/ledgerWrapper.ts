import nodeLedger, { LedgerForNode } from './nodeLedger';
import webLedger, { LedgerForWeb } from './webLedger';

// type LedgerType = 'nodeLedger' | 'webLedger';

type Ledger = LedgerForNode | LedgerForWeb;

// const ledgers = {
//   nodeLedger,
//   webLedger,
// };

export const getWebLedger = async (): Promise<Ledger> => {
  const myLedger = await webLedger();

  return myLedger;
};

export const getNodeLedger = (): Ledger => {
  const myLedger = nodeLedger();

  return myLedger;
};
