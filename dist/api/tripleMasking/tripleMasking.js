"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitmentByAtxoSid = exports.decryptAbarMemo = exports.getNullifierHashesFromCommitments = exports.abarToBarAmount = exports.getAbarToBarAmountPayload = exports.abarToBar = exports.abarToAbarAmount = exports.abarToAbar = exports.getAbarToAbarAmountPayload = exports.getTotalAbarTransferFee = exports.getSendAtxo = exports.getAbarTransferFee = exports.prepareAnonTransferOperationBuilder = exports.barToAbar = exports.barToAbarAmount = exports.getAllAbarBalances = exports.getSpentBalance = exports.getBalance = exports.getUnspentAbars = exports.getAbarBalance = exports.getBalanceMaps = exports.getSpentAbars = exports.getOwnedAbars = exports.genNullifierHash = exports.isNullifierHashSpent = exports.openAbar = exports.getAnonKeypairFromJson = exports.getAbarOwnerMemo = exports.genAnonKeys = void 0;
var testHelpers_1 = require("../../evm/testHelpers");
var bigNumber_1 = require("../../services/bigNumber");
var fee_1 = require("../../services/fee");
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var utils_1 = require("../../services/utils");
var utxoHelper_1 = require("../../services/utxoHelper");
var Keypair = __importStar(require("../keypair"));
var Network = __importStar(require("../network"));
var Asset = __importStar(require("../sdkAsset"));
var Transaction = __importStar(require("../transaction"));
var Builder = __importStar(require("../transaction/builder"));
var DEFAULT_BLOCKS_TO_WAIT_AFTER_ABAR = 3;
/**
 * The `genAnonKeys` function is an asynchronous function that generates anonymous wallet key pairs.
 * It uses the `Keypair` module to generate a mnemonic phrase and restore a wallet key pair
 * from the generated mnemonic.
 *
 * @remarks
 * The `WalletKeypair` interface represents a pair of keys for a wallet and has the following structure:
 *
 * @remarks
 * The function internally uses the `Keypair` module, which should be imported and available in the module where this function is used.
 *
 * @remarks
 * The `Keypair.getMnemonic` and `Keypair.restoreFromMnemonic` functions are assumed to be defined within the `Keypair` module. These functions are used to generate a mnemonic and restore a wallet key pair from the mnemonic, respectively.
 *
 * @remarks
 * The `Keypair.getMnemonic` function creates a new mnemonic phrase with a given length (in this example, it is 24).
 *
 * @remarks
 * The `Keypair.restoreFromMnemonic` function is used to restore a wallet key pair from the generated mnemonic.
 *
 * @remarks
 * The string `'passwordfoo'` passed as the second argument to `Keypair.restoreFromMnemonic` is a placeholder and should be replaced with the actual password or passphrase for restoring the wallet key pair.
 *
 * @example
 * ```typescript
 * interface WalletKeypair {
 *   publicKey: string;
 *   privateKey: string;
 * }
 * ```
 *
 * ```typescript
 * import { genAnonKeys } from './your-module';
 *
 * async function generateAnonymousKeys() {
 *   try {
 *     const walletKeys = await genAnonKeys();
 *     console.log('Public Key:', walletKeys.publickey);
 *     console.log('Private Key:', walletKeys.privateStr);
 *   } catch (error) {
 *     console.error('Error generating anonymous keys:', error);
 *   }
 * }
 *
 * generateAnonymousKeys();
 * ```
 *
 * @returns The function returns a promise that resolves to a `WalletKeypair` object.
 */
var genAnonKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mm, walletInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Keypair.getMnemonic(24)];
            case 1:
                mm = _a.sent();
                return [4 /*yield*/, Keypair.restoreFromMnemonic(mm, 'passwordfoo')];
            case 2:
                walletInfo = _a.sent();
                return [2 /*return*/, walletInfo];
        }
    });
}); };
exports.genAnonKeys = genAnonKeys;
/**
 * Retrieves the ABAR object from its JSON representation.
 * The function decodes the JSON data using the ledger imported from the WebAssembly module.
 *
 * @param {FindoraWallet.OwnedAbar} ownedAbar - The JSON representation of the owned ABAR.
 * @returns {Promise<any>} - The ABAR object.
 * @throws {Error} - If an error occurs while decoding the ABAR data.
 *
 * @example
 * import { FindoraWallet } from 'your-library';
 *
 * const ownedAbar: FindoraWallet.OwnedAbar = {
 *   // JSON representation of the owned ABAR
 * };
 *
 * try {
 *   const myOwnedAbar = await getAbarFromJson(ownedAbar);
 *
 *   // Use the myOwnedAbar object in further operations
 *
 * } catch (error) {
 *   console.error('An error occurred while retrieving the ABAR from JSON:', error);
 * }
 */
var getAbarFromJson = function (ownedAbar) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, myOwnedAbar;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                try {
                    myOwnedAbar = ledger.abar_from_json(ownedAbar);
                }
                catch (error) {
                    throw new Error("Could not decode myOwnedAbar data\", Error - ".concat(error));
                }
                return [2 /*return*/, myOwnedAbar];
        }
    });
}); };
/**
 * The `getAbarOwnerMemo` function is an asynchronous function that retrieves the abar owner memo data for a given atxoSid.
 *
 * @param atxoSid - The atxoSid for which to fetch the abar owner memo data.
 *
 * @remarks
 * This function depends on the external `ledger` module, which should be imported from the wasm module and available in the module where this function is used.
 * It also relies on the `Network` module, which should be imported separately and accessible in the module.
 *
 * @remarks
 * The `abarOwnerMemo` is returned as an instance of `AxfrOwnerMemo`.
 *
 * @remarks
 * Ensure that the `ledger` module is imported from the wasm module and the `Network` module is imported separately. Replace `"atxoSid123456"` in the example with the actual atxoSid for which you want to fetch the abar owner memo data.
 *
 * @example
 * ```typescript
 * const atxoSid = "atxoSid123456";
 *
 * try {
 *   const abarOwnerMemo = await getAbarOwnerMemo(atxoSid);
 *
 *   console.log("Abar Owner Memo:");
 *   console.log(abarOwnerMemo);
 * } catch (error) {
 *   console.error("Error fetching abar owner memo data:", error);
 * }
 * ```
 *
 * @returns A promise that resolves to an instance of `AxfrOwnerMemo` representing the abar owner memo data.
 *
 * @throws Throws an error if there is a failure in fetching or decoding the abar memo data.
 */
var getAbarOwnerMemo = function (atxoSid) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, abarOwnerMemoResult, myMemoData, memoError, abarOwnerMemo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, Network.getAbarOwnerMemo(atxoSid)];
            case 2:
                abarOwnerMemoResult = _a.sent();
                myMemoData = abarOwnerMemoResult.response, memoError = abarOwnerMemoResult.error;
                if (memoError) {
                    throw new Error("Could not fetch abar memo data for sid \"".concat(atxoSid, "\", Error - ").concat(memoError.message));
                }
                try {
                    abarOwnerMemo = ledger.AxfrOwnerMemo.from_json(myMemoData);
                }
                catch (error) {
                    throw new Error("Could not get decode abar memo data\", Error - ".concat(error.message));
                }
                return [2 /*return*/, abarOwnerMemo];
        }
    });
}); };
exports.getAbarOwnerMemo = getAbarOwnerMemo;
/**
 * Retrieves the MTLeafInfo object associated with the given ATXO SID.
 * The function fetches the MTLeafInfo data from the network and decodes it using the ledger imported from the WebAssembly module.
 * Note: This function is not exported and is intended for internal use within the module.
 *
 * @param {string} atxoSid - The ATXO SID for which to retrieve the MTLeafInfo.
 * @returns {Promise<MTLeafInfo>} - The MTLeafInfo object.
 * @throws {Error} - If an error occurs while fetching or decoding the MTLeafInfo data.
 *
 * @remarks
 * - This function internally fetches the MTLeafInfo data from the network using the `Network.getMTLeafInfo` function.
 * - It requires the imported ledger from the WebAssembly module to decode the MTLeafInfo data.
 * - The function throws an error if the fetched data is empty or if there is an error during decoding.
 * - Use this function when you need to retrieve the MTLeafInfo object for a specific ATXO SID within the module.
 *
 * @example
 * ```typescript
 * // Internal use within the module
 * const atxoSid = 'abcde12345';
 *
 * try {
 *   const myMTLeafInfo = await getMyMTLeafInfo(atxoSid);
 *
 *   // Use the myMTLeafInfo object for further operations within the module
 *
 * } catch (error) {
 *   console.error('An error occurred while retrieving the MTLeafInfo:', error);
 * }
 * ```
 */
var getMyMTLeafInfo = function (atxoSid) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, mTLeafInfoResult, mTLeafInfo, mTLeafInfoError, myMTLeafInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, Network.getMTLeafInfo(atxoSid)];
            case 2:
                mTLeafInfoResult = _a.sent();
                mTLeafInfo = mTLeafInfoResult.response, mTLeafInfoError = mTLeafInfoResult.error;
                if (mTLeafInfoError) {
                    throw new Error("Could not fetch mTLeafInfo data for sid \"".concat(atxoSid, "\", Error - ").concat(mTLeafInfoError.message));
                }
                if (!mTLeafInfo) {
                    throw new Error("Could not fetch mTLeafInfo data for sid \"".concat(atxoSid, "\", Error - mTLeafInfo is empty"));
                }
                try {
                    myMTLeafInfo = ledger.MTLeafInfo.from_json(mTLeafInfo);
                }
                catch (error) {
                    throw new Error("Could not decode myMTLeafInfo data\", Error - ".concat(error.message));
                }
                return [2 /*return*/, myMTLeafInfo];
        }
    });
}); };
/**
 * The `getAnonKeypairFromJson` function is an asynchronous function that converts a WalletKeypar object from JSON format to AnonKeyPair format.
 *
 * @param anonKeys - An object of type `WalletKeypar` containing the wallet's public key and private key in JSON format.
 *
 * @remarks
 * This function depends on the external `Keypair` module, which should be imported and available in the module where this function is used.
 *
 * @example
 * ```typescript
 * const anonKeys = {
 *   publickey: "base64publickey",
 *   privateStr: "base64privatekey",
 * };
 *
 * try {
 *   const anonKeyPair = await getAnonKeypairFromJson(anonKeys);
 *
 *   console.log("Converted AnonKeyPair:");
 *   console.log("Axfr Secret Key:", anonKeyPair.aXfrSecretKeyConverted);
 *   console.log("Axfr Public Key:", anonKeyPair.axfrPublicKeyConverted);
 * } catch (error) {
 *   console.error("Error converting AnonKeyPair from JSON:", error);
 * }
 * ```
 *
 * @returns A promise that resolves to an object containing the converted Axfr Secret Key and Axfr Public Key.
 */
