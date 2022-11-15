"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractBytecode = exports.contractInterface = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var solc_1 = __importDefault(require("solc"));
var contractName = 'Lottery';
var contractPath = path_1.default.resolve(__dirname, './', "".concat(contractName, ".sol"));
var source = fs_1.default.readFileSync(contractPath, 'utf8');
var result = solc_1.default.compile(source, 1).contracts[":".concat(contractName)];
exports.contractInterface = result.interface;
exports.contractBytecode = result.bytecode;
//# sourceMappingURL=compile.js.map