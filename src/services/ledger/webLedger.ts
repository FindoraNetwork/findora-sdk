export type LedgerForWeb = typeof import('findora-wallet-wasm/bundler/wasm.js');
export type LegerWasm = typeof import('findora-wallet-wasm/bundler/');

const getWebLedger = async (): Promise<LegerWasm> => {
  const awaitedLedgerModuleLoader = await import('findora-wallet-wasm/bundler/wasm.js');

  // we must keep awaiting for this promise to fullfil, so do not remove the next line await
  const wasmLedgerModule = await awaitedLedgerModuleLoader.default;

  // console.log('resolved wasm module for web', wasmLedgerModule);

  return wasmLedgerModule;
};

export default getWebLedger;
