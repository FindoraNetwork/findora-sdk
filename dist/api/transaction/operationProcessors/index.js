"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processorsMap = exports.getOperationProcessor = void 0;
const get_1 = __importDefault(require("lodash/get"));
const claim_1 = require("./claim");
const convertAccount_1 = require("./convertAccount");
const defineAsset_1 = require("./defineAsset");
const delegation_1 = require("./delegation");
const issueAsset_1 = require("./issueAsset");
const transferAsset_1 = require("./transferAsset");
const undelegation_1 = require("./undelegation");
const unsupported_1 = require("./unsupported");
const getOperationProcessor = (operationItem, processors) => {
    for (const el of Object.keys(processors)) {
        if (el in operationItem) {
            return (0, get_1.default)(processors, el, processors.Unsupported);
        }
    }
    return processors.Unsupported;
};
exports.getOperationProcessor = getOperationProcessor;
exports.processorsMap = {
    DefineAsset: defineAsset_1.processDefineAsset,
    TransferAsset: transferAsset_1.processTransferAsset,
    IssueAsset: issueAsset_1.processIssueAsset,
    Unsupported: unsupported_1.processUnsupported,
    UnDelegation: undelegation_1.processUndelegation,
    Delegation: delegation_1.processDelegation,
    Claim: claim_1.processClaim,
    ConvertAccount: convertAccount_1.processConvertAccount,
};
//# sourceMappingURL=index.js.map