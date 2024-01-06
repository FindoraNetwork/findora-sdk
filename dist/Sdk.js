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
var cache_1 = require("./config/cache");
var factory_1 = __importDefault(require("./services/cacheStore/factory"));
var providers_1 = require("./services/cacheStore/providers");
var SdkDefaultEnvironment = {
    hostUrl: 'https://dev-evm.dev.findora.org',
    blockScanerUrl: '',
    configServerUrl: 'http://columbus-config-qa02.s3-website-us-west-1.amazonaws.com/',
    queryPort: '8667',
    ledgerPort: '8668',
    submissionPort: '8669',
    explorerApiPort: '26657',
    rpcPort: '8545',
    cacheProvider: providers_1.MemoryCacheProvider,
    cachePath: './cache',
    brc20url: 'https://api-testnet.brc20.findora.org',
    brc20port: '',
};
var Sdk = /** @class */ (function () {
    function Sdk() {
    }
    Sdk.init = function (sdkEnv) {
        console.log('sdk init was called');
        Sdk.environment = __assign(__assign({}, SdkDefaultEnvironment), sdkEnv);
    };
    Sdk.reset = function () {
        Sdk.environment = __assign({}, SdkDefaultEnvironment);
    };
    Sdk.setUtxoData = function (walletAddress, utxoCache) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheDataToSave;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheDataToSave = {};
                        utxoCache.forEach(function (item) {
                            cacheDataToSave["sid_".concat(item.sid)] = item;
                        });
                        return [4 /*yield*/, factory_1.default.write("".concat(cache_1.CACHE_ENTRIES.UTXO_DATA, "_").concat(walletAddress), cacheDataToSave, Sdk.environment.cacheProvider || providers_1.MemoryCacheProvider)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Sdk.environment = __assign({}, SdkDefaultEnvironment);
    return Sdk;
}());
exports.default = Sdk;
//# sourceMappingURL=Sdk.js.map