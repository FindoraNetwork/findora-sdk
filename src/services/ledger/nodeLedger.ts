export type LedgerForNode = typeof import('findora-wallet-wasm/nodejs/wasm.js');

import Ledger from 'findora-wallet-wasm/nodejs/wasm.js';

const getNodeLedger = (): LedgerForNode => {
  return Ledger;
};

export default getNodeLedger;