var getAnonKeypairFromJson = function (anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var aXfrSecretKeyConverted, axfrPublicKeyConverted, publickey, privateStr, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publickey = anonKeys.publickey, privateStr = anonKeys.privateStr;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Keypair.getXfrPrivateKeyByBase64(privateStr)];
            case 2:
                aXfrSecretKeyConverted = _a.sent();
                return [4 /*yield*/, Keypair.getXfrPublicKeyByBase64(publickey)];
            case 3:
                axfrPublicKeyConverted = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                throw new Error("Could not convert AnonKeyPair from JSON\", Error - ".concat(error_1.message));
            case 5: return [2 /*return*/, {
                    aXfrSecretKeyConverted: aXfrSecretKeyConverted,
                    axfrPublicKeyConverted: axfrPublicKeyConverted,
                }];
        }
    });
}); };
exports.getAnonKeypairFromJson = getAnonKeypairFromJson;
/**
 * The `openAbar` function opens (decrypts) an owned Abar item.
 *
 * @param abar - The owned Abar item to open.
 * @param anonKeys - The wallet keypair used for decryption.
 *
 * @returns A promise that resolves to an object containing the opened Abar information.
 *
 * @throws An error if there was an issue opening the Abar or retrieving the required information.
 *
 * @remarks
 * The `openAbar` function takes an owned Abar item and a wallet keypair as input.
 * It decrypts the owned Abar item using the provided keypair and retrieves additional information required for the decryption process.
 * The function returns an object containing the opened Abar information, including the decrypted amount, asset type, and the opened Abar itself.
 *
 * Example usage:
 * ```typescript
 * const abar = {
 *   abarData: {
 *     atxoSid: '0xabcdef1234567890',
 *     ownedAbar: 'encrypted-abar-data',
 *   },
 * };
 *
 * const anonKeys = {
 *   publickey: 'anon-public-key',
 *   privateStr: 'anon-private-key',
 * };
 *
 * try {
 *   const openedAbar = await openAbar(abar, anonKeys);
 *   console.log(openedAbar);
 *   // {
 *   //   amount: '100',
 *   //   assetType: 'ABC',
 *   //   abar: // opened Abar object
 *   // }
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
var openAbar = function (abar, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, abarData, atxoSid, ownedAbar, myOwnedAbar, abarOwnerMemo, myMTLeafInfo, axfrSpendKey, openedAbar, amount, asset_type, assetCode, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                abarData = abar.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, getAbarFromJson(ownedAbar)];
            case 2:
                myOwnedAbar = _a.sent();
                return [4 /*yield*/, (0, exports.getAbarOwnerMemo)(atxoSid)];
            case 3:
                abarOwnerMemo = _a.sent();
                return [4 /*yield*/, getMyMTLeafInfo(atxoSid)];
            case 4:
                myMTLeafInfo = _a.sent();
                return [4 /*yield*/, (0, exports.getAnonKeypairFromJson)(anonKeys)];
            case 5:
                axfrSpendKey = (_a.sent()).aXfrSecretKeyConverted;
                openedAbar = ledger.get_open_abar(myOwnedAbar, abarOwnerMemo, axfrSpendKey, myMTLeafInfo);
                amount = openedAbar.amount, asset_type = openedAbar.asset_type;
                assetCode = ledger.asset_type_from_jsvalue(asset_type);
                item = {
                    amount: amount,
                    assetType: assetCode,
                    abar: openedAbar,
                };
                return [2 /*return*/, item];
        }
    });
}); };
exports.openAbar = openAbar;
/**
 * The `isNullifierHashSpent` function checks if a given nullifier hash is spent.
 *
 * @param hash - The nullifier hash to check.
 *
 * @returns A promise that resolves to a boolean indicating if the nullifier hash is spent (`true`) or not spent (`false`).
 *
 * @throws An error if there was an issue checking the nullifier hash spent status.
 *
 * @remarks
 * The `isNullifierHashSpent` function uses the given nullifier hash to check if it is spent. It calls the network's `checkNullifierHashSpent` function and retrieves the response indicating if the hash is spent or not.
 * The function handles error scenarios and returns a boolean value indicating the spent status of the nullifier hash.
 *
 * Example usage:
 * ```typescript
 * const hash = '0xabcdef1234567890';
 *
 * try {
 *   const isSpent = await isNullifierHashSpent(hash);
 *   console.log(isSpent); // true or false
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
var isNullifierHashSpent = function (hash) { return __awaiter(void 0, void 0, void 0, function () {
    var checkSpentResult, checkSpentResponse, checkSpentError;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Network.checkNullifierHashSpent(hash)];
            case 1:
                checkSpentResult = _a.sent();
                checkSpentResponse = checkSpentResult.response, checkSpentError = checkSpentResult.error;
                if (checkSpentError) {
                    throw new Error("Could not check if hash \"".concat(hash, " is spent\", Error - ").concat(checkSpentError.message));
                }
                if (checkSpentResponse === undefined) {
                    throw new Error("Could not check if hash \"".concat(hash, " is spent\", Error - Response is undefined"));
                }
                return [2 /*return*/, checkSpentResponse];
        }
    });
}); };
exports.isNullifierHashSpent = isNullifierHashSpent;
/**
 * The `genNullifierHash` function is an asynchronous function that generates a nullifier hash for a given set of parameters using zero-knowledge proof functionality.
 *
 * @param atxoSid - The identifier for the atxo (Anonymous Transferable eXtended Output) for which the nullifier hash is generated. It is a positive number in string format.
 * @param ownedAbar - An object representing an OwnedAbar with zero-knowledge proof functionality. It is fetched using a given string called `commitmentHash`.
 * @param axfrSpendKey - The spend key used to create the AxfrOwnerMemo for the `abarOwnerMemo`.
 *
 * @remarks
 * The `ledger` object is imported from the WebAssembly (wasm) module and provides various methods for cryptographic operations.
 *
 * @remarks
 * The function makes use of the zero-knowledge proof functionality to generate the nullifier hash. It performs the following steps:
 * 1. Retrieves the ledger instance using the `getLedger` function.
 * 2. Fetches the abar owner memo data for the given `atxoSid` using the `Network.getAbarOwnerMemo` function.
 * 3. Decodes the abar owner memo data into an `AxfrOwnerMemo` object using the `AxfrOwnerMemo.from_json` method of the `ledger`.
 * 4. Creates a key pair from the `axfrSpendKey` using the `ledger.create_keypair_from_secret` method.
 * 5. Fetches the mTLeafInfo data for the given `atxoSid` using the `Network.getMTLeafInfo` function.
 * 6. Decodes the mTLeafInfo data into an `MTLeafInfo` object using the `MTLeafInfo.from_json` method of the `ledger`.
 * 7. Decodes the `ownedAbar` object into an `Abar` object using the `ledger.abar_from_json` method.
 * 8. Generates the nullifier hash using the `ledger.gen_nullifier_hash` method with the provided parameters.
 * 9. Returns the generated nullifier hash.
 *
 * @remarks
 * This function is used in several scenarios, including but not limited to:
 * - Validating whether a commitment (and its related abar) is spent or not spent.
 *
 * @example
 * ```typescript
 * const atxoSid = "1234";
 * const ownedAbar = // OwnedAbar object
 * const axfrSpendKey = // Spend key
 *
 * try {
 *   const nullifierHash = await genNullifierHash(atxoSid, ownedAbar, axfrSpendKey);
 *   console.log("Nullifier Hash:", nullifierHash);
 * } catch (error) {
 *   console.error("Error generating nullifier hash:", error);
 * }
 * ```
 *
 * @throws Throws an error if any step in the nullifier hash generation process fails.
 *
 * @returns The function returns a promise that resolves to the generated nullifier hash.
 */
var genNullifierHash = function (atxoSid, ownedAbar, axfrSpendKey) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, abarOwnerMemoResult, myMemoData, memoError, abarOwnerMemo, toSend, myXfrKeyPair, mTLeafInfoResult, mTLeafInfo, mTLeafInfoError, myMTLeafInfo, myOwnedAbar, hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, Network.getAbarOwnerMemo(atxoSid)];
            case 2:
                abarOwnerMemoResult = _a.sent();
                myMemoData = abarOwnerMemoResult.response, memoError = abarOwnerMemoResult.error;
                if (memoError) {
                    throw new Error("Could not fetch abar memo data for sid (genNullifierHash) \"".concat(atxoSid, "\", Error - ").concat(memoError.message));
                }
                try {
                    abarOwnerMemo = ledger.AxfrOwnerMemo.from_json(myMemoData);
                }
                catch (error) {
                    console.log('error!', error);
                    throw new Error("Could not get decode abar memo data 1\", Error - ".concat(error.message));
                }
                console.log('axfrSpendKey', axfrSpendKey);
                toSend = "\"".concat(axfrSpendKey, "\"");
                try {
                    myXfrKeyPair = ledger.create_keypair_from_secret(toSend);
                }
                catch (error) {
                    throw new Error("could not restore keypair. details: \"".concat(error, "\""));
                }
                return [4 /*yield*/, Network.getMTLeafInfo(atxoSid)];
            case 3:
                mTLeafInfoResult = _a.sent();
                mTLeafInfo = mTLeafInfoResult.response, mTLeafInfoError = mTLeafInfoResult.error;
                if (mTLeafInfoError) {
                    throw new Error("Could not fetch mTLeafInfo data for sid \"".concat(atxoSid, "\", Error - ").concat(mTLeafInfoError.message));
                }
                if (!mTLeafInfo) {
                    throw new Error("Could not fetch mTLeafInfo data for sid \"".concat(atxoSid, "\", Error - mTLeafInfo is empty"));
                }
                try {
                    myMTLeafInfo = ledger.MTLeafInfo.from_json(mTLeafInfo);
                }
                catch (error) {
                    throw new Error("Could not decode myMTLeafInfo data\", Error - ".concat(error.message));
                }
                try {
                    myOwnedAbar = ledger.abar_from_json(ownedAbar);
                }
                catch (error) {
                    throw new Error("Could not decode myOwnedAbar data\", Error - ".concat(error));
                }
                try {
                    hash = ledger.gen_nullifier_hash(myOwnedAbar, abarOwnerMemo, myXfrKeyPair, myMTLeafInfo);
                    return [2 /*return*/, hash];
                }
                catch (err) {
                    throw new Error("Could not get nullifier hash\", Error - ".concat(err.message));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.genNullifierHash = genNullifierHash;
/**
 * The `getOwnedAbars` function retrieves the owned abars associated with a given commitment.
 *
 * @param givenCommitment - The commitment for which to retrieve the owned abars.
 *
 * @returns A promise that resolves to an array of owned abar items.
 *
 * @throws An error if there was an issue retrieving the owned abars or if the response is missing or invalid.
 *
 * @remarks
 * The `getOwnedAbars` function uses the `Network.getOwnedAbars` function to fetch the owned abars associated with the provided commitment. It handles error scenarios by throwing informative error messages.
 *
 * Example usage:
 * ```typescript
 * const commitment = 'exampleCommitment'; // Commitment value
 *
 * try {
 *   const ownedAbars = await getOwnedAbars(commitment);
 *   console.log(ownedAbars);
 *   // [
 *   //   {
 *   //     commitment: 'exampleCommitment',
 *   //     abarData: {
 *   //       atxoSid: 'atxoSidValue',
 *   //       ownedAbar: // ownedAbar object
 *   //     },
 *   //   },
 *   // ]
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
var getOwnedAbars = function (givenCommitment) { return __awaiter(void 0, void 0, void 0, function () {
    var getOwnedAbarsResponse, ownedAbarsResponse, error, atxoSid, ownedAbar, abar;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Network.getOwnedAbars(givenCommitment)];
            case 1:
                getOwnedAbarsResponse = _a.sent();
                console.log('getOwnedAbars getOwnedAbarsResponse', getOwnedAbarsResponse);
                ownedAbarsResponse = getOwnedAbarsResponse.response, error = getOwnedAbarsResponse.error;
                if (error) {
                    throw new Error(error.message);
                }
                if (ownedAbarsResponse === undefined) {
                    throw new Error('Could not receive response from get ownedAbars call');
                }
                if (!ownedAbarsResponse) {
                    return [2 /*return*/, []];
                }
                atxoSid = ownedAbarsResponse[0], ownedAbar = ownedAbarsResponse[1];
                abar = {
                    commitment: givenCommitment,
                    abarData: {
                        atxoSid: atxoSid,
                        ownedAbar: __assign({}, ownedAbar),
                    },
                };
                return [2 /*return*/, [abar]];
        }
    });
}); };
exports.getOwnedAbars = getOwnedAbars;
/**
 * The `getSpentAbars` function retrieves a list of spent abars (Anonymous Banknote Asset Records) associated with the given commitments and anonymous keys.
 *
 * @param anonKeys - The sender's anonymous keys.
 * @param givenCommitmentsList - The list of commitments associated with the sender's owned abars.
 *
 * @returns A promise that resolves to an array of spent abars.
 *
 * @throws An error if there was an issue retrieving the owned abars or checking the nullifier hash spent status, or if the response is missing or invalid.
 *
 * @remarks
 * The `getSpentAbars` function retrieves the owned abars for each given commitment using the `getOwnedAbars` function. It then checks the nullifier hash spent status for each abar by generating the nullifier hash and using the `isNullifierHashSpent` function. The function handles error scenarios and returns an array of spent abars.
 *
 * Example usage:
 * ```typescript
 * const anonKeys =  // anonymous keys object - Sender's anonymous keys
 * const commitments = ['commitment1', 'commitment2']; // List of commitments
 *
 * try {
 *   const spentAbars = await getSpentAbars(anonKeys, commitments);
 *   console.log(spentAbars);
 *   // [
 *   //   {
 *   //     // spent abar item
 *   //   },
 *   //   {
 *   //     // spent abar item
 *   //   },
 *   // ]
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
var getSpentAbars = function (anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var publickey, privateStr, spentAbars, _i, givenCommitmentsList_1, givenCommitment, ownedAbarsResponse, error_2, ownedAbarItem, abarData, atxoSid, ownedAbar, hash, isAbarSpent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publickey = anonKeys.publickey, privateStr = anonKeys.privateStr;
                spentAbars = [];
                _i = 0, givenCommitmentsList_1 = givenCommitmentsList;
                _a.label = 1;
            case 1:
                if (!(_i < givenCommitmentsList_1.length)) return [3 /*break*/, 9];
                givenCommitment = givenCommitmentsList_1[_i];
                ownedAbarsResponse = [];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 3:
                ownedAbarsResponse = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.log("getOwnedAbars for '".concat(publickey, "'->'").concat(givenCommitment, "' returned an error. ").concat(error_2.message), console.log('Full Error', error_2));
                return [3 /*break*/, 8];
            case 5:
                ownedAbarItem = ownedAbarsResponse[0];
                if (!ownedAbarItem) {
                    return [3 /*break*/, 8];
                }
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, (0, exports.genNullifierHash)(atxoSid, ownedAbar, privateStr)];
            case 6:
                hash = _a.sent();
                return [4 /*yield*/, (0, exports.isNullifierHashSpent)(hash)];
            case 7:
                isAbarSpent = _a.sent();
                if (isAbarSpent) {
                    spentAbars.push(__assign({}, ownedAbarItem));
                }
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 1];
            case 9: return [2 /*return*/, spentAbars];
        }
    });
}); };
exports.getSpentAbars = getSpentAbars;
/**
 * The `getBalanceMaps` function retrieves the balance maps for the provided unspent abars using the given anonymous keys.
 *
 * @param unspentAbars - The array of unspent abars to retrieve the balance maps for.
 * @param anonKeys - The anonymous keys associated with the wallet.
 *
 * @returns An object containing the asset details map, balances map, used assets, and ATXO map.
 *
 * @remarks
 * The `getBalanceMaps` function iterates over each unspent abar in the provided array, opens (decrypts) the abar using the `openAbar` function, and constructs the balance maps. It also retrieves the asset details using the `Asset.getAssetDetails` function and stores them in the asset details map. The `plus` function is used to perform arithmetic operations on the balance amounts, provided by the big number helper.
 *
 * Example usage:
 * ```typescript
 * const unspentAbars: FindoraWallet.OwnedAbarItem[] = [...]; // Array of unspent abars
 * const anonKeys: Keypair.WalletKeypar = ...; // Anonymous keys associated with the wallet
 *
 * const balanceMaps = await getBalanceMaps(unspentAbars, anonKeys);
 *
 * console.log(balanceMaps.assetDetailsMap); // Asset details map containing asset types as keys and asset details as values
 * console.log(balanceMaps.balancesMap); // Balances map containing asset types as keys and balance amounts as values
 * console.log(balanceMaps.usedAssets); // Array of used asset types
 * console.log(balanceMaps.atxoMap); // ATXO map containing asset types as keys and an array of ATXO items as values
 * ```
 */
