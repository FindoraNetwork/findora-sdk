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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTxList = void 0;
var get_1 = __importDefault(require("lodash/get"));
var Network = __importStar(require("../../api/network"));
var atob_1 = __importDefault(require("atob"));
var processors_1 = require("./processors");
var processOperationItem = function (operationItem) { return __awaiter(void 0, void 0, void 0, function () {
    var dataProcessor, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dataProcessor = processors_1.getProcessor(operationItem);
                return [4 /*yield*/, dataProcessor(operationItem)];
            case 1:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
var processTxOperations = function (operationsList) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Promise.all(operationsList.map(function (operationItem) { return processOperationItem(operationItem); }))];
    });
}); };
var getTxOperationsList = function (parsedTx) { return get_1.default(parsedTx, 'body.operations', []); };
var processTxInfoItem = function (txItem) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedTx, operationsList, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                try {
                    parsedTx = JSON.parse(atob_1.default(txItem.tx));
                }
                catch (err) {
                    throw new Error("cant parse the tx info from the tx item. Details: \"" + JSON.stringify(err) + "\"");
                }
                if (!parsedTx) {
                    throw new Error('parsed tx is empty');
                }
                operationsList = getTxOperationsList(parsedTx);
                return [4 /*yield*/, processTxOperations(operationsList)];
            case 1:
                res = _a.sent();
                console.log('res', res);
                return [2 /*return*/, '1'];
        }
    });
}); };
var getProcessedTxInfoList = function (txList) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Promise.all(txList.map(function (txItem) { return processTxInfoItem(txItem); }))];
    });
}); };
var getTxListFromResponse = function (result) { return get_1.default(result, 'response.result.txs', null); };
var getTxList = function (address, type, page) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var dataResult, txList, processedTxList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Network.getTxList(address, type, page)];
                case 1:
                    dataResult = _a.sent();
                    txList = getTxListFromResponse(dataResult);
                    // console.log('txList', txList[0]);
                    if (!txList) {
                        return [2 /*return*/, ['n']];
                    }
                    return [4 /*yield*/, getProcessedTxInfoList(txList)];
                case 2:
                    processedTxList = _a.sent();
                    console.log('processedTxList!', processedTxList);
                    return [2 /*return*/, ['y']];
            }
        });
    });
};
exports.getTxList = getTxList;
//# sourceMappingURL=index.js.map