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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMnemonic = exports.createKeypair = exports.restoreFromKeystoreString = exports.restoreFromKeystore = exports.restoreFromMnemonic = exports.restoreFromPrivateKey = exports.getAddressPublicAndKey = exports.getPublicKeyByXfr = exports.getXfrPublicKeyByBase64 = exports.getAddressByPublicKey = exports.getAddress = exports.getPublicKeyStr = exports.getPrivateKeyStr = void 0;
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
/**
 * Returns a private key
 * @rem
 * @remarks
 * Using a given {@link https://git@github.com:FindoraNetwork/wasm-js-bindings.git | Ledger } **XfrKeyPair** keypair it returns a private key.
 *
 * This method is used when user needs to retrieve a private key from the **XfrKeyPair** keypair
 *
 * @example
 *
 * ```ts
 * // We use Findora Ledger to generate a new keypair (in demo purposes)
 * const ledger = await getLedger();
 * const keypair = ledger.new_keypair();
 *
 * // Now, we use `getPrivateKeyStr` to return a provate key of this keypair
 * const privateStr = await getPrivateKeyStr(keypair);
 * ```
 * @param keypair - XfrKeyPair
 * @returns Private key
 *
 * @throws `An error returned by Ledger with a prefix added by SDK`
 */
var getPrivateKeyStr = function (keypair) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, privateStr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                try {
                    privateStr = ledger.get_priv_key_str(keypair).replace(/^"|"$/g, '');
                    return [2 /*return*/, privateStr];
                }
                catch (err) {
                    throw new Error("could not get priv key string, \"".concat(err, "\" "));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getPrivateKeyStr = getPrivateKeyStr;
var getPublicKeyStr = function (keypair) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, publickey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                try {
                    publickey = ledger.get_pub_key_str(keypair).replace(/"/g, '');
                    // other option is
                    //  const publickey = ledger.public_key_to_base64(ledger.get_pk_from_keypair(keypair));
                    //
                    return [2 /*return*/, publickey];
                }
                catch (err) {
                    throw new Error("could not get pub key string, \"".concat(err, "\" "));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getPublicKeyStr = getPublicKeyStr;
var getAddress = function (keypair) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, address;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                try {
                    address = ledger.public_key_to_bech32(ledger.get_pk_from_keypair(keypair));
                    return [2 /*return*/, address];
                }
                catch (err) {
                    throw new Error("could not get address string, \"".concat(err, "\" "));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getAddress = getAddress;
var getAddressByPublicKey = function (publicKey) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, address;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                try {
                    address = ledger.base64_to_bech32(publicKey);
                    return [2 /*return*/, address];
                }
                catch (err) {
                    throw new Error("could not get address by public key, \"".concat(err, "\" "));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getAddressByPublicKey = getAddressByPublicKey;
/**
 * @todo Add unit test
 */
var getXfrPublicKeyByBase64 = function (publicKey) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, toPublickey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                try {
                    toPublickey = ledger.public_key_from_base64(publicKey);
                    return [2 /*return*/, toPublickey];
                }
                catch (err) {
                    throw new Error("could not get xfr public key by base64, \"".concat(err, "\" "));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getXfrPublicKeyByBase64 = getXfrPublicKeyByBase64;
/**
 * @todo Add unit test
 */
var getPublicKeyByXfr = function (publicKey) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, toPublickey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                try {
                    toPublickey = ledger.public_key_to_base64(publicKey);
                    return [2 /*return*/, toPublickey];
                }
                catch (err) {
                    throw new Error("could not get base64 public key by xfr, \"".concat(err, "\" "));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getPublicKeyByXfr = getPublicKeyByXfr;
var getAddressPublicAndKey = function (address) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, publickey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                try {
                    publickey = ledger.bech32_to_base64(address);
                    return [2 /*return*/, {
                            address: address,
                            publickey: publickey,
                        }];
                }
                catch (err) {
                    throw new Error("could not create a LightWalletKeypair, \"".concat(err, "\" "));
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getAddressPublicAndKey = getAddressPublicAndKey;
/**
 * Creates an instance of {@link WalletKeypar} using given private key and password.
 *
 * @remarks
 * This method is used to restore a `wallet keypair`.
 *
 * The **Keypair** contains some essential information, such as:
 * - address
 * - public key
 * - key store
 *
 * and so on, and it is used for pretty much any _personalized_ operation that user can do using FindoraSdk
 *
 * @example
 *
 * ```ts
 * const password = 'qsjEI%123';
 * const pkey = 'XXXXXXXXXX';
 *
 * // Create a wallet info object using given private key and password
 * const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 * ```
 * @param privateStr - Private key
 * @param password - Password to be used to generate an encrypted KeyStore
 * @returns An instance of {@link WalletKeypar}
 *
 */
var restoreFromPrivateKey = function (privateStr, password) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, toSend, keypair, keypairStr, encrypted, publickey, address;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                toSend = "\"".concat(privateStr, "\"");
                try {
                    keypair = ledger.create_keypair_from_secret(toSend);
                }
                catch (error) {
                    throw new Error("could not restore keypair. details: \"".concat(error.message, "\""));
                }
                if (!keypair) {
                    throw new Error('could not restore keypair. Keypair is empty');
                }
                keypairStr = ledger.keypair_to_str(keypair);
                encrypted = ledger.encryption_pbkdf2_aes256gcm(keypairStr, password);
                return [4 /*yield*/, (0, exports.getPublicKeyStr)(keypair)];
            case 2:
                publickey = _a.sent();
                return [4 /*yield*/, (0, exports.getAddress)(keypair)];
            case 3:
                address = _a.sent();
                return [2 /*return*/, {
                        keyStore: encrypted,
                        publickey: publickey,
                        address: address,
                        keypair: keypair,
                        privateStr: privateStr,
                    }];
        }
    });
}); };
exports.restoreFromPrivateKey = restoreFromPrivateKey;
var restoreFromMnemonic = function (mnemonic, password) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, keypair, keyPairStr, encrypted, publickey, address;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                keypair = ledger.restore_keypair_from_mnemonic_default(mnemonic.join(' '));
                return [4 /*yield*/, (0, exports.getPrivateKeyStr)(keypair)];
            case 2:
                keyPairStr = _a.sent();
                encrypted = ledger.encryption_pbkdf2_aes256gcm(keyPairStr, password);
                return [4 /*yield*/, (0, exports.getPublicKeyStr)(keypair)];
            case 3:
                publickey = _a.sent();
                return [4 /*yield*/, (0, exports.getAddress)(keypair)];
            case 4:
                address = _a.sent();
                return [2 /*return*/, {
                        keyStore: encrypted,
                        publickey: publickey,
                        address: address,
                        keypair: keypair,
                        privateStr: keyPairStr,
                    }];
        }
    });
}); };
exports.restoreFromMnemonic = restoreFromMnemonic;
var restoreFromKeystore = function (keyStore, password) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, keyPairStr, keypair, encrypted, publickey, address, privateStr, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, , 7]);
                keyPairStr = ledger.decryption_pbkdf2_aes256gcm(keyStore, password);
                keypair = ledger.keypair_from_str(keyPairStr);
                encrypted = ledger.encryption_pbkdf2_aes256gcm(keyPairStr, password);
                return [4 /*yield*/, (0, exports.getPublicKeyStr)(keypair)];
            case 3:
                publickey = _a.sent();
                return [4 /*yield*/, (0, exports.getAddress)(keypair)];
            case 4:
                address = _a.sent();
                return [4 /*yield*/, (0, exports.getPrivateKeyStr)(keypair)];
            case 5:
                privateStr = _a.sent();
                return [2 /*return*/, {
                        keyStore: encrypted,
                        publickey: publickey,
                        address: address,
                        keypair: keypair,
                        privateStr: privateStr,
                    }];
            case 6:
                err_1 = _a.sent();
                throw new Error("could not restore keypair from the key string. Details: \"".concat(err_1.message, "\""));
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.restoreFromKeystore = restoreFromKeystore;
var restoreFromKeystoreString = function (keyStoreString, password) { return __awaiter(void 0, void 0, void 0, function () {
    var keyStoreObject, keyStore, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                keyStoreObject = JSON.parse(keyStoreString).encryptedKey;
                keyStore = new Uint8Array(Object.values(keyStoreObject));
                return [4 /*yield*/, (0, exports.restoreFromKeystore)(keyStore, password)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                err_2 = _a.sent();
                throw new Error("could not restore keypair from the key store string. Details: \"".concat(err_2.message, "\""));
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.restoreFromKeystoreString = restoreFromKeystoreString;
var createKeypair = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, keypair, keyPairStr, encrypted, privateStr, publickey, address, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, , 7]);
                keypair = ledger.new_keypair();
                keyPairStr = ledger.keypair_to_str(keypair);
                encrypted = ledger.encryption_pbkdf2_aes256gcm(keyPairStr, password);
                return [4 /*yield*/, (0, exports.getPrivateKeyStr)(keypair)];
            case 3:
                privateStr = _a.sent();
                return [4 /*yield*/, (0, exports.getPublicKeyStr)(keypair)];
            case 4:
                publickey = _a.sent();
                return [4 /*yield*/, (0, exports.getAddress)(keypair)];
            case 5:
                address = _a.sent();
                return [2 /*return*/, {
                        keyStore: encrypted,
                        publickey: publickey,
                        address: address,
                        keypair: keypair,
                        privateStr: privateStr,
                    }];
            case 6:
                err_3 = _a.sent();
                throw new Error("could not create a WalletKeypar, \"".concat(err_3, "\" "));
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createKeypair = createKeypair;
var getMnemonic = function (desiredLength, mnemonicLang) {
    if (mnemonicLang === void 0) { mnemonicLang = 'en'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var ledger, ledgerMnemonicString, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
                case 1:
                    ledger = _a.sent();
                    try {
                        ledgerMnemonicString = ledger.generate_mnemonic_custom(desiredLength, mnemonicLang);
                        result = String(ledgerMnemonicString).split(' ');
                        return [2 /*return*/, result];
                    }
                    catch (err) {
                        throw new Error("could not generate custom mnemonic. Details are: \"".concat(err, "\""));
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.getMnemonic = getMnemonic;
//# sourceMappingURL=keypair.js.map