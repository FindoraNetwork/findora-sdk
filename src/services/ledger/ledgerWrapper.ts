import nodeLedger, { LedgerForNode } from './nodeLedger';
import webLedger, { LedgerForWeb } from './webLedger';

let isInitNoah = false;

export type Ledger = LedgerForNode | LedgerForWeb;

export const isItNodeEnv = () => typeof process !== 'undefined' && process.release.name === 'node';

export const getWebLedger = async (): Promise<Ledger> => {
  const myLedger = await webLedger();

  return myLedger;
};

export const getNodeLedger = async (): Promise<Ledger> => {
  const myLedger = await nodeLedger();

  return myLedger;
};

export const getLedger = async (): Promise<Ledger> => {
  const isNodeEnv = isItNodeEnv();
  const myLedger = await (isNodeEnv ? getNodeLedger() : getWebLedger());

  if (!isInitNoah) {
    await myLedger.init_noah();
    isInitNoah = true;
  }
  return myLedger;
};
