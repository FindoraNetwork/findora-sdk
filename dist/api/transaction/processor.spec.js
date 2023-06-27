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
const helpers = __importStar(require("./helpers"));
const OperationProcessors = __importStar(require("./operationProcessors"));
const Processor = __importStar(require("./processor"));
describe('processor (unit test)', () => {
    const myTime = 'foo';
    const hash = 'barfoo';
    const code = 'foobar';
    const processedDataByProcessor = { barfoo: 'foobar' };
    const dataProcessor = () => __awaiter(void 0, void 0, void 0, function* () {
        return processedDataByProcessor;
    });
    const operationsList = [{ a: '1' }];
    const txItem = {
        foo: 'bar',
        tx: 'eyJ0eEZvbyI6InR4QmFyIn0=',
        hash,
        tx_result: {
            code,
        },
    };
    describe('processTxInfoItem', () => {
        it('properly processes a given txItem', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyGetBlockTime = jest.spyOn(helpers, 'getBlockTime').mockImplementation(() => {
                return Promise.resolve(myTime);
            });
            const spyGetTxOperationsList = jest
                .spyOn(helpers, 'getTxOperationsList')
                .mockImplementation((_) => {
                return operationsList;
            });
            const spyGetOperationProcessor = jest
                .spyOn(OperationProcessors, 'getOperationProcessor')
                .mockImplementation(() => {
                return dataProcessor;
            });
            const processedData = yield Processor.processTxInfoItem(txItem);
            expect(processedData).toHaveProperty('code');
            expect(processedData).toHaveProperty('data');
            expect(processedData).toHaveProperty('hash');
            expect(processedData).toHaveProperty('time');
            expect(processedData.code).toEqual(code);
            expect(processedData.hash).toEqual(hash);
            expect(processedData.time).toEqual(myTime);
            expect(processedData.data).toHaveLength(1);
            expect(processedData.data).toEqual([Object.assign(Object.assign({}, processedDataByProcessor), txItem)]);
            spyGetBlockTime.mockReset();
            spyGetTxOperationsList.mockReset();
            spyGetOperationProcessor.mockReset();
        }));
        it('throws an error if tx in the txItem can not be parsed', () => __awaiter(void 0, void 0, void 0, function* () {
            const txItem = {
                foo: 'bar',
                tx: 'blah',
                hash,
                tx_result: {
                    code,
                },
            };
            yield expect(Processor.processTxInfoItem(txItem)).rejects.toThrowError('Can not parse the tx info from the tx item');
        }));
    });
    describe('processeTxInfoList', () => {
        it('properly processes a given txItem', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyGetBlockTime = jest.spyOn(helpers, 'getBlockTime').mockImplementation(() => {
                return Promise.resolve(myTime);
            });
            const spyGetTxOperationsList = jest
                .spyOn(helpers, 'getTxOperationsList')
                .mockImplementation((_) => {
                return operationsList;
            });
            const spyGetOperationProcessor = jest
                .spyOn(OperationProcessors, 'getOperationProcessor')
                .mockImplementation(() => {
                return dataProcessor;
            });
            const processedDataList = yield Processor.processeTxInfoList([txItem]);
            expect(processedDataList).toHaveLength(1);
            const [processedData] = processedDataList;
            expect(processedData).toHaveProperty('code');
            expect(processedData).toHaveProperty('data');
            expect(processedData).toHaveProperty('hash');
            expect(processedData).toHaveProperty('time');
            expect(processedData.code).toEqual(code);
            expect(processedData.hash).toEqual(hash);
            expect(processedData.time).toEqual(myTime);
            expect(processedData.data).toHaveLength(1);
            expect(processedData.data).toEqual([Object.assign(Object.assign({}, processedDataByProcessor), txItem)]);
            spyGetBlockTime.mockReset();
            spyGetTxOperationsList.mockReset();
            spyGetOperationProcessor.mockReset();
        }));
    });
});
//# sourceMappingURL=processor.spec.js.map