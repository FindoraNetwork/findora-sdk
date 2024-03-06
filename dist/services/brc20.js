"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addList = exports.getMiddleman = exports.sendBRC20MintTx = void 0;
var api_1 = require("../api");
var utils_1 = require("../services/utils");
var axios_1 = __importStar(require("axios"));
var brcEnpoints = {
    balance: '/balance',
    balanceAll: '/balance/all',
    tokenList: '/tokenList',
    tokenDetail: '/token/:id/detail',
    tokenHolders: '/token/userRank',
    tokenDeployCheck: '/token/check/:ticker',
    addList: '/addList',
    confirmList: '/confirmList',
    cancelList: '/cancelList',
    listedList: '/list',
    orderList: '/orderList',
    myList: '/myList',
    middleman: '/account',
    market: '/market',
    banner: '/banner',
    buy: '/buy',
};
var sendBRC20MintTx = function (tick, amt, repeat, walletInfoFrom) { return __awaiter(void 0, void 0, void 0, function () {
    var params, transactionBuilder, myTxInJson, myTxInBase64, result, response, er_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                params = { tick: tick, amt: amt, repeat: repeat };
                return [4 /*yield*/, api_1.Transaction.brc20Mint(walletInfoFrom, params)];
            case 1:
                transactionBuilder = _c.sent();
                myTxInJson = transactionBuilder.transaction();
                myTxInBase64 = Buffer.from(myTxInJson).toString('base64');
                return [4 /*yield*/, api_1.Network.submitBRC20Tx(myTxInBase64)];
            case 2:
                result = _c.sent();
                console.log('submitBRC20Tx mint result', result);
                response = result.response;
                return [2 /*return*/, (_b = (_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.hash) !== null && _b !== void 0 ? _b : ''];
            case 3:
                er_1 = _c.sent();
                console.log(er_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, ''];
        }
    });
}); };
exports.sendBRC20MintTx = sendBRC20MintTx;
var getAxios = function () {
    var _axios = axios_1.default.create({});
    // Unified processing
    _axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        return Promise.reject(error);
    });
    return _axios;
};
var getMiddleman = function (listId, baseUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var _axios, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _axios = getAxios();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, _axios.get("".concat(baseUrl).concat(brcEnpoints.middleman), { params: { listId: listId } })];
            case 2:
                data = (_a.sent()).data;
                return [2 /*return*/, data.result];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, ''];
        }
    });
}); };
exports.getMiddleman = getMiddleman;
var confirmList = function (listId, user, baseUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var formData, headers, _axios, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                formData = new FormData();
                formData.append('listId', "".concat(listId));
                formData.append('user', user);
                headers = new axios_1.AxiosHeaders();
                headers.setContentType('multipart/form-data');
                _axios = getAxios();
                return [4 /*yield*/, _axios.post("".concat(baseUrl).concat(brcEnpoints.confirmList), formData, { headers: headers })];
            case 1:
                data = (_a.sent()).data;
                console.log('confirmList response data', data);
                if (data.result === 'ok') {
                    return [2 /*return*/, true];
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, false];
        }
    });
}); };
var addList = function (ticker, 
// user: string,
totalPrice, amount, baseUrl, walletInfoFrom) { return __awaiter(void 0, void 0, void 0, function () {
    var _axios, user, formData, headers, data, listId, receiver, fraTx, brc20Tx, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _axios = getAxios();
                user = walletInfoFrom.address;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                formData = new FormData();
                formData.append('ticker', ticker);
                formData.append('user', user);
                formData.append('totalPrice', totalPrice);
                formData.append('amount', amount);
                headers = new axios_1.AxiosHeaders();
                headers.setContentType('multipart/form-data');
                return [4 /*yield*/, _axios.post("".concat(baseUrl).concat(brcEnpoints.addList), formData, { headers: headers })];
            case 2:
                data = (_a.sent()).data;
                console.log('addList response data', data);
                listId = data.listId;
                if (!listId) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, exports.getMiddleman)(listId, baseUrl)];
            case 3:
                receiver = _a.sent();
                return [4 /*yield*/, fraTransfer({
                        amt: '0.1',
                        receiver: receiver,
                    }, walletInfoFrom)];
            case 4:
                fraTx = _a.sent();
                return [4 /*yield*/, transfer({
                        tick: ticker,
                        amt: "".concat(amount),
                        receiver: receiver,
                    }, walletInfoFrom)];
            case 5:
                brc20Tx = _a.sent();
                if (!fraTx || !brc20Tx)
                    return [2 /*return*/, ''];
                return [4 /*yield*/, confirmList(listId, user, baseUrl)];
            case 6:
                _a.sent();
                return [2 /*return*/, brc20Tx];
            case 7: return [3 /*break*/, 9];
            case 8:
                error_3 = _a.sent();
                console.log(error_3);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/, ''];
        }
    });
}); };
exports.addList = addList;
var sendBRC20TransferTx = function (tick, amt, receiver, walletInfoFrom) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionBuilder, myTxInJson, myTxInBase64, result, er_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, api_1.Transaction.brc20Transfer(walletInfoFrom, {
                        receiverAddress: receiver,
                        amt: amt,
                        tick: tick,
                    })];
            case 1:
                transactionBuilder = _a.sent();
                myTxInJson = transactionBuilder.transaction();
                myTxInBase64 = Buffer.from(myTxInJson).toString('base64');
                return [4 /*yield*/, api_1.Network.submitBRC20Tx(myTxInBase64)];
            case 2:
                result = _a.sent();
                console.log('submitBRC20Tx transfer result', result);
                return [2 /*return*/, result];
            case 3:
                er_2 = _a.sent();
                console.log(er_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, {}];
        }
    });
}); };
//
var sendFRATransferTx = function (data, walletInfoFrom) { return __awaiter(void 0, void 0, void 0, function () {
    var amt, receiver, assetCode, assetBlindRules, transactionBuilder, result, txHash, response, tx, hash, er_3;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('sendFRATransferTx data', data);
                amt = data.amt, receiver = data.receiver;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 9, , 10]);
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 2:
                assetCode = _d.sent();
                assetBlindRules = {
                    isTypeBlind: false,
                    isAmountBlind: false,
                };
                return [4 /*yield*/, api_1.Transaction.sendToAddressV2(walletInfoFrom, receiver, "".concat(amt), assetCode, assetBlindRules)];
            case 3:
                transactionBuilder = _d.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 4:
                result = _d.sent();
                console.log('submit tx result (for sending fra), ', result);
                txHash = '';
                _d.label = 5;
            case 5:
                if (!(txHash === '')) return [3 /*break*/, 8];
                return [4 /*yield*/, (0, utils_1.delay)(5000)];
            case 6:
                _d.sent();
                return [4 /*yield*/, api_1.Network.getHashSwap(result)];
            case 7:
                response = _d.sent();
                tx = ((_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.response) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.txs) !== null && _c !== void 0 ? _c : [])[0];
                console.log('tx hash swap result after waiting 5sec', tx);
                hash = (tx || {}).hash;
                txHash = tx ? hash : '';
                return [3 /*break*/, 5];
            case 8: return [2 /*return*/, txHash];
            case 9:
                er_3 = _d.sent();
                console.log('sendFRATransferTx err', er_3);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/, ''];
        }
    });
}); };
var transfer = function (data, walletInfoFrom) { return __awaiter(void 0, void 0, void 0, function () {
    var tick, amt, receiver, response, error_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                tick = data.tick, amt = data.amt, receiver = data.receiver;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sendBRC20TransferTx(tick, +amt, receiver, walletInfoFrom)];
            case 2:
                response = (_c.sent()).response;
                return [2 /*return*/, (_b = (_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.hash) !== null && _b !== void 0 ? _b : ''];
            case 3:
                error_4 = _c.sent();
                console.log(error_4);
                return [2 /*return*/, ''];
            case 4: return [2 /*return*/];
        }
    });
}); };
var fraTransfer = function (data, walletInfoFrom) { return __awaiter(void 0, void 0, void 0, function () {
    var receiver, amt, data_1, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                receiver = data.receiver, amt = data.amt;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sendFRATransferTx({
                        receiver: receiver,
                        amt: amt,
                    }, walletInfoFrom)];
            case 2:
                data_1 = _a.sent();
                // const { response } = data;
                console.log('sendFRATransferTx data response', data_1);
                // return response?.result?.hash ?? "";
                // yes, it is not an object but a plain string
                return [2 /*return*/, data_1];
            case 3:
                error_5 = _a.sent();
                console.log('aaaa!!! fra transfer error ', error_5);
                return [2 /*return*/, ''];
            case 4: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=brc20.js.map