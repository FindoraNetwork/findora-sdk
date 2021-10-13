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
exports.processeTxInfoList = exports.processTxInfoItem = void 0;
var js_base64_1 = __importDefault(require("js-base64"));
var helpers = __importStar(require("./helpers"));
var operationProcessors_1 = require("./operationProcessors");
var processTxOperationItem = function (operationItem) { return __awaiter(void 0, void 0, void 0, function () {
    var dataProcessor, processedData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dataProcessor = operationProcessors_1.getOperationProcessor(operationItem, operationProcessors_1.processorsMap);
                return [4 /*yield*/, dataProcessor(operationItem)];
            case 1:
                processedData = _a.sent();
                return [2 /*return*/, processedData];
        }
    });
}); };
var processTxOperationList = function (operationsList) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Promise.all(operationsList.map(function (operationItem) { return processTxOperationItem(operationItem); }))];
    });
}); };
var processTxInfoItem = function (txItem) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedTx, e, time, hash, code, operationsList, processedOperationList, processedUpdatedTxList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                try {
                    parsedTx = JSON.parse(js_base64_1.default.decode(txItem.tx));
                }
                catch (err) {
                    e = err;
                    throw new Error("Can not parse the tx info from the tx item. Details: \"" + e.message + "\"");
                }
                if (!parsedTx) {
                    throw new Error('parsed tx is empty');
                }
                return [4 /*yield*/, helpers.getBlockTime(txItem.height)];
            case 1:
                time = _a.sent();
                hash = txItem.hash;
                code = txItem.tx_result.code;
                operationsList = helpers.getTxOperationsList(parsedTx);
                return [4 /*yield*/, processTxOperationList(operationsList)];
            case 2:
                processedOperationList = _a.sent();
                processedUpdatedTxList = processedOperationList.map(function (txOperation) { return (__assign(__assign({}, txItem), txOperation)); });
                return [2 /*return*/, {
                        code: code,
                        data: processedUpdatedTxList,
                        hash: hash,
                        time: time,
                    }];
        }
    });
}); };
exports.processTxInfoItem = processTxInfoItem;
var processeTxInfoList = function (txList) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Promise.all(txList.map(function (txItem) { return exports.processTxInfoItem(txItem); }))];
    });
}); };
exports.processeTxInfoList = processeTxInfoList;
//# sourceMappingURL=processor.js.map