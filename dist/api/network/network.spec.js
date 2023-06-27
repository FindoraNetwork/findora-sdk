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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const msw_1 = require("msw");
const node_1 = require("msw/node");
const Sdk_1 = __importDefault(require("../../Sdk"));
const providers_1 = require("../../services/cacheStore/providers");
const network = __importStar(require("./network"));
const myDefaultResult = [
    {
        foo: 'bar',
    },
    {
        barfoo: 'foobar',
    },
];
const defaultUrl = `https://foo.com`;
const server = (0, node_1.setupServer)(msw_1.rest.get(defaultUrl, (_req, res, ctx) => {
    return res(ctx.json(myDefaultResult));
}));
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
describe('network (unit test)', () => {
    const testConfig = {
        headers: {
            testHeader: 'test-value',
        },
    };
    const hostUrl = 'https://foo.bar';
    const sdkEnv = {
        hostUrl,
        cacheProvider: providers_1.MemoryCacheProvider,
        blockScanerUrl: 'https://foo.bar',
        cachePath: '.',
    };
    Sdk_1.default.init(sdkEnv);
    describe('apiPost', () => {
        const data = { foo: 'bar' };
        const myHandle = 'foobar';
        it('returns properly formatted response data', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.post(defaultUrl, (_req, res, ctx) => {
                return res(ctx.json(myHandle));
            }));
            const dataResult = yield network.apiPost(defaultUrl, data, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response).toEqual('foobar');
        }));
        it('makes a call with no data', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.post(defaultUrl, (_req, res, ctx) => {
                return res(ctx.json(myHandle));
            }));
            const dataResult = yield network.apiPost(defaultUrl, undefined, testConfig);
            expect(dataResult).toHaveProperty('response');
            const { response } = dataResult;
            expect(response).toEqual('foobar');
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.post(defaultUrl, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.apiPost(defaultUrl, data, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('apiGet', () => {
        it('returns properly formatted response data', () => __awaiter(void 0, void 0, void 0, function* () {
            const dataResult = yield network.apiGet(defaultUrl, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response.length).toEqual(2);
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(defaultUrl, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.apiGet(defaultUrl, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getOwnedSids', () => {
        const address = 'mhlYmYPKqBcvhJjvXnapuaZdkzqdz27bEmoxpF0ZG_A=';
        const url = `${hostUrl}:8667/get_owned_utxos/${address}`;
        it('returns properly formatted utxo sids data for multiple sids', () => __awaiter(void 0, void 0, void 0, function* () {
            const mySids = [3, 4, 5];
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(mySids));
            }));
            const dataResult = yield network.getOwnedSids(address, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response.length).toEqual(3);
        }));
        it('returns properly formatted utxo sids data for a single sid ', () => __awaiter(void 0, void 0, void 0, function* () {
            const mySids = 3;
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(mySids));
            }));
            const dataResult = yield network.getOwnedSids(address, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response.length).toEqual(1);
        }));
        it('returns properly formatted utxo sids data for a single sid in an array', () => __awaiter(void 0, void 0, void 0, function* () {
            const mySids = [3];
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(mySids));
            }));
            const dataResult = yield network.getOwnedSids(address, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response.length).toEqual(1);
        }));
        it('returns properly formatted utxo sids data response is undefined', () => __awaiter(void 0, void 0, void 0, function* () {
            const mySids = undefined;
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(mySids));
            }));
            const dataResult = yield network.getOwnedSids(address, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response.length).toEqual(0);
        }));
        it('returns an error in case of a server error and does not return response', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.getOwnedSids(address, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getOwnedSids(address, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getRelatedSids', () => {
        const address = 'mhlYmYPKqBcvhJjvXnapuaZdkzqdz27bEmoxpF0ZG_A=';
        const url = `${hostUrl}:8667/get_related_txns/${address}`;
        it('returns properly formatted utxo sids data for multiple sids', () => __awaiter(void 0, void 0, void 0, function* () {
            const mySids = [3, 4, 5];
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(mySids));
            }));
            const dataResult = yield network.getRelatedSids(address, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response.length).toEqual(3);
        }));
        it('returns properly formatted utxo sids data for a single sid ', () => __awaiter(void 0, void 0, void 0, function* () {
            const mySids = 3;
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(mySids));
            }));
            const dataResult = yield network.getRelatedSids(address, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response.length).toEqual(1);
        }));
        it('returns properly formatted utxo sids data for a single sid in an array', () => __awaiter(void 0, void 0, void 0, function* () {
            const mySids = [3];
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(mySids));
            }));
            const dataResult = yield network.getRelatedSids(address, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response.length).toEqual(1);
        }));
        it('returns properly formatted utxo sids data response is undefined', () => __awaiter(void 0, void 0, void 0, function* () {
            const mySids = undefined;
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(mySids));
            }));
            const dataResult = yield network.getRelatedSids(address, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response.length).toEqual(0);
        }));
        it('returns an error in case of a server error and does not return response', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.getRelatedSids(address, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getRelatedSids(address, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getUtxo', () => {
        const sid = 42;
        const url = `${hostUrl}:8668/utxo_sid/${sid}`;
        it('returns properly formatted utxo data', () => __awaiter(void 0, void 0, void 0, function* () {
            const myUtxo = {
                id: 1,
                record: { foo: 'bar' },
            };
            const myUtxoResponse = {
                utxo: myUtxo,
            };
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myUtxoResponse));
            }));
            const dataResult = yield network.getUtxo(sid, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response).toHaveProperty('utxo');
            const { utxo } = response;
            expect(utxo).toHaveProperty('record');
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.getUtxo(sid, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getUtxo(sid, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getOwnerMemo', () => {
        const sid = 1234342;
        const url = `${hostUrl}:8667/get_owner_memo/${sid}`;
        it('returns properly formatted owner memo data', () => __awaiter(void 0, void 0, void 0, function* () {
            const myLock = {
                ciphertext: 'foo',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                ephemeral_public_key: 'bar',
            };
            const myResponse = {
                lock: myLock,
            };
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const dataResult = yield network.getOwnerMemo(sid, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response).toHaveProperty('lock');
            const { lock } = response;
            expect(lock).toHaveProperty('ciphertext');
            expect(lock).toHaveProperty('ephemeral_public_key');
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.getOwnerMemo(sid, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getOwnerMemo(sid, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getStateCommitment', () => {
        const url = `${hostUrl}:8668/global_state`;
        it('returns properly formatted data', () => __awaiter(void 0, void 0, void 0, function* () {
            const myResponse = [[1, 2, 3], 45, 'foobar'];
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const dataResult = yield network.getStateCommitment(testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            const [first, height, third] = response;
            expect(Array.isArray(first)).toEqual(true);
            expect(height).toEqual(45);
            expect(third).toEqual('foobar');
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.getStateCommitment(testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getStateCommitment(testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getSubmitTransactionData', () => {
        it('return empty tx data with no data given to the input', () => {
            const txData = network.getSubmitTransactionData();
            expect(txData).toStrictEqual({ response: undefined });
        });
        it('return empty tx data with empty string given to the input', () => {
            const givenData = '';
            const txData = network.getSubmitTransactionData(givenData);
            expect(txData).toStrictEqual({ response: undefined });
        });
        it('return given string parsed as number', () => {
            const givenData = '1234';
            const txData = network.getSubmitTransactionData(givenData);
            expect(txData).toStrictEqual({ response: 1234 });
        });
        it('return given stringified object properly parsed', () => {
            const givenData = {
                foo: 'bar',
                barfoo: 123,
            };
            const txData = network.getSubmitTransactionData(JSON.stringify(givenData));
            expect(txData).toEqual({ response: givenData });
        });
        it('return properly formatted error', () => {
            const givenData = '124343hh s';
            const txData = network.getSubmitTransactionData(givenData);
            expect(txData).not.toHaveProperty('response');
            expect(txData).toHaveProperty('error');
            expect(txData.error.message).toContain("Can't submit transaction. Can't parse transaction data.");
        });
        it('return properly formatted error for mailformed json', () => {
            const givenData = '{f:1}';
            const txData = network.getSubmitTransactionData(givenData);
            expect(txData).not.toHaveProperty('response');
            expect(txData).toHaveProperty('error');
            expect(txData.error.message).toContain("Can't submit transaction. Can't parse transaction data.");
        });
        it('return given stringified object properly parsed', () => {
            const givenData = {
                foo: 'bar',
                barfoo: 123434343434343435343434343434242342342432,
            };
            const txData = network.getSubmitTransactionData(JSON.stringify(givenData));
            const { response: { barfoo }, } = txData;
            expect(barfoo instanceof bignumber_js_1.default).toEqual(true);
        });
    });
    describe('submitTransaction', () => {
        const url = `${hostUrl}:8669/submit_transaction`;
        it('returns properly formatted response', () => __awaiter(void 0, void 0, void 0, function* () {
            const myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';
            const myData = { foo: myResponse };
            server.use(msw_1.rest.post(url, (_req, res, ctx) => {
                const { foo } = _req.body;
                return res(ctx.json(foo));
            }));
            const spy = jest.spyOn(network, 'getSubmitTransactionData');
            const spyPost = jest.spyOn(network, 'apiPost');
            const myNewData = JSON.stringify(myData);
            const dataResult = yield network.submitTransaction(myNewData, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            expect(dataResult.response).toBe(myResponse);
            expect(spy).toHaveBeenCalledWith(myNewData);
            expect(spy).toReturnWith({ response: myData });
            expect(spyPost).toHaveBeenCalledWith(url, myData, testConfig);
        }));
        it('returns properly formatted response with no input data', () => __awaiter(void 0, void 0, void 0, function* () {
            const myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';
            server.use(msw_1.rest.post(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const dataResult = yield network.submitTransaction(undefined, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.post(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.submitTransaction('', testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.post(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.submitTransaction('', testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getAssetToken', () => {
        const assetCode = 'foo';
        const url = `${hostUrl}:8668/asset_token/${assetCode}`;
        it('returns properly formatted data', () => __awaiter(void 0, void 0, void 0, function* () {
            const assetProperties = {
                code: 1,
                issuer: 2,
                asset_rules: [],
            };
            const myResponse = {
                properties: assetProperties,
            };
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const dataResult = yield network.getAssetToken(assetCode, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response).toHaveProperty('properties');
            const { properties } = response;
            expect(properties).toHaveProperty('code');
            expect(properties).toHaveProperty('issuer');
            expect(properties).toHaveProperty('asset_rules');
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.getAssetToken(assetCode, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getAssetToken(assetCode, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getIssuedRecords', () => {
        const address = 'foo';
        const url = `${hostUrl}:8667/get_issued_records/${address}`;
        it('returns properly formatted data', () => __awaiter(void 0, void 0, void 0, function* () {
            const issuedRecord = [
                {
                    id: 1,
                    record: 'foo',
                },
                null,
            ];
            const myResponse = [issuedRecord];
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const dataResult = yield network.getIssuedRecords(address, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response.length).toBe(1);
            const [firstRecord] = response;
            expect(firstRecord.length).toBe(2);
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.getIssuedRecords(address, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getIssuedRecords(address, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getTransactionStatus', () => {
        const handle = 'foo';
        const url = `${hostUrl}:8669/txn_status/${handle}`;
        it('returns properly formatted data', () => __awaiter(void 0, void 0, void 0, function* () {
            const myResponse = {
                Committed: [1, [1, 2, 3]],
            };
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const dataResult = yield network.getTransactionStatus(handle, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response).toHaveProperty('Committed');
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.getTransactionStatus(handle, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getTransactionStatus(handle, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getBlock', () => {
        const height = 12;
        const url = `${hostUrl}:26657/block`;
        it('returns properly formatted data', () => __awaiter(void 0, void 0, void 0, function* () {
            const myResponse = {
                result: {
                    block_id: {
                        hash: '123',
                    },
                },
            };
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const spy = jest.spyOn(network, 'apiGet');
            const dataResult = yield network.getBlock(height, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response).toHaveProperty('result');
            const { result } = response;
            expect(result).toHaveProperty('block_id');
            expect(spy).toHaveBeenCalledWith(url, Object.assign(Object.assign({}, testConfig), { params: { height } }));
            spy.mockRestore();
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.getBlock(height, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getBlock(height, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getHashSwap', () => {
        const hash = 'abc123';
        const url = `${hostUrl}:26657/tx_search`;
        it('returns properly formatted data', () => __awaiter(void 0, void 0, void 0, function* () {
            const myResponse = {
                result: {
                    txs: [{ foo: 'bar' }],
                    total_count: 1,
                },
            };
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const spy = jest.spyOn(network, 'apiGet');
            const dataResult = yield network.getHashSwap(hash, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response).toHaveProperty('result');
            const { result } = response;
            expect(result).toHaveProperty('total_count');
            expect(result).toHaveProperty('txs');
            const { txs, total } = result;
            expect(txs === null || txs === void 0 ? void 0 : txs.length).toBe(1);
            expect(total).toBe(1);
            expect(spy).toHaveBeenCalledWith(url, Object.assign(Object.assign({}, testConfig), { params: { query: `"tx.prehash='${hash}'"` } }));
            spy.mockRestore();
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.getHashSwap(hash, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getHashSwap(hash, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getTxList', () => {
        const address = 'foo';
        const type = 'to';
        const page = 1;
        const url = `${hostUrl}:26657/tx_search`;
        it('returns properly formatted data with default page equals to 1 and check type = "to"', () => __awaiter(void 0, void 0, void 0, function* () {
            const myResponse = {
                result: {
                    txs: [{ foo: 'bar' }],
                    total_count: 1,
                },
            };
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const spy = jest.spyOn(network, 'apiGet');
            const dataResult = yield network.getTxList(address, type, 1, 10);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response).toHaveProperty('result');
            const { data } = response;
            expect(data).toHaveProperty('total');
            expect(data).toHaveProperty('txs');
            const { txs, total } = data;
            expect(txs === null || txs === void 0 ? void 0 : txs.length).toBe(1);
            expect(total).toBe(1);
            expect(spy).toHaveBeenCalledWith(url, {
                params: {
                    order_by: '"desc"',
                    page: 1,
                    per_page: 10,
                    query: '"addr.to.foo=\'y\'"',
                },
            });
            spy.mockRestore();
        }));
        it('returns properly formatted data with given page and check type = "from"', () => __awaiter(void 0, void 0, void 0, function* () {
            const myResponse = {
                result: {
                    txs: [{ foo: 'bar' }],
                    total_count: 1,
                },
            };
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const spy = jest.spyOn(network, 'apiGet');
            // const dataResult = await network.getTxList(address, 'from', 2, 'transparent', testConfig);
            // expect(dataResult).toHaveProperty('response');
            // expect(dataResult).not.toHaveProperty('error');
            // const { response } = dataResult;
            // expect(response).toHaveProperty('result');
            // const { data } = response!;
            // expect(data).toHaveProperty('total');
            // expect(data).toHaveProperty('txs');
            // const { txs, total } = data;
            // expect(txs?.length).toBe(1);
            // expect(total).toBe(1);
            expect(spy).toHaveBeenCalledWith(url, Object.assign(Object.assign({}, testConfig), { params: {
                    order_by: '"desc"',
                    page: 2,
                    per_page: 10,
                    query: '"addr.from.foo=\'y\'"',
                } }));
            spy.mockRestore();
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            // const dataResult = await network.getTxList(address, type, page, 'transparent', testConfig);
            // expect(dataResult).not.toHaveProperty('response');
            // expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            // const dataResult = await network.getTxList(address, type, page, 'transparent', testConfig);
            // expect(dataResult).not.toHaveProperty('response');
            // expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getTransactionDetails', () => {
        const hash = 'abc123';
        const url = `${hostUrl}:26657/tx`;
        it('returns properly formatted data', () => __awaiter(void 0, void 0, void 0, function* () {
            const myResponse = {
                result: {
                    tx: 'assd123abcdf',
                },
            };
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const spy = jest.spyOn(network, 'apiGet');
            const dataResult = yield network.getTransactionDetails(hash, testConfig);
            expect(dataResult).toHaveProperty('response');
            expect(dataResult).not.toHaveProperty('error');
            const { response } = dataResult;
            expect(response).toHaveProperty('result');
            const { result } = response;
            expect(result).toHaveProperty('tx');
            const { tx } = result;
            expect(tx).toEqual('assd123abcdf');
            expect(spy).toHaveBeenCalledWith(url, Object.assign(Object.assign({}, testConfig), { params: { hash: `0x${hash}` } }));
            spy.mockRestore();
        }));
        it('returns an error in case of a server error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            const dataResult = yield network.getTransactionDetails(hash, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getTransactionDetails(hash, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
    describe('getOwnedAbars', () => {
        const randomizedPubKey = 'randomizedPubKey';
        const url = `${hostUrl}:8667/owned_abars/${randomizedPubKey}`;
        it('returns properly formatted data', () => __awaiter(void 0, void 0, void 0, function* () {
            const ownedAbar = { amount_type_commitment: 'amount_type_commitment', public_key: 'public_key' };
            const myResponse = [[123, ownedAbar]];
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(myResponse));
            }));
            const spyApiGet = jest.spyOn(network, 'apiGet');
            const result = yield network.getOwnedAbars(randomizedPubKey, testConfig);
            const { response } = result;
            expect(result).toHaveProperty('response');
            expect(result).not.toHaveProperty('error');
            expect(response).toEqual(myResponse);
            expect(spyApiGet).toHaveBeenCalledWith(url, testConfig);
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const result = yield network.getOwnedAbars(randomizedPubKey, testConfig);
            expect(result).not.toHaveProperty('response');
            expect(result).toHaveProperty('error');
        }));
    });
    describe('getAbarMemos', () => {
        const startSid = '1';
        const endSid = '4';
        const url = `${hostUrl}:8667/get_abar_memos`;
        it('returns properly formatted data', () => __awaiter(void 0, void 0, void 0, function* () {
            const abarMemoDataResponse = [
                [1, { point: '1', ctext: [1, 2, 3] }],
                [2, { point: '2', ctext: [4, 5, 6] }],
                [3, { point: '3', ctext: [7, 8, 9] }],
                [4, { point: '4', ctext: [10, 11, 12] }],
            ];
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(abarMemoDataResponse));
            }));
            const spyApiGet = jest.spyOn(network, 'apiGet');
            const result = yield network.getAbarMemos(startSid, endSid, testConfig);
            const { response } = result;
            expect(result).toHaveProperty('response');
            expect(result).not.toHaveProperty('error');
            expect(response).toEqual(abarMemoDataResponse);
            expect(spyApiGet).toHaveBeenCalledWith(url, Object.assign(Object.assign({}, testConfig), { params: { start: startSid, end: endSid } }));
        }));
        it('returns an error in case of a user error', () => __awaiter(void 0, void 0, void 0, function* () {
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(404));
            }));
            const dataResult = yield network.getAbarMemos(startSid, endSid, testConfig);
            expect(dataResult).not.toHaveProperty('response');
            expect(dataResult).toHaveProperty('error');
        }));
    });
});
//# sourceMappingURL=network.spec.js.map