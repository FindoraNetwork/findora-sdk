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
const msw_1 = require("msw");
const node_1 = require("msw/node");
const Keypair = __importStar(require("../../api/keypair/keypair"));
const NetworkApi = __importStar(require("../../api/network/network"));
const SdkAssetApi = __importStar(require("../../api/sdkAsset/sdkAsset"));
const Sdk_1 = __importDefault(require("../../Sdk"));
const bigNumber = __importStar(require("../../services/bigNumber"));
const providers_1 = require("../../services/cacheStore/providers");
const utxoHelper = __importStar(require("../../services/utxoHelper"));
const Account = __importStar(require("./account"));
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
describe('account (unit test)', () => {
    const pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
    const password = '123';
    const sids = [454];
    const hostUrl = 'https://foo.bar';
    const sdkEnv = {
        hostUrl,
        cacheProvider: providers_1.MemoryCacheProvider,
        blockScanerUrl: 'https://foo.bar',
        cachePath: '.',
    };
    Sdk_1.default.init(sdkEnv);
    const nonConfidentialAssetType = {
        NonConfidential: [
            164, 219, 150, 105, 103, 223, 148, 3, 154, 18, 158, 146, 195, 186, 148, 245, 191, 206, 45, 215, 251,
            136, 179, 245, 227, 140, 98, 176, 190, 60, 175, 224,
        ],
    };
    const myUtxoRecord = {
        amount: { NonConfidential: '40000' },
        asset_type: nonConfidentialAssetType,
        public_key: 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=',
    };
    const myUtxo = {
        id: 1,
        record: myUtxoRecord,
    };
    const myUtxoDataList = [
        {
            sid: 4,
            public_key: 'foo',
            address: 'bar',
            body: {
                asset_type: 'myAssetCode',
                amount: 200000,
            },
            ownerMemo: undefined,
            memoData: undefined,
            utxo: myUtxo,
        },
        {
            sid: 1,
            public_key: 'foo',
            address: 'bar',
            body: {
                asset_type: 'myAssetCodeTwo',
                amount: 10,
            },
            ownerMemo: undefined,
            memoData: undefined,
            utxo: myUtxo,
        },
        {
            sid: 2,
            public_key: 'foo',
            address: 'bar',
            body: {
                asset_type: 'myAssetCode',
                amount: 1,
            },
            ownerMemo: undefined,
            memoData: undefined,
            utxo: myUtxo,
        },
        {
            sid: 3,
            public_key: 'foo',
            address: 'bar',
            body: {
                asset_type: 'myAssetCodeTwo',
                amount: 13,
            },
            ownerMemo: undefined,
            memoData: undefined,
            utxo: myUtxo,
        },
    ];
    describe('getAssetBalance', () => {
        it('returns asset balance for first code', () => __awaiter(void 0, void 0, void 0, function* () {
            const walletInfo = yield Keypair.restoreFromPrivateKey(pkey, password);
            const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
            spyAddUtxo.mockReturnValue(Promise.resolve(myUtxoDataList));
            const balanceInWei = yield Account.getAssetBalance(walletInfo, 'myAssetCode', sids);
            const balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);
            expect(balance).toEqual('0.200001');
        }));
        it('returns asset balance for second code', () => __awaiter(void 0, void 0, void 0, function* () {
            const walletInfo = yield Keypair.restoreFromPrivateKey(pkey, password);
            const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
            spyAddUtxo.mockReturnValue(Promise.resolve(myUtxoDataList));
            const balanceInWei = yield Account.getAssetBalance(walletInfo, 'myAssetCodeTwo', sids);
            const balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);
            expect(balance).toEqual('0.000023');
        }));
        it('returns asset balance if no sid with the given code exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const walletInfo = yield Keypair.restoreFromPrivateKey(pkey, password);
            const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
            spyAddUtxo.mockReturnValue(Promise.resolve(myUtxoDataList));
            const balanceInWei = yield Account.getAssetBalance(walletInfo, 'nonExistingCode', sids);
            const balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);
            expect(balance).toEqual('0.000000');
        }));
        it('returns asset balance if sids list is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            const walletInfo = yield Keypair.restoreFromPrivateKey(pkey, password);
            const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
            spyAddUtxo.mockReturnValue(Promise.resolve([]));
            const balanceInWei = yield Account.getAssetBalance(walletInfo, 'nonExistingCode', []);
            const balance = bigNumber.fromWei(balanceInWei, 6).toFormat(6);
            expect(balance).toEqual('0.000000');
        }));
        it('throws an error when could not get utxoDataList', () => __awaiter(void 0, void 0, void 0, function* () {
            const walletInfo = yield Keypair.restoreFromPrivateKey(pkey, password);
            const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
            spyAddUtxo.mockReturnValue(Promise.reject(new Error('foo')));
            yield expect(Account.getAssetBalance(walletInfo, 'nonExistingCode', [])).rejects.toThrowError('Could not get list of addUtxo');
        }));
    });
    describe('getBalance', () => {
        it('returns asset balance for first code', () => __awaiter(void 0, void 0, void 0, function* () {
            const walletInfo = yield Keypair.restoreFromPrivateKey(pkey, password);
            const url = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(sids));
            }));
            const spyAddUtxo = jest.spyOn(utxoHelper, 'addUtxo');
            spyAddUtxo.mockReturnValueOnce(Promise.resolve(myUtxoDataList));
            const balance = yield Account.getBalance(walletInfo, 'myAssetCode');
            expect(balance).toEqual('0.200001');
        }));
        it('throws an error when no sids were fetched', () => __awaiter(void 0, void 0, void 0, function* () {
            const walletInfo = yield Keypair.restoreFromPrivateKey(pkey, password);
            const url = `${hostUrl}:8667/get_owned_utxos/${walletInfo.publickey}`;
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.status(500));
            }));
            yield expect(Account.getBalance(walletInfo, 'myAssetCode')).rejects.toThrowError('No sids were fetched');
        }));
        it('throws an error when getAssetBalance throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const walletInfo = yield Keypair.restoreFromPrivateKey(pkey, password);
            const publickey = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk=';
            const url = `${hostUrl}:8667/get_owned_utxos/${publickey}`;
            server.use(msw_1.rest.get(url, (_req, res, ctx) => {
                return res(ctx.json(sids));
            }));
            const spyAddUtxo = jest.spyOn(Account, 'getAssetBalance');
            spyAddUtxo.mockImplementation(() => {
                throw new Error('boo');
            });
            yield expect(Account.getBalance(walletInfo, 'myAssetCode')).rejects.toThrowError('Could not fetch balance for');
        }));
    });
    describe('create', () => {
        it('creates a keypair', () => __awaiter(void 0, void 0, void 0, function* () {
            const myFakeKeyPair = { foo: 'bar' };
            const spyCreateKeypair = jest.spyOn(Keypair, 'createKeypair');
            spyCreateKeypair.mockImplementation(() => {
                return Promise.resolve(myFakeKeyPair);
            });
            const result = yield Account.create('123');
            expect(result).toBe(myFakeKeyPair);
            spyCreateKeypair.mockRestore();
        }));
        it('throws an error if it can not create a keypair', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyCreateKeypair = jest.spyOn(Keypair, 'createKeypair');
            spyCreateKeypair.mockImplementation(() => {
                throw new Error('abc boom');
            });
            yield expect(Account.create('123')).rejects.toThrow('Could not create a new account');
            spyCreateKeypair.mockRestore();
        }));
    });
    describe('processIssuedRecordItem', () => {
        it('processes an issued record item', () => __awaiter(void 0, void 0, void 0, function* () {
            const myAssetCodeHere = 'abcd';
            const spyGetAssetCode = jest.spyOn(SdkAssetApi, 'getAssetCode');
            spyGetAssetCode.mockImplementation(() => {
                return Promise.resolve(myAssetCodeHere);
            });
            const txRecord = {
                foo: 'bar',
                record: {
                    asset_type: { NonConfidential: '123' },
                },
            };
            const ownerMemo = 'myOwnerMemo';
            const issuedRecord = [txRecord, ownerMemo];
            const result = yield Account.processIssuedRecordItem(issuedRecord);
            const expected = Object.assign(Object.assign({}, txRecord), { code: myAssetCodeHere, ownerMemo });
            expect(result).toStrictEqual(expected);
        }));
    });
    describe('processIssuedRecordList', () => {
        it('processes an issued record item', () => __awaiter(void 0, void 0, void 0, function* () {
            const myAssetCodeHere = 'abcd';
            const spyGetAssetCode = jest.spyOn(SdkAssetApi, 'getAssetCode');
            spyGetAssetCode.mockImplementation(() => {
                return Promise.resolve(myAssetCodeHere);
            });
            const txRecord = {
                foo: 'bar',
                record: {
                    asset_type: { NonConfidential: '123' },
                },
            };
            const ownerMemo = 'myOwnerMemo';
            const issuedRecord = [txRecord, ownerMemo];
            const result = yield Account.processIssuedRecordList([issuedRecord]);
            const expected = Object.assign(Object.assign({}, txRecord), { code: myAssetCodeHere, ownerMemo });
            expect(result).toStrictEqual([expected]);
        }));
    });
    describe('getCreatedAssets', () => {
        it('returns a list of created assets', () => __awaiter(void 0, void 0, void 0, function* () {
            const publickey = 'myPublickey';
            const address = 'myAddress';
            const myLightWallet = {
                address,
                publickey,
            };
            const spyGetAddressPublicAndKey = jest.spyOn(Keypair, 'getAddressPublicAndKey');
            spyGetAddressPublicAndKey.mockImplementation(() => {
                return Promise.resolve(myLightWallet);
            });
            const recordsResponse = { foo: 'bar' };
            const myIssuedRecordResult = {
                response: recordsResponse,
            };
            const spyGetIssuedRecords = jest.spyOn(NetworkApi, 'getIssuedRecords');
            spyGetIssuedRecords.mockImplementation(() => {
                return Promise.resolve(myIssuedRecordResult);
            });
            const processedIssuedRecordsList = [
                {
                    bar: 'foo',
                },
            ];
            const spyProcessIssuedRecordList = jest.spyOn(Account, 'processIssuedRecordList');
            spyProcessIssuedRecordList.mockImplementation(() => {
                return Promise.resolve(processedIssuedRecordsList);
            });
            const result = yield Account.getCreatedAssets(address);
            expect(result).toBe(processedIssuedRecordsList);
            spyGetAddressPublicAndKey.mockRestore();
            spyGetIssuedRecords.mockRestore();
            spyProcessIssuedRecordList.mockRestore();
        }));
        it('throws an error if it could not get a list of issued records', () => __awaiter(void 0, void 0, void 0, function* () {
            const publickey = 'myPublickey';
            const address = 'myAddress';
            const myLightWallet = {
                address,
                publickey,
            };
            const spyGetAddressPublicAndKey = jest.spyOn(Keypair, 'getAddressPublicAndKey');
            spyGetAddressPublicAndKey.mockImplementation(() => {
                return Promise.resolve(myLightWallet);
            });
            const spyGetIssuedRecords = jest.spyOn(NetworkApi, 'getIssuedRecords');
            spyGetIssuedRecords.mockImplementation(() => {
                throw new Error('boom');
            });
            yield expect(Account.getCreatedAssets(address)).rejects.toThrow('boom');
            spyGetAddressPublicAndKey.mockRestore();
            spyGetIssuedRecords.mockRestore();
        }));
        it('throws an error if there is an error in the issued records result', () => __awaiter(void 0, void 0, void 0, function* () {
            const publickey = 'myPublickey';
            const address = 'myAddress';
            const myLightWallet = {
                address,
                publickey,
            };
            const spyGetAddressPublicAndKey = jest.spyOn(Keypair, 'getAddressPublicAndKey');
            spyGetAddressPublicAndKey.mockImplementation(() => {
                return Promise.resolve(myLightWallet);
            });
            const myIssuedRecordResult = {
                error: new Error('gimps'),
            };
            const spyGetIssuedRecords = jest.spyOn(NetworkApi, 'getIssuedRecords');
            spyGetIssuedRecords.mockImplementation(() => {
                return Promise.resolve(myIssuedRecordResult);
            });
            yield expect(Account.getCreatedAssets(address)).rejects.toThrow('No issued records were fetched');
            spyGetAddressPublicAndKey.mockRestore();
            spyGetIssuedRecords.mockRestore();
        }));
        it('throws an error if there is no response in the issued records result', () => __awaiter(void 0, void 0, void 0, function* () {
            const publickey = 'myPublickey';
            const address = 'myAddress';
            const myLightWallet = {
                address,
                publickey,
            };
            const spyGetAddressPublicAndKey = jest.spyOn(Keypair, 'getAddressPublicAndKey');
            spyGetAddressPublicAndKey.mockImplementation(() => {
                return Promise.resolve(myLightWallet);
            });
            const myIssuedRecordResult = {};
            const spyGetIssuedRecords = jest.spyOn(NetworkApi, 'getIssuedRecords');
            spyGetIssuedRecords.mockImplementation(() => {
                return Promise.resolve(myIssuedRecordResult);
            });
            yield expect(Account.getCreatedAssets(address)).rejects.toThrow('No issued records were fetched');
            spyGetAddressPublicAndKey.mockRestore();
            spyGetIssuedRecords.mockRestore();
        }));
    });
    describe('getRelatedSids', () => {
        it('returns a list of related sids', () => __awaiter(void 0, void 0, void 0, function* () {
            const address = 'myAddress';
            const relatedSids = [1, 2, 3];
            const myResult = { response: relatedSids };
            const spyGetRelatedSids = jest.spyOn(NetworkApi, 'getRelatedSids');
            spyGetRelatedSids.mockImplementation(() => {
                return Promise.resolve(myResult);
            });
            const result = yield Account.getRelatedSids(address);
            expect(result).toBe(relatedSids);
            spyGetRelatedSids.mockRestore();
        }));
        it('throws an error if no related sids were fetched', () => __awaiter(void 0, void 0, void 0, function* () {
            const address = 'myAddress';
            const myResult = {};
            const spyGetRelatedSids = jest.spyOn(NetworkApi, 'getRelatedSids');
            spyGetRelatedSids.mockImplementation(() => {
                return Promise.resolve(myResult);
            });
            yield expect(Account.getRelatedSids(address)).rejects.toThrow('No related sids were fetched');
            spyGetRelatedSids.mockRestore();
        }));
    });
});
//# sourceMappingURL=account.spec.js.map