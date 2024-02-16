export type LedgerForWeb = typeof import('findora-wallet-wasm/bundler/wasm.js');
export type LegerWasm = typeof import('findora-wallet-wasm/bundler/');

const getWebLedger = async (needToAwait = false): Promise<LegerWasm> => {
  const awaitedLedgerModuleLoader = await import('findora-wallet-wasm/bundler/wasm.js');
  // here we are returning the ledger to the electrcon app, where it does not need
  // to be awaited , like in the next line, when getWebLedger is called from the web app
  // then we need to have an extra promise to be resolved, so the web app needs to
  // call getWebLedger(true) to have the wasm properly resolved and the electrcon app
  // should simply call getWebLedger()
  if (!needToAwait) {
    return awaitedLedgerModuleLoader;
  }

  // we must keep awaiting for this promise to fullfil, so do not remove the next line await
  const wasmLedgerModule = await awaitedLedgerModuleLoader.default;

  // console.log('resolved wasm module for web', wasmLedgerModule);

  return wasmLedgerModule;
};
export default getWebLedger;
