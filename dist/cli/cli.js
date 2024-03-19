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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var minimist_1 = __importDefault(require("minimist"));
var Sdk_1 = __importDefault(require("../Sdk"));
var providers_1 = require("../services/cacheStore/providers");
var utils_1 = require("../services/utils");
var CliCommands = __importStar(require("./commands"));
/**
 * Prior to using SDK we have to initialize its environment configuration
 */
var sdkEnv = {
    // hostUrl: 'https://prod-mainnet.prod.findora.org',
    // hostUrl: 'https://dev-mainnetmock.dev.findora.org',
    hostUrl: 'https://prod-testnet.prod.findora.org',
    // hostUrl: 'https://dev-qa02.dev.findora.org',
    // hostUrl: 'http://127.0.0.1',
    cacheProvider: providers_1.MemoryCacheProvider,
    blockScanerUrl: 'https://foo.bar',
    cachePath: './cache',
    brc20url: 'https://api-testnet.brc20.findora.org',
};
Sdk_1.default.init(sdkEnv);
var COMMANDS = {
    FUND: 'fund',
    CREATE_WALLET: 'createWallet',
    RESTORE_WALLET: 'restoreWallet',
    BATCH_SEND_ERC20: 'batchSendErc20',
    BATCH_SEND_FRA: 'batchSendFra',
    CREATE_AND_SAVE_WALLETS: 'createAndSaveWallets',
    CREATE_BUY_FILE_FROM_WALLETS: 'createBuyFileFromWallets',
    CREATE_FUND_FILE_FROM_WALLETS: 'createFundFileFromWallets',
    COLLECT_FUNDS_FROM_WALLETS: 'collectFundsFromWallets',
    GET_BALANCE_FROM_WALLETS: 'getBalanceFromWallets',
    BATCH_DEPLOY_TICKET: 'batchDeployTicket',
    BATCH_MINT_TICKET: 'batchMintTicket',
    BATCH_ADD_LIST: 'batchAddList',
    BATCH_BUY_TICKET: 'batchBuyTicket',
    BATCH_TRANSFER_TICKET: 'batchTransferTicket',
};
var ERROR_MESSAGES = (_a = {},
    _a[COMMANDS.FUND] = 'please run as "yarn cli fund --address=fraXXX --amountToFund=1 "',
    _a[COMMANDS.CREATE_WALLET] = 'please run as "yarn cli createWallet"',
    _a[COMMANDS.RESTORE_WALLET] = "please run as \"yarn cli restoreWallet --mnemonicString='XXX ... ... XXX'\"",
    _a[COMMANDS.BATCH_SEND_ERC20] = "please run as \"yarn cli batchSendErc20 --filePath=\"./file.csv\"",
    _a[COMMANDS.BATCH_SEND_FRA] = "please run as \"yarn cli batchSendFra --privateKey=XXX --filePath=\"./fileFra.csv\"",
    _a[COMMANDS.CREATE_AND_SAVE_WALLETS] = "please run as \"yarn cli createAndSaveWallets --numberOfWallets=10 [--generateFundFile=true] [--amountToFund=5] --filePath=\"./yourWalletsFile.json\"",
    _a[COMMANDS.CREATE_BUY_FILE_FROM_WALLETS] = "please run as \"yarn cli createBuyFileFromWallets --tick=ole6 --totalFraToSpend=1000 --maxAmtToBuy=100 --filePath=\"./yourWalletsFile.json\"",
    _a[COMMANDS.CREATE_FUND_FILE_FROM_WALLETS] = "please run as \"yarn cli createFundFileFromWallets --amountToFund=100 --filePath=\"./yourWalletsFile.json\"",
    _a[COMMANDS.COLLECT_FUNDS_FROM_WALLETS] = "please run as \"yarn cli collectFundsFromWallets --privateKey=XXX --filePath=\"./yourWalletsFile.json\"",
    _a[COMMANDS.GET_BALANCE_FROM_WALLETS] = "please run as \"yarn cli getBalanceFromWallets --filePath=\"./yourWalletsFile.json\"",
    _a[COMMANDS.BATCH_DEPLOY_TICKET] = "please run as \"yarn cli batchDeployTicket --privateKey=XXX --filePath=\"./fileDeployTicket.csv\"",
    _a[COMMANDS.BATCH_MINT_TICKET] = "please run as \"yarn cli batchMintTicket --privateKey=XXX --filePath=\"./fileMintTicket.csv\"",
    _a[COMMANDS.BATCH_ADD_LIST] = "please run as \"yarn cli batchAddList --repeatTimes=XXX --waitBetweenRepeatMinutes=X --filePath=\"./fileAddList.csv\"",
    _a[COMMANDS.BATCH_BUY_TICKET] = "please run as \"yarn cli batchBuyTicket --repeatTimes=XXX --waitBetweenRepeatMinutes=X --filePath=\"./fileBuyTicket.csv\"",
    _a[COMMANDS.BATCH_TRANSFER_TICKET] = "please run as \"yarn cli batchTransferTicket  --filePath=\"./fileTransferTicket.csv\"",
    _a);
