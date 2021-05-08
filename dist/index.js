"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sdk = exports.Api = exports.getNodeLedger = exports.getWebLedger = exports.Random = void 0;
var random_1 = require("_src/random");
Object.defineProperty(exports, "Random", { enumerable: true, get: function () { return random_1.Random; } });
var ledgerWrapper_1 = require("_src/services/ledger/ledgerWrapper");
Object.defineProperty(exports, "getWebLedger", { enumerable: true, get: function () { return ledgerWrapper_1.getWebLedger; } });
Object.defineProperty(exports, "getNodeLedger", { enumerable: true, get: function () { return ledgerWrapper_1.getNodeLedger; } });
exports.Api = __importStar(require("_src/api"));
exports.Sdk = __importStar(require("_src/Sdk"));
//# sourceMappingURL=index.js.map