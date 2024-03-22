export type LedgerForWeb = typeof import('findora-wallet-wasm/bundler/wasm.js');
export type LegerWasm = typeof import('findora-wallet-wasm/bundler/');
import Sdk from '../../Sdk';

const getWebLedger = async (): Promise<LegerWasm> => {
  const { needToAwaitForWasm } = Sdk.environment;
  console.log('3 1 web Ledger getWebLedger , needToAwaitForWasm', needToAwaitForWasm);
  const awaitedLedgerModuleLoader = await import('findora-wallet-wasm/bundler/wasm.js');

  console.log('webleger awaitedLedgerModuleLoader', awaitedLedgerModuleLoader);

  // here we are returning the ledger to the electrcon app, where it does not need
  // to be awaited , like in the next line, when getWebLedger is called from the web app
  // then we need to have an extra promise to be resolved,
  // BUT to use the awaited wasm in the web app we need
  // to set needToAwaitForWasm=true in the Sdk Init , then the wasm will be fulfilled
  // from the awaitedLedgerModuleLoader.default , below this if statement
  if (!needToAwaitForWasm) {
    return awaitedLedgerModuleLoader;
  }

  // we must keep awaiting for this promise to fullfil, so do not remove the next line await
  const wasmLedgerModule = await awaitedLedgerModuleLoader.default;
  console.log('webleger wasmLedgerModule', wasmLedgerModule);

  return wasmLedgerModule;
};
export default getWebLedger;
