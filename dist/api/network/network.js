"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.getBrc20CheckTicker = exports.getBrc20BalanceAll = exports.getBrc20UserRank = exports.getBrc20TokenDetail = exports.getBrc20TokenList = exports.getBrc20Balance = exports.submitBRC20Tx = exports.getMaxAtxoSid = exports.getAbarCommitment = exports.getConfig = exports.checkNullifierHashSpent = exports.getAbarMemos = exports.getOwnedAbars = exports.getLatestBlock = exports.getRpcPayload = exports.sendRpcCallV2 = exports.sendRpcCall = exports.getDelegateInfo = exports.getValidatorList = exports.submitEvmTx = exports.getAbciInfo = exports.getAbciNoce = exports.getTransactionDetails = exports.getTxListByPrismReceive = exports.getTxListByPrismSend = exports.getTxListByStakingUnDelegation = exports.getTxListByStakingDelegation = exports.getTxListByClaim = exports.getTxList = exports.getAnonymousTxList = exports.getParamsForTransparentTxList = exports.getHashSwap = exports.getBlock = exports.getTransactionStatus = exports.getIssuedRecords = exports.getAssetToken = exports.submitTransaction = exports.getSubmitTransactionData = exports.getStateCommitment = exports.getMTLeafInfo = exports.getAbarOwnerMemo = exports.getOwnerMemo = exports.getUtxo = exports.getRelatedSids = exports.getOwnedSids = exports.apiGet = exports.apiPost = exports.getRpcRoute = void 0;
var axios_1 = __importDefault(require("axios"));
var json_bigint_1 = __importDefault(require("json-bigint"));
var Sdk_1 = __importDefault(require("../../Sdk"));
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var axios_fetch_adapter_1 = __importDefault(require("@haverstack/axios-fetch-adapter"));
var _axios = axios_1.default.create({ adapter: axios_fetch_adapter_1.default });
_axios.defaults.transformResponse = [
    function (data) {
        try {
            return (0, json_bigint_1.default)({ useNativeBigInt: true }).parse(data);
        }
        catch (_) {
            return data;
        }
    },
];
var getBrc20Route = function () {
    var _a = Sdk_1.default.environment, hostUrl = _a.brc20url, queryPort = _a.brc20port;
    var url = "".concat(hostUrl).concat(queryPort ? ":".concat(queryPort) : '');
    return url;
};
var getQueryRoute = function () {
    var _a = Sdk_1.default.environment, hostUrl = _a.hostUrl, queryPort = _a.queryPort;
    var url = "".concat(hostUrl, ":").concat(queryPort);
    return url;
};
var getSubmitRoute = function () {
    var _a = Sdk_1.default.environment, hostUrl = _a.hostUrl, submissionPort = _a.submissionPort;
    var url = "".concat(hostUrl, ":").concat(submissionPort);
    return url;
};
var getLedgerRoute = function () {
    var _a = Sdk_1.default.environment, hostUrl = _a.hostUrl, ledgerPort = _a.ledgerPort;
    var url = "".concat(hostUrl, ":").concat(ledgerPort);
    return url;
};
var getExplorerApiRoute = function () {
    var _a = Sdk_1.default.environment, hostUrl = _a.hostUrl, explorerApiPort = _a.explorerApiPort;
    var url = "".concat(hostUrl, ":").concat(explorerApiPort);
    return url;
};
var getRpcRoute = function () {
    var _a = Sdk_1.default.environment, hostUrl = _a.hostUrl, rpcPort = _a.rpcPort;
    var url = "".concat(hostUrl, ":").concat(rpcPort);
    return url;
};
exports.getRpcRoute = getRpcRoute;
var apiPost = function (url, data, config) { return __awaiter(void 0, void 0, void 0, function () {
    var axiosResponse, err_1, e, myResponse, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, _axios.post(url, data, config)];
            case 1:
                axiosResponse = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                e = err_1;
                return [2 /*return*/, { error: { message: e.message } }];
            case 3:
                try {
                    myResponse = axiosResponse.data;
                    return [2 /*return*/, { response: myResponse }];
                }
                catch (err) {
                    e = err;
                    return [2 /*return*/, { error: { message: e.message } }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.apiPost = apiPost;
var apiGet = function (url, config) { return __awaiter(void 0, void 0, void 0, function () {
    var axiosResponse, err_2, e, myResponse, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, _axios.get(url, config)];
            case 1:
                axiosResponse = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                e = err_2;
                return [2 /*return*/, { error: { message: e.message } }];
            case 3:
                try {
                    myResponse = axiosResponse.data;
                    return [2 /*return*/, { response: myResponse }];
                }
                catch (err) {
                    e = err;
                    return [2 /*return*/, { error: { message: e.message } }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.apiGet = apiGet;
var getOwnedSids = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult, response, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getQueryRoute(), "/get_owned_utxos/").concat(address);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                response = dataResult.response, error = dataResult.error;
                if (error) {
                    return [2 /*return*/, { error: error }];
                }
                if (Array.isArray(response)) {
                    return [2 /*return*/, { response: response }];
                }
                if (parseFloat(response) > 0) {
                    return [2 /*return*/, { response: [response] }];
                }
                return [2 /*return*/, { response: [] }];
        }
    });
}); };
exports.getOwnedSids = getOwnedSids;
var getRelatedSids = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult, response, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getQueryRoute(), "/get_related_txns/").concat(address);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                response = dataResult.response, error = dataResult.error;
                if (error) {
                    return [2 /*return*/, { error: error }];
                }
                if (Array.isArray(response)) {
                    return [2 /*return*/, { response: response }];
                }
                if (parseFloat(response) > 0) {
                    return [2 /*return*/, { response: [response] }];
                }
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getRelatedSids = getRelatedSids;
var getUtxo = function (utxoSid, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getLedgerRoute(), "/utxo_sid/").concat(utxoSid);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
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
                url = "".concat(getQueryRoute(), "/get_owner_memo/").concat(utxoSid);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getOwnerMemo = getOwnerMemo;
