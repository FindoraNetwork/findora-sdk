"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeLedger = exports.getWebLedger = exports.Random = void 0;
var random_1 = require("./random");
Object.defineProperty(exports, "Random", { enumerable: true, get: function () { return random_1.Random; } });
var ledgerWrapper_1 = require("./services/ledger/ledgerWrapper");
Object.defineProperty(exports, "getWebLedger", { enumerable: true, get: function () { return ledgerWrapper_1.getWebLedger; } });
Object.defineProperty(exports, "getNodeLedger", { enumerable: true, get: function () { return ledgerWrapper_1.getNodeLedger; } });
//# sourceMappingURL=index.js.map