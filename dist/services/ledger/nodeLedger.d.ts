export declare type LedgerForNode = typeof import('findora-wallet-wasm/nodejs/wasm.js');
declare const getNodeLedger: () => Promise<LedgerForNode>;
export default getNodeLedger;
