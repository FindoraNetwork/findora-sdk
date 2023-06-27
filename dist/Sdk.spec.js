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
require("@testing-library/jest-dom/extend-expect");
const Sdk_1 = __importDefault(require("./Sdk"));
const providers_1 = require("./services/cacheStore/providers");
afterEach(() => Sdk_1.default.reset());
describe('SdkMain (unit test)', () => {
    describe('init', () => {
        it('initializes sdk environment with given values', () => __awaiter(void 0, void 0, void 0, function* () {
            const sdkEnv = {
                hostUrl: 'pHost',
                queryPort: 'p8667',
                ledgerPort: 'p8668',
                submissionPort: 'p8669',
                explorerApiPort: 'p26657',
                cacheProvider: providers_1.FileCacheProvider,
                cachePath: 'pCacheDir',
                blockScanerUrl: 'https://foo.bar',
            };
            Sdk_1.default.init(sdkEnv);
            expect(Sdk_1.default.environment.hostUrl).toEqual('pHost');
            expect(Sdk_1.default.environment.queryPort).toEqual('p8667');
            expect(Sdk_1.default.environment.ledgerPort).toEqual('p8668');
            expect(Sdk_1.default.environment.submissionPort).toEqual('p8669');
            expect(Sdk_1.default.environment.explorerApiPort).toEqual('p26657');
            expect(Sdk_1.default.environment.cacheProvider).toEqual({
                read: providers_1.FileCacheProvider.read,
                write: providers_1.FileCacheProvider.write,
            });
            expect(Sdk_1.default.environment.cachePath).toEqual('pCacheDir');
        }));
        it('initializes sdk environment with default values', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(Sdk_1.default.environment.hostUrl).toEqual('https://dev-evm.dev.findora.org');
            expect(Sdk_1.default.environment.queryPort).toEqual('8667');
            expect(Sdk_1.default.environment.ledgerPort).toEqual('8668');
            expect(Sdk_1.default.environment.submissionPort).toEqual('8669');
            expect(Sdk_1.default.environment.explorerApiPort).toEqual('26657');
            expect(Sdk_1.default.environment.cacheProvider).toEqual({
                read: providers_1.MemoryCacheProvider.read,
                write: providers_1.MemoryCacheProvider.write,
            });
            expect(Sdk_1.default.environment.cachePath).toEqual('./cache');
        }));
    });
    describe('reset', () => {
        it('resets the environment with default values', () => __awaiter(void 0, void 0, void 0, function* () {
            const sdkEnv = {
                hostUrl: 'foo',
                queryPort: 'bar',
                blockScanerUrl: 'https://foo.bar',
            };
            Sdk_1.default.init(sdkEnv);
            expect(Sdk_1.default.environment.hostUrl).toEqual('foo');
            expect(Sdk_1.default.environment.queryPort).toEqual('bar');
            Sdk_1.default.reset();
            expect(Sdk_1.default.environment.hostUrl).toEqual('https://dev-evm.dev.findora.org');
            expect(Sdk_1.default.environment.queryPort).toEqual('8667');
            expect(Sdk_1.default.environment.ledgerPort).toEqual('8668');
            expect(Sdk_1.default.environment.submissionPort).toEqual('8669');
            expect(Sdk_1.default.environment.explorerApiPort).toEqual('26657');
            expect(Sdk_1.default.environment.cacheProvider).toEqual({
                read: providers_1.MemoryCacheProvider.read,
                write: providers_1.MemoryCacheProvider.write,
            });
            expect(Sdk_1.default.environment.cachePath).toEqual('./cache');
        }));
    });
});
//# sourceMappingURL=Sdk.spec.js.map