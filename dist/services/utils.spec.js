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
const fs_1 = __importDefault(require("fs"));
const Utils = __importStar(require("./utils"));
describe('utils (unit test)', () => {
    describe('uint8arrayToHexStr', () => {
        it('converts Uint8Array to hex string', () => {
            const myInput = new Uint8Array([1, 2, 3]);
            const result = Utils.uint8arrayToHexStr(myInput);
            expect(result).toBe('010203');
        });
    });
    describe('writeFile', () => {
        const filePath = 'pathFoo';
        const cacheData = 'barCache';
        it('throws an error if fs.WriteFile fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyWriteFile = jest.spyOn(fs_1.default, 'writeFile');
            const errorMsg = 'foobar';
            const myWriteFile = (_path, _data, _options, callback) => {
                callback(new Error(errorMsg));
            };
            spyWriteFile.mockImplementation(myWriteFile);
            yield expect(Utils.writeFile(filePath, cacheData)).rejects.toThrow(errorMsg);
            expect(spyWriteFile).toHaveBeenCalled();
            spyWriteFile.mockRestore();
        }));
        it('writes a file', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyWriteFile = jest.spyOn(fs_1.default, 'writeFile');
            const myWriteFile = (_path, _data, _options, callback) => {
                callback(null);
            };
            spyWriteFile.mockImplementation(myWriteFile);
            const result = yield Utils.writeFile(filePath, cacheData);
            expect(spyWriteFile).toHaveBeenCalled();
            expect(result).toBe(true);
            spyWriteFile.mockRestore();
        }));
    });
    describe('readFile', () => {
        const filePath = 'pathFoo';
        const cacheData = 'barCache';
        it('throws an error if fs.readFile fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyReadFile = jest.spyOn(fs_1.default, 'readFile');
            const errorMsg = 'foobar';
            const myReadFile = (_path, _options, callback) => {
                callback(new Error(errorMsg), cacheData);
            };
            spyReadFile.mockImplementation(myReadFile);
            yield expect(Utils.readFile(filePath)).rejects.toThrow(errorMsg);
            expect(spyReadFile).toHaveBeenCalled();
            spyReadFile.mockRestore();
        }));
        it('reads a file', () => __awaiter(void 0, void 0, void 0, function* () {
            const spyReadFile = jest.spyOn(fs_1.default, 'readFile');
            const myReadFile = (_path, _options, callback) => {
                callback(null, cacheData);
            };
            spyReadFile.mockImplementation(myReadFile);
            const result = yield Utils.readFile(filePath);
            expect(spyReadFile).toHaveBeenCalled();
            expect(result).toBe(cacheData);
            spyReadFile.mockRestore();
        }));
    });
    describe('createCacheDir', () => {
        it('creates a directory', () => {
            const dirPath = 'foobar';
            const myMkdirSync = (_path, _options) => {
                return dirPath;
            };
            const spyMkdirSync = jest
                .spyOn(fs_1.default, 'mkdirSync')
                .mockImplementation(myMkdirSync);
            const result = Utils.createCacheDir(dirPath);
            expect(result).toBe(dirPath);
            expect(spyMkdirSync).toHaveBeenCalledWith(dirPath, { recursive: true });
        });
    });
});
//# sourceMappingURL=utils.spec.js.map