var getAbarOwnerMemo = function (atxoSid, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getQueryRoute(), "/get_abar_memo/").concat(atxoSid);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getAbarOwnerMemo = getAbarOwnerMemo;
var getMTLeafInfo = function (atxoSid, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getQueryRoute(), "/get_abar_proof/").concat(atxoSid);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getMTLeafInfo = getMTLeafInfo;
/**
 * Returns state commitment
 *
 * @remarks
 * An important property of a Findora ledger is the ability to authenticate transactions.
 * Users can authenticate transactions against a small tag called the state commitment.
 * The state commitment is a commitment to the current state of the ledger.
 * The state commitment response is a tuple containing the state commitment and the state commitment version.
 *
 *
 * @returns An instace of StateCommitmentDataResult
 */
var getStateCommitment = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getLedgerRoute(), "/global_state");
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
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
        var e = err;
        return { error: { message: "Can't submit transaction. Can't parse transaction data. ".concat(e.message) } };
    }
};
exports.getSubmitTransactionData = getSubmitTransactionData;
var submitTransaction = function (data, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, _a, txData, error, dataResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(getSubmitRoute(), "/submit_transaction");
                _a = (0, exports.getSubmitTransactionData)(data), txData = _a.response, error = _a.error;
                if (error) {
                    return [2 /*return*/, { error: error }];
                }
                return [4 /*yield*/, (0, exports.apiPost)(url, txData, config)];
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
                url = "".concat(getLedgerRoute(), "/asset_token/").concat(assetCode);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getAssetToken = getAssetToken;
var getIssuedRecords = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getQueryRoute(), "/get_issued_records/").concat(address);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getIssuedRecords = getIssuedRecords;
/**
 * Returns transaction status
 *
 * @remarks
 * Using the transaction handle, user can fetch the status of the transaction from the query server.
 *
 * @returns An instace of TransactionStatusDataResult
 */
