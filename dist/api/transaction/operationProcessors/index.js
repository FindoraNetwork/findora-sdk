"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processorsMap = exports.getOperationProcessor = void 0;
var get_1 = __importDefault(require("lodash/get"));
var claim_1 = require("./claim");
var converAccount_1 = require("./converAccount");
var defineAsset_1 = require("./defineAsset");
var delegation_1 = require("./delegation");
var issueAsset_1 = require("./issueAsset");
var transferAsset_1 = require("./transferAsset");
var undelegation_1 = require("./undelegation");
var unsupported_1 = require("./unsupported");
var getOperationProcessor = function (operationItem, processors) {
    for (var _i = 0, _a = Object.keys(processors); _i < _a.length; _i++) {
        var el = _a[_i];
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
    ConvertAccount: converAccount_1.processConvertAccount,
};
//# sourceMappingURL=index.js.map