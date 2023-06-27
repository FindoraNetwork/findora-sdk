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
const minimist_1 = __importDefault(require("minimist"));
const Sdk_1 = __importDefault(require("../Sdk"));
const providers_1 = require("../services/cacheStore/providers");
const utils_1 = require("../services/utils");
const CliCommands = __importStar(require("./commands"));
/**
 * Prior to using SDK we have to initialize its environment configuration
 */
const sdkEnv = {
    // hostUrl: 'https://prod-mainnet.prod.findora.org',
    // hostUrl: 'https://dev-mainnetmock.dev.findora.org',
    // hostUrl: 'https://prod-testnet.prod.findora.org', // anvil balance!
    // hostUrl: 'https://dev-qa01.dev.findora.org',
    // hostUrl: 'https://dev-qa02.dev.findora.org',
    hostUrl: 'http://127.0.0.1',
    // hostUrl: 'http://54.213.254.47',
    cacheProvider: providers_1.MemoryCacheProvider,
    blockScanerUrl: 'https://foo.bar',
    cachePath: './cache',
};
Sdk_1.default.init(sdkEnv);
const COMMANDS = {
    FUND: 'fund',
    CREATE_WALLET: 'createWallet',
    RESTORE_WALLET: 'restoreWallet',
    BATCH_SEND_ERC20: 'batchSendErc20',
    BATCH_SEND_FRA: 'batchSendFra',
    CREATE_AND_SAVE_WALLETS: 'createAndSaveWallets',
};
const ERROR_MESSAGES = {
    [COMMANDS.FUND]: 'please run as "yarn cli fund --address=fraXXX --amountToFund=1 "',
    [COMMANDS.CREATE_WALLET]: 'please run as "yarn cli createWallet"',
    [COMMANDS.RESTORE_WALLET]: `please run as "yarn cli restoreWallet --mnemonicString='XXX ... ... XXX'"`,
    [COMMANDS.BATCH_SEND_ERC20]: `please run as "yarn cli batchSendErc20 --filePath="./file.csv"`,
    [COMMANDS.BATCH_SEND_FRA]: `please run as "yarn cli batchSendFra --privateKey=XXX --filePath="./fileFra.csv"`,
    [COMMANDS.CREATE_AND_SAVE_WALLETS]: `please run as "yarn cli createAndSaveWallets --numberOfWallets=10`,
};
const showHelp = () => {
    for (const prop in ERROR_MESSAGES) {
        (0, utils_1.log)(ERROR_MESSAGES[prop]);
    }
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const argv = (0, minimist_1.default)(process.argv.slice(4));
    const [command] = argv._;
    const { address, amountToFund, mnemonicString, filePath, privateKey, numberOfWallets } = argv;
    if (!command) {
        showHelp();
        return;
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
            if (!numberOfWallets) {
                (0, utils_1.log)(ERROR_MESSAGES[COMMANDS.CREATE_AND_SAVE_WALLETS]);
                break;
            }
            CliCommands.runCreateAndSaveWallets(numberOfWallets);
            break;
        default:
            showHelp();
    }
});
main();
//# sourceMappingURL=cli.js.map