var showHelp = function () {
    for (var prop in ERROR_MESSAGES) {
        (0, utils_1.log)(ERROR_MESSAGES[prop]);
    }
};
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var argv, command, address, amountToFund, mnemonicString, filePath, privateKey, numberOfWallets, repeatTimes, waitBetweenRepeatMinutes, generateFundFile, tick, totalFraToSpend, maxAmtToBuy;
    return __generator(this, function (_a) {
        argv = (0, minimist_1.default)(process.argv.slice(4));
        command = argv._[0];
        address = argv.address, amountToFund = argv.amountToFund, mnemonicString = argv.mnemonicString, filePath = argv.filePath, privateKey = argv.privateKey, numberOfWallets = argv.numberOfWallets, repeatTimes = argv.repeatTimes, waitBetweenRepeatMinutes = argv.waitBetweenRepeatMinutes, generateFundFile = argv.generateFundFile, tick = argv.tick, totalFraToSpend = argv.totalFraToSpend, maxAmtToBuy = argv.maxAmtToBuy;
        if (!command) {
            showHelp();
            return [2 /*return*/];
        }
        switch (command) {
            case COMMANDS.FUND:
                if (!address || !amountToFund) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.FUND]);
                    break;
                }
                CliCommands.runFund(address, amountToFund);
                break;
            case COMMANDS.CREATE_WALLET:
                CliCommands.runCreateWallet();
                break;
            case COMMANDS.RESTORE_WALLET:
                if (!mnemonicString) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.RESTORE_WALLET]);
                    break;
                }
                CliCommands.runRestoreWallet(mnemonicString);
                break;
            case COMMANDS.BATCH_SEND_ERC20:
                if (!filePath) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.BATCH_SEND_ERC20]);
                    break;
                }
                CliCommands.runBatchSendERC20(filePath);
                break;
            case COMMANDS.BATCH_SEND_FRA:
                if (!filePath) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.BATCH_SEND_FRA]);
                    break;
                }
                CliCommands.runBatchSendFra(filePath, privateKey, 12);
                break;
            case COMMANDS.CREATE_AND_SAVE_WALLETS:
                if (!numberOfWallets || !filePath) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.CREATE_AND_SAVE_WALLETS]);
                    break;
                }
                CliCommands.runCreateAndSaveWallets(filePath, numberOfWallets, generateFundFile, amountToFund);
                break;
            case COMMANDS.BATCH_DEPLOY_TICKET:
                if (!filePath) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.BATCH_DEPLOY_TICKET]);
                    break;
                }
                CliCommands.runBatchDeployTicket(filePath, privateKey);
                break;
            case COMMANDS.BATCH_MINT_TICKET:
                if (!filePath) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.BATCH_MINT_TICKET]);
                    break;
                }
                CliCommands.runBatchMintTicket(filePath, privateKey);
                break;
            case COMMANDS.BATCH_ADD_LIST:
                if (!filePath) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.BATCH_ADD_LIST]);
                    break;
                }
                CliCommands.runBatchAddList(filePath, +"".concat(repeatTimes), +waitBetweenRepeatMinutes);
                break;
            case COMMANDS.BATCH_BUY_TICKET:
                if (!filePath || !waitBetweenRepeatMinutes || !repeatTimes) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.BATCH_BUY_TICKET]);
                    break;
                }
                CliCommands.runBatchBuyTicket(filePath, +"".concat(repeatTimes), +waitBetweenRepeatMinutes);
                break;
            case COMMANDS.BATCH_TRANSFER_TICKET:
                if (!filePath) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.BATCH_TRANSFER_TICKET]);
                    break;
                }
                CliCommands.runBatchTransferTicket(filePath);
                break;
            case COMMANDS.CREATE_BUY_FILE_FROM_WALLETS:
                if (!filePath || !tick || !totalFraToSpend || !maxAmtToBuy) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.CREATE_BUY_FILE_FROM_WALLETS]);
                    break;
                }
                CliCommands.runCreateBuyFileFromeWallets(filePath, tick.trim(), +"".concat(totalFraToSpend), +"".concat(maxAmtToBuy));
                break;
            case COMMANDS.CREATE_FUND_FILE_FROM_WALLETS:
                if (!filePath || !amountToFund) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.CREATE_FUND_FILE_FROM_WALLETS]);
                    break;
                }
                CliCommands.runCreateFundFileFromeWallets(filePath, +"".concat(amountToFund));
                break;
            case COMMANDS.COLLECT_FUNDS_FROM_WALLETS:
                if (!filePath || !privateKey) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.COLLECT_FUNDS_FROM_WALLETS]);
                    break;
                }
                CliCommands.runCollectFundsFromWallets(filePath, privateKey.trim());
                break;
            case COMMANDS.GET_BALANCE_FROM_WALLETS:
                if (!filePath) {
                    (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.GET_BALANCE_FROM_WALLETS]);
                    break;
                }
                CliCommands.runGetBalanceFromWallets(filePath);
                break;
            default:
                (0, utils_1.log)("\n\nIt seems you have provided an unsupported command \n \"".concat(command, "\" \n"));
                showHelp();
        }
        return [2 /*return*/];
    });
}); };
main();
//# sourceMappingURL=cli.js.map