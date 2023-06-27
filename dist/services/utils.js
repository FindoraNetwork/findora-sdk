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
exports.delay = exports.wait = exports.getRandomNumber = exports.generateSeedString = exports.getCryptoInstance = exports.log = exports.now = exports.createCacheDir = exports.readFile = exports.writeFile = exports.uint8arrayToHexStr = void 0;
const fs_1 = __importDefault(require("fs"));
const crypto = require('crypto');
// NOTE - did log for console output - use -> console.dir(result, { depth: null, colors: true, maxArrayLength: null });
const uint8arrayToHexStr = (input) => Buffer.from(input).toString('hex');
exports.uint8arrayToHexStr = uint8arrayToHexStr;
const writeFile = (filePath, cacheData) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        fs_1.default.writeFile(filePath, cacheData, 'utf8', err => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
});
exports.writeFile = writeFile;
const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
};
exports.readFile = readFile;
const createCacheDir = (dirPath) => {
    return fs_1.default.mkdirSync(dirPath, { recursive: true });
};
exports.createCacheDir = createCacheDir;
const now = () => new Date().toLocaleString();
exports.now = now;
const log = (message, ...rest) => {
    console.log(`"${(0, exports.now)()}" - ${message}`, (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '');
};
exports.log = log;
const getCryptoInstance = () => {
    if (!global.window) {
        return crypto.webcrypto;
    }
    return window.crypto;
};
exports.getCryptoInstance = getCryptoInstance;
const generateSeedString = () => {
    let seed = '';
    const randomVals = new Uint8Array(32);
    const myCrypto = (0, exports.getCryptoInstance)();
    myCrypto.getRandomValues(randomVals);
    randomVals.forEach(num => {
        const hex = num.toString(16);
        seed += hex.length === 1 ? `0${hex}` : hex;
    });
    return seed;
};
exports.generateSeedString = generateSeedString;
const getRandomNumber = (min = 1, max = 10) => Math.floor(Math.random() * (max - min + 1)) + min;
exports.getRandomNumber = getRandomNumber;
function wait(fn, ms) {
    return __awaiter(this, void 0, void 0, function* () {
        while (!(yield fn())) {
            yield delay(ms);
        }
    });
}
exports.wait = wait;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.delay = delay;
//# sourceMappingURL=utils.js.map