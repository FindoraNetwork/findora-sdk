export type LedgerForWeb = typeof import('findora-wallet-wasm/bundler/wasm.js');
declare const getWebLedger: () => Promise<LedgerForWeb>;
export default getWebLedger;
