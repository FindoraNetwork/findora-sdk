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
exports.s3awsCacheProvider = void 0;
var s3_1 = __importDefault(require("aws-sdk/clients/s3"));
var dotenv_1 = __importDefault(require("dotenv"));
var json_bigint_1 = __importDefault(require("json-bigint"));
dotenv_1.default.config();
var _a = process.env, MY_AWS_ACCESS_KEY_ID = _a.MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY = _a.MY_AWS_SECRET_ACCESS_KEY, UTXO_CACHE_BUCKET_NAME = _a.UTXO_CACHE_BUCKET_NAME, UTXO_CACHE_KEY_NAME = _a.UTXO_CACHE_KEY_NAME;
var accessKeyId = MY_AWS_ACCESS_KEY_ID || '';
var secretAccessKey = MY_AWS_SECRET_ACCESS_KEY || '';
var cacheBucketName = UTXO_CACHE_BUCKET_NAME || '';
var s3Params = {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
};
var s3 = new s3_1.default(s3Params);
var readCache = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var fileContent, cacheData, readRes, err_1, e;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cacheData = {};
                console.log("Reading s3 cache from \"" + cacheBucketName + "/" + filePath + "\"");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, s3
                        .getObject({
                        Bucket: cacheBucketName,
                        Key: filePath,
                    })
                        .promise()];
            case 2:
                readRes = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                console.log("File doesnt exist at \"" + cacheBucketName + "/" + filePath + "\", so returning default cache data", err_1);
                return [2 /*return*/, cacheData];
            case 4:
                fileContent = (_a = readRes === null || readRes === void 0 ? void 0 : readRes.Body) === null || _a === void 0 ? void 0 : _a.toString();
                if (!fileContent) {
                    throw new Error("could not read file \"" + filePath + "\".s3 response body is empty");
                }
                try {
                    cacheData = (0, json_bigint_1.default)({ useNativeBigInt: true }).parse(fileContent);
                }
                catch (error) {
                    e = error;
                    throw new Error("could not read parse cache data from  \"" + fileContent + "\". Error. " + e.message + " ");
                }
                return [2 /*return*/, cacheData];
        }
    });
}); };
var writeCache = function (filePath, data) { return __awaiter(void 0, void 0, void 0, function () {
    var result, cacheData, e, error_1, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Writing s3 cache to \"" + cacheBucketName + "/" + filePath + "\"");
                try {
                    cacheData = (0, json_bigint_1.default)({ useNativeBigInt: true }).stringify(data);
                }
                catch (error) {
                    e = error;
                    throw new Error("can not stringify data for cache, \"" + e.message + "\"");
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, s3
                        .putObject({
                        Bucket: cacheBucketName,
                        Key: filePath,
                        Body: cacheData,
                    })
                        .promise()];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                e = error_1;
                throw new Error("can not write s3 cache for \"" + filePath + "\", \"" + e.message + "\"");
            case 4:
                if (result) {
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
        }
    });
}); };
exports.s3awsCacheProvider = {
    read: readCache,
    write: writeCache,
};
//# sourceMappingURL=s3awsCacheProvider.js.map