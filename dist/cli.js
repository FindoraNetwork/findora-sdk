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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var minimist_1 = __importDefault(require("minimist"));
var api_1 = require("./api");
var Sdk_1 = __importDefault(require("./Sdk"));
var providers_1 = require("./services/cacheStore/providers");
dotenv_1.default.config();
/**
 * Prior to using SDK we have to initialize its environment configuration
 */
var sdkEnv = {
    hostUrl: 'https://dev-qa02.dev.findora.org',
    cacheProvider: providers_1.MemoryCacheProvider,
    cachePath: './cache',
};
Sdk_1.default.init(sdkEnv);
var _b = process.env.PKEY_LOCAL_FAUCET, PKEY_LOCAL_FAUCET = _b === void 0 ? '' : _b;
var COMMANDS = {
    FUND: 'fund',
    CREATE_WALLET: 'createWallet',
    RESTORE_WALLET: 'restoreWallet',
};
var ERROR_MESSAGES = (_a = {},
    _a[COMMANDS.FUND] = 'please run as "yarn cli fund --address=fraXXX --amountToFund=1 "',
    _a[COMMANDS.CREATE_WALLET] = 'please run as "yarn cli createWallet"',
    _a[COMMANDS.RESTORE_WALLET] = "please run as \"yarn cli restoreWallet --mnemonicString='XXX ... ... XXX'\"",
    _a);
var now = function () { return new Date().toLocaleString(); };
var log = function (message) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    console.log("\"" + now() + "\" - " + message, (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '');
};
var showHelp = function () {
    for (var prop in ERROR_MESSAGES) {
        log(ERROR_MESSAGES[prop]);
    }
};
var runFund = function (address, amountToFund) { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, walletInfo, assetCode, transactionBuilder, resultHandle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = PKEY_LOCAL_FAUCET;
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restoreFromPrivateKey(pkey, password)];
            case 1:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 2:
                assetCode = _a.sent();
                return [4 /*yield*/, api_1.Transaction.sendToAddress(walletInfo, address, amountToFund, assetCode)];
            case 3:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, api_1.Transaction.submitTransaction(transactionBuilder)];
            case 4:
                resultHandle = _a.sent();
                log('send fra result handle', resultHandle);
                return [2 /*return*/];
        }
    });
}); };
var runCreateWallet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var password, mm, walletInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                password = '123';
                return [4 /*yield*/, api_1.Keypair.getMnemonic(24)];
            case 1:
                mm = _a.sent();
                log("\uD83D\uDE80 ~ new mnemonic: \"" + mm.join(' ') + "\"");
                return [4 /*yield*/, api_1.Keypair.restoreFromMnemonic(mm, password)];
            case 2:
                walletInfo = _a.sent();
                log('🚀 ~ new wallet info: ', walletInfo);
                return [2 /*return*/];
        }
    });
}); };
var runRestoreWallet = function (mnemonicString) { return __awaiter(void 0, void 0, void 0, function () {
    var password, mm, walletInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                password = '123';
                log("\uD83D\uDE80 ~ mnemonic to be used: \"" + mnemonicString + "\"");
                mm = mnemonicString.split(' ');
                return [4 /*yield*/, api_1.Keypair.restoreFromMnemonic(mm, password)];
            case 1:
                walletInfo = _a.sent();
                log('🚀 ~ restored wallet info: ', walletInfo);
                return [2 /*return*/];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var argv, command, address, amountToFund, mnemonicString;
    return __generator(this, function (_a) {
        argv = (0, minimist_1.default)(process.argv.slice(4));
        command = argv._[0];
        address = argv.address, amountToFund = argv.amountToFund, mnemonicString = argv.mnemonicString;
        if (!command) {
            showHelp();
            return [2 /*return*/];
        }
        switch (command) {
            case COMMANDS.FUND:
                if (!address) {
                    log(ERROR_MESSAGES[COMMANDS.FUND]);
                    break;
                }
                runFund(address, amountToFund);
                break;
            case COMMANDS.CREATE_WALLET:
                runCreateWallet();
                break;
            case COMMANDS.RESTORE_WALLET:
                if (!mnemonicString) {
                    log(ERROR_MESSAGES[COMMANDS.RESTORE_WALLET]);
                    break;
                }
                runRestoreWallet(mnemonicString);
                break;
            default:
                showHelp();
        }
        return [2 /*return*/];
    });
}); };
main();
//# sourceMappingURL=cli.js.map