var getBalanceMaps = function (unspentAbars, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var assetDetailsMap, balancesMap, atxoMap, usedAssets, _i, unspentAbars_1, abar, _a, atxoSid, commitment, openedAbarItem, amount, assetType, asset;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                assetDetailsMap = {};
                balancesMap = {};
                atxoMap = {};
                usedAssets = [];
                _i = 0, unspentAbars_1 = unspentAbars;
                _b.label = 1;
            case 1:
                if (!(_i < unspentAbars_1.length)) return [3 /*break*/, 6];
                abar = unspentAbars_1[_i];
                _a = abar.abarData, atxoSid = _a.atxoSid, commitment = _a.ownedAbar.commitment;
                return [4 /*yield*/, (0, exports.openAbar)(abar, anonKeys)];
            case 2:
                openedAbarItem = _b.sent();
                amount = openedAbarItem.amount, assetType = openedAbarItem.assetType;
                if (!!assetDetailsMap[assetType]) return [3 /*break*/, 4];
                return [4 /*yield*/, Asset.getAssetDetails(assetType)];
            case 3:
                asset = _b.sent();
                usedAssets.push(assetType);
                assetDetailsMap[assetType] = asset;
                _b.label = 4;
            case 4:
                if (!balancesMap[assetType]) {
                    balancesMap[assetType] = '0';
                }
                if (!atxoMap[assetType]) {
                    atxoMap[assetType] = [];
                }
                balancesMap[assetType] = (0, bigNumber_1.plus)(balancesMap[assetType], amount).toString();
                atxoMap[assetType].push({ amount: amount.toString(), assetType: assetType, atxoSid: atxoSid, commitment: commitment });
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, {
                    assetDetailsMap: assetDetailsMap,
                    balancesMap: balancesMap,
                    usedAssets: usedAssets,
                    atxoMap: atxoMap,
                }];
        }
    });
}); };
exports.getBalanceMaps = getBalanceMaps;
/**
 * The `getAbarBalance` function is an asynchronous function that retrieves the balance information for a wallet's owned abars.
 *
 * @param unspentAbars - An array of `OwnedAbarItem` objects representing the unspent abars for the wallet.
 * @param anonKeys - An object of type `WalletKeypar` containing the wallet's public key and private key.
 *
 * @remarks
 * The function internally uses the `getBalanceMaps` helper function to create an object with a list of details related to the balance information.
 * It also utilizes the `fromWei` helper function to convert the balance from a big integer to a human-readable format.
 *
 * @remarks
 * The unspent abars are created using zero-proof functionality and are fetched by providing the commitment hash.
 *
 * @example
 * ```typescript
 * const unspentAbars = [...]; // Array of OwnedAbarItem objects
 * const anonKeys = {
 *   publickey: "...",
 *   privateStr: "...",
 * };
 *
 * try {
 *   const balanceInfo = await getAbarBalance(unspentAbars, anonKeys);
 *
 *   console.log("Public Key:", balanceInfo.publickey);
 *   console.log("Balances:");
 *   for (const balance of balanceInfo.balances) {
 *     console.log("Asset Type:", balance.assetType);
 *     console.log("Amount:", balance.amount);
 *   }
 * } catch (error) {
 *   console.error("Error retrieving abar balance:", error);
 * }
 * ```
 *
 * @returns A promise that resolves to an object of type `AnonWalletBalanceInfo` containing the wallet's public key and an array of `BalanceInfo` objects representing the balances for each asset type.
 */
var getAbarBalance = function (unspentAbars, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var maps, publickey, assetDetailsMap, balancesMap, usedAssets, balances, _i, usedAssets_1, assetType, decimals, amount, balanceInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getBalanceMaps)(unspentAbars, anonKeys)];
            case 1:
                maps = _a.sent();
                publickey = anonKeys.publickey;
                assetDetailsMap = maps.assetDetailsMap, balancesMap = maps.balancesMap, usedAssets = maps.usedAssets;
                balances = [];
                for (_i = 0, usedAssets_1 = usedAssets; _i < usedAssets_1.length; _i++) {
                    assetType = usedAssets_1[_i];
                    decimals = assetDetailsMap[assetType].assetRules.decimals;
                    amount = (0, bigNumber_1.fromWei)(balancesMap[assetType], decimals).toFormat(decimals);
                    balances.push({ assetType: assetType, amount: amount });
                }
                balanceInfo = {
                    publickey: publickey,
                    balances: balances,
                };
                return [2 /*return*/, balanceInfo];
        }
    });
}); };
exports.getAbarBalance = getAbarBalance;
/**
 * The `getUnspentAbars` function retrieves the unspent abars for a given list of commitments using the provided anonymous keys.
 *
 * @param anonKeys - The anonymous keys associated with the wallet.
 * @param givenCommitmentsList - The list of commitments to retrieve unspent abars for.
 *
 * @returns An array of unspent abars.
 *
 * @remarks
 * The `getUnspentAbars` function uses the `getOwnedAbars` function to retrieve the owned abars for each given commitment. It then checks the spending status of each abar and adds the unspent abars to the result array.
 *
 * Example usage:
 * ```typescript
 * const anonKeys: Keypair.WalletKeypar = ...; // Anonymous keys associated with the wallet
 * const givenCommitmentsList: string[] = [...]; // List of commitments
 *
 * const unspentAbars = await getUnspentAbars(anonKeys, givenCommitmentsList);
 *
 * console.log(unspentAbars); // Array of unspent abars
 * ```
 */
var getUnspentAbars = function (anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var publickey, privateStr, unspentAbars, _i, givenCommitmentsList_2, givenCommitment, ownedAbarsResponse, error_3, ownedAbarItem, abarData, atxoSid, ownedAbar, hash, isAbarSpent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publickey = anonKeys.publickey, privateStr = anonKeys.privateStr;
                unspentAbars = [];
                _i = 0, givenCommitmentsList_2 = givenCommitmentsList;
                _a.label = 1;
            case 1:
                if (!(_i < givenCommitmentsList_2.length)) return [3 /*break*/, 9];
                givenCommitment = givenCommitmentsList_2[_i];
                ownedAbarsResponse = [];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 3:
                ownedAbarsResponse = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.log("getOwnedAbars for '".concat(publickey, "'->'").concat(givenCommitment, "' returned an error. ").concat(error_3.message), console.log('Full Error', error_3));
                return [3 /*break*/, 8];
            case 5:
                ownedAbarItem = ownedAbarsResponse[0];
                if (!ownedAbarItem) {
                    return [3 /*break*/, 8];
                }
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, (0, exports.genNullifierHash)(atxoSid, ownedAbar, privateStr)];
            case 6:
                hash = _a.sent();
                return [4 /*yield*/, (0, exports.isNullifierHashSpent)(hash)];
            case 7:
                isAbarSpent = _a.sent();
                if (!isAbarSpent) {
                    unspentAbars.push(__assign({}, ownedAbarItem));
                }
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 1];
            case 9: return [2 /*return*/, unspentAbars];
        }
    });
}); };
exports.getUnspentAbars = getUnspentAbars;
/**
 * The `getBalance` function retrieves the balances of abars for the given commitments using the provided anonymous keys.
 *
 * @param anonKeys - The anonymous keys associated with the wallet.
 * @param givenCommitmentsList - The list of commitments to retrieve the balances for.
 *
 * @returns The balances of abars for the given commitments.
 *
 * @remarks
 * The `getBalance` function calls the `getUnspentAbars` function to retrieve the unspent abars and then calculates the balances using the `getAbarBalance` function.
 *
 * Example usage:
 * ```typescript
 * const anonKeys: Keypair.WalletKeypar = ...; // Anonymous keys associated with the wallet
 * const givenCommitmentsList: string[] = [...]; // List of commitments
 *
 * const balances = await getBalance(anonKeys, givenCommitmentsList);
 *
 * console.log(balances); // Balances of abars for the given commitments
 * ```
 */
var getBalance = function (anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var unspentAbars, balances;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getUnspentAbars)(anonKeys, givenCommitmentsList)];
            case 1:
                unspentAbars = _a.sent();
                return [4 /*yield*/, (0, exports.getAbarBalance)(unspentAbars, anonKeys)];
            case 2:
                balances = _a.sent();
                return [2 /*return*/, balances];
        }
    });
}); };
exports.getBalance = getBalance;
/**
 * The `getSpentBalance` function retrieves the balances of spent abars for the given commitments using the provided anonymous keys.
 *
 * @param anonKeys - The anonymous keys associated with the wallet.
 * @param givenCommitmentsList - The list of commitments to retrieve the balances for.
 *
 * @returns The balances of spent abars for the given commitments.
 *
 * @remarks
 * The `getSpentBalance` function calls the `getSpentAbars` function to retrieve the spent abars and then calculates the balances using the `getAbarBalance` function.
 *
 * Example usage:
 * ```typescript
 * const anonKeys: Keypair.WalletKeypar = ...; // Anonymous keys associated with the wallet
 * const givenCommitmentsList: string[] = [...]; // List of commitments
 *
 * const balances = await getSpentBalance(anonKeys, givenCommitmentsList);
 *
 * console.log(balances); // Balances of spent abars for the given commitments
 * ```
 */
var getSpentBalance = function (anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var unspentAbars, balances;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getSpentAbars)(anonKeys, givenCommitmentsList)];
            case 1:
                unspentAbars = _a.sent();
                return [4 /*yield*/, (0, exports.getAbarBalance)(unspentAbars, anonKeys)];
            case 2:
                balances = _a.sent();
                return [2 /*return*/, balances];
        }
    });
}); };
exports.getSpentBalance = getSpentBalance;
/**
 * The `getAllAbarBalances` function retrieves both spent and unspent balances of abars for the given commitments using the provided anonymous keys.
 *
 * @param anonKeys - The anonymous keys associated with the wallet.
 * @param givenCommitmentsList - The list of commitments to retrieve the balances for.
 *
 * @returns An object containing the spent balances, unspent balances, and the given commitments list.
 *
 * @remarks
 * The `getAllAbarBalances` function calls the `getSpentBalance` and `getBalance` functions to retrieve the spent and unspent balances respectively.
 *
 * Example usage:
 * ```typescript
 * const anonKeys: Keypair.WalletKeypar = ...; // Anonymous keys associated with the wallet
 * const givenCommitmentsList: string[] = [...]; // List of commitments
 *
 * const allBalances = await getAllAbarBalances(anonKeys, givenCommitmentsList);
 *
 * console.log(allBalances.spentBalances); // Balances of spent abars for the given commitments
 * console.log(allBalances.unSpentBalances); // Balances of unspent abars for the given commitments
 * console.log(allBalances.givenCommitmentsList); // The given commitments list
 * ```
 */
var getAllAbarBalances = function (anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var spentBalances, unSpentBalances;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getSpentBalance)(anonKeys, givenCommitmentsList)];
            case 1:
                spentBalances = _a.sent();
                return [4 /*yield*/, (0, exports.getBalance)(anonKeys, givenCommitmentsList)];
            case 2:
                unSpentBalances = _a.sent();
                return [2 /*return*/, {
                        spentBalances: spentBalances,
                        unSpentBalances: unSpentBalances,
                        givenCommitmentsList: givenCommitmentsList,
                    }];
        }
    });
}); };
exports.getAllAbarBalances = getAllAbarBalances;
/**
 * Transfer the exact amount of funds from a 'transparent' to 'anonymous' wallet
 *
 * @remarks
 * This function is used to transfer the exact amount of provided asset code from the sender to the receiver.
 * It is calling `sendToAddress` function to obtain an utxo with the exact amount, and then it is calling `barToAbar`
 * with a fetched utxo sid number
  *
 * @example
 *
 * ```ts
  // returns a tx builder to be submitted to the nextwork
  const { transactionBuilder } = await barToAbarAmount(senderWalletInfo, amount, fraAssetCode, receiverPublickey);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 * @returns a promise with an object that contains the TransactionBuilder, which should be used in `Transaction.submitTransaction`
 */
var barToAbarAmount = function (walletInfo, amount, assetCode, receiverAxfrPublicKey) { return __awaiter(void 0, void 0, void 0, function () {
    var assetBlindRules, transactionBuilder, sendResultHandle, asset, decimals, utxoNumbers, utxoToUse, barToAbarResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                assetBlindRules = { isTypeBlind: false, isAmountBlind: false };
                return [4 /*yield*/, Transaction.sendToAddress(walletInfo, walletInfo.address, amount, assetCode, assetBlindRules)];
            case 1:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, Transaction.submitTransaction(transactionBuilder)];
            case 2:
                sendResultHandle = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 501 ~ sendResultHandle', sendResultHandle);
                return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)()];
            case 3:
                _a.sent();
                return [4 /*yield*/, Asset.getAssetDetails(assetCode)];
            case 4:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                utxoNumbers = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                return [4 /*yield*/, (0, utxoHelper_1.getUtxoWithAmount)(walletInfo, utxoNumbers, assetCode)];
            case 5:
                utxoToUse = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 510 ~ utxoToUse', utxoToUse);
                return [4 /*yield*/, (0, exports.barToAbar)(walletInfo, [utxoToUse.sid], receiverAxfrPublicKey)];
            case 6:
                barToAbarResult = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 508 ~ barToAbarResult', barToAbarResult);
                return [2 /*return*/, barToAbarResult];
        }
    });
}); };
exports.barToAbarAmount = barToAbarAmount;
/**
 * Transfer funds from a 'transparent' to 'anonymous' wallet
 *
 * @remarks
 * Using a given array of utxo sids, this function fetches the associated utxo objects and confidentially transfers those
 * utxos (bars) to a given receiverPublicKey. After the transaction is submitted, the receiver will receive a list of one (or multiple)
 * atxos (aka abars).
 * Please note, this function is only meant to transfer the particularly provided utxos, and it is not used for transferring a custom
 * amount. To transfer the custom amount, please use `barToAbarAmount`
 *
 * @example
 *
 * ```ts
  // returns a tx builder to be submitted to the nextwork
  const { transactionBuilder } = await TripleMasking.barToAbar(senderWalletInfo, arrayOfUtxoSids, receiverPublickey);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```

    @throws `Could not fetch utxo for sids `
    @throws `Could not fetch memo data for sid `
    @throws `Could not get decode memo data or get assetRecord`
    @throws `Could not add bar to abar operation`
    @throws `Could not get fee inputs for bar to abar operation`
    @throws `Could not add fee for bar to abar operation`
    @throws `could not get a list of commitments strings `
    @throws `list of commitments strings is empty`
    @throws `could not build and sign txn`

 * @returns a promise with an object that contains the TransactionBuilder, which should be used in `Transaction.submitTransaction`
 */
