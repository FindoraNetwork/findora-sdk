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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBarToAbar = void 0;
var ledgerWrapper_1 = require("../../../services/ledger/ledgerWrapper");
var Keypair = __importStar(require("../../keypair"));
var processBarToAbar = function (operationItem) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, operation, transperentNote, hiddenNote, myBody, fromPublicKey, from, commitement, commitement58, data;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _s.sent();
                operation = operationItem.BarToAbar;
                transperentNote = (_a = operation === null || operation === void 0 ? void 0 : operation.note) === null || _a === void 0 ? void 0 : _a.ArNote;
                hiddenNote = (_b = operation === null || operation === void 0 ? void 0 : operation.note) === null || _b === void 0 ? void 0 : _b.BarNote;
                myBody = (transperentNote === null || transperentNote === void 0 ? void 0 : transperentNote.body) || (hiddenNote === null || hiddenNote === void 0 ? void 0 : hiddenNote.body);
                fromPublicKey = (_c = myBody === null || myBody === void 0 ? void 0 : myBody.input) === null || _c === void 0 ? void 0 : _c.public_key;
                return [4 /*yield*/, Keypair.getAddressByPublicKey(fromPublicKey)];
            case 2:
                from = _s.sent();
                commitement = (_d = myBody === null || myBody === void 0 ? void 0 : myBody.output) === null || _d === void 0 ? void 0 : _d.commitment;
                commitement58 = ledger.base64_to_base58(commitement);
                data = {
                    barToAbarOperation: operation,
                    from: [from],
                    to: [commitement58],
                    type: 'barToAbar',
                    originalOperation: operationItem,
                    amount: [(_g = (_f = (_e = transperentNote === null || transperentNote === void 0 ? void 0 : transperentNote.body) === null || _e === void 0 ? void 0 : _e.input) === null || _f === void 0 ? void 0 : _f.amount) === null || _g === void 0 ? void 0 : _g.NonConfidential],
                    assetType: (_k = (_j = (_h = transperentNote === null || transperentNote === void 0 ? void 0 : transperentNote.body) === null || _h === void 0 ? void 0 : _h.input) === null || _j === void 0 ? void 0 : _j.asset_type) === null || _k === void 0 ? void 0 : _k.NonConfidential,
                };
                if (hiddenNote) {
                    data.confidentialAmount = (_o = (_m = (_l = hiddenNote === null || hiddenNote === void 0 ? void 0 : hiddenNote.body) === null || _l === void 0 ? void 0 : _l.input) === null || _m === void 0 ? void 0 : _m.amount) === null || _o === void 0 ? void 0 : _o.Confidential;
                    data.confidentialAssetType = (_r = (_q = (_p = hiddenNote === null || hiddenNote === void 0 ? void 0 : hiddenNote.body) === null || _p === void 0 ? void 0 : _p.input) === null || _q === void 0 ? void 0 : _q.asset_type) === null || _r === void 0 ? void 0 : _r.Confidential;
                }
                return [2 /*return*/, data];
        }
    });
}); };
exports.processBarToAbar = processBarToAbar;
//# sourceMappingURL=barToAbar.js.map