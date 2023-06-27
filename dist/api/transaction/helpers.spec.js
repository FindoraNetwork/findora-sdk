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
const NetworkApi = __importStar(require("../network/network"));
const helpers = __importStar(require("./helpers"));
describe('helpers (unit test)', () => {
    describe('getTxListFromResponse', () => {
        it('returns proper list from the data result', () => {
            const txList = [{ foo: 'bar' }];
            const payload = {
                response: {
                    result: {
                        txs: txList,
                    },
                },
            };
            const result = helpers.getTxListFromResponse(payload);
            expect(result).toBe(txList);
        });
        it('returns null from data result if tx list is no found', () => {
            const payload = {
                bar: 'foo',
            };
            const result = helpers.getTxListFromResponse(payload);
            expect(result).toBe(null);
        });
    });
    describe('getTxOperationsList', () => {
        it('returns proper list from the parsed tx', () => {
            const txList = [{ foo: 'bar' }];
            const payload = {
                body: {
                    operations: txList,
                },
            };
            const result = helpers.getTxOperationsList(payload);
            expect(result).toBe(txList);
        });
        it('returns an empty array from parsed tx if operations are notfound', () => {
            const payload = {
                bar: 'foo',
            };
            const result = helpers.getTxOperationsList(payload);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
    });
    describe('getBlockTime', () => {
        it('returns proper time from the block', () => __awaiter(void 0, void 0, void 0, function* () {
            const height = 1;
            const block = {
                block: {
                    header: {
                        time: 'footime',
                    },
                },
            };
            const spyGetBlock = jest.spyOn(NetworkApi, 'getBlock').mockImplementation(() => {
                return Promise.resolve({
                    response: {
                        result: block,
                    },
                });
            });
            const result = yield helpers.getBlockTime(height);
            expect(result).toEqual('footime');
            spyGetBlock.mockRestore();
        }));
        it('returns undefined if time is not found in the block', () => __awaiter(void 0, void 0, void 0, function* () {
            const height = 1;
            const block = {
                bar: 'foo',
            };
            const spyGetBlock = jest.spyOn(NetworkApi, 'getBlock').mockImplementation(() => {
                return Promise.resolve({
                    response: {
                        result: block,
                    },
                });
            });
            const result = yield helpers.getBlockTime(height);
            spyGetBlock.mockRestore();
            expect(result).toEqual(undefined);
        }));
    });
});
//# sourceMappingURL=helpers.spec.js.map