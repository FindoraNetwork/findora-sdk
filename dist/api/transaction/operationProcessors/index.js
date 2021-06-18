"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processorsMap = exports.getOperationProcessor = void 0;
var get_1 = __importDefault(require("lodash/get"));
var unsupported_1 = require("./unsupported");
var defineAsset_1 = require("./defineAsset");
var transferAsset_1 = require("./transferAsset");
var issueAsset_1 = require("./issueAsset");
var getOperationProcessor = function (operationItem, processors) {
    for (var _i = 0, _a = Object.keys(processors); _i < _a.length; _i++) {
        var el = _a[_i];
        if (el in operationItem) {
            return get_1.default(processors, el, processors.Unsupported);
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
};
//# sourceMappingURL=index.js.map