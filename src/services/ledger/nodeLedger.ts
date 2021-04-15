// export type LedgerForNode = typeof import('findora-wallet-wasm/nodejs/wasm.js');

const getNodeLedger = async (): Promise<typeof import('findora-wallet-wasm/nodejs/wasm.js')> => {
  const ledger = await import('findora-wallet-wasm/nodejs/wasm.js');
  return ledger;
};

export default getNodeLedger;
