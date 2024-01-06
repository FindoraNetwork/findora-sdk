export type LedgerForWeb = typeof import('findora-wallet-wasm/bundler/wasm.js');
export type LegerWasm = typeof import('findora-wallet-wasm/bundler/');

const getWebLedger = async (): Promise<LegerWasm> => {
  const awaitedLedgerModuleLoader = await import('findora-wallet-wasm/bundler/wasm.js');
  console.log('awaited module loader!', awaitedLedgerModuleLoader);

  const wasmLedgerModule = await awaitedLedgerModuleLoader.default;
  console.log('resolved wasm module!', wasmLedgerModule);

  return wasmLedgerModule;
};

export default getWebLedger;
