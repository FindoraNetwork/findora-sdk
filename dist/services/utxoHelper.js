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
exports.getUtxoWithAmount = exports.addUtxoInputs = exports.getSendUtxo = exports.getSendUtxoForAmount = exports.addUtxo = exports.getUtxoItem = exports.decryptUtxoItem = exports.filterUtxoByCode = void 0;
const Network = __importStar(require("../api/network"));
const cache_1 = require("../config/cache");
const Sdk_1 = __importDefault(require("../Sdk"));
const factory_1 = __importDefault(require("./cacheStore/factory"));
const ledgerWrapper_1 = require("./ledger/ledgerWrapper");
const mergeUtxoList = (arr1, arr2) => {
    const res = [];
    while (arr1.length && arr2.length) {
        const assetItem1 = arr1[0];
        const assetItem2 = arr2[0];
        const amount1 = BigInt(assetItem1.body.amount);
        const amount2 = BigInt(assetItem2.body.amount);
        if (amount1 < amount2) {
            res.push(arr1.splice(0, 1)[0]);
            continue;
        }
        res.push(arr2.splice(0, 1)[0]);
    }
    return res.concat(arr1, arr2);
};
const mergeSortUtxoList = (arr) => {
    if (arr.length < 2)
        return arr;
    const middleIdx = Math.floor(arr.length / 2);
    let left = arr.splice(0, middleIdx);
    let right = arr.splice(0);
    return mergeUtxoList(mergeSortUtxoList(left), mergeSortUtxoList(right));
};
const filterUtxoByCode = (code, utxoDataList) => {
    return utxoDataList.filter(assetItem => { var _a; return ((_a = assetItem === null || assetItem === void 0 ? void 0 : assetItem.body) === null || _a === void 0 ? void 0 : _a.asset_type) === code; });
};
exports.filterUtxoByCode = filterUtxoByCode;
// is called only from getUtxoItem
const decryptUtxoItem = (sid, walletInfo, utxoData, memoData) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    let assetRecord;
    try {
        assetRecord = ledger.ClientAssetRecord.from_json(utxoData.utxo);
    }
    catch (error) {
        const err = error;
        throw new Error(`Can not get client asset record. Details: "${err.message}"`);
    }
    let ownerMemo;
    try {
        ownerMemo = memoData ? ledger.OwnerMemo.from_json(memoData) : undefined;
    }
    catch (error) {
        const err = error;
        throw new Error(`Can not decode owner memo. Details: "${err.message}"`);
    }
    let decryptAssetData;
    try {
        decryptAssetData = yield ledger.open_client_asset_record(assetRecord, ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(), walletInfo.keypair);
    }
    catch (error) {
        const err = error;
        throw new Error(`Can not open client asset record to decode. Details: "${err.message}"`);
    }
    let decryptedAsetType;
    try {
        decryptedAsetType = ledger.asset_type_from_jsvalue(decryptAssetData.asset_type);
    }
    catch (error) {
        const err = error;
        throw new Error(`Can not decrypt asset type. Details: "${err.message}"`);
    }
    decryptAssetData.asset_type = decryptedAsetType;
    decryptAssetData.amount = BigInt(decryptAssetData.amount);
    const item = {
        address: walletInfo.address,
        sid,
        body: decryptAssetData || {},
        utxo: Object.assign({}, utxoData.utxo),
        ownerMemo: ownerMemo === null || ownerMemo === void 0 ? void 0 : ownerMemo.clone(),
        memoData,
    };
    return item;
});
exports.decryptUtxoItem = decryptUtxoItem;
// is called only by addUtxo
const getUtxoItem = (sid, walletInfo, cachedItem) => __awaiter(void 0, void 0, void 0, function* () {
    if (cachedItem) {
        return cachedItem;
    }
    // console.log(`Fetching sid "${sid}"`);
    const utxoDataResult = yield Network.getUtxo(sid);
    const { response: utxoData, error: utxoError } = utxoDataResult;
    if (utxoError || !utxoData) {
        throw new Error(`Could not fetch utxo data for sid "${sid}", Error - ${utxoError === null || utxoError === void 0 ? void 0 : utxoError.message}`);
    }
    const memoDataResult = yield Network.getOwnerMemo(sid);
    // console.log('🚀 ~ file: utxoHelper.ts ~ line 1 ~ sid processing 1', sid);
    const { response: memoData, error: memoError } = memoDataResult;
    if (memoError) {
        throw new Error(`Could not fetch memo data for sid "${sid}", Error - ${memoError.message}`);
    }
    // console.log('🚀 ~ file: utxoHelper.ts ~ line 2 ~ sid processing 2', sid);
    // console.log('🚀 ~ file: utxoHelper.ts ~ line 155 ~ sid processing', sid);
    const item = yield (0, exports.decryptUtxoItem)(sid, walletInfo, utxoData, memoData);
    // console.log('🚀 ~ file: utxoHelper.ts ~ line 155 ~ sid processed', sid);
    // console.log('🚀 ~ file: utxoHelper.ts ~ line 178 ~ item', item);
    return item;
});
exports.getUtxoItem = getUtxoItem;
// creates a list of items with descrypted utxo information
const addUtxo = (walletInfo, addSids) => __awaiter(void 0, void 0, void 0, function* () {
    const utxoDataList = [];
    const cacheDataToSave = {};
    let utxoDataCache;
    const cacheEntryName = `${cache_1.CACHE_ENTRIES.UTXO_DATA}_${walletInfo.address}`;
    let fullPathToCacheEntry = `${Sdk_1.default.environment.cachePath}/${cacheEntryName}.json`;
    try {
        if (window && (window === null || window === void 0 ? void 0 : window.document)) {
            fullPathToCacheEntry = cacheEntryName;
        }
    }
    catch (_) {
        // console.log('window instance is not found. running is sdk mode. skipping');
    }
    try {
        utxoDataCache = yield factory_1.default.read(fullPathToCacheEntry, Sdk_1.default.environment.cacheProvider);
    }
    catch (error) {
        const err = error;
        throw new Error(`Error reading the cache, "${err.message}"`);
    }
    for (let i = 0; i < addSids.length; i++) {
        const sid = addSids[i];
        // console.log('🚀 ~ file: utxoHelper.ts ~ line 207 ~ addUtxo ~ sid', sid);
        try {
            const item = yield (0, exports.getUtxoItem)(sid, walletInfo, utxoDataCache === null || utxoDataCache === void 0 ? void 0 : utxoDataCache[`sid_${sid}`]);
            // console.log('🚀 ~ file: utxoHelper.ts ~ line 211 ~ addUtxo ~ item', item);
            utxoDataList.push(item);
            // console.log('sid processed!!', sid);
            cacheDataToSave[`sid_${item.sid}`] = item;
        }
        catch (error) {
            const err = error;
            console.log(`Could not process addUtxo for sid ${sid}, Details: "${err.message}"`);
            continue;
        }
    }
    // console.log('🚀 ~ file: utxoHelper.ts ~ line 229 ~ addUtxo ~ utxoDataList', utxoDataList);
    try {
        yield factory_1.default.write(fullPathToCacheEntry, cacheDataToSave, Sdk_1.default.environment.cacheProvider);
    }
    catch (error) {
        const err = error;
        console.log(`Could not write cache for utxoData, "${err.message}"`);
    }
    return utxoDataList;
});
exports.addUtxo = addUtxo;
// creates a list of utxo like object, which are suitable for the required send operation
// is only used in fee
/**
 * @depricated
 */
