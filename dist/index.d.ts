export { Random } from './random';
export declare const getLedger: (ledger: "nodeLedger" | "webLedger") => Promise<typeof import("findora-wallet-wasm/nodejs") | typeof import("findora-wallet-wasm/bundler")>;
