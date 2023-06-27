"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ASSET_RULES = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const DEFAULT_DECIMALS = 6;
const DEFAULT_TRANSFERABLE = true;
const DEFAULT_UPDATABLE = true;
exports.DEFAULT_ASSET_RULES = {
    max_units: null,
    transfer_multisig_rules: null,
    transferable: DEFAULT_TRANSFERABLE,
    updatable: DEFAULT_UPDATABLE,
    tracing_policies: [],
    decimals: DEFAULT_DECIMALS,
};
//# sourceMappingURL=asset.js.map