export type LedgerForWeb = typeof import('findora-wallet-wasm/bundler/wasm.js');

const getWebLedger = async (): Promise<LedgerForWeb> => {
  const ledger = await import('findora-wallet-wasm/bundler/wasm.js');
  return ledger;
};

export default getWebLedger;
