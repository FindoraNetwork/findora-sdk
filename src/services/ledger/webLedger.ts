// export type LedgerForWeb = typeof import('findora-wallet-wasm/bundler/wasm.js');

const getWebLedger = async (): Promise<any> => {
  const ledger = await import('findora-wallet-wasm/bundler/wasm.js');
  return ledger;
};

export default getWebLedger;
