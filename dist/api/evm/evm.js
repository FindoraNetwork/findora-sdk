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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEvmToAccount = exports.sendAccountToEvm = exports.tokenBalance = exports.frcNftToBar = exports.getDomainCurrentText = exports.approveNFT = exports.getPrismConfig = exports.frc20ToBar = exports.approveToken = exports.fraToBar = exports.hashAddressTofraAddressByNFT = exports.hashAddressTofraAddress = exports.fraAddressToHashAddress = void 0;
var eth_ens_namehash_1 = __importDefault(require("@ensdomains/eth-ens-namehash"));
var bech32ToBuffer = __importStar(require("bech32-buffer"));
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var ethereumjs_abi_1 = __importDefault(require("ethereumjs-abi"));
var js_base64_1 = __importDefault(require("js-base64"));
var web3_1 = __importDefault(require("web3"));
var api_1 = require("../../api");
var bigNumber_1 = require("../../services/bigNumber");
var ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
var AssetApi = __importStar(require("../sdkAsset"));
var Transaction = __importStar(require("../transaction"));
var web3_2 = require("./web3");
var fraAddressToHashAddress = function (address) {
    var _a = bech32ToBuffer.decode(address), data = _a.data, prefix = _a.prefix;
    if (prefix == 'eth') {
        return '0x01' + Buffer.from(data).toString('hex');
    }
    return '0x' + Buffer.from(data).toString('hex');
};
exports.fraAddressToHashAddress = fraAddressToHashAddress;
var hashAddressTofraAddress = function (addresss) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, tokenAddress, tokenAddressHex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                tokenAddress = ethereumjs_abi_1.default.rawEncode(['address', 'address'], ['0x0000000000000000000000000000000000000000000000000000000000000077', addresss]);
                tokenAddressHex = web3_1.default.utils.keccak256("0x".concat(tokenAddress.toString('hex')));
                return [2 /*return*/, ledger.asset_type_from_jsvalue(web3_1.default.utils.hexToBytes(tokenAddressHex))];
        }
    });
}); };
exports.hashAddressTofraAddress = hashAddressTofraAddress;
var hashAddressTofraAddressByNFT = function (addresss, tokenId) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, tokenAddress, tokenAddressHex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                tokenAddress = ethereumjs_abi_1.default.rawEncode(['address', 'address', 'uint256'], ['0x0000000000000000000000000000000000000000000000000000000000000002', addresss, tokenId]);
                tokenAddressHex = web3_1.default.utils.keccak256("0x".concat(tokenAddress.toString('hex')));
                return [2 /*return*/, ledger.asset_type_from_jsvalue(web3_1.default.utils.hexToBytes(tokenAddressHex))];
        }
    });
}); };
exports.hashAddressTofraAddressByNFT = hashAddressTofraAddressByNFT;
var fraToBar = function (bridgeAddress, recipientAddress, amount, web3WalletInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var web3, contract, convertAmount, findoraTo, nonce, gasPrice, contractData, estimategas, txParams, signed_txn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
                contract = (0, web3_2.getSimBridgeContract)(web3, bridgeAddress);
                convertAmount = new bignumber_js_1.default(amount).times(Math.pow(10, 18)).toString(10);
                findoraTo = (0, exports.fraAddressToHashAddress)(recipientAddress);
                return [4 /*yield*/, web3.eth.getTransactionCount(web3WalletInfo.account)];
            case 1:
                nonce = _a.sent();
                return [4 /*yield*/, web3.eth.getGasPrice()];
            case 2:
                gasPrice = _a.sent();
                contractData = contract.methods.depositFRA(findoraTo).encodeABI();
                return [4 /*yield*/, web3.eth.estimateGas({
                        to: web3WalletInfo.account,
                        data: contractData,
                    })];
            case 3:
                estimategas = _a.sent();
                txParams = {
                    from: web3WalletInfo.account,
                    to: bridgeAddress,
                    gasPrice: web3.utils.toHex(gasPrice),
                    gasLimit: web3.utils.toHex(3000000),
                    gas: web3.utils.toHex(estimategas),
                    value: convertAmount,
                    nonce: nonce,
                    data: contractData,
                    chainId: web3WalletInfo.chainId,
                };
                console.log(txParams);
                return [4 /*yield*/, web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr)];
            case 4:
                signed_txn = _a.sent();
                if (!(signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction)) return [3 /*break*/, 6];
                return [4 /*yield*/, web3.eth.sendSignedTransaction(signed_txn.rawTransaction)];
            case 5: return [2 /*return*/, _a.sent()];
            case 6: throw Error('fail frc20ToBar');
        }
    });
}); };
exports.fraToBar = fraToBar;
var approveToken = function (tokenAddress, deckAddress, price, web3WalletInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var web3, erc20Contract, amount, nonce, gasPrice, contractData, estimategas, txParams, signed_txn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.table([tokenAddress, deckAddress, price]);
                web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
                erc20Contract = (0, web3_2.getErc20Contract)(web3, tokenAddress);
                return [4 /*yield*/, (0, web3_2.calculationDecimalsAmount)(erc20Contract, web3, web3WalletInfo.account, tokenAddress, price, 'toWei')];
            case 1:
                amount = _a.sent();
                return [4 /*yield*/, web3.eth.getTransactionCount(web3WalletInfo.account)];
            case 2:
                nonce = _a.sent();
                return [4 /*yield*/, web3.eth.getGasPrice()];
            case 3:
                gasPrice = _a.sent();
                contractData = erc20Contract.methods.approve(deckAddress, amount).encodeABI();
                return [4 /*yield*/, web3.eth.estimateGas({
                        to: web3WalletInfo.account,
                        data: contractData,
                    })];
            case 4:
                estimategas = _a.sent();
                txParams = {
                    from: web3WalletInfo.account,
                    to: tokenAddress,
                    gasPrice: web3.utils.toHex(gasPrice),
                    gasLimit: web3.utils.toHex(3000000),
                    gas: web3.utils.toHex(estimategas),
                    nonce: nonce,
                    data: contractData,
                    chainId: web3WalletInfo.chainId,
                };
                return [4 /*yield*/, web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr)];
            case 5:
                signed_txn = _a.sent();
                if (!(signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction)) return [3 /*break*/, 7];
                return [4 /*yield*/, web3.eth.sendSignedTransaction(signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction)];
            case 6: return [2 /*return*/, _a.sent()];
            case 7: throw Error('fail frc20ToBar');
        }
    });
}); };
exports.approveToken = approveToken;
var frc20ToBar = function (bridgeAddress, recipientAddress, tokenAddress, tokenAmount, web3WalletInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var web3, contract, erc20Contract, bridgeAmount, findoraTo, nonce, gasPrice, contractData, estimategas, txParams, signed_txn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
                contract = (0, web3_2.getSimBridgeContract)(web3, bridgeAddress);
                erc20Contract = (0, web3_2.getErc20Contract)(web3, tokenAddress);
                return [4 /*yield*/, (0, web3_2.calculationDecimalsAmount)(erc20Contract, web3, web3WalletInfo.account, tokenAddress, tokenAmount, 'toWei')];
            case 1:
                bridgeAmount = _a.sent();
                findoraTo = (0, exports.fraAddressToHashAddress)(recipientAddress);
                return [4 /*yield*/, web3.eth.getTransactionCount(web3WalletInfo.account)];
            case 2:
                nonce = _a.sent();
                return [4 /*yield*/, web3.eth.getGasPrice()];
            case 3:
                gasPrice = _a.sent();
                contractData = contract.methods.depositFRC20(tokenAddress, findoraTo, bridgeAmount).encodeABI();
                return [4 /*yield*/, web3.eth.estimateGas({
                        to: web3WalletInfo.account,
                        data: contractData,
                    })];
            case 4:
                estimategas = _a.sent();
                txParams = {
                    from: web3WalletInfo.account,
                    to: bridgeAddress,
                    gasPrice: web3.utils.toHex(gasPrice),
                    gasLimit: web3.utils.toHex(3000000),
                    gas: web3.utils.toHex(estimategas),
                    nonce: nonce,
                    // value: web3.utils.toHex(convertAmount),
                    data: contractData,
                    chainId: web3WalletInfo.chainId,
                };
                return [4 /*yield*/, web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr)];
            case 5:
                signed_txn = _a.sent();
                if (!(signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction)) return [3 /*break*/, 7];
                return [4 /*yield*/, web3.eth.sendSignedTransaction(signed_txn.rawTransaction)];
            case 6: return [2 /*return*/, _a.sent()];
            case 7: throw Error('fail frc20ToBar');
        }
    });
}); };
exports.frc20ToBar = frc20ToBar;
function getPrismConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, displayCheckpointData, error, web3, bridgeAddress, prismContract, _b, ledgerAddress, assetAddress;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, api_1.Network.getConfig()];
                case 1:
                    _a = _c.sent(), displayCheckpointData = _a.response, error = _a.error;
                    if (error)
                        throw error;
                    if (!(displayCheckpointData === null || displayCheckpointData === void 0 ? void 0 : displayCheckpointData.prism_bridge_address))
                        throw 'no prism_bridge_address';
                    web3 = (0, web3_2.getWeb3)(api_1.Network.getRpcRoute());
                    bridgeAddress = displayCheckpointData.prism_bridge_address;
                    return [4 /*yield*/, (0, web3_2.getSimBridgeContract)(web3, bridgeAddress)];
                case 2:
                    prismContract = _c.sent();
                    return [4 /*yield*/, Promise.all([
                            prismContract.methods.ledger_contract().call(),
                            prismContract.methods.asset_contract().call(),
                        ])];
                case 3:
                    _b = _c.sent(), ledgerAddress = _b[0], assetAddress = _b[1];
                    return [2 /*return*/, { ledgerAddress: ledgerAddress, assetAddress: assetAddress, bridgeAddress: bridgeAddress }];
            }
        });
    });
}
exports.getPrismConfig = getPrismConfig;
var approveNFT = function (tokenAddress, deckAddress, tokenId, nftType, web3WalletInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var web3, contractData, nft721Contract, nft1155Contract, nonce, gasPrice, estimategas, txParams, signed_txn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
                contractData = '';
                if (nftType == '721') {
                    nft721Contract = (0, web3_2.getNFT721Contract)(web3, tokenAddress);
                    contractData = nft721Contract.methods.approve(deckAddress, tokenId).encodeABI();
                }
                if (nftType == '1155') {
                    nft1155Contract = (0, web3_2.getNFT1155Contract)(web3, tokenAddress);
                    contractData = nft1155Contract.methods.setApprovalForAll(deckAddress, true).encodeABI();
                }
                return [4 /*yield*/, web3.eth.getTransactionCount(web3WalletInfo.account)];
            case 1:
                nonce = _a.sent();
                return [4 /*yield*/, web3.eth.getGasPrice()];
            case 2:
                gasPrice = _a.sent();
                return [4 /*yield*/, web3.eth.estimateGas({
                        to: web3WalletInfo.account,
                        data: contractData,
                    })];
            case 3:
                estimategas = _a.sent();
                txParams = {
                    from: web3WalletInfo.account,
                    to: tokenAddress,
                    gasPrice: web3.utils.toHex(gasPrice),
                    gasLimit: web3.utils.toHex(3000000),
                    gas: web3.utils.toHex(estimategas),
                    nonce: nonce,
                    data: contractData,
                    chainId: web3WalletInfo.chainId,
                };
                return [4 /*yield*/, web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr)];
            case 4:
                signed_txn = _a.sent();
                if (!(signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction)) return [3 /*break*/, 6];
                return [4 /*yield*/, web3.eth.sendSignedTransaction(signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction)];
            case 5: return [2 /*return*/, _a.sent()];
            case 6: throw Error('fail frc20ToBar');
        }
    });
}); };
exports.approveNFT = approveNFT;
var getDomainCurrentText = function (nameResolverAddress, name) { return __awaiter(void 0, void 0, void 0, function () {
    var web3, fnsRegistryContract, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                web3 = (0, web3_2.getWeb3)(api_1.Network.getRpcRoute());
                fnsRegistryContract = (0, web3_2.getFNSRegistryContract)(web3, nameResolverAddress);
                return [4 /*yield*/, fnsRegistryContract.methods.currentText(eth_ens_namehash_1.default.hash(name)).call()];
            case 1:
                result = _a.sent();
                if (result.includes('eth') || result.includes('fra')) {
                    return [2 /*return*/, JSON.parse(result)];
                }
                return [2 /*return*/, null];
        }
    });
}); };
exports.getDomainCurrentText = getDomainCurrentText;
var frcNftToBar = function (bridgeAddress, recipientAddress, tokenAddress, tokenAmount, tokenId, nftType, web3WalletInfo) { return __awaiter(void 0, void 0, void 0, function () {
    var web3, contract, findoraTo, contractData, nonce, gasPrice, estimategas, txParams, signed_txn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
                contract = (0, web3_2.getSimBridgeContract)(web3, bridgeAddress);
                findoraTo = (0, exports.fraAddressToHashAddress)(recipientAddress);
                contractData = '';
                if (nftType == '721') {
                    contractData = contract.methods.depositFRC721(tokenAddress, findoraTo, tokenId).encodeABI();
                }
                if (nftType == '1155') {
                    contractData = contract.methods.depositFRC1155(tokenAddress, findoraTo, tokenId, tokenAmount).encodeABI();
                }
                return [4 /*yield*/, web3.eth.getTransactionCount(web3WalletInfo.account)];
            case 1:
                nonce = _a.sent();
                return [4 /*yield*/, web3.eth.getGasPrice()];
            case 2:
                gasPrice = _a.sent();
                return [4 /*yield*/, web3.eth.estimateGas({
                        to: web3WalletInfo.account,
                        data: contractData,
                    })];
            case 3:
                estimategas = _a.sent();
                txParams = {
                    from: web3WalletInfo.account,
                    to: bridgeAddress,
                    gasPrice: web3.utils.toHex(gasPrice),
                    gasLimit: web3.utils.toHex(3000000),
                    gas: web3.utils.toHex(estimategas),
                    nonce: nonce,
                    // value: web3.utils.toHex(convertAmount),
                    data: contractData,
                    chainId: web3WalletInfo.chainId,
                };
                return [4 /*yield*/, web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr)];
            case 4:
                signed_txn = _a.sent();
                if (!(signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction)) return [3 /*break*/, 6];
                return [4 /*yield*/, web3.eth.sendSignedTransaction(signed_txn.rawTransaction)];
            case 5: return [2 /*return*/, _a.sent()];
            case 6: throw Error('fail frc20ToBar');
        }
    });
}); };
exports.frcNftToBar = frcNftToBar;
var tokenBalance = function (web3WalletInfo, tokenAddress, decimals, account) { return __awaiter(void 0, void 0, void 0, function () {
    var web3, erc20Contract, contractData, txParams, callResultHex, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
                erc20Contract = (0, web3_2.getErc20Contract)(web3, tokenAddress);
                contractData = erc20Contract.methods.balanceOf(account).encodeABI();
                txParams = {
                    from: web3WalletInfo.account,
                    to: tokenAddress,
                    data: contractData,
                };
                return [4 /*yield*/, web3.eth.call(txParams)];
            case 1:
                callResultHex = _a.sent();
                balance = web3.utils.hexToNumberString(callResultHex);
                if (!decimals) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, web3_2.calculationDecimalsAmount)(erc20Contract, web3, web3WalletInfo.account, tokenAddress, balance, 'formWei')];
            case 2:
                balance = _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, balance];
        }
    });
}); };
exports.tokenBalance = tokenBalance;
var sendAccountToEvm = function (walletInfo, amount, ethAddress, assetCode, lowLevelData) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, address, fraAssetCode, mainAssetCode, assetBlindRules, transactionBuilder, asset, decimals, convertAmount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                address = ledger.base64_to_bech32(ledger.get_coinbase_address());
                fraAssetCode = ledger.fra_get_asset_code();
                mainAssetCode = assetCode || fraAssetCode;
                assetBlindRules = {
                    isAmountBlind: false,
                    isTypeBlind: false,
                };
                return [4 /*yield*/, Transaction.sendToAddressV2(walletInfo, address, amount, mainAssetCode, assetBlindRules)];
            case 2:
                transactionBuilder = _a.sent();
                return [4 /*yield*/, AssetApi.getAssetDetails(assetCode)];
            case 3:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                convertAmount = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString(10));
                transactionBuilder = transactionBuilder.add_operation_convert_account(walletInfo.keypair, ethAddress, convertAmount, mainAssetCode, lowLevelData);
                transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
                // transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
                return [2 /*return*/, transactionBuilder];
        }
    });
}); };
exports.sendAccountToEvm = sendAccountToEvm;
/**
 * Transfer ETH to the user FRA address
 *
 * @remarks
 * To transfer ETH tokens to the FRA address (EVM transfer) user should use this function
 *
 * @example
 *
 * ```ts
 *  const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 *  const ethPrivate = 'faXXXX';
 *  const ethAddress = '0xXXX';
 *
 *  const result = await Evm.sendEvmToAccount(walletInfo.address, amount, ethPrivate, ethAddress);
 * ```
 *
 * @throws `Get nonce error`
 * @throws `Evm to Account wasm error`
 * @throws `Could not submit of transactions. No response from the server`
 * @throws `Evm to Account submit error`
 *
 * @returns Result of transaction submission to the network
 */
