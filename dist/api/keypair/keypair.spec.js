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
require("@testing-library/jest-dom/extend-expect");
var keypair_1 = require("./keypair");
describe('keypair (unit test)', function () {
    describe('restoreFromPrivateKey', function () {
        var publickey = '1mtO4j3bvRiKlXotdD1q0DQYoxutSgee-f1LQtlq45g=';
        var address = 'fra16e45ac3amw733z540gkhg0t26q6p3gcm449q08hel4959kt2uwvq9svvqh';
        var pkey = 'Y6umoUmBJRPYJU5n_Y9bHuhoHm6aDMsxDI9FLJzOEXc=';
        var password = '345';
        it('restores the keypair', function () { return __awaiter(void 0, void 0, void 0, function () {
            var walletInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.restoreFromPrivateKey)(pkey, password)];
                    case 1:
                        walletInfo = _a.sent();
                        expect(walletInfo).toHaveProperty('keyStore');
                        expect(walletInfo).toHaveProperty('publickey');
                        expect(walletInfo).toHaveProperty('address');
                        expect(walletInfo).toHaveProperty('keypair');
                        expect(walletInfo).toHaveProperty('privateStr');
                        expect(walletInfo.publickey).toEqual(publickey);
                        expect(walletInfo.address).toEqual(address);
                        expect(walletInfo.keypair).toHaveProperty('ptr');
                        expect(walletInfo.keyStore).toHaveLength(188);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws the error when bad private key is used', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect((0, keypair_1.restoreFromPrivateKey)('123', password)).rejects.toThrow('could not restore keypair. Keypair is empty')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getMnemonic', function () {
        it('creates a mnemonic of a desired length using default lang ', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.getMnemonic)(24)];
                    case 1:
                        result = _a.sent();
                        expect(result.length).toEqual(24);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if an unsupported lang is submitted', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect((0, keypair_1.getMnemonic)(24, 'FOO')).rejects.toThrowError('could not generate custom mnemonic. Details are')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getPrivateKeyStr', function () {
        it('creates a private key string from a given XfrKeyPair', function () { return __awaiter(void 0, void 0, void 0, function () {
            var kp, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.createKeypair)('123')];
                    case 1:
                        kp = _a.sent();
                        return [4 /*yield*/, (0, keypair_1.getPrivateKeyStr)(kp.keypair)];
                    case 2:
                        result = _a.sent();
                        expect(result.length).toEqual(44);
                        expect(result.split('').pop()).toEqual('=');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if not an instance of XfrKeyPair given', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect((0, keypair_1.getPrivateKeyStr)('FOO')).rejects.toThrowError('could not get priv key string')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getPublicKeyStr', function () {
        it('creates a public key string from a given XfrKeyPair', function () { return __awaiter(void 0, void 0, void 0, function () {
            var kp, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.createKeypair)('123')];
                    case 1:
                        kp = _a.sent();
                        return [4 /*yield*/, (0, keypair_1.getPublicKeyStr)(kp.keypair)];
                    case 2:
                        result = _a.sent();
                        expect(result.length).toEqual(44);
                        expect(result.split('').pop()).toEqual('=');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if not an instance of XfrKeyPair given', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect((0, keypair_1.getPublicKeyStr)('FOO')).rejects.toThrowError('could not get pub key string')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAddress', function () {
        it('creates an address string from a given XfrKeyPair', function () { return __awaiter(void 0, void 0, void 0, function () {
            var kp, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.createKeypair)('123')];
                    case 1:
                        kp = _a.sent();
                        return [4 /*yield*/, (0, keypair_1.getAddress)(kp.keypair)];
                    case 2:
                        result = _a.sent();
                        expect(result.length).toEqual(62);
                        expect(result.split('').slice(0, 3).join('')).toEqual('fra');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if not an instance of XfrKeyPair given', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect((0, keypair_1.getAddress)('FOO')).rejects.toThrowError('could not get address string')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAddressByPublicKey', function () {
        it('creates an address from a given public key string', function () { return __awaiter(void 0, void 0, void 0, function () {
            var kp, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.createKeypair)('123')];
                    case 1:
                        kp = _a.sent();
                        return [4 /*yield*/, (0, keypair_1.getAddressByPublicKey)(kp.publickey)];
                    case 2:
                        result = _a.sent();
                        expect(result).toEqual(kp.address);
                        expect(result.length).toEqual(62);
                        expect(result.split('').slice(0, 3).join('')).toEqual('fra');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if not a valid public key is given', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect((0, keypair_1.getAddressByPublicKey)('aa')).rejects.toThrowError('could not get address by public key')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAddressPublicAndKey', function () {
        it('creates an instance of a LightWalletKeypair using a given address', function () { return __awaiter(void 0, void 0, void 0, function () {
            var kp, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.createKeypair)('123')];
                    case 1:
                        kp = _a.sent();
                        return [4 /*yield*/, (0, keypair_1.getAddressPublicAndKey)(kp.address)];
                    case 2:
                        result = _a.sent();
                        expect(result).toHaveProperty('address');
                        expect(result).toHaveProperty('publickey');
                        expect(result.address).toEqual(kp.address);
                        expect(result.publickey).toEqual(kp.publickey);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if not a valid address key is given', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect((0, keypair_1.getAddressPublicAndKey)('aa')).rejects.toThrowError('could not create a LightWalletKeypair')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAddressPublicAndKey', function () {
        it('creates an instance of a WalletKeypar', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.createKeypair)('123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveProperty('keyStore');
                        expect(result).toHaveProperty('publickey');
                        expect(result).toHaveProperty('address');
                        expect(result).toHaveProperty('keypair');
                        expect(result).toHaveProperty('privateStr');
                        expect(result.publickey.length).toEqual(44);
                        expect(result.address.length).toEqual(62);
                        expect(result.privateStr.length).toEqual(44);
                        expect(result.keyStore.length).toEqual(188);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if not a valid address key is given', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect((0, keypair_1.createKeypair)([123])).rejects.toThrowError('could not create a WalletKeypar')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAXfrPublicKeyByBase64', function () {
        it('throws an error if not a valid public key is given', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect((0, keypair_1.getAXfrPublicKeyByBase64)('aa')).rejects.toThrowError('could not get AXfrPubKey by base64 public key, ')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('get AXfrPubKey by base64 public key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var kp, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.createKeypair)('123')];
                    case 1:
                        kp = _a.sent();
                        return [4 /*yield*/, (0, keypair_1.getAXfrPublicKeyByBase64)(kp.publickey)];
                    case 2:
                        result = _a.sent();
                        expect(result).toHaveProperty('free');
                        expect(typeof result.free).toBe('function');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getXPublicKeyByBase64', function () {
        it('throws an error if not a valid public key is given', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect((0, keypair_1.getXPublicKeyByBase64)('aa')).rejects.toThrowError("could not get XPublicKey by base64 public key, \"")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('get XPublicKey by base64 public key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var kp, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.createKeypair)('123')];
                    case 1:
                        kp = _a.sent();
                        return [4 /*yield*/, (0, keypair_1.getXPublicKeyByBase64)(kp.publickey)];
                    case 2:
                        result = _a.sent();
                        expect(result).toHaveProperty('free');
                        expect(typeof result.free).toBe('function');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getXfrPublicKeyByBase64', function () {
        it('throws an error if not a valid public key is given', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect((0, keypair_1.getXfrPublicKeyByBase64)('aa')).rejects.toThrowError("could not get xfr public key by base64, \"")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('get XfrPublicKey by base64', function () { return __awaiter(void 0, void 0, void 0, function () {
            var kp, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.createKeypair)('123')];
                    case 1:
                        kp = _a.sent();
                        return [4 /*yield*/, (0, keypair_1.getXfrPublicKeyByBase64)(kp.publickey)];
                    case 2:
                        result = _a.sent();
                        expect(result).toHaveProperty('free');
                        expect(typeof result.free).toBe('function');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getPublicKeyByXfr', function () {
        it('throws an error if not a valid public key is given', function () { return __awaiter(void 0, void 0, void 0, function () {
            var toPublickey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toPublickey = 'mockedToPublickey';
                        return [4 /*yield*/, expect((0, keypair_1.getPublicKeyByXfr)(toPublickey)).rejects.toThrowError("could not get base64 public key by xfr, \"")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('get publicKey by xfr', function () { return __awaiter(void 0, void 0, void 0, function () {
            var kp, toPublickey, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, keypair_1.createKeypair)('123')];
                    case 1:
                        kp = _a.sent();
                        return [4 /*yield*/, (0, keypair_1.getXfrPublicKeyByBase64)(kp.publickey)];
                    case 2:
                        toPublickey = _a.sent();
                        return [4 /*yield*/, (0, keypair_1.getPublicKeyByXfr)(toPublickey)];
                    case 3:
                        result = _a.sent();
                        expect(typeof result).toBe('string');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=keypair.spec.js.map