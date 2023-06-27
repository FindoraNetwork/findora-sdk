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
exports.getLedger = exports.getNodeLedger = exports.getWebLedger = exports.isItNodeEnv = void 0;
const nodeLedger_1 = __importDefault(require("./nodeLedger"));
const webLedger_1 = __importDefault(require("./webLedger"));
let isInitNoah = false;
const isItNodeEnv = () => typeof process !== 'undefined' && process.release.name === 'node';
exports.isItNodeEnv = isItNodeEnv;
const getWebLedger = () => __awaiter(void 0, void 0, void 0, function* () {
    const myLedger = yield (0, webLedger_1.default)();
    return myLedger;
});
exports.getWebLedger = getWebLedger;
const getNodeLedger = () => __awaiter(void 0, void 0, void 0, function* () {
    const myLedger = yield (0, nodeLedger_1.default)();
    return myLedger;
});
exports.getNodeLedger = getNodeLedger;
const getLedger = () => __awaiter(void 0, void 0, void 0, function* () {
    const isNodeEnv = (0, exports.isItNodeEnv)();
    const myLedger = yield (isNodeEnv ? (0, exports.getNodeLedger)() : (0, exports.getWebLedger)());
    if (!isInitNoah) {
        yield myLedger.init_noah();
        isInitNoah = true;
    }
    return myLedger;
});
exports.getLedger = getLedger;
//# sourceMappingURL=ledgerWrapper.js.map