declare const getWebLedger: () => Promise<typeof import('findora-wallet-wasm/bundler/wasm.js')>;
export default getWebLedger;
