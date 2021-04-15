import nodeLedger, { LedgerForNode } from './nodeLedger';
import webLedger, { LedgerForWeb } from './webLedger';

type Ledger = LedgerForNode | LedgerForWeb;

export const getWebLedger = async (): Promise<Ledger> => {
  const myLedger = await webLedger();

  return myLedger;
};

export const getNodeLedger = async (): Promise<Ledger> => {
  const myLedger = await nodeLedger();

  return myLedger;
};
