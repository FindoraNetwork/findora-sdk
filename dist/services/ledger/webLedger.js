const getWebLedger = async () => {
    const ledger = await import('findora-wallet-wasm/bundler/wasm.js');
    return ledger;
};
export default getWebLedger;
//# sourceMappingURL=webLedger.js.map