var getTransactionStatus = function (handle, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getSubmitRoute(), "/txn_status/").concat(handle);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getTransactionStatus = getTransactionStatus;
var getBlock = function (height, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getExplorerApiRoute(), "/block");
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: { height: height } }))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getBlock = getBlock;
var getHashSwap = function (hash, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getExplorerApiRoute(), "/tx_search");
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: { query: "\"tx.prehash='".concat(hash, "'\"") } }))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getHashSwap = getHashSwap;
var getParamsForTransparentTxList = function (address, type, page) {
    if (page === void 0) { page = 1; }
    var query = type === 'from' ? "\"addr.from.".concat(address, "='y'\"") : "\"addr.to.".concat(address, "='y'\"");
    var params = {
        query: query,
        page: page,
        per_page: 10,
        order_by: '"desc"',
    };
    return params;
};
exports.getParamsForTransparentTxList = getParamsForTransparentTxList;
var getAnonymousTxList = function (subject, type, page) {
    if (page === void 0) { page = 1; }
    var query = type === 'to' ? "\"commitment.created.".concat(subject, "='y'\"") : "\"nullifier.used.".concat(subject, "='y'\"");
    var params = {
        query: query,
        page: page,
        per_page: 10,
        order_by: '"desc"',
    };
    return params;
};
exports.getAnonymousTxList = getAnonymousTxList;
var getTxList = function (subject, type, page, per_page, config) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var blockScanerUrl, url, params, dataResult;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    blockScanerUrl = Sdk_1.default.environment.blockScanerUrl;
                    url = "".concat(blockScanerUrl, "/api/txs");
                    params = (_a = {}, _a[type] = subject, _a.page = page, _a.per_page = per_page, _a);
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
                case 1:
                    dataResult = _b.sent();
                    console.log(dataResult);
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.getTxList = getTxList;
var getTxListByClaim = function (subject, page, page_size, config) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var blockScanerUrl, url, params, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockScanerUrl = Sdk_1.default.environment.blockScanerUrl;
                    url = "".concat(blockScanerUrl, "/api/staking/claim");
                    params = { address: subject, page: page, page_size: page_size };
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
                case 1:
                    dataResult = _a.sent();
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.getTxListByClaim = getTxListByClaim;
var getTxListByStakingDelegation = function (subject, page, page_size, config) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var blockScanerUrl, url, params, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockScanerUrl = Sdk_1.default.environment.blockScanerUrl;
                    url = "".concat(blockScanerUrl, "/api/tx/delegation");
                    params = { address: subject, page: page, page_size: page_size };
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
                case 1:
                    dataResult = _a.sent();
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.getTxListByStakingDelegation = getTxListByStakingDelegation;
var getTxListByStakingUnDelegation = function (subject, page, page_size, config) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var blockScanerUrl, ledger, url, params, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockScanerUrl = Sdk_1.default.environment.blockScanerUrl;
                    return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
                case 1:
                    ledger = _a.sent();
                    url = "".concat(blockScanerUrl, "/api/staking/undelegation");
                    params = { pubkey: ledger.bech32_to_base64(subject), page: page, page_size: page_size };
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
                case 2:
                    dataResult = _a.sent();
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.getTxListByStakingUnDelegation = getTxListByStakingUnDelegation;
var getTxListByPrismSend = function (subject, page, page_size, config) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var blockScanerUrl, url, params, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockScanerUrl = Sdk_1.default.environment.blockScanerUrl;
                    url = "".concat(blockScanerUrl, "/api/tx/prism/records/send");
                    params = { address: subject, page: page, page_size: page_size };
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
                case 1:
                    dataResult = _a.sent();
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.getTxListByPrismSend = getTxListByPrismSend;
var getTxListByPrismReceive = function (subject, page, page_size, config) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var blockScanerUrl, url, params, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockScanerUrl = Sdk_1.default.environment.blockScanerUrl;
                    url = "".concat(blockScanerUrl, "/api/tx/prism/records/receive");
                    params = { address: subject, page: page, page_size: page_size };
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
                case 1:
                    dataResult = _a.sent();
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.getTxListByPrismReceive = getTxListByPrismReceive;
var getTransactionDetails = function (hash, config) { return __awaiter(void 0, void 0, void 0, function () {
    var params, url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = {
                    hash: "0x".concat(hash),
                };
                url = "".concat(getExplorerApiRoute(), "/tx");
                console.log('🚀 ~ file: network.ts ~ line 372 ~ url', url);
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getTransactionDetails = getTransactionDetails;
var getAbciNoce = function (data, config) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, ethAddressJson, url, params, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                ethAddressJson = ledger.get_serialized_address(data);
                url = "".concat(getExplorerApiRoute(), "/abci_query");
                params = {
                    path: '"module/account/nonce"',
                    data: "\"".concat(ethAddressJson, "\""),
                    prove: false,
                };
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
            case 2:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getAbciNoce = getAbciNoce;
var getAbciInfo = function (data, config) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, ethAddressJson, url, params, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                ethAddressJson = ledger.get_serialized_address(data);
                url = "".concat(getExplorerApiRoute(), "/abci_query");
                params = {
                    path: '"module/account/info"',
                    data: "\"".concat(ethAddressJson, "\""),
                    prove: false,
                };
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
            case 2:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getAbciInfo = getAbciInfo;
var submitEvmTx = function (tx, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, params, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getExplorerApiRoute());
                params = {
                    id: 58,
                    jsonrpc: '2.0',
                    method: 'broadcast_tx_sync',
                    params: {
                        tx: tx,
                    },
                };
                return [4 /*yield*/, (0, exports.apiPost)(url, params, __assign({}, config))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.submitEvmTx = submitEvmTx;
var getValidatorList = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getLedgerRoute(), "/validator_list");
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getValidatorList = getValidatorList;
var getDelegateInfo = function (publickey, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getLedgerRoute(), "/delegation_info/").concat(publickey);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getDelegateInfo = getDelegateInfo;
var sendRpcCall = function (url, givenPayload, config) { return __awaiter(void 0, void 0, void 0, function () {
    var defaultPayload, payload, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                defaultPayload = {
                    id: 1,
                    jsonrpc: '2.0',
                    method: 'eth_protocolVersion',
                    params: [],
                };
                payload = __assign(__assign({}, defaultPayload), givenPayload);
                return [4 /*yield*/, (0, exports.apiPost)(url, payload, __assign({}, config))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.sendRpcCall = sendRpcCall;
var sendRpcCallV2 = function (givenPayload, config) { return __awaiter(void 0, void 0, void 0, function () {
    var defaultPayload, url, payload, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                defaultPayload = {
                    id: 1,
                    jsonrpc: '2.0',
                    method: 'eth_protocolVersion',
                    params: [],
                };
                url = "".concat((0, exports.getRpcRoute)());
                payload = __assign(__assign({}, defaultPayload), givenPayload);
                return [4 /*yield*/, (0, exports.apiPost)(url, payload, __assign({}, config))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.sendRpcCallV2 = sendRpcCallV2;
var getRpcPayload = function (msgId, method, extraParams) {
    var payload = {
        id: msgId,
        method: method,
        params: extraParams,
    };
    return payload;
};
exports.getRpcPayload = getRpcPayload;
var getLatestBlock = function (extraParams, config) { return __awaiter(void 0, void 0, void 0, function () {
    var msgId, method, payload, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msgId = 1;
                method = 'eth_blockNumber';
                payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
                return [4 /*yield*/, (0, exports.sendRpcCallV2)(payload, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getLatestBlock = getLatestBlock;
var getOwnedAbars = function (commitment, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getQueryRoute(), "/owned_abars/").concat(commitment);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getOwnedAbars = getOwnedAbars;
var getAbarMemos = function (startSid, endSid, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, params, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getQueryRoute(), "/get_abar_memos");
                params = { start: startSid.trim(), end: endSid.trim() };
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getAbarMemos = getAbarMemos;
var checkNullifierHashSpent = function (hash, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getQueryRoute(), "/check_nullifier_hash/").concat(hash);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.checkNullifierHashSpent = checkNullifierHashSpent;
var getConfig = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getLedgerRoute(), "/display_checkpoint");
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getConfig = getConfig;
var getAbarCommitment = function (atxoSid, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getQueryRoute(), "/get_abar_commitment/").concat(atxoSid.trim());
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign({}, config))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getAbarCommitment = getAbarCommitment;
var getMaxAtxoSid = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getQueryRoute(), "/get_max_atxo_sid");
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign({}, config))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getMaxAtxoSid = getMaxAtxoSid;
var submitBRC20Tx = function (tx, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, params, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getExplorerApiRoute());
                console.log('url for submit brc', url);
                params = {
                    id: 'anything',
                    jsonrpc: '2.0',
                    method: 'broadcast_tx_sync',
                    params: {
                        tx: tx,
                    },
                };
                return [4 /*yield*/, (0, exports.apiPost)(url, params, __assign({}, config))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.submitBRC20Tx = submitBRC20Tx;
var getBrc20Balance = function (ticker, address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var params, url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = { ticker: ticker.trim(), address: address.trim() };
                url = "".concat(getBrc20Route(), "/balance");
                console.log('url ', url);
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getBrc20Balance = getBrc20Balance;
var getBrc20TokenList = function (tokenType, pageNo, pageCount, config) {
    if (tokenType === void 0) { tokenType = 0; }
    if (pageNo === void 0) { pageNo = 1; }
    if (pageCount === void 0) { pageCount = 10; }
    return __awaiter(void 0, void 0, void 0, function () {
        var params, url, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = { type: tokenType, pageNo: pageNo, pageCount: pageCount };
                    url = "".concat(getBrc20Route(), "/tokenList");
                    console.log('url ', url);
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
                case 1:
                    dataResult = _a.sent();
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.getBrc20TokenList = getBrc20TokenList;
var getBrc20TokenDetail = function (id, config) { return __awaiter(void 0, void 0, void 0, function () {
    var params, url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = { id: id.toString().trim() };
                url = "".concat(getBrc20Route(), "/token/").concat(params.id, "/detail");
                console.log('url ', url);
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign({}, config))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getBrc20TokenDetail = getBrc20TokenDetail;
var getBrc20UserRank = function (ticker, pageNo, pageCount, config) {
    if (pageNo === void 0) { pageNo = 1; }
    if (pageCount === void 0) { pageCount = 10; }
    return __awaiter(void 0, void 0, void 0, function () {
        var params, url, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = { ticker: ticker.trim(), pageNo: pageNo, pageCount: pageCount };
                    url = "".concat(getBrc20Route(), "/token/userRank");
                    console.log('url ', url);
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
                case 1:
                    dataResult = _a.sent();
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.getBrc20UserRank = getBrc20UserRank;
var getBrc20BalanceAll = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var params, url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = { address: address.trim() };
                url = "".concat(getBrc20Route(), "/balance/all");
                console.log('url ', url);
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getBrc20BalanceAll = getBrc20BalanceAll;
var getBrc20CheckTicker = function (ticker, config) { return __awaiter(void 0, void 0, void 0, function () {
    var params, url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = { ticker: ticker.trim() };
                url = "".concat(getBrc20Route(), "/token/check/").concat(params.ticker);
                console.log('url ', url);
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign({}, config))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getBrc20CheckTicker = getBrc20CheckTicker;
//# sourceMappingURL=network.js.map