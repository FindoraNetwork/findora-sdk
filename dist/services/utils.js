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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.wait = exports.getRandomNumber = exports.generateSeedString = exports.getCryptoInstance = exports.log = exports.now = exports.createCacheDir = exports.readFile = exports.writeFile = exports.uint8arrayToHexStr = void 0;
var fs_1 = __importDefault(require("fs"));
var crypto = require('crypto');
var uint8arrayToHexStr = function (input) { return Buffer.from(input).toString('hex'); };
exports.uint8arrayToHexStr = uint8arrayToHexStr;
var writeFile = function (filePath, cacheData) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                fs_1.default.writeFile(filePath, cacheData, 'utf8', function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
            })];
    });
}); };
exports.writeFile = writeFile;
var readFile = function (filePath) {
    return new Promise(function (resolve, reject) {
        fs_1.default.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
};
exports.readFile = readFile;
var createCacheDir = function (dirPath) {
    return fs_1.default.mkdirSync(dirPath, { recursive: true });
};
exports.createCacheDir = createCacheDir;
var now = function () { return new Date().toLocaleString(); };
exports.now = now;
var log = function (message) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    console.log("\"" + (0, exports.now)() + "\" - " + message, (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '');
};
exports.log = log;
var getCryptoInstance = function () {
    if (!global.window) {
        return crypto.webcrypto;
    }
    return window.crypto;
};
exports.getCryptoInstance = getCryptoInstance;
var generateSeedString = function () {
    var seed = '';
    var randomVals = new Uint8Array(32);
    var myCrypto = (0, exports.getCryptoInstance)();
    myCrypto.getRandomValues(randomVals);
    randomVals.forEach(function (num) {
        var hex = num.toString(16);
        seed += hex.length === 1 ? "0" + hex : hex;
    });
    return seed;
};
exports.generateSeedString = generateSeedString;
var getRandomNumber = function (min, max) {
    if (min === void 0) { min = 1; }
    if (max === void 0) { max = 10; }
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getRandomNumber = getRandomNumber;
function wait(fn, ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fn()];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 3];
                    return [4 /*yield*/, delay(ms)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.wait = wait;
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.delay = delay;
//# sourceMappingURL=utils.js.map