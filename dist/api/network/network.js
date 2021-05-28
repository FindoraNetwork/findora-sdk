"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionStatus = exports.getAssetToken = exports.submitTransaction = exports.getSubmitTransactionData = exports.getStateCommitment = exports.getOwnerMemo = exports.getUtxo = exports.getOwnedSids = exports.apiGet = exports.apiPost = void 0;
var axios_1 = __importDefault(require("axios"));
var json_bigint_1 = __importDefault(require("json-bigint"));
var Sdk_1 = __importDefault(require("../../Sdk"));
var getQueryRoute = function () {
    var _a = Sdk_1.default.environment, hostUrl = _a.hostUrl, queryPort = _a.queryPort;
    var url = hostUrl + ":" + queryPort;
    return url;
};
var getSubmitRoute = function () {
    var _a = Sdk_1.default.environment, hostUrl = _a.hostUrl, submissionPort = _a.submissionPort;
    var url = hostUrl + ":" + submissionPort;
    return url;
};
var getLedgerRoute = function () {
    var _a = Sdk_1.default.environment, hostUrl = _a.hostUrl, ledgerPort = _a.ledgerPort;
    var url = hostUrl + ":" + ledgerPort;
    return url;
};
var apiPost = function (url, data, config) { return __awaiter(void 0, void 0, void 0, function () {
    var axiosResponse, err_1, myResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post(url, data, config)];
            case 1:
                axiosResponse = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, { error: { message: err_1.message } }];
            case 3:
                try {
                    myResponse = json_bigint_1.default({ useNativeBigInt: true }).parse(axiosResponse.data);
                    return [2 /*return*/, { response: myResponse }];
                }
                catch (_) {
                    return [2 /*return*/, { response: axiosResponse.data }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.apiPost = apiPost;
var apiGet = function (url, config) { return __awaiter(void 0, void 0, void 0, function () {
    var axiosResponse, err_2, myResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get(url, config)];
            case 1:
                axiosResponse = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, { error: { message: err_2.message } }];
            case 3:
                try {
                    myResponse = json_bigint_1.default({ useNativeBigInt: true }).parse(axiosResponse.data);
                    return [2 /*return*/, { response: myResponse }];
                }
                catch (_) {
                    return [2 /*return*/, { response: axiosResponse.data }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.apiGet = apiGet;
var getOwnedSids = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = getQueryRoute() + "/get_owned_utxos/" + address;
                return [4 /*yield*/, exports.apiGet(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getOwnedSids = getOwnedSids;
var getUtxo = function (utxoSid, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = getLedgerRoute() + "/utxo_sid/" + utxoSid;
                return [4 /*yield*/, exports.apiGet(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getUtxo = getUtxo;
var getOwnerMemo = function (utxoSid, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = getQueryRoute() + "/get_owner_memo/" + utxoSid;
                return [4 /*yield*/, exports.apiGet(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getOwnerMemo = getOwnerMemo;
var getStateCommitment = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = getLedgerRoute() + "/global_state";
                return [4 /*yield*/, exports.apiGet(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getStateCommitment = getStateCommitment;
var getSubmitTransactionData = function (data) {
    var txData;
    if (!data) {
        return { response: txData };
    }
    try {
        txData = json_bigint_1.default.parse(data);
        return { response: txData };
    }
    catch (err) {
        return { error: { message: "Can't submit transaction. Can't parse transaction data. " + err.message } };
    }
};
exports.getSubmitTransactionData = getSubmitTransactionData;
var submitTransaction = function (data, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, _a, txData, error, dataResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = getSubmitRoute() + "/submit_transaction";
                _a = exports.getSubmitTransactionData(data), txData = _a.response, error = _a.error;
                if (error) {
                    return [2 /*return*/, { error: error }];
                }
                return [4 /*yield*/, exports.apiPost(url, txData, config)];
            case 1:
                dataResult = _b.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.submitTransaction = submitTransaction;
var getAssetToken = function (assetCode, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = getLedgerRoute() + "/asset_token/" + assetCode;
                return [4 /*yield*/, exports.apiGet(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getAssetToken = getAssetToken;
var getTransactionStatus = function (handle, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = getSubmitRoute() + "/txn_status/" + handle;
                return [4 /*yield*/, exports.apiGet(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getTransactionStatus = getTransactionStatus;
//# sourceMappingURL=network.js.map