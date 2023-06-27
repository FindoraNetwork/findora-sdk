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
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
const KeypairApi = __importStar(require("../../keypair/keypair"));
const AssetApi = __importStar(require("../../sdkAsset/sdkAsset"));
const issueAsset_1 = require("./issueAsset");
describe('issueAsset (processor) (unit test)', () => {
    describe('processIssueAsset', () => {
        it('returns properly processed data', () => __awaiter(void 0, void 0, void 0, function* () {
            const address = 'barfoo';
            const code = 'foobar';
            const type = 'issueAsset';
            const myAsset = {
                code: {
                    val: code,
                },
            };
            const myOperation = {
                body: myAsset,
                pubkey: {
                    key: 'foofoo',
                },
            };
            const payload = {
                IssueAsset: myOperation,
            };
            const spyGetAddressByPublicKey = jest
                .spyOn(KeypairApi, 'getAddressByPublicKey')
                .mockImplementation(() => {
                return Promise.resolve(address);
            });
            const spyGetAssetCode = jest.spyOn(AssetApi, 'getAssetCode').mockImplementation(() => {
                return Promise.resolve(code);
            });
            const result = yield (0, issueAsset_1.processIssueAsset)(payload);
            expect(result).toHaveProperty('issueAsset');
            expect(result).toHaveProperty('from');
            expect(result).toHaveProperty('to');
            expect(result).toHaveProperty('type');
            expect(result).toHaveProperty('originalOperation');
            expect(result.issueAsset).toEqual(Object.assign(Object.assign({}, myOperation), { code }));
            expect(result.from).toEqual([address]);
            expect(result.to).toEqual([address]);
            expect(result.type).toEqual(type);
            expect(result.originalOperation).toBe(payload);
            expect(Object.keys(result)).toHaveLength(5);
            spyGetAddressByPublicKey.mockRestore();
            spyGetAssetCode.mockRestore();
        }));
    });
});
//# sourceMappingURL=issueAsset.spec.js.map