// export const getSendUtxoLegacy = (
//   code: string,
//   amount: BigInt,
//   utxoDataList: AddUtxoItem[],
// ): UtxoOutputItem[] => {
//   let balance = amount;
//   const result = [];
//   for (let i = 0; i < utxoDataList.length; i++) {
//     const assetItem = utxoDataList[i];
//     if (assetItem.body.asset_type === code) {
//       const _amount = BigInt(assetItem.body.amount);
//       if (balance <= BigInt(0)) {
//         break;
//       } else if (BigInt(_amount) >= balance) {
//         result.push({
//           amount: balance,
//           originAmount: _amount,
//           sid: assetItem.sid,
//           utxo: { ...assetItem.utxo },
//           ownerMemo: assetItem.ownerMemo,
//           memoData: assetItem.memoData,
//         });
//         break;
//       } else {
//         balance = BigInt(Number(balance) - Number(_amount));
//         result.push({
//           amount: _amount,
//           originAmount: _amount,
//           sid: assetItem.sid,
//           utxo: { ...assetItem.utxo },
//           ownerMemo: assetItem.ownerMemo,
//           memoData: assetItem.memoData,
//         });
//       }
//     }
//   }
//   return result;
// };
const getSendUtxoForAmount = (code, amount, utxoDataList) => {
    const result = [];
    const filteredUtxoList = (0, exports.filterUtxoByCode)(code, utxoDataList);
    console.log('🚀 ~ file: utxoHelper.ts ~ line 307 ~ amount', amount);
    for (const assetItem of filteredUtxoList) {
        const _amount = BigInt(assetItem.body.amount);
        console.log('🚀 ~ file: utxoHelper.ts ~ line 307 ~ _amount', _amount);
        if (_amount === amount) {
            result.push({
                amount: _amount,
                originAmount: _amount,
                sid: assetItem.sid,
                utxo: Object.assign({}, assetItem.utxo),
                ownerMemo: assetItem.ownerMemo,
                memoData: assetItem.memoData,
            });
            break;
        }
    }
    return result;
};
exports.getSendUtxoForAmount = getSendUtxoForAmount;
const getSendUtxo = (code, amount, utxoDataList) => {
    const result = [];
    const filteredUtxoList = (0, exports.filterUtxoByCode)(code, utxoDataList);
    const sortedUtxoList = mergeSortUtxoList(filteredUtxoList);
    let sum = BigInt(0);
    for (const assetItem of sortedUtxoList) {
        const _amount = BigInt(assetItem.body.amount);
        sum = sum + _amount;
        const credit = BigInt(Number(sum) - Number(amount));
        const remainedDebt = _amount - credit;
        const amountToUse = credit > 0 ? remainedDebt : _amount;
        result.push({
            amount: amountToUse,
            originAmount: _amount,
            sid: assetItem.sid,
            utxo: Object.assign({}, assetItem.utxo),
            ownerMemo: assetItem.ownerMemo,
            memoData: assetItem.memoData,
        });
        if (credit >= 0) {
            break;
        }
    }
    return result;
};
exports.getSendUtxo = getSendUtxo;
// creates a list of inputs, which would be used by transaction builder in a fee service
// used in fee.buildTransferOperation , fee.getFeeInputs
const addUtxoInputs = (utxoSids) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    let inputAmount = BigInt(0);
    const inputParametersList = [];
    for (let i = 0; i < utxoSids.length; i += 1) {
        const item = utxoSids[i];
        inputAmount = BigInt(Number(inputAmount) + Number(item.originAmount));
        let assetRecord;
        try {
            assetRecord = ledger.ClientAssetRecord.from_json(item.utxo);
        }
        catch (error) {
            const err = error;
            throw new Error(`Can not get client asset record. Details: "${err.message}"`);
        }
        let txoRef;
        try {
            txoRef = ledger.TxoRef.absolute(BigInt(item.sid));
        }
        catch (error) {
            const err = error;
            throw new Error(`Can not convert given sid id to a BigInt, "${item.sid}", Details - "${err.message}"`);
        }
        const inputParameters = {
            txoRef,
            assetRecord,
            ownerMemo: item === null || item === void 0 ? void 0 : item.ownerMemo,
            amount: item.amount,
            memoData: item.memoData,
            sid: item.sid,
        };
        inputParametersList.push(inputParameters);
    }
    const res = { inputParametersList, inputAmount };
    return res;
});
exports.addUtxoInputs = addUtxoInputs;
const getUtxoWithAmount = (walletInfo, utxoNumbers, assetCode) => __awaiter(void 0, void 0, void 0, function* () {
    const { response: sids } = yield Network.getOwnedSids(walletInfo.publickey);
    if (!sids) {
        console.log('ERROR no sids available');
        throw new Error(`could not get an utxo with an amount of ${utxoNumbers} for asset code ${assetCode}. No sids available`);
    }
    const utxoDataList = yield (0, exports.addUtxo)(walletInfo, sids);
    const sendUtxoList = (0, exports.getSendUtxoForAmount)(assetCode, utxoNumbers, utxoDataList);
    const [utxoInput] = sendUtxoList;
    if (!utxoInput) {
        throw new Error(`could not get an utxo with an amount of ${utxoNumbers} for asset code ${assetCode}`);
    }
    return utxoInput;
});
exports.getUtxoWithAmount = getUtxoWithAmount;
//# sourceMappingURL=utxoHelper.js.map