var sendEvmToAccount = function (fraAddress, amount, ethPrivate, ethAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var ledger, accountPublickey, asset, decimals, utxoNumbers, nonce, result_1, err_1, e, result, e, submitResult, err_2, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
            case 1:
                ledger = _a.sent();
                accountPublickey = ledger.public_key_from_bech32(fraAddress);
                return [4 /*yield*/, AssetApi.getAssetDetails(ledger.fra_get_asset_code())];
            case 2:
                asset = _a.sent();
                decimals = asset.assetRules.decimals;
                utxoNumbers = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString(10));
                nonce = '';
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, api_1.Network.getAbciNoce(ethAddress)];
            case 4:
                result_1 = _a.sent();
                if (result_1.response && result_1.response.result.response.code === 0) {
                    nonce = result_1.response.result.response.value;
                    nonce = js_base64_1.default.atob(nonce);
                    nonce = JSON.parse(nonce);
                }
                else {
                    throw new Error('Get nonce error');
                }
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                e = err_1;
                throw new Error("Get nonce error \"".concat(ethAddress, "\". Error - ").concat(e.message));
            case 6:
                result = '';
                try {
                    result = ledger.transfer_to_utxo_from_account(accountPublickey, BigInt(utxoNumbers), ethPrivate, BigInt(nonce));
                }
                catch (err) {
                    e = err;
                    throw new Error("Evm to Account wasm error\". Error - ".concat(e.message));
                }
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, api_1.Network.submitEvmTx(js_base64_1.default.encode(result))];
            case 8:
                submitResult = _a.sent();
                if (!submitResult.response) {
                    throw new Error('Could not submit of transactions. No response from the server.');
                }
                return [2 /*return*/, submitResult];
            case 9:
                err_2 = _a.sent();
                e = err_2;
                throw new Error("Evm to Account submit error\". Error - ".concat(e.message));
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.sendEvmToAccount = sendEvmToAccount;
//# sourceMappingURL=evm.js.map