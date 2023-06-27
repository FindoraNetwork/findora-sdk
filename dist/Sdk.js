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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("./config/cache");
const factory_1 = __importDefault(require("./services/cacheStore/factory"));
const providers_1 = require("./services/cacheStore/providers");
const SdkDefaultEnvironment = {
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
};
class Sdk {
    static init(sdkEnv) {
        Sdk.environment = Object.assign(Object.assign({}, SdkDefaultEnvironment), sdkEnv);
    }
    static reset() {
        Sdk.environment = Object.assign({}, SdkDefaultEnvironment);
    }
    static setUtxoData(walletAddress, utxoCache) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheDataToSave = {};
            utxoCache.forEach(item => {
                cacheDataToSave[`sid_${item.sid}`] = item;
            });
            yield factory_1.default.write(`${cache_1.CACHE_ENTRIES.UTXO_DATA}_${walletAddress}`, cacheDataToSave, Sdk.environment.cacheProvider);
            return true;
        });
    }
}
exports.default = Sdk;
Sdk.environment = Object.assign({}, SdkDefaultEnvironment);
//# sourceMappingURL=Sdk.js.map