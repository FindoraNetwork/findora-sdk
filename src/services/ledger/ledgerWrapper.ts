// import nodeLedger, { LedgerForNode } from './nodeLedger';
// import webLedger, { LedgerForWeb } from './webLedger';
import nodeLedger from './nodeLedger';
import webLedger from './webLedger';

// type Ledger = LedgerForNode | LedgerForWeb;

export const getWebLedger = async (): Promise<typeof import('findora-wallet-wasm/bundler/wasm.js')> => {
  const myLedger = await webLedger();

  return myLedger;
};

export const getNodeLedger = async (): Promise<typeof import('findora-wallet-wasm/nodejs/wasm.js')> => {
  const myLedger = await nodeLedger();

  return myLedger;
};
