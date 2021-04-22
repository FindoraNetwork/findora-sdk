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
var api_1 = require("./api");
var services_1 = require("./services");
var myAsset = function () { return __awaiter(void 0, void 0, void 0, function () {
    var assetCode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 1:
                assetCode = _a.sent();
                console.log('FRA assetCode IS ', assetCode);
                return [2 /*return*/];
        }
    });
}); };
var myAssetN = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pkey, password, assetCode, walletInfo, asset;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
                password = '123';
                console.log('pass!', password);
                return [4 /*yield*/, api_1.Asset.getRandomAssetCode()];
            case 1:
                assetCode = _a.sent();
                return [4 /*yield*/, api_1.Keypair.restorePrivatekeypair(pkey, password)];
            case 2:
                walletInfo = _a.sent();
                return [4 /*yield*/, api_1.Asset.defineAsset(walletInfo, assetCode)];
            case 3:
                asset = _a.sent();
                console.log('asset IS !', asset);
                return [2 /*return*/];
        }
    });
}); };
var myMain = function () { return __awaiter(void 0, void 0, void 0, function () {
    var address, sidsResult, sid, utxo, ownerMemo, stateCommitment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';
                return [4 /*yield*/, services_1.network.getOwnedSids(address)];
            case 1:
                sidsResult = _a.sent();
                console.log('sidsResult', sidsResult);
                sid = 519;
                return [4 /*yield*/, services_1.network.getUtxo(sid)];
            case 2:
                utxo = _a.sent();
                console.log('utxo!', utxo);
                return [4 /*yield*/, services_1.network.getOwnerMemo(sid)];
            case 3:
                ownerMemo = _a.sent();
                console.log('owner memo', ownerMemo);
                return [4 /*yield*/, services_1.network.getStateCommitment()];
            case 4:
                stateCommitment = _a.sent();
                console.log('stateCommitment', stateCommitment);
                return [2 /*return*/];
        }
    });
}); };
var myUtxo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var address, sidsResult, pkey, password, walletInfo, sids, utxoDataList, fraCode, amount, sendUtxoList, utxoInputsInfo, trasferOperation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                address = 'gMwGfoP1B98ZRBRFvCJyv48fJLoRgzcoWH4Vd4Acqyk';
                return [4 /*yield*/, services_1.network.getOwnedSids(address)];
            case 1:
                sidsResult = _a.sent();
                pkey = '8yQCMZzFRdjm5QK1cYDiBa6yICrE5mt37xl9n8V9MXE=';
                password = '123';
                return [4 /*yield*/, api_1.Keypair.restorePrivatekeypair(pkey, password)];
            case 2:
                walletInfo = _a.sent();
                sids = sidsResult.response;
                console.log('sids', sids);
                if (!sids) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, api_1.Core.Fee.addUtxo(walletInfo, sids)];
            case 3:
                utxoDataList = _a.sent();
                console.log('utxoDataList', utxoDataList);
                return [4 /*yield*/, api_1.Asset.getFraAssetCode()];
            case 4:
                fraCode = _a.sent();
                amount = BigInt(3);
                sendUtxoList = api_1.Core.Fee.getSendUtxo(fraCode, amount, utxoDataList);
                console.log('sendUtxoList!', sendUtxoList);
                return [4 /*yield*/, api_1.Core.Fee.addUtxoInputs(sendUtxoList)];
            case 5:
                utxoInputsInfo = _a.sent();
                console.log('utxoInputsInfo!', utxoInputsInfo);
                return [4 /*yield*/, api_1.Core.Fee.getTransferOperationWithFee(walletInfo, utxoInputsInfo)];
            case 6:
                trasferOperation = _a.sent();
                console.log('trasferOperation!', trasferOperation);
                return [2 /*return*/];
        }
    });
}); };
myAssetN();
//# sourceMappingURL=run.js.map