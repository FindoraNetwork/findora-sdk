import nodeLedger, { LedgerForNode } from './nodeLedger';
import webLedger, { LedgerForWeb } from './webLedger';

export type Ledger = LedgerForNode | LedgerForWeb;

export const isItNodeEnv = () => {
  const weHaveProcess = typeof process !== undefined;
  const releaseNameIsNode = process?.release?.name === 'node';

  return weHaveProcess && releaseNameIsNode;
};

export const getWebLedger = async (): Promise<Ledger> => {
  const myLedger = await webLedger();
  // console.log('myLedger module', myLedger);

  return myLedger;
};

export const getNodeLedger = async (): Promise<Ledger> => {
  const myLedger = await nodeLedger();

  return myLedger;
};

export const getLedger = async (): Promise<Ledger> => {
  const isNodeEnv = isItNodeEnv();

  if (isNodeEnv) {
    return getNodeLedger();
  }

  return getWebLedger();
};