var barToAbar = function (walletInfo, sids, receiverPublicKey) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, transactionBuilder, utxoDataList, error_4, _i, utxoDataList_1, utxoItem, sid, memoDataResult, myMemoData, memoError, ownerMemo, assetRecord, seed, receiverXfrPublicKeyConverted, feeInputs, error_5, commitments, barToAbarData;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _b.sent();
                return [4 /*yield*/, Builder.getTransactionBuilder()];
            case 2:
                transactionBuilder = _b.sent();
                utxoDataList = [];
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, utxoHelper_1.addUtxo)(walletInfo, sids)];
            case 4:
                utxoDataList = _b.sent();
                return [3 /*break*/, 6];
            case 5:
                error_4 = _b.sent();
                throw new Error("Could not fetch utxo for sids ".concat(sids.join(',')));
            case 6:
                _i = 0, utxoDataList_1 = utxoDataList;
                _b.label = 7;
            case 7:
                if (!(_i < utxoDataList_1.length)) return [3 /*break*/, 11];
                utxoItem = utxoDataList_1[_i];
                sid = utxoItem.sid;
                return [4 /*yield*/, Network.getOwnerMemo(sid)];
            case 8:
                memoDataResult = _b.sent();
                myMemoData = memoDataResult.response, memoError = memoDataResult.error;
                if (memoError) {
                    throw new Error("Could not fetch memo data for sid \"".concat(sid, "\", Error - ").concat(memoError));
                }
                ownerMemo = void 0;
                assetRecord = void 0;
                try {
                    ownerMemo = myMemoData ? ledger.AxfrOwnerMemo.from_json(myMemoData) : null;
                    assetRecord = ledger.ClientAssetRecord.from_json(utxoItem.utxo);
                }
                catch (error) {
                    throw new Error("Could not get decode memo data or get assetRecord\", Error - ".concat(error));
                }
                seed = (0, utils_1.generateSeedString)();
                return [4 /*yield*/, Keypair.getXfrPublicKeyByBase64(receiverPublicKey)];
            case 9:
                receiverXfrPublicKeyConverted = _b.sent();
                try {
                    transactionBuilder = transactionBuilder.add_operation_bar_to_abar(seed, walletInfo.keypair, receiverXfrPublicKeyConverted, BigInt(sid), assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone());
                }
                catch (error) {
                    throw new Error("Could not add bar to abar operation\", Error - ".concat(error));
                }
                _b.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 7];
            case 11:
                _b.trys.push([11, 13, , 14]);
                return [4 /*yield*/, (0, fee_1.getFeeInputs)(walletInfo, sids, true)];
            case 12:
                feeInputs = _b.sent();
                return [3 /*break*/, 14];
            case 13:
                error_5 = _b.sent();
                throw new Error("Could not get fee inputs for bar to abar operation\", Error - ".concat(error_5));
            case 14:
                try {
                    transactionBuilder = transactionBuilder.add_fee_bar_to_abar(feeInputs);
                }
                catch (error) {
                    console.log('Full error while trying to execute add_fee_bar_to_abar', error);
                    throw new Error("Could not add fee for bar to abar operation, Error - ".concat(error));
                }
                try {
                    commitments = transactionBuilder === null || transactionBuilder === void 0 ? void 0 : transactionBuilder.get_commitments();
                }
                catch (err) {
                    throw new Error("could not get a list of commitments strings \"".concat(err, "\" "));
                }
                if (!((_a = commitments === null || commitments === void 0 ? void 0 : commitments.commitments) === null || _a === void 0 ? void 0 : _a.length)) {
                    throw new Error("list of commitments strings is empty ");
                }
                barToAbarData = {
                    receiverXfrPublicKey: receiverPublicKey,
                    commitments: commitments.commitments,
                };
                try {
                    transactionBuilder = transactionBuilder.build();
                    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                }
                catch (err) {
                    throw new Error("could not build and sign txn \"".concat(err, "\""));
                }
                return [2 /*return*/, { transactionBuilder: transactionBuilder, barToAbarData: barToAbarData, sids: sids }];
        }
    });
}); };
exports.barToAbar = barToAbar;
/**
 * Retrieves the necessary payload data for an Abar transfer input.
 * The function fetches various data related to the owned Abar item and the associated ATXO SID.
 *
 * @param {FindoraWallet.OwnedAbarItem} ownedAbarItem - The owned Abar item for which to retrieve the payload data.
 * @param {Keypair.WalletKeypar} anonKeysSender - The anonymous keys of the sender.
 * @returns {Promise<AbarTransferInputPayload>} - The payload data for the Abar transfer input.
 *
 * @remarks:
 * - This function retrieves the necessary data for an Abar transfer input, including the owned Abar, Abar owner memo, MTLeafInfo, asset code, and decimals.
 * - It internally makes use of other functions such as `getAbarFromJson`, `getAbarOwnerMemo`, `getMyMTLeafInfo`, `getBalanceMaps`, and `Asset.getAssetDetails` to fetch the required data.
 * - The payload data is returned as an object containing the following properties:
 *   - `myOwnedAbar`: The owned Abar item.
 *   - `abarOwnerMemo`: The Abar owner memo.
 *   - `myMTLeafInfo`: The MTLeafInfo object associated with the ATXO SID.
 *   - `assetCode`: The asset code of the Abar.
 *   - `decimals`: The number of decimal places for the asset.
 *
 * @example
 * ```typescript
 * // Retrieve the payload data for an Abar transfer input
 * const ownedAbarItem = {
 *   // Owned Abar item details
 * };
 *
 * const anonKeysSender = {
 *   aXfrSecretKeyConverted: 'abcdefg1234567890',
 *   // other anonymous key details
 * };
 *
 * try {
 *   const payload = await getAbarTransferInputPayload(ownedAbarItem, anonKeysSender);
 *
 *   // Use the payload data for further Abar transfer operations
 *
 * } catch (error) {
 *   console.error('An error occurred while retrieving the Abar transfer input payload:', error);
 * }
 * ```
 */
var getAbarTransferInputPayload = function (ownedAbarItem, anonKeysSender) { return __awaiter(void 0, void 0, void 0, function () {
    var abarData, atxoSid, ownedAbar, myOwnedAbar, abarOwnerMemo, myMTLeafInfo, maps, usedAssets, assetCode, asset, decimals, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, getAbarFromJson(ownedAbar)];
            case 1:
                myOwnedAbar = _a.sent();
                return [4 /*yield*/, (0, exports.getAbarOwnerMemo)(atxoSid)];
            case 2:
                abarOwnerMemo = _a.sent();
                return [4 /*yield*/, getMyMTLeafInfo(atxoSid)];
            case 3:
                myMTLeafInfo = _a.sent();
                return [4 /*yield*/, (0, exports.getBalanceMaps)([ownedAbarItem], anonKeysSender)];
            case 4:
                maps = _a.sent();
                usedAssets = maps.usedAssets;
                assetCode = usedAssets[0];
                return [4 /*yield*/, Asset.getAssetDetails(assetCode)];
            case 5:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                result = {
                    myOwnedAbar: myOwnedAbar,
                    abarOwnerMemo: abarOwnerMemo,
                    myMTLeafInfo: myMTLeafInfo,
                    assetCode: assetCode,
                    decimals: decimals,
                };
                return [2 /*return*/, __assign({}, result)];
        }
    });
}); };
/**
 * The `prepareAnonTransferOperationBuilder` function prepares an anonymous transfer operation builder.
 * The transfer operation can be used to build an anonymous transfer operation for transferring assets from one wallet to another.
 *
 * @param walletInfo - The wallet keypair of the sender.
 * @param receiverXfrPublicKey - The anonymous public key of the receiver.
 * @param abarAmountToTransfer - The amount of the asset being transferred.
 * @param additionalOwnedAbarItems - (Optional) Additional owned Abar items to include in the transfer.
 * @throws {Error} If an error occurs during the preparation of the transfer operation builder.
 * @returns {Promise<FindoraWallet.AnonTransferOperationBuilder>} The prepared anonymous transfer operation builder.
 *
 * @remarks
 * The `prepareAnonTransferOperationBuilder` function prepares an anonymous transfer operation builder by following these steps:
 * 1. Retrieve the anonymous transfer operation builder using the `getAnonTransferOperationBuilder` method.
 * 2. Convert the sender's aXfrSecretKey to the appropriate format using the `getAnonKeypairFromJson` method.
 * 3. Convert the receiver's Xfr public key from base64 to the appropriate format using the `getXfrPublicKeyByBase64` method.
 * 4. Extract the ownedAbarToUseAsSource and additionalOwnedAbars from the `additionalOwnedAbarItems` array.
 * 5. Retrieve the abarPayloadOne by calling the `getAbarTransferInputPayload` method with the ownedAbarToUseAsSource and walletInfo.
 * 6. Add the first input to the anonymous transfer operation builder using the `add_input` method, passing the necessary parameters from abarPayloadOne.
 * 7. Convert the abarAmountToTransfer to the appropriate format using the `toWei` method and assign it to the toAmount variable.
 * 8. Initialize an empty array named addedInputs.
 * 9. Iterate over the additionalOwnedAbars array and add inputs to the anonymous transfer operation builder for each ownedAbarItemOne.
 *    - If the length of addedInputs becomes equal to or exceeds 4, throw an error indicating that the amount being sent is too large to send at once.
 *    - Retrieve the abarPayloadNext by calling the `getAbarTransferInputPayload` method with ownedAbarItemOne and walletInfo.
 *    - Add the additional input to the anonymous transfer operation builder using the `add_input` method, passing the necessary parameters from abarPayloadNext.
 *    - Push ownedAbarItemOne to the addedInputs array.
 * 10. Retrieve the ledger using the `getLedger` method.
 * 11. Retrieve the amountAssetType by calling the `open_abar` method on the ledger instance, passing the necessary parameters from abarPayloadOne.
 * 12. Add the output to the anonymous transfer operation builder using the `add_output` method, passing the toAmount, amountAssetType.asset_type, and receiverXfrPublicKeyConverted.
 * 13. Add the sender's aXfrSpendKeySender to the anonymous transfer operation builder using the `add_keypair` method.
 * 14. Return the prepared anonymous transfer operation builder.
 *
 * @example
 *
 * ```ts
 * import { Keypair, FindoraWallet } from 'your-library';
 *
 * const walletInfo: Keypair.WalletKeypar = {
 *   aXfrSecretKeyConverted: 'abcdefg1234567890',
 *   // other wallet info
 * };
 *
 * const receiverXfrPublicKey = 'hijklmn0987654321';
 * const abarAmountToTransfer = '10';
 *
 * // Additional owned Abar items
 * const additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[] = [
 *   {
 *     // additional owned Abar item details
 *   },
 *   {
 *     // additional owned Abar item details
 *   },
 * ];
 *
 * try {
 *   const anonTransferOperationBuilder = await prepareAnonTransferOperationBuilder(
 *     walletInfo,
 *     receiverXfrPublicKey,
 *     abarAmountToTransfer,
 *     additionalOwnedAbarItems,
 *   );
 *
 *   // Continue building the anonymous transfer operation using the anonTransferOperationBuilder
 *
 * } catch (error) {
 *   console.error('An error occurred while preparing the anonymous transfer operation builder:', error);
 * }
 *
 * ```
 */
