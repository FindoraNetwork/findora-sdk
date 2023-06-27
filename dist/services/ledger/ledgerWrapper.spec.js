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
const NodeLedger = __importStar(require("./nodeLedger"));
const WebLedger = __importStar(require("./webLedger"));
const LedgerWrapper = __importStar(require("./ledgerWrapper"));
const myWebLedger = { foo: 'web' };
const myNodeLedger = { foo: 'node' };
describe('ledgerWrapper (unit test)', () => {
    describe('getWebLedger', () => {
        it('returns a web ledger', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyGetLedger = jest.spyOn(WebLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myWebLedger);
            });
            const result = yield LedgerWrapper.getWebLedger();
            expect(result).toBe(myWebLedger);
            spyGetLedger.mockReset();
        }));
    });
    describe('getNodeLedger', () => {
        it('returns a node ledger', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyGetLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myNodeLedger);
            });
            const result = yield LedgerWrapper.getNodeLedger();
            expect(result).toBe(myNodeLedger);
            spyGetLedger.mockReset();
        }));
    });
    describe('getLedger', () => {
        it('returns a web ledger for web env', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyIsItNodeEnv = jest.spyOn(LedgerWrapper, 'isItNodeEnv').mockImplementation(() => {
                return false;
            });
            const spyGetWebLedger = jest.spyOn(WebLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myWebLedger);
            });
            const spyGetNodeLedger = jest.spyOn(NodeLedger, 'default');
            const result = yield LedgerWrapper.getLedger();
            expect(result).toBe(myWebLedger);
            expect(spyGetWebLedger).toBeCalled();
            expect(spyGetNodeLedger).not.toBeCalled();
            spyIsItNodeEnv.mockReset();
            spyGetWebLedger.mockReset();
            spyGetNodeLedger.mockReset();
        }));
        it('returns a node ledger for node env', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyIsItNodeEnv = jest.spyOn(LedgerWrapper, 'isItNodeEnv').mockImplementation(() => {
                return true;
            });
            const spyGetWebLedger = jest.spyOn(WebLedger, 'default');
            const spyGetNodeLedger = jest.spyOn(NodeLedger, 'default').mockImplementation(() => {
                return Promise.resolve(myNodeLedger);
            });
            const result = yield LedgerWrapper.getLedger();
            expect(result).toBe(myNodeLedger);
            expect(spyGetWebLedger).not.toBeCalled();
            expect(spyGetNodeLedger).toBeCalled();
            spyIsItNodeEnv.mockReset();
            spyGetWebLedger.mockReset();
            spyGetNodeLedger.mockReset();
        }));
    });
});
//# sourceMappingURL=ledgerWrapper.spec.js.map