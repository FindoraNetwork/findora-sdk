"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractBytecode = exports.contractInterface = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const solc_1 = __importDefault(require("solc"));
const contractName = 'Lottery';
const contractPath = path_1.default.resolve(__dirname, './', `${contractName}.sol`);
const source = fs_1.default.readFileSync(contractPath, 'utf8');
const result = solc_1.default.compile(source, 1).contracts[`:${contractName}`];
exports.contractInterface = result.interface;
exports.contractBytecode = result.bytecode;
//# sourceMappingURL=compile.js.map