var prepareAnonTransferOperationBuilder = function (walletInfo, receiverXfrPublicKey, abarAmountToTransfer, additionalOwnedAbarItems) {
    if (additionalOwnedAbarItems === void 0) { additionalOwnedAbarItems = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var anonTransferOperationBuilder, aXfrSpendKeySender, receiverXfrPublicKeyConverted, ownedAbarToUseAsSource, additionalOwnedAbars, abarPayloadOne, toAmount, addedInputs, _i, additionalOwnedAbars_1, ownedAbarItemOne, abarPayloadNext, ledger, amountAssetType, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Builder.getAnonTransferOperationBuilder()];
                case 1:
                    anonTransferOperationBuilder = _a.sent();
                    return [4 /*yield*/, (0, exports.getAnonKeypairFromJson)(walletInfo)];
                case 2:
                    aXfrSpendKeySender = (_a.sent()).aXfrSecretKeyConverted;
                    return [4 /*yield*/, Keypair.getXfrPublicKeyByBase64(receiverXfrPublicKey)];
                case 3:
                    receiverXfrPublicKeyConverted = _a.sent();
                    ownedAbarToUseAsSource = additionalOwnedAbarItems[0], additionalOwnedAbars = additionalOwnedAbarItems.slice(1);
                    return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarToUseAsSource, walletInfo)];
                case 4:
                    abarPayloadOne = _a.sent();
                    try {
                        anonTransferOperationBuilder = anonTransferOperationBuilder.add_input(abarPayloadOne.myOwnedAbar, abarPayloadOne.abarOwnerMemo, aXfrSpendKeySender, abarPayloadOne.myMTLeafInfo);
                    }
                    catch (error) {
                        throw new Error("Could not add an input for abar transfer operation\", Error - ".concat(error.message));
                    }
                    toAmount = BigInt((0, bigNumber_1.toWei)(abarAmountToTransfer, abarPayloadOne.decimals).toString());
                    addedInputs = [];
                    _i = 0, additionalOwnedAbars_1 = additionalOwnedAbars;
                    _a.label = 5;
                case 5:
                    if (!(_i < additionalOwnedAbars_1.length)) return [3 /*break*/, 8];
                    ownedAbarItemOne = additionalOwnedAbars_1[_i];
                    if (addedInputs.length >= 4) {
                        throw new Error('Amount you are trying to send is to big to send at once. Please try a smaller amount');
                    }
                    return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarItemOne, walletInfo)];
                case 6:
                    abarPayloadNext = _a.sent();
                    try {
                        anonTransferOperationBuilder = anonTransferOperationBuilder.add_input(abarPayloadNext.myOwnedAbar, abarPayloadNext.abarOwnerMemo, aXfrSpendKeySender, abarPayloadNext.myMTLeafInfo);
                    }
                    catch (error) {
                        console.log('platform error', error);
                        throw new Error("Could not add an additional input for abar transfer operation\", Error - ".concat(error.message));
                    }
                    addedInputs.push(ownedAbarItemOne);
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
                case 9:
                    ledger = _a.sent();
                    amountAssetType = ledger.open_abar(abarPayloadOne.myOwnedAbar, abarPayloadOne.abarOwnerMemo, aXfrSpendKeySender);
                    anonTransferOperationBuilder = anonTransferOperationBuilder.add_output(toAmount, amountAssetType.asset_type, receiverXfrPublicKeyConverted);
                    return [3 /*break*/, 11];
                case 10:
                    error_6 = _a.sent();
                    throw new Error("Could not add an output for abar transfer operation\", Error - ".concat(error_6.message));
                case 11:
                    anonTransferOperationBuilder = anonTransferOperationBuilder.add_keypair(aXfrSpendKeySender);
                    return [2 /*return*/, anonTransferOperationBuilder];
            }
        });
    });
};
exports.prepareAnonTransferOperationBuilder = prepareAnonTransferOperationBuilder;
/**
 * The `getAbarTransferFee` function calculates the transfer fee for an abar transfer operation from one account to another.
 *
 * @param anonKeysSender - The anonymous keys of the sender account.
 * @param anonPubKeyReceiver - The anonymous public key of the receiver account.
 * @param abarAmountToTransfer - The amount to be transferred.
 * @param additionalOwnedAbarItems - Owned abar items to consider for the fee calculation.
 *
 * @returns The calculated transfer fee for the abar transfer operation.
 *
 * @remarks
 * The `getAbarTransferFee` function uses the `prepareAnonTransferOperationBuilder` helper function to prepare an anonymous transfer operation builder, which allows the calculation of the expected fee.
 *
 * The `fromWei` helper function is used to convert the calculated fee from a big integer format to a human-readable format with 6 decimal places.
 *
 * Example usage:
 * ```typescript
 * const anonKeysSender: Keypair.WalletKeypar = ...; // Sender's anonymous keys
 * const anonPubKeyReceiver: string = ...; // Receiver's anonymous public key
 * const abarAmountToTransfer: string = "10"; // Amount of abars to transfer
 * const additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[] = [...]; // Additional owned abar items
 *
 * const calculatedFee = await getAbarTransferFee(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems);
 *
 * console.log(calculatedFee); // Calculated transfer fee
 * ```
 */
var getAbarTransferFee = function (anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems) {
    if (additionalOwnedAbarItems === void 0) { additionalOwnedAbarItems = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var anonTransferOperationBuilder, expectedFee, calculatedFee;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.prepareAnonTransferOperationBuilder)(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems)];
                case 1:
                    anonTransferOperationBuilder = _a.sent();
                    expectedFee = anonTransferOperationBuilder.get_expected_fee();
                    calculatedFee = (0, bigNumber_1.fromWei)((0, bigNumber_1.create)(expectedFee.toString()), 6).toFormat(6);
                    return [2 /*return*/, calculatedFee];
            }
        });
    });
};
exports.getAbarTransferFee = getAbarTransferFee;
/**
 * Processes the Abar to Abar commitment response data and transforms it into a processed commitments map.
 * The function performs necessary operations on the commitments data, such as converting amounts to human-readable format.
 *
 * @param {CommitmentsResponseMap} commitmentsMap - The Abar to Abar commitment response map to process.
 * @returns {Promise<ProcessedCommitmentsMap[]>} - The processed commitments map containing the transformed commitment data.
 *
 * Remarks:
 * - This function takes the Abar to Abar commitment response data and performs necessary operations to transform it into a processed commitments map.
 * - The commitments map is an object containing commitment keys as keys and commitment entity arrays as values.
 * - Each commitment entity array contains the following elements in order: commitmentAxfrPublicKey, commitmentNumericAssetType, and commitmentAmountInWei.
 * - The function follows these steps to process the commitments:
 *   1. Retrieves the commitment asset type using the commitmentNumericAssetType value.
 *   2. Retrieves the asset details for the commitment asset type.
 *   3. Converts the commitment amount from Wei to a human-readable format using the asset's decimal places.
 *   4. Constructs a processed commitment object with the commitment key, Axfr public key, asset type, and formatted commitment amount.
 *   5. Appends the processed commitment object to the response map.
 * - The response map is an array of processed commitment objects.
 *
 * @example
 * ```typescript
 * // Process the Abar to Abar commitment response
 * const commitmentsMap = {
 *   commitmentKey1: ['commitmentAxfrPublicKey1', 123, '1000000000000000000'],
 *   commitmentKey2: ['commitmentAxfrPublicKey2', 456, '2000000000000000000'],
 * };
 *
 * try {
 *   const processedCommitments = await processAbarToAbarCommitmentResponse(commitmentsMap);
 *
 *   // Use the processed commitments data as needed
 *
 * } catch (error) {
 *   console.error('An error occurred while processing the Abar to Abar commitment response:', error);
 * }
 * ```
 */
var processAbarToAbarCommitmentResponse = function (commitmentsMap) { return __awaiter(void 0, void 0, void 0, function () {
    var commitmentKeys, responseMap, _i, commitmentKeys_1, commitmentKey, commitmentEntity, commitmentAxfrPublicKey, commitmentNumericAssetType, commitmentAmountInWei, commitmentAssetType, asset, commitmentAmount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commitmentKeys = Object.keys(commitmentsMap);
                if (!(commitmentKeys === null || commitmentKeys === void 0 ? void 0 : commitmentKeys.length)) {
                    throw new Error("Commitments maps is empty ");
                }
                responseMap = [];
                _i = 0, commitmentKeys_1 = commitmentKeys;
                _a.label = 1;
            case 1:
                if (!(_i < commitmentKeys_1.length)) return [3 /*break*/, 5];
                commitmentKey = commitmentKeys_1[_i];
                commitmentEntity = commitmentsMap[commitmentKey];
                commitmentAxfrPublicKey = commitmentEntity[0], commitmentNumericAssetType = commitmentEntity[1], commitmentAmountInWei = commitmentEntity[2];
                return [4 /*yield*/, Asset.getAssetCode(commitmentNumericAssetType)];
            case 2:
                commitmentAssetType = _a.sent();
                return [4 /*yield*/, Asset.getAssetDetails(commitmentAssetType)];
            case 3:
                asset = _a.sent();
                commitmentAmount = (0, bigNumber_1.fromWei)((0, bigNumber_1.create)(commitmentAmountInWei.toString()), (asset === null || asset === void 0 ? void 0 : asset.assetRules.decimals) || 6).toFormat((asset === null || asset === void 0 ? void 0 : asset.assetRules.decimals) || 6);
                responseMap.push({
                    commitmentKey: commitmentKey,
                    commitmentAxfrPublicKey: commitmentAxfrPublicKey,
                    commitmentAssetType: commitmentAssetType,
                    commitmentAmount: "".concat(commitmentAmount),
                });
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/, responseMap];
        }
    });
}); };
/**
 * Merges two arrays of AtxoMapItem objects into a single sorted array based on the amount value.
 * The function calls another function, mergeSortAtxoList, recursively to perform the merge sort algorithm.
 *
 * @param {AtxoMapItem[]} arr1 - The first array of AtxoMapItem objects to merge.
 * @param {AtxoMapItem[]} arr2 - The second array of AtxoMapItem objects to merge.
 * @returns {AtxoMapItem[]} - The merged and sorted array of AtxoMapItem objects.
 *
 * Remarks:
 * - This function merges two arrays of AtxoMapItem objects into a single sorted array based on the amount value.
 * - It uses the merge sort algorithm to perform the merging and sorting operation.
 * - The merge sort algorithm is implemented in the mergeSortAtxoList function, which is called recursively.
 * - The mergeAtxoList function compares the amount values of the AtxoMapItem objects in arr1 and arr2.
 * - It adds the AtxoMapItem object with the smaller amount value to the result array and continues until one of the input arrays is empty.
 * - The remaining items in the non-empty array are then appended to the result array.
 * - The function returns the merged and sorted array of AtxoMapItem objects.
 *
 * @example
 * const arr1: AtxoMapItem[] = [
 *   { amount: '100' },
 *   { amount: '300' },
 *   { amount: '500' },
 * ];
 *
 * const arr2: AtxoMapItem[] = [
 *   { amount: '200' },
 *   { amount: '400' },
 *   { amount: '600' },
 * ];
 *
 * const mergedArray = mergeAtxoList(arr1, arr2);
 * console.log(mergedArray);
 * // Output: [
 * //   { amount: '100' },
 * //   { amount: '200' },
 * //   { amount: '300' },
 * //   { amount: '400' },
 * //   { amount: '500' },
 * //   { amount: '600' },
 * // ]
 */
var mergeAtxoList = function (arr1, arr2) {
    var res = [];
    while (arr1.length && arr2.length) {
        var assetItem1 = arr1[0];
        var assetItem2 = arr2[0];
        var amount1 = BigInt(assetItem1.amount);
        var amount2 = BigInt(assetItem2.amount);
        if (amount1 < amount2) {
            res.push(arr1.splice(0, 1)[0]);
            continue;
        }
        res.push(arr2.splice(0, 1)[0]);
    }
    return res.concat(arr1, arr2);
};
/**
 * Sorts an array of AtxoMapItem objects using the merge sort algorithm.
 * The function recursively divides the array into smaller subarrays, sorts them, and then merges them back together.
 *
 * @param {AtxoMapItem[]} arr - The array of AtxoMapItem objects to sort.
 * @returns {AtxoMapItem[]} - The sorted array of AtxoMapItem objects.
 *
 * Remarks:
 * - This function sorts an array of AtxoMapItem objects using the merge sort algorithm.
 * - It divides the input array into smaller subarrays until each subarray contains a single element.
 * - It then merges the subarrays back together, comparing the amount values of the AtxoMapItem objects to determine the order.
 * - The merge operation is performed by the mergeAtxoList function.
 * - The function continues the recursive process until the entire array is sorted.
 * - The sorted array of AtxoMapItem objects is returned as the result.
 *
 * @example
 * const arr: AtxoMapItem[] = [
 *   { amount: '500' },
 *   { amount: '200' },
 *   { amount: '300' },
 *   { amount: '100' },
 *   { amount: '400' },
 * ];
 *
 * const sortedArray = mergeSortAtxoList(arr);
 * console.log(sortedArray);
 * // Output: [
 * //   { amount: '100' },
 * //   { amount: '200' },
 * //   { amount: '300' },
 * //   { amount: '400' },
 * //   { amount: '500' },
 * // ]
 */
