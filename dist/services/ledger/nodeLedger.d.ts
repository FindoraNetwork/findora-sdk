declare const getNodeLedger: () => Promise<typeof import('findora-wallet-wasm/nodejs/wasm.js')>;
export default getNodeLedger;
