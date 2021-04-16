import nodeLedger, { LedgerForNode } from './nodeLedger';
import webLedger, { LedgerForWeb } from './webLedger';
// import nodeLedger from './nodeLedger';
// import webLedger from './webLedger';

type Ledger = LedgerForNode | LedgerForWeb;

export const getWebLedger = async (): Promise<Ledger> => {
  const myLedger = await webLedger();

  return myLedger;
};

export const getNodeLedger = async (): Promise<Ledger> => {
  const myLedger = await nodeLedger();

  return myLedger;
};

export const getLedger = async (): Promise<Ledger> => {
  const isNodeEnv = typeof process !== 'undefined' && process.release.name === 'node';

  console.log('isNodeEnv', isNodeEnv);

  if (isNodeEnv) {
    return getNodeLedger();
  }

  return getWebLedger();
};