var mergeSortAtxoList = function (arr) {
    if (arr.length < 2)
        return arr;
    var middleIdx = Math.floor(arr.length / 2);
    var left = arr.splice(0, middleIdx);
    var right = arr.splice(0);
    return mergeAtxoList(mergeSortAtxoList(left), mergeSortAtxoList(right));
};
/**
 * The `getSendAtxo` function retrieves a list of send ATXOs (Anonymous Transaction Outputs) for a given asset and amount.
 *
 * @param code - The asset code for the ATXOs.
 * @param amount - The amount to transfer.
 * @param commitments - The list of commitments associated with the sender's owned abars.
 * @param anonKeys - The sender's anonymous keys.
 *
 * @returns A promise that resolves to an array of send ATXOs.
 *
 * @throws An error if there was an issue retrieving the unspent abars or balance maps, or if the response is missing or invalid.
 *
 * @remarks
 * The `getSendAtxo` function uses the `getUnspentAbars` and `getBalanceMaps` functions to fetch the unspent abars and balance maps associated with the provided commitments and anonymous keys.
 * It then filters the balance maps for the specified asset code and calculates the required send ATXOs to transfer the specified amount.
 * The function handles error scenarios and returns an empty array if the sum of the selected ATXOs is less than the specified amount.
 *
 * Example usage:
 * ```typescript
 * const assetCode = 'ABC'; // Asset code
 * const amount = BigInt(100); // Amount to transfer
 * const commitments = ['commitment1', 'commitment2']; // List of commitments
 * const anonKeys = // anonymous keys object -  Sender's anonymous keys
 *
 * try {
 *   const sendAtxos = await getSendAtxo(assetCode, amount, commitments, anonKeys);
 *   console.log(sendAtxos);
 *   // [
 *   //   {
 *   //     amount: BigInt(50),
 *   //     sid: 'atxoSid1',
 *   //     commitment: 'commitment1',
 *   //   },
 *   //   {
 *   //     amount: BigInt(60),
 *   //     sid: 'atxoSid2',
 *   //     commitment: 'commitment2',
 *   //   },
 *   // ]
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
var getSendAtxo = function (code, amount, commitments, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var result, unspentAbars, balancesMaps, atxoMap, filteredUtxoList, sortedUtxoList, sum, _i, sortedUtxoList_1, assetItem, _amount, credit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = [];
                return [4 /*yield*/, (0, exports.getUnspentAbars)(anonKeys, commitments)];
            case 1:
                unspentAbars = _a.sent();
                return [4 /*yield*/, (0, exports.getBalanceMaps)(unspentAbars, anonKeys)];
            case 2:
                balancesMaps = _a.sent();
                atxoMap = balancesMaps.atxoMap;
                filteredUtxoList = atxoMap[code];
                if (!filteredUtxoList) {
                    return [2 /*return*/, []];
                }
                sortedUtxoList = mergeSortAtxoList(filteredUtxoList);
                sum = BigInt(0);
                for (_i = 0, sortedUtxoList_1 = sortedUtxoList; _i < sortedUtxoList_1.length; _i++) {
                    assetItem = sortedUtxoList_1[_i];
                    _amount = BigInt(assetItem.amount);
                    sum = sum + _amount;
                    credit = BigInt(Number(sum) - Number(amount));
                    result.push({
                        amount: _amount,
                        sid: assetItem.atxoSid,
                        commitment: assetItem.commitment,
                    });
                    if (credit >= 0) {
                        break;
                    }
                }
                return [2 /*return*/, sum >= amount ? result : []];
        }
    });
}); };
exports.getSendAtxo = getSendAtxo;
/**
 * The `getTotalAbarTransferFee` function calculates the total fee for transferring abars from the sender to the receiver.
 *
 * @param anonKeysSender - The sender's anonymous keys.
 * @param anonPubKeyReceiver - The receiver's anonymous public key.
 * @param abarAmountToTransfer - The amount to transfer.
 * @param additionalOwnedAbarItems - Owned abar items to include in the transfer operation.
 *
 * @returns A promise that resolves to the calculated fee for the abar transfer operation.
 *
 * @throws An error if there was an issue preparing the anonymous transfer operation builder or calculating the fee.
 *
 * @remarks
 * The `getTotalAbarTransferFee` function prepares an anonymous transfer operation builder using the sender's anonymous keys,
 * receiver's anonymous public key, abar amount to transfer, and additional owned abar items.
 * It then retrieves the expected fee estimate from the transfer operation builder and converts it to a human-readable format.
 * The function handles error scenarios and returns the calculated fee for the abar transfer operation.
 *
 * Example usage:
 * ```typescript
 * const anonKeysSender =  // sender's anonymous keys object
 * const anonPubKeyReceiver = 'receiverPublicKey';
 * const abarAmountToTransfer = '100';
 * const additionalOwnedAbarItems = [
 *   {
 *     // additional owned abar item
 *   },
 *   {
 *     // additional owned abar item
 *   },
 * ];
 *
 * try {
 *   const fee = await getTotalAbarTransferFee(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems);
 *   console.log(fee); // '0.012345'
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
var getTotalAbarTransferFee = function (anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems) {
    if (additionalOwnedAbarItems === void 0) { additionalOwnedAbarItems = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var anonTransferOperationBuilder, expectedFee, calculatedFee;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.prepareAnonTransferOperationBuilder)(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems)];
                case 1:
                    anonTransferOperationBuilder = _a.sent();
                    expectedFee = anonTransferOperationBuilder.get_total_fee_estimate();
                    calculatedFee = (0, bigNumber_1.fromWei)((0, bigNumber_1.create)(expectedFee.toString()), 6).toFormat(6);
                    return [2 /*return*/, calculatedFee];
            }
        });
    });
};
exports.getTotalAbarTransferFee = getTotalAbarTransferFee;
/**
 * The `getAbarToAbarAmountPayload` function is an asynchronous function that calculates the payload required for a transfer of abars from one account to another.
 *
 * @param anonKeysSender - The anonymous keys of the sender account.
 * @param anonPubKeyReceiver - The anonymous public key of the receiver account.
 * @param amount - The amount of the asset to be transferred.
 * @param assetCode - The code of the asset for the abars being transferred.
 * @param givenCommitmentsList - The list of given commitments to consider for the transfer.
 *
 * @remarks
 * The `getAbarToAbarAmountPayload` function calculates the payload required for transferring abars from one account to another.
 *
 * This function relies on various helper functions and modules, such as `Asset`, `getUnspentAbars`, `getBalanceMaps`, `getSendAtxo`, `getAbarTransferFee`,
 * `getTotalAbarTransferFee`, `getOwnedAbars`, and `createBigNumber`, to retrieve asset details, unspent abars, balance maps,
 * calculate transfer fees, and perform other necessary operations.
 *
 * The function attempts to determine whether the given list of abars is enough to cover the transfer fee. If additional fee is required,
 * it recursively checks if more fee is needed until the required amount is met or an error occurs. The conditions for triggering an error include exceeding the allowed inputs and outputs limit, calculating the missing amount of the fee, or determining that the input payload contains enough abars to cover the fee.
 *
 * Note that the required dependencies, such as `Asset`, `getUnspentAbars`, `getBalanceMaps`, `getSendAtxo`, `getAbarTransferFee`, `getTotalAbarTransferFee`,
 * `getOwnedAbars`, and `createBigNumber`, should be imported and accessible within the module where this function is used.
 *
 * The returned value is an object with the following properties:
 * - `commitmentsToSend`: An array of commitments that will be used to perform the transfer.
 * - `commitmentsForFee`: An array of commitments to be used to pay the transfer fee.
 * - `additionalAmountForFee`: The total estimated fee amount.
 *
 * @example
 * ```typescript
 * const anonKeysSender = {
 *   publickey: "senderPublicKey",
 *   privateStr: "senderPrivateKey",
 * };
 * const anonPubKeyReceiver = "receiverPublicKey";
 * const amount = "100";
 * const assetCode = "ABC";
 * const givenCommitmentsList = ["commitment1", "commitment2", "commitment3"];
 *
 * try {
 *   const payload = await getAbarToAbarAmountPayload(
 *     anonKeysSender,
 *     anonPubKeyReceiver,
 *     amount,
 *     assetCode,
 *     givenCommitmentsList
 *   );
 *
 *   console.log("Abar Transfer Payload:");
 *   console.log(payload);
 * } catch (error) {
 *   console.error("Error calculating abar transfer payload:", error);
 * }
 * ```
 *
 * @returns A promise that resolves to an object containing the payload details for the abar transfer, including the commitments to send, commitments for fee, and additional amount for fee.
 *
 * @throws Throws an error under the following conditions:
 * - If there are no abars available for the specified asset and sender account.
 * - If there are no FRA abars available to cover the transfer fee for the sender account.
 * - If the sender account does not have enough abars to perform the requested transfer.
 * - If there is a failure in calculating the transfer fee, such as an invalid amount or other errors.
 * - If the amount being sent is too large to be sent at once.
 * - If there is an error in decoding the abar memo data.
 * - If there is an error in converting the given AnonKeyPair from JSON.
 */
