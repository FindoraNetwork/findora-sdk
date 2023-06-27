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
const transferAsset_1 = require("./transferAsset");
describe('transferAsset (processor) (unit test)', () => {
    describe('processTransferAsset', () => {
        it('returns properly processed data', () => __awaiter(void 0, void 0, void 0, function* () {
            const addressFrom = 'barfooFrom';
            const addressTo = 'barfooToo';
            const type = 'transferAsset';
            const transfer = {
                inputs: [{ public_key: 'b1' }],
                outputs: [{ public_key: 'b2' }],
            };
            const myOperation = {
                body: {
                    transfer,
                },
            };
            const payload = {
                TransferAsset: myOperation,
            };
            const spyGetAddressByPublicKey = jest
                .spyOn(KeypairApi, 'getAddressByPublicKey')
                .mockImplementationOnce(() => {
                return Promise.resolve(addressFrom);
            })
                .mockImplementationOnce(() => {
                return Promise.resolve(addressTo);
            });
            const result = yield (0, transferAsset_1.processTransferAsset)(payload);
            expect(result).toHaveProperty('transferAsset');
            expect(result).toHaveProperty('from');
            expect(result).toHaveProperty('to');
            expect(result).toHaveProperty('type');
            expect(result).toHaveProperty('originalOperation');
            expect(result.transferAsset).toEqual(myOperation);
            expect(result.from).toEqual([addressFrom]);
            expect(result.to).toEqual([addressTo]);
            expect(result.type).toEqual(type);
            expect(result.originalOperation).toBe(payload);
            expect(Object.keys(result)).toHaveLength(5);
            spyGetAddressByPublicKey.mockRestore();
        }));
    });
});
//# sourceMappingURL=transferAsset.spec.js.map