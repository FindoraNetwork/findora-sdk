export type LedgerForWeb = typeof import('findora-wallet-wasm/bundler/wasm.js');
export type LegerWasm = typeof import('findora-wallet-wasm/bundler/');
declare const getWebLedger: (needToAwait?: boolean) => Promise<LegerWasm>;
export default getWebLedger;
