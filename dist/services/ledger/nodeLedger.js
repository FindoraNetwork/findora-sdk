const getNodeLedger = async () => {
    const ledger = await import('findora-wallet-wasm/nodejs/wasm.js');
    return ledger;
};
export default getNodeLedger;
//# sourceMappingURL=nodeLedger.js.map