var getAbarToAbarAmountPayload = function (anonKeysSender, anonPubKeyReceiver, amount, assetCode, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var asset, decimals, utxoNumbers, unspentAbars, balancesMaps, atxoMap, filteredFraAtxoList, filteredAssetAtxoList, fraAssetCode, isFraTransfer, assetCommitments, fraCommitments, atxoListToSend, additionalOwnedAbarItems, commitmentsToSend, commitmentsForFee, _i, atxoListToSend_1, atxoItem, givenCommitment, ownedAbarsResponseTwo, additionalOwnedAbarItem, calculatedFee, error_7, totalFeeEstimate, error_8, balanceAfterSendToBN, isMoreFeeNeeded, allCommitmentsForFee, idx, feeUtxoNumbers, feeAtxoListToSend, allCommitmentsForFeeSorted, calculatedFeeA, givenCommitment, myCalculatedFee, error_9, ownedAbarsResponseFee, additionalOwnedAbarItemFee;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Asset.getAssetDetails(assetCode)];
            case 1:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                utxoNumbers = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                return [4 /*yield*/, (0, exports.getUnspentAbars)(anonKeysSender, givenCommitmentsList)];
            case 2:
                unspentAbars = _a.sent();
                return [4 /*yield*/, (0, exports.getBalanceMaps)(unspentAbars, anonKeysSender)];
            case 3:
                balancesMaps = _a.sent();
                atxoMap = balancesMaps.atxoMap;
                filteredFraAtxoList = [];
                filteredAssetAtxoList = atxoMap[assetCode] || [];
                if (!filteredAssetAtxoList.length) {
                    throw new Error("There is no any abar for asset ".concat(assetCode, " available for ").concat(anonKeysSender.publickey));
                }
                return [4 /*yield*/, Asset.getFraAssetCode()];
            case 4:
                fraAssetCode = _a.sent();
                isFraTransfer = assetCode === fraAssetCode;
                if (!isFraTransfer) {
                    filteredFraAtxoList = atxoMap[fraAssetCode] || [];
                }
                if (!isFraTransfer && !filteredFraAtxoList.length) {
                    throw new Error("There is no any FRA abar to cover the fee for ".concat(anonKeysSender.publickey));
                }
                assetCommitments = filteredAssetAtxoList.map(function (atxoItem) { return atxoItem.commitment; });
                fraCommitments = filteredFraAtxoList.map(function (atxoItem) { return atxoItem.commitment; });
                return [4 /*yield*/, (0, exports.getSendAtxo)(assetCode, utxoNumbers, assetCommitments, anonKeysSender)];
            case 5:
                atxoListToSend = _a.sent();
                if (!atxoListToSend.length) {
                    throw new Error("Sender ".concat(anonKeysSender.publickey, " does not have enough abars to send ").concat(amount, " of ").concat(assetCode));
                }
                additionalOwnedAbarItems = [];
                commitmentsToSend = [];
                commitmentsForFee = [];
                _i = 0, atxoListToSend_1 = atxoListToSend;
                _a.label = 6;
            case 6:
                if (!(_i < atxoListToSend_1.length)) return [3 /*break*/, 9];
                atxoItem = atxoListToSend_1[_i];
                givenCommitment = atxoItem.commitment;
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 7:
                ownedAbarsResponseTwo = _a.sent();
                additionalOwnedAbarItem = ownedAbarsResponseTwo[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                commitmentsToSend.push(givenCommitment);
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9:
                _a.trys.push([9, 11, , 12]);
                return [4 /*yield*/, (0, exports.getAbarTransferFee)(anonKeysSender, anonPubKeyReceiver, amount, additionalOwnedAbarItems)];
            case 10:
                calculatedFee = _a.sent();
                return [3 /*break*/, 12];
            case 11:
                error_7 = _a.sent();
                throw new Error('1 The amount you are trying to send might be to big to be sent at once. Please try sending smaller amount');
            case 12:
                _a.trys.push([12, 14, , 15]);
                return [4 /*yield*/, (0, exports.getTotalAbarTransferFee)(anonKeysSender, anonPubKeyReceiver, amount, additionalOwnedAbarItems)];
            case 13:
                totalFeeEstimate = _a.sent();
                return [3 /*break*/, 15];
            case 14:
                error_8 = _a.sent();
                throw new Error('2 The amount you are trying to send might be to big to be sent at once. Please try sending smaller amount');
            case 15:
                balanceAfterSendToBN = (0, bigNumber_1.create)(calculatedFee);
                isMoreFeeNeeded = balanceAfterSendToBN.gt((0, bigNumber_1.create)(0));
                if (!isMoreFeeNeeded) {
                    return [2 /*return*/, {
                            commitmentsToSend: commitmentsToSend,
                            commitmentsForFee: commitmentsForFee,
                            additionalAmountForFee: totalFeeEstimate,
                        }];
                }
                allCommitmentsForFee = fraCommitments;
                if (isFraTransfer) {
                    allCommitmentsForFee = assetCommitments.filter(function (commitment) { return !atxoListToSend.map(function (atxoItem) { return atxoItem.commitment; }).includes(commitment); });
                }
                idx = 0;
                feeUtxoNumbers = BigInt((0, bigNumber_1.toWei)(calculatedFee, 6).toString());
                return [4 /*yield*/, (0, exports.getSendAtxo)(fraAssetCode, feeUtxoNumbers, allCommitmentsForFee, anonKeysSender)];
            case 16:
                feeAtxoListToSend = _a.sent();
                allCommitmentsForFeeSorted = feeAtxoListToSend.map(function (atxoItem) { return atxoItem.commitment; });
                _a.label = 17;
            case 17:
                if (!isMoreFeeNeeded) return [3 /*break*/, 24];
                givenCommitment = allCommitmentsForFeeSorted === null || allCommitmentsForFeeSorted === void 0 ? void 0 : allCommitmentsForFeeSorted[idx];
                _a.label = 18;
            case 18:
                _a.trys.push([18, 20, , 21]);
                return [4 /*yield*/, (0, exports.getAbarTransferFee)(anonKeysSender, anonPubKeyReceiver, amount, additionalOwnedAbarItems)];
            case 19:
                myCalculatedFee = _a.sent();
                calculatedFeeA = myCalculatedFee;
                return [3 /*break*/, 21];
            case 20:
                error_9 = _a.sent();
                throw new Error('3 The amount you are trying to send might be to big to be sent at once. Please try sending smaller amount');
            case 21:
                balanceAfterSendToBN = (0, bigNumber_1.create)(calculatedFeeA);
                isMoreFeeNeeded = balanceAfterSendToBN.gt((0, bigNumber_1.create)(0));
                if (isMoreFeeNeeded && !givenCommitment) {
                    throw new Error("You still need ".concat(calculatedFeeA, " FRA to cover the fee 3"));
                }
                if (!givenCommitment) return [3 /*break*/, 23];
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 22:
                ownedAbarsResponseFee = _a.sent();
                additionalOwnedAbarItemFee = ownedAbarsResponseFee[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItemFee);
                commitmentsForFee.push(givenCommitment);
                _a.label = 23;
            case 23:
                idx += 1;
                return [3 /*break*/, 17];
            case 24: return [2 /*return*/, {
                    commitmentsToSend: commitmentsToSend,
                    commitmentsForFee: commitmentsForFee,
                    additionalAmountForFee: totalFeeEstimate,
                }];
        }
    });
}); };
exports.getAbarToAbarAmountPayload = getAbarToAbarAmountPayload;
/**
 * Transfer funds from an 'anonymous' to another 'anonymous' wallet
 *
 * @remarks
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note, that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remained abars could be either FRA asset, or other custom assets.
 *
 * @example
 *
 * ```ts
 * const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
 *    anonKeysSender,
 *    anonKeysReceiver.publickey,
 *    '2',
 *    additionalOwnedAbarItems,
 *  );

  // tx hash
 *  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);
 * ```
 *
 * @remarks

 Please also keep in mind, that this function returns an object `abarToBarData` which contains information about the new commitments,
 both for the sender (i.e. with the remainders from the transfer) and for the receiver (with a destination abar commitment value).

 Those commitments could be retrieved in this way.

* ```ts
*  const { commitmentsMap } = abarToAbarData;
*
*  const retrievedCommitmentsListReceiver = [];
*  const retrievedCommitmentsListSender= [];
*
*  for (const commitmentsMapEntry of commitmentsMap) {
*    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
*
*    if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
*      givenCommitmentsListSender.push(commitmentKey);
*    }
*
*    if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
*      retrievedCommitmentsListReceiver.push(commitmentKey);
*    }
*  }
* ```
*
* @throws 'The amount you are trying to send might be too big to be sent at once. Please try sending a smaller amount'
* @throws 'Could not process abar transfer. More fees are needed. Required amount at least "${calculatedFee} FRA"'
* @throws 'Could not build and sign abar transfer operation'
* @throws 'Could not get a list of commitments strings '
*
* @returns a promise with an object, containing the AnonTransferOperationBuilder, which should be used in `Transaction.submitAbarTransaction`
*/
var abarToAbar = function (anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems) {
    if (additionalOwnedAbarItems === void 0) { additionalOwnedAbarItems = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var calculatedFee, error_10, balanceAfterSendToBN, isMoreFeeNeeded, msg, anonTransferOperationBuilder, commitmentsMap, processedCommitmentsMap, abarToAbarData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, exports.getAbarTransferFee)(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems)];
                case 1:
                    calculatedFee = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    throw new Error('The amount you are trying to send might be too big to be sent at once. Please try sending a smaller amount');
                case 3:
                    console.log("\uD83D\uDE80 ~ file: tripleMasking.ts ~ line 308 ~ we need ".concat(calculatedFee, " more FRA to pay fee"));
                    balanceAfterSendToBN = (0, bigNumber_1.create)(calculatedFee);
                    isMoreFeeNeeded = balanceAfterSendToBN.gt((0, bigNumber_1.create)(0));
                    if (isMoreFeeNeeded) {
                        msg = "Could not process abar transfer. More fees are needed. Required amount at least \"".concat(calculatedFee, " FRA\"");
                        throw new Error(msg);
                    }
                    return [4 /*yield*/, (0, exports.prepareAnonTransferOperationBuilder)(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems)];
                case 4:
                    anonTransferOperationBuilder = _a.sent();
                    try {
                        anonTransferOperationBuilder = anonTransferOperationBuilder.build();
                    }
                    catch (error) {
                        console.log('🚀 ~ file: tripleMasking.ts ~ line 320 ~ error', error);
                        console.log('Full Error: ', error);
                        throw new Error("Could not build and sign abar transfer operation, Error - ".concat(error));
                    }
                    try {
                        commitmentsMap = anonTransferOperationBuilder === null || anonTransferOperationBuilder === void 0 ? void 0 : anonTransferOperationBuilder.get_commitment_map();
                    }
                    catch (err) {
                        throw new Error("Could not get a list of commitments strings \"".concat(err.message, "\" "));
                    }
                    return [4 /*yield*/, processAbarToAbarCommitmentResponse(commitmentsMap)];
                case 5:
                    processedCommitmentsMap = _a.sent();
                    abarToAbarData = {
                        anonKeysSender: anonKeysSender,
                        anonPubKeyReceiver: anonPubKeyReceiver,
                        commitmentsMap: processedCommitmentsMap,
                    };
                    return [2 /*return*/, { anonTransferOperationBuilder: anonTransferOperationBuilder, abarToAbarData: abarToAbarData }];
            }
        });
    });
};
exports.abarToAbar = abarToAbar;
/**
 * Transfer funds of the specific asset from an 'anonymous' to another 'anonymous' wallet
 *
 * @remarks
 * Using a given asset code and the amount, this function executes a confidential transfer. Abars for the transfer are
 * being retrieved using provided commitments array. The retrieved abars array must have enough FRA abars to cover the
 * transfer fee.
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 *
 * @example
 *
 * ```ts
 * const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbarAmount(
 *   anonKeysSender,
 *   anonKeysReceiver.publickey,
 *   amountToSend,
 *   assetCodeToUse,
 *   givenCommitmentsListSender,
 * );

 * // tx hash
 *  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);
 * ```
 *
 * @remarks

 Please also keep in mind that this function returns an object `abarToBarData` which contains information about the new commitments,
 both for the sender (i.e. with the remainders from the transfer) and for the receiver (with a destination abar commitment value).

 Those commitments could be retrieved in this way.

* ```ts
*  const { commitmentsMap } = abarToAbarData;
*
*  const retrievedCommitmentsListReceiver = [];
*  const retrievedCommitmentsListSender= [];
*
*  for (const commitmentsMapEntry of commitmentsMap) {
*    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
*
*    if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
*      givenCommitmentsListSender.push(commitmentKey);
*    }
*
*    if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
*      retrievedCommitmentsListReceiver.push(commitmentKey);
*    }
*  }
* ```
*
* @returns a promise with an object, containing the AnonTransferOperationBuilder, which should be used in `Transaction.submitAbarTransaction`
*/
var abarToAbarAmount = function (anonKeysSender, anonPubKeyReceiver, amount, assetCode, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, commitmentsToSend, commitmentsForFee, allCommitments, additionalOwnedAbarItems, _i, allCommitments_1, givenCommitment, ownedAbarsResponseTwo, additionalOwnedAbarItem, abarToAbarResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getAbarToAbarAmountPayload)(anonKeysSender, anonPubKeyReceiver, amount, assetCode, givenCommitmentsList)];
            case 1:
                payload = _a.sent();
                console.log('🚀 ~ file: tripleMasking.ts ~ line 453 ~ payload', payload);
                commitmentsToSend = payload.commitmentsToSend, commitmentsForFee = payload.commitmentsForFee;
                allCommitments = __spreadArray(__spreadArray([], commitmentsToSend, true), commitmentsForFee, true);
                console.log('🚀 ~ file: tripleMasking.ts ~ line 458 ~ allCommitments', allCommitments);
                additionalOwnedAbarItems = [];
                _i = 0, allCommitments_1 = allCommitments;
                _a.label = 2;
            case 2:
                if (!(_i < allCommitments_1.length)) return [3 /*break*/, 5];
                givenCommitment = allCommitments_1[_i];
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 3:
                ownedAbarsResponseTwo = _a.sent();
                additionalOwnedAbarItem = ownedAbarsResponseTwo[0];
                additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, (0, exports.abarToAbar)(anonKeysSender, anonPubKeyReceiver, amount, additionalOwnedAbarItems)];
            case 6:
                abarToAbarResult = _a.sent();
                return [2 /*return*/, abarToAbarResult];
        }
    });
}); };
exports.abarToAbarAmount = abarToAbarAmount;
/**
 * Transfer funds from an 'anonymous' to a 'transparent' wallet
 *
 * @remarks
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer
 * those abars to the receiverPublickey.
 * Please note that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 * Also, by specifying `hideAmount` and `hideAssetType` parameters, user can have either (or both) of them hidden.
 *
 * @example
 *
 * ```ts
  const { transactionBuilder } = await TripleMasking.abarToBar(anonKeysSender, receiverPublickey, abarsList);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
  
 * ```
* @throws `Could not add abar to bar operation", Error - ${error as Error}`
* @throws `Could not add an additional input for abar to bar transfer operation`
* @throws `Could not build txn`
*
* @returns a promise with an object, containing the TransactionBuilder, which should be used in `Transaction.submitTransaction`
*/
var abarToBar = function (anonKeysSender, receiverXfrPublicKey, additionalOwnedAbarItems, hideAmount, hideAssetType) {
    if (hideAmount === void 0) { hideAmount = false; }
    if (hideAssetType === void 0) { hideAssetType = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var transactionBuilder, receiverXfrPublicKeyConverted, aXfrSpendKeySender, ownedAbarToUseAsSource, additionalOwnedAbars, abarPayloadSource, _i, additionalOwnedAbars_2, ownedAbarItemOne, abarPayloadNext, abarToBarData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Builder.getTransactionBuilder()];
                case 1:
                    transactionBuilder = _a.sent();
                    return [4 /*yield*/, Keypair.getXfrPublicKeyByBase64(receiverXfrPublicKey)];
                case 2:
                    receiverXfrPublicKeyConverted = _a.sent();
                    return [4 /*yield*/, (0, exports.getAnonKeypairFromJson)(anonKeysSender)];
                case 3:
                    aXfrSpendKeySender = (_a.sent()).aXfrSecretKeyConverted;
                    ownedAbarToUseAsSource = additionalOwnedAbarItems[0], additionalOwnedAbars = additionalOwnedAbarItems.slice(1);
                    return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarToUseAsSource, anonKeysSender)];
                case 4:
                    abarPayloadSource = _a.sent();
                    try {
                        transactionBuilder = transactionBuilder.add_operation_abar_to_bar(abarPayloadSource.myOwnedAbar, abarPayloadSource.abarOwnerMemo, abarPayloadSource.myMTLeafInfo, aXfrSpendKeySender, receiverXfrPublicKeyConverted, hideAmount, hideAssetType);
                    }
                    catch (error) {
                        console.log('Error adding Abar to bar', error);
                        throw new Error("Could not add abar to bar operation\", Error - ".concat(error));
                    }
                    _i = 0, additionalOwnedAbars_2 = additionalOwnedAbars;
                    _a.label = 5;
                case 5:
                    if (!(_i < additionalOwnedAbars_2.length)) return [3 /*break*/, 8];
                    ownedAbarItemOne = additionalOwnedAbars_2[_i];
                    return [4 /*yield*/, getAbarTransferInputPayload(ownedAbarItemOne, anonKeysSender)];
                case 6:
                    abarPayloadNext = _a.sent();
                    try {
                        transactionBuilder = transactionBuilder.add_operation_abar_to_bar(abarPayloadNext.myOwnedAbar, abarPayloadNext.abarOwnerMemo, abarPayloadNext.myMTLeafInfo, aXfrSpendKeySender, receiverXfrPublicKeyConverted, hideAmount, hideAssetType);
                    }
                    catch (error) {
                        console.log('Error from the backend:', error);
                        throw new Error("Could not add an additional input for abar to bar transfer operation\", Error - ".concat(error.message));
                    }
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    try {
                        transactionBuilder = transactionBuilder.build();
                    }
                    catch (err) {
                        throw new Error("could not build txn \"".concat(err, "\""));
                    }
                    abarToBarData = {
                        anonKeysSender: anonKeysSender,
                    };
                    return [2 /*return*/, { transactionBuilder: transactionBuilder, abarToBarData: abarToBarData, receiverXfrPublicKey: receiverXfrPublicKey }];
            }
        });
    });
};
exports.abarToBar = abarToBar;
/**
 * The `getAbarToBarAmountPayload` function retrieves the payload required for transferring abars to bars from one account to another. It simplifies the process by using the `getAbarToAbarAmountPayload` function internally.
 *
 * @param anonKeysSender - The anonymous keys of the sender account.
 * @param amount - The amount of the asset to be transferred.
 * @param assetCode - The code of the asset for the abars being transferred.
 * @param givenCommitmentsList - The list of given commitments to consider for the transfer.
 *
 * @returns An object containing the payload for the abar transfer, including the commitments to send the abars, the commitments to cover the transfer fee, and the additional amount required for the fee.
 *
 * @remarks
 * The `getAbarToBarAmountPayload` function internally uses the `getAbarToAbarAmountPayload` function to calculate the payload required for transferring abars.
 * It simplifies the process by providing a more streamlined interface and returning a subset of the payload.
 *
 * The `commitmentsToSend` field in the return value is an array of commitments that will be used to perform the abar transfer.
 *
 * The `commitmentsForFee` field in the return value is an array of commitments that will be used to pay the transfer fee.
 *
 * The `additionalAmountForFee` field in the return value is the additional amount required for the transfer fee, if applicable.
 * If this field is present and greater than zero, it indicates that additional abars need to be included to cover the fee.
 *
 * Example usage:
 * ```typescript
 * const anonKeysSender: Keypair.WalletKeypar = ...; // Sender's anonymous keys
 * const amount: string = "10"; // Amount of abars to transfer
 * const assetCode: string = "FOO"; // Asset code for the abars
 * const givenCommitmentsList: string[] = [...]; // List of given commitments
 *
 * const payload = await getAbarToBarAmountPayload(anonKeysSender, amount, assetCode, givenCommitmentsList);
 *
 * console.log(payload.commitmentsToSend); // Array of commitments for abar transfer
 * console.log(payload.commitmentsForFee); // Array of commitments for transfer fee
 * console.log(payload.additionalAmountForFee); // Additional amount required for the fee
 * ```
 */
var getAbarToBarAmountPayload = function (anonKeysSender, amount, assetCode, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, commitmentsToSend, commitmentsForFee, additionalAmountForFee;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getAbarToAbarAmountPayload)(anonKeysSender, anonKeysSender.publickey, amount, assetCode, givenCommitmentsList)];
            case 1:
                payload = _a.sent();
                commitmentsToSend = payload.commitmentsToSend, commitmentsForFee = payload.commitmentsForFee, additionalAmountForFee = payload.additionalAmountForFee;
                return [2 /*return*/, {
                        commitmentsToSend: commitmentsToSend,
                        commitmentsForFee: commitmentsForFee,
                        additionalAmountForFee: additionalAmountForFee,
                    }];
        }
    });
}); };
exports.getAbarToBarAmountPayload = getAbarToBarAmountPayload;
/**
 * Transfer the exact amount of the provided asset from an 'anonymous' to a 'transparent' wallet
 *
 * @remarks
 * Using a given array of provided commitments, (and associated abars that are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note that the provided commitments must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 * Its return value also contains a list of commitments spent during this operation, and a list of commitments with the transfer remainders (if any).
 * Also, by specifying `hideAmount` and `hideAssetType` parameters, user can have either (or both) of them hidden.
 *
 * @example
 * ```ts
 * const { transactionBuilder, remainderCommitements, spentCommitments } = await TripleMasking.abarToBarAmount(
 *   anonKeysSender,
 *   toWalletInfo.publickey,
 *   amountToSend,
 *   assetCodeToUse,
 *   givenCommitmentsListSender,
 * );
 *
 * // tx hash
 * const resultHandle = await Transaction.submitTransaction(transactionBuilder);
  
 * ```
* @returns a promise with an object, containing the TransactionBuilder, which should be used in `Transaction.submitTransaction`
*/
var abarToBarAmount = function (anonKeysSender, receiverXfrPublicKey, amount, assetCode, givenCommitmentsList, hideAmount, hideAssetType) {
    if (hideAmount === void 0) { hideAmount = false; }
    if (hideAssetType === void 0) { hideAssetType = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var payload, commitmentsToSend, commitmentsForFee, givenCommitmentsListSender, _a, anonTransferOperationBuilder, abarToAbarData, asset, decimals, amountToSendInWei, _resultHandle, commitmentsMap, retrivedCommitmentsListReceiver, remainderCommitements, _i, commitmentsMap_1, commitmentsMapEntry, commitmentKey, commitmentAmount, commitmentAssetType, commitmentAmountInWei, isSameAssetType, isSameAmount, allCommitments, additionalOwnedAbarItems, _b, allCommitments_2, givenCommitment, ownedAbarsResponseTwo, additionalOwnedAbarItem, abarToBarResult;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, exports.getAbarToBarAmountPayload)(anonKeysSender, amount, assetCode, givenCommitmentsList)];
                case 1:
                    payload = _c.sent();
                    commitmentsToSend = payload.commitmentsToSend, commitmentsForFee = payload.commitmentsForFee;
                    givenCommitmentsListSender = __spreadArray(__spreadArray([], commitmentsToSend, true), commitmentsForFee, true);
                    return [4 /*yield*/, (0, exports.abarToAbarAmount)(anonKeysSender, anonKeysSender.publickey, amount, assetCode, givenCommitmentsListSender)];
                case 2:
                    _a = _c.sent(), anonTransferOperationBuilder = _a.anonTransferOperationBuilder, abarToAbarData = _a.abarToAbarData;
                    return [4 /*yield*/, Asset.getAssetDetails(assetCode)];
                case 3:
                    asset = _c.sent();
                    decimals = asset.assetRules.decimals;
                    amountToSendInWei = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString());
                    return [4 /*yield*/, Transaction.submitAbarTransaction(anonTransferOperationBuilder)];
                case 4:
                    _resultHandle = _c.sent();
                    return [4 /*yield*/, (0, testHelpers_1.waitForBlockChange)(DEFAULT_BLOCKS_TO_WAIT_AFTER_ABAR)];
                case 5:
                    _c.sent();
                    console.log('abar transaction handle', _resultHandle);
                    commitmentsMap = abarToAbarData.commitmentsMap;
                    retrivedCommitmentsListReceiver = [];
                    remainderCommitements = [];
                    for (_i = 0, commitmentsMap_1 = commitmentsMap; _i < commitmentsMap_1.length; _i++) {
                        commitmentsMapEntry = commitmentsMap_1[_i];
                        commitmentKey = commitmentsMapEntry.commitmentKey, commitmentAmount = commitmentsMapEntry.commitmentAmount, commitmentAssetType = commitmentsMapEntry.commitmentAssetType;
                        console.log('🚀 ~ file: tripleMasking.ts ~ line 863 ~ commitmentsMapEntry', commitmentsMapEntry);
                        commitmentAmountInWei = BigInt((0, bigNumber_1.toWei)(commitmentAmount, decimals).toString());
                        isSameAssetType = commitmentAssetType === assetCode;
                        isSameAmount = commitmentAmountInWei === amountToSendInWei;
                        if (isSameAssetType && isSameAmount) {
                            console.log('🚀 ~ file: tripleMasking.ts ~ line 906 ~ amountToSendInWei!!!', amountToSendInWei);
                            retrivedCommitmentsListReceiver.push(commitmentKey);
                            continue;
                        }
                        remainderCommitements.push(commitmentKey);
                    }
                    allCommitments = __spreadArray([], retrivedCommitmentsListReceiver, true);
                    additionalOwnedAbarItems = [];
                    _b = 0, allCommitments_2 = allCommitments;
                    _c.label = 6;
                case 6:
                    if (!(_b < allCommitments_2.length)) return [3 /*break*/, 9];
                    givenCommitment = allCommitments_2[_b];
                    return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
                case 7:
                    ownedAbarsResponseTwo = _c.sent();
                    additionalOwnedAbarItem = ownedAbarsResponseTwo[0];
                    additionalOwnedAbarItems.push(additionalOwnedAbarItem);
                    _c.label = 8;
                case 8:
                    _b++;
                    return [3 /*break*/, 6];
                case 9: return [4 /*yield*/, (0, exports.abarToBar)(anonKeysSender, receiverXfrPublicKey, additionalOwnedAbarItems, hideAmount, hideAssetType)];
                case 10:
                    abarToBarResult = _c.sent();
                    return [2 /*return*/, __assign(__assign({}, abarToBarResult), { remainderCommitements: remainderCommitements, spentCommitments: givenCommitmentsListSender })];
            }
        });
    });
};
exports.abarToBarAmount = abarToBarAmount;
/**
 * The `getNullifierHashesFromCommitments` function retrieves the nullifier hashes corresponding to the provided commitments.
 *
 * @param anonKeys - The anonymous keys associated with the commitments.
 * @param givenCommitmentsList - The list of commitments for which to retrieve the nullifier hashes.
 *
 * @returns A promise that resolves to an array of nullifier hashes.
 *
 * @throws An error if there was an issue retrieving the owned abars or generating the nullifier hash.
 *
 * @remarks
 * The `getNullifierHashesFromCommitments` function iterates over the given commitments and retrieves the owned abars associated with each commitment using the `getOwnedAbars` function. It then generates the nullifier hash for each owned abar using the `genNullifierHash` function. The function handles error scenarios by throwing informative error messages.
 *
 * Example usage:
 * ```typescript
 * const anonKeys = {
 *   publickey: 'ABC123', // Public key
 *   privateStr: 'xyzABC...', // Private key string
 * };
 * const commitments = ['commitment1', 'commitment2', 'commitment3']; // List of commitments
 *
 * try {
 *   const nullifierHashes = await getNullifierHashesFromCommitments(anonKeys, commitments);
 *   console.log(nullifierHashes); // ['hash1', 'hash2', 'hash3']
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
var getNullifierHashesFromCommitments = function (anonKeys, givenCommitmentsList) { return __awaiter(void 0, void 0, void 0, function () {
    var publickey, privateStr, nullifierHashes, _i, givenCommitmentsList_3, givenCommitment, ownedAbarsResponse, error_11, ownedAbarItem, abarData, atxoSid, ownedAbar, hash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publickey = anonKeys.publickey, privateStr = anonKeys.privateStr;
                nullifierHashes = [];
                _i = 0, givenCommitmentsList_3 = givenCommitmentsList;
                _a.label = 1;
            case 1:
                if (!(_i < givenCommitmentsList_3.length)) return [3 /*break*/, 8];
                givenCommitment = givenCommitmentsList_3[_i];
                ownedAbarsResponse = [];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, exports.getOwnedAbars)(givenCommitment)];
            case 3:
                ownedAbarsResponse = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_11 = _a.sent();
                console.log("getOwnedAbars for '".concat(publickey, "'->'").concat(givenCommitment, "' returned an error. ").concat(error_11.message), console.log('Full Error', error_11));
                return [3 /*break*/, 7];
            case 5:
                ownedAbarItem = ownedAbarsResponse[0];
                if (!ownedAbarItem) {
                    return [3 /*break*/, 7];
                }
                abarData = ownedAbarItem.abarData;
                atxoSid = abarData.atxoSid, ownedAbar = abarData.ownedAbar;
                return [4 /*yield*/, (0, exports.genNullifierHash)(atxoSid, ownedAbar, privateStr)];
            case 6:
                hash = _a.sent();
                nullifierHashes.push(hash);
                _a.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8: return [2 /*return*/, nullifierHashes];
        }
    });
}); };
exports.getNullifierHashesFromCommitments = getNullifierHashesFromCommitments;
/**
 * The `decryptAbarMemo` function is an asynchronous function that decrypts an abar memo item using the provided AnonKeyPair.
 *
 * @param abarMemoItem - An array containing the atxoSid and the abar memo data to be decrypted.
 * @param anonKeys - An object of type `WalletKeypar` containing the AnonKeyPair used for decryption.
 *
 * @remarks
 * This function internally uses the `getAnonKeypairFromJson` function to convert the AnonKeyPair from JSON format to the required format for decryption.
 * It also depends on the external `ledger` module, which should be imported from the wasm module and available in the module where this function is used.
 *
 * @remarks
 * In order to access the details of the decrypted abar item (e.g., amount, currency), the abar memo item needs to be decrypted.
 *
 * @example
 * ```typescript
 * const abarMemoItem = [
 *   "atxoSid123456",
 *   encryptedAbarMemoData // actual encrypted abar memo data in JSON format.
 * ];
 * const anonKeys = {
 *   publickey: "base64publickey",
 *   privateStr: "base64privatekey",
 * };
 *
 * try {
 *   const decryptedAbarData = await decryptAbarMemo(abarMemoItem, anonKeys);
 *
 *   if (decryptedAbarData) {
 *     console.log("Decrypted Abar Data:");
 *     console.log("atxoSid:", decryptedAbarData.atxoSid);
 *     console.log("Decrypted Abar:", decryptedAbarData.decryptedAbar);
 *     console.log("Owner:", decryptedAbarData.owner);
 *   } else {
 *     console.log("Failed to decrypt Abar Memo.");
 *   }
 * } catch (error) {
 *   console.error("Error decrypting Abar Memo:", error);
 * }
 * ```
 *
 * @returns A promise that resolves to an object of type `DecryptedAbarMemoData` containing the decrypted abar memo data, or `false` if decryption fails.
 */
var decryptAbarMemo = function (abarMemoItem, anonKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, atxoSid, myMemoData, axfrSpendKey, abarOwnerMemo, decryptedAbar, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                atxoSid = abarMemoItem[0], myMemoData = abarMemoItem[1];
                return [4 /*yield*/, (0, exports.getAnonKeypairFromJson)(anonKeys)];
            case 2:
                axfrSpendKey = (_a.sent()).aXfrSecretKeyConverted;
                abarOwnerMemo = ledger.AxfrOwnerMemo.from_json(myMemoData);
                try {
                    decryptedAbar = ledger.try_decrypt_axfr_memo(abarOwnerMemo, axfrSpendKey);
                }
                catch (error) {
                    return [2 /*return*/, false];
                }
                result = {
                    atxoSid: atxoSid,
                    decryptedAbar: decryptedAbar,
                    owner: anonKeys,
                };
                return [2 /*return*/, result];
        }
    });
}); };
exports.decryptAbarMemo = decryptAbarMemo;
/**
 * The `getCommitmentByAtxoSid` function retrieves the commitment corresponding to the provided ATXO SID.
 *
 * @param atxoSid - The ATXO SID for which to retrieve the commitment.
 *
 * @returns A promise that resolves to an object containing the ATXO SID and the corresponding commitment.
 *
 * @throws An error if there was an issue retrieving the commitment or if no response was received.
 *
 * @remarks
 * The `getCommitmentByAtxoSid` function interacts with the network to fetch the commitment associated with the provided ATXO SID.
 * It utilizes the `getLedger` function to access the ledger and the `Network.getAbarCommitment` function to retrieve the commitment. The function handles error scenarios by throwing informative error messages.
 *
 * Example usage:
 * ```typescript
 * const atxoSid = 'ABC123'; // ATXO SID
 *
 * try {
 *   const commitment = await getCommitmentByAtxoSid(atxoSid);
 *   console.log(commitment); // { atxoSid: 'ABC123', commitment: 'xyzABC...' }
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
var getCommitmentByAtxoSid = function (atxoSid) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, commitementResult, error, response, commitmentInBase58;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                return [4 /*yield*/, Network.getAbarCommitment("".concat(atxoSid))];
            case 2:
                commitementResult = _a.sent();
                error = commitementResult.error, response = commitementResult.response;
                if (error) {
                    (0, utils_1.log)('error', error);
                    throw new Error("could not get commitment by atxo sid. details: ".concat(error.message));
                }
                if (!response) {
                    throw new Error("could not get commitment by atxo sid. no response retrieved");
                }
                commitmentInBase58 = ledger.base64_to_base58(response);
                return [2 /*return*/, {
                        atxoSid: atxoSid,
                        commitment: commitmentInBase58,
                    }];
        }
    });
}); };
exports.getCommitmentByAtxoSid = getCommitmentByAtxoSid;
//# sourceMappingURL=tripleMasking.js.map