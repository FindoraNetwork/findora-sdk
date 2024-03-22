export type LedgerForWeb = typeof import('findora-wallet-wasm/bundler/wasm.js');
export type LegerWasm = typeof import('findora-wallet-wasm/bundler/');
declare const getWebLedger: () => Promise<LegerWasm>;
export default getWebLedger;
