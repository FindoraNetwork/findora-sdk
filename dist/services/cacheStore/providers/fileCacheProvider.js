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
exports.fileCacheProvider = void 0;
const fs_1 = __importDefault(require("fs"));
const json_bigint_1 = __importDefault(require("json-bigint"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../../utils");
const readCache = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    let fileContent;
    let cacheData = {};
    console.log(`Reading file cache from "${filePath}"`);
    try {
        if (!fs_1.default.existsSync(filePath)) {
            return cacheData;
        }
    }
    catch (err) {
        console.log(`File doesnt exist at "${filePath}", so returning default cache data`, err);
        return cacheData;
    }
    try {
        fileContent = yield (0, utils_1.readFile)(filePath);
    }
    catch (error) {
        throw new Error(`could not read file "${filePath}". Error. ${error.message} `);
    }
    try {
        cacheData = (0, json_bigint_1.default)({ useNativeBigInt: true }).parse(fileContent);
    }
    catch (error) {
        throw new Error(`could not read parse cache data from  "${fileContent}". Error. ${error.message} `);
    }
    return cacheData;
});
const writeCache = (filePath, data) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    let cacheData;
    console.log(`Writing file cache to "${filePath}"`);
    try {
        cacheData = (0, json_bigint_1.default)({ useNativeBigInt: true }).stringify(data);
    }
    catch (err) {
        throw new Error(`can not stringify data for cache, "${err.message}"`);
    }
    try {
        (0, utils_1.createCacheDir)(path_1.default.parse(filePath).dir);
    }
    catch (err) {
        throw new Error(`Failed to create directory, "${err.message}", "dir path: ${path_1.default.parse(filePath).dir}"`);
    }
    try {
        result = yield (0, utils_1.writeFile)(filePath, cacheData);
    }
    catch (error) {
        throw new Error(`can not write cache for "${filePath}", "${error.message}"`);
    }
    return result;
});
exports.fileCacheProvider = {
    read: readCache,
    write: writeCache,
};
//# sourceMappingURL=fileCacheProvider.js.map