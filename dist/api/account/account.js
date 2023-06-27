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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedSids = exports.getCreatedAssets = exports.processIssuedRecordList = exports.processIssuedRecordItem = exports.create = exports.getBalance = exports.getBalanceInWei = exports.getAssetBalance = void 0;
const bigNumber_1 = require("../../services/bigNumber");
const utxoHelper_1 = require("../../services/utxoHelper");
const keypair_1 = require("../keypair");
const Network = __importStar(require("../network"));
const sdkAsset_1 = require("../sdkAsset");
const getAssetBalance = (walletKeypair, assetCode, sids) => __awaiter(void 0, void 0, void 0, function* () {
    let utxoDataList;
    try {
        utxoDataList = yield (0, utxoHelper_1.addUtxo)(walletKeypair, sids);
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not get list of addUtxo, Details: "${e.message}"`);
    }
    if (!utxoDataList.length) {
        return (0, bigNumber_1.create)(0);
    }
    const filteredUtxoList = utxoDataList.filter(row => { var _a; return ((_a = row === null || row === void 0 ? void 0 : row.body) === null || _a === void 0 ? void 0 : _a.asset_type) === assetCode; });
    if (!filteredUtxoList.length) {
        return (0, bigNumber_1.create)(0);
    }
    const currentBalance = filteredUtxoList.reduce((acc, currentUtxoItem) => {
        var _a;
        return acc + Number(((_a = currentUtxoItem.body) === null || _a === void 0 ? void 0 : _a.amount) || 0);
    }, 0);
    return (0, bigNumber_1.create)(currentBalance);
});
exports.getAssetBalance = getAssetBalance;
/**
 * @todo Add unit test
 * @param walletKeypair
 * @param assetCode
 * @returns
 */
const getBalanceInWei = (walletKeypair, assetCode) => __awaiter(void 0, void 0, void 0, function* () {
    const sidsResult = yield Network.getOwnedSids(walletKeypair.publickey);
    const { response: sids } = sidsResult;
    if (!sids) {
        throw new Error('No sids were fetched!');
    }
    const fraAssetCode = yield (0, sdkAsset_1.getFraAssetCode)();
    const assetCodeToUse = assetCode || fraAssetCode;
    try {
        const balanceInWei = yield (0, exports.getAssetBalance)(walletKeypair, assetCodeToUse, sids);
        return balanceInWei;
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not fetch balance in wei for "${assetCodeToUse}". Error - ${e.message}`);
    }
});
exports.getBalanceInWei = getBalanceInWei;
/**
 * Get the balance of the specific asset for the given user
 *
 * @remarks
 * Using this function user can retrieve the balance for the specific asset code, which could be either custom asset or an FRA asset
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *
 *  const balance = await Account.getBalance(walletInfo, customAssetCode);
 * ```
 *
 * @throws `No sids were fetched`
 * @throws `Could not fetch balance`
 *
 * @returns Result of transaction submission to the network
 */
const getBalance = (walletKeypair, assetCode) => __awaiter(void 0, void 0, void 0, function* () {
    const fraAssetCode = yield (0, sdkAsset_1.getFraAssetCode)();
    const assetCodeToUse = assetCode || fraAssetCode;
    try {
        const balanceInWei = yield (0, exports.getBalanceInWei)(walletKeypair, assetCodeToUse);
        const balance = (0, bigNumber_1.fromWei)(balanceInWei, 6).toFormat(6);
        return balance;
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not fetch balance for "${assetCodeToUse}". Error - ${e.message}`);
    }
});
exports.getBalance = getBalance;
const create = (password) => __awaiter(void 0, void 0, void 0, function* () {
    let walletKeyPair;
    try {
        walletKeyPair = yield (0, keypair_1.createKeypair)(password);
    }
    catch (err) {
        const e = err;
        throw new Error(`Could not create a new account. "${e.message}"`);
    }
    return walletKeyPair;
});
exports.create = create;
const processIssuedRecordItem = (issuedRecord) => __awaiter(void 0, void 0, void 0, function* () {
    const [txRecord, ownerMemo] = issuedRecord;
    const assetCode = yield (0, sdkAsset_1.getAssetCode)(txRecord.record.asset_type.NonConfidential);
    return Object.assign(Object.assign({}, txRecord), { code: assetCode, ownerMemo });
});
exports.processIssuedRecordItem = processIssuedRecordItem;
const processIssuedRecordList = (issuedRecords) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(issuedRecords.map(issuedRecord => (0, exports.processIssuedRecordItem)(issuedRecord)));
});
exports.processIssuedRecordList = processIssuedRecordList;
const getCreatedAssets = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const { publickey } = yield (0, keypair_1.getAddressPublicAndKey)(address);
    const result = yield Network.getIssuedRecords(publickey);
    const { response: recordsResponse } = result;
    if (!recordsResponse) {
        throw new Error('No issued records were fetched!');
    }
    const processedIssuedRecordsList = yield (0, exports.processIssuedRecordList)(recordsResponse);
    return processedIssuedRecordsList;
});
exports.getCreatedAssets = getCreatedAssets;
const getRelatedSids = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Network.getRelatedSids(address);
    const { response: relatedSids } = result;
    if (!relatedSids) {
        throw new Error('No related sids were fetched!');
    }
    return relatedSids;
});
exports.getRelatedSids = getRelatedSids;
//# sourceMappingURL=account.js.map