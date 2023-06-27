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
exports.sendEvmToAccount = exports.sendAccountToEvm = exports.tokenBalance = exports.frcNftToBar = exports.getDomainCurrentText = exports.approveNFT = exports.getPrismConfig = exports.frc20ToBar = exports.approveToken = exports.fraToBar = exports.hashAddressTofraAddressByNFT = exports.hashAddressTofraAddress = exports.hashAddressTofraAddressOld = exports.fraAddressToHashAddress = void 0;
const eth_ens_namehash_1 = __importDefault(require("@ensdomains/eth-ens-namehash"));
const bech32ToBuffer = __importStar(require("bech32-buffer"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethereumjs_abi_1 = __importDefault(require("ethereumjs-abi"));
const js_base64_1 = __importDefault(require("js-base64"));
const web3_1 = __importDefault(require("web3"));
const api_1 = require("../../api");
const bigNumber_1 = require("../../services/bigNumber");
const ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
const AssetApi = __importStar(require("../sdkAsset"));
const Transaction = __importStar(require("../transaction"));
const web3_2 = require("./web3");
/**
 * Convert the address starting with fra into a hex address
 *
 * @example
 * ```ts
 * const contract = fraAddressToHashAddress('fraxxxxx....');
 * ```
 *
 * @param address - fra wallet address
 *
 * @returns Hex address
 *
 */
const fraAddressToHashAddress = (address) => {
    const { data, prefix } = bech32ToBuffer.decode(address);
    if (prefix == 'eth') {
        return '0x01' + Buffer.from(data).toString('hex');
    }
    return '0x' + Buffer.from(data).toString('hex');
};
exports.fraAddressToHashAddress = fraAddressToHashAddress;
const hashAddressTofraAddressOld = (addresss) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const tokenAddress = ethereumjs_abi_1.default.rawEncode(['address', 'address'], ['0x0000000000000000000000000000000000000000000000000000000000000077', addresss]);
    const tokenAddressHex = web3_1.default.utils.keccak256(`0x${tokenAddress.toString('hex')}`);
    const assetType = ledger.asset_type_from_jsvalue(web3_1.default.utils.hexToBytes(tokenAddressHex));
    return assetType;
});
exports.hashAddressTofraAddressOld = hashAddressTofraAddressOld;
// uses contract to compute the proper asset type for the token
const hashAddressTofraAddress = (addresss, bridgeAddress, web3WalletInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
    const contract = (0, web3_2.getSimBridgeContract)(web3, bridgeAddress);
    const tokenAddressHexA = yield contract.methods.computeERC20AssetType(addresss).call();
    // const tokenAddressHex = Web3.utils.keccak256(tokenAddressHexA);
    const assetType = ledger.asset_type_from_jsvalue(web3_1.default.utils.hexToBytes(tokenAddressHexA));
    return assetType;
});
exports.hashAddressTofraAddress = hashAddressTofraAddress;
/**
 * NFT asset address conversion
 *
 * @remarks
 * Convert the NFT asset address in evm to an asset address that can be recognized by native
 *
 * @example
 * ```ts
 * const contract = hashAddressTofraAddressByNFT('0x00000....', '1');
 * ```
 *
 * @param address - evm nft contract address
 * @param tokenId - evm nft tokenId
 *
 *
 * @returns fra asset address
 *
 */
const hashAddressTofraAddressByNFT = (addresss, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const tokenAddress = ethereumjs_abi_1.default.rawEncode(['address', 'address', 'uint256'], ['0x0000000000000000000000000000000000000000000000000000000000000002', addresss, tokenId]);
    const tokenAddressHex = web3_1.default.utils.keccak256(`0x${tokenAddress.toString('hex')}`);
    return ledger.asset_type_from_jsvalue(web3_1.default.utils.hexToBytes(tokenAddressHex));
});
exports.hashAddressTofraAddressByNFT = hashAddressTofraAddressByNFT;
/**
 * Transfer fra asset to native chain
 *
 * @remarks
 * Used to transfer fra tokens from the evm chain to the native chain
 *
 * @example
 * ```ts
 * const web3WalletInfo = {};
 * const bridgeAddress = '0x000...';
 * const recipientAddress = 'fra wallet address';
 * const amount = '10';
 *
 * const contract = fraToBar(bridgeAddress, recipientAddress, amount, web3WalletInfo);
 * ```
 *
 * @param bridgeAddress - evm-bridge contract address, used to bridge evm to assets on the original chain
 * @param recipientAddress - On the native chain, fra wallet address
 * @param amount - the amount of transferred fra assets
 * @param web3WalletInfo - wallet An instance of {@link IWebLinkedInfo}
 *
 * @returns TransactionReceipt
 */
const fraToBar = (bridgeAddress, recipientAddress, amount, web3WalletInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
    const contract = (0, web3_2.getSimBridgeContract)(web3, bridgeAddress);
    const convertAmount = new bignumber_js_1.default(amount).times(Math.pow(10, 18)).toString(10);
    const findoraTo = (0, exports.fraAddressToHashAddress)(recipientAddress);
    const nonce = yield web3.eth.getTransactionCount(web3WalletInfo.account);
    const gasPrice = yield web3.eth.getGasPrice();
    const contractData = contract.methods.depositFRA(findoraTo).encodeABI();
    const estimategas = yield web3.eth.estimateGas({
        to: web3WalletInfo.account,
        data: contractData,
    });
    const txParams = {
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
    const signed_txn = yield web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr);
    if (signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction) {
        return yield web3.eth.sendSignedTransaction(signed_txn.rawTransaction);
    }
    else {
        throw Error('fail frc20ToBar');
    }
});
exports.fraToBar = fraToBar;
/**
 * approve token transfer permission
 *
 * @example
 * ```ts
 * const walletInfo = {};
 * const contract = await approveToken('0x00000....','0x00000....', '1' , walletInfo);
 * ```
 *
 * @param tokenAddress - payment token contract address
 * @param deckAddress - contract address for operating token transfer
 * @param price - approve amount
 * @param web3WalletInfo - wallet struct data {@link IWebLinkedInfo}
 *
 * @throws `fail approveToken`
 *
 * @returns PromiEvent<TransactionReceipt>
 */
const approveToken = (tokenAddress, deckAddress, price, web3WalletInfo) => __awaiter(void 0, void 0, void 0, function* () {
    console.table([tokenAddress, deckAddress, price]);
    const web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
    const erc20Contract = (0, web3_2.getErc20Contract)(web3, tokenAddress);
    const amount = yield (0, web3_2.calculationDecimalsAmount)(erc20Contract, web3, web3WalletInfo.account, tokenAddress, price, 'toWei');
    const nonce = yield web3.eth.getTransactionCount(web3WalletInfo.account);
    const gasPrice = yield web3.eth.getGasPrice();
    const contractData = erc20Contract.methods.approve(deckAddress, amount).encodeABI();
    const estimategas = yield web3.eth.estimateGas({
        to: web3WalletInfo.account,
        data: contractData,
    });
    const txParams = {
        from: web3WalletInfo.account,
        to: tokenAddress,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(3000000),
        gas: web3.utils.toHex(estimategas),
        nonce: nonce,
        data: contractData,
        chainId: web3WalletInfo.chainId,
    };
    const signed_txn = yield web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr);
    if (signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction) {
        return yield web3.eth.sendSignedTransaction(signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction);
    }
    else {
        throw Error('fail approveToken');
    }
});
exports.approveToken = approveToken;
/**
 * Transfer frc20 token to native chain
 *
 * @remarks
 * Transfer frc20 assets from evm chain to native chain
 *
 * @example
 * ```ts
 * const walletInfo = {};
 * const bridgeAddress = '0x000...',
 * const recipientAddress = 'fra wallet address',
 *
 * const tokenInfo = {
 *    address: '0x000...',
 *    amount: '10',
 * }
 *
 * const contract = frc20ToBar(bridgeAddress, recipientAddress, tokenInfo.address, tokenInfo.amount, walletInfo);
 * ```
 *
 * @param bridgeAddress - evm-bridge contract address, used to bridge evm to assets on the original chain
 * @param recipientAddress - On the native chain, fra wallet address
 * @param tokenAddress - evm chain, nft contract address
 * @param tokenAmount - The amount of transferred frc20 assets
 * @param web3WalletInfo - wallet An instance of {@link IWebLinkedInfo}
 *
 * @returns TransactionReceipt
 */
const frc20ToBar = (bridgeAddress, recipientAddress, tokenAddress, tokenAmount, web3WalletInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
    const contract = (0, web3_2.getSimBridgeContract)(web3, bridgeAddress);
    const erc20Contract = (0, web3_2.getErc20Contract)(web3, tokenAddress);
    const bridgeAmount = yield (0, web3_2.calculationDecimalsAmount)(erc20Contract, web3, web3WalletInfo.account, tokenAddress, tokenAmount, 'toWei');
    const findoraTo = (0, exports.fraAddressToHashAddress)(recipientAddress);
    const nonce = yield web3.eth.getTransactionCount(web3WalletInfo.account);
    const gasPrice = yield web3.eth.getGasPrice();
    const contractData = contract.methods.depositFRC20(tokenAddress, findoraTo, bridgeAmount).encodeABI();
    const estimategas = yield web3.eth.estimateGas({
        to: web3WalletInfo.account,
        data: contractData,
    });
    const txParams = {
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
    const signed_txn = yield web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr);
    if (signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction) {
        return yield web3.eth.sendSignedTransaction(signed_txn.rawTransaction);
    }
    else {
        throw Error('fail frc20ToBar');
    }
});
exports.frc20ToBar = frc20ToBar;
/**
 * Return prism config
 *
 * @remarks
 * Return the ledgerAddress, assetAddress, bridgeAddress contract addresses configured on the chain
 *
 * @example
 * ```ts
 * const result = await getPrismConfig();
 * ```
 *
 * @returns `{ ledgerAddress: '', assetAddress: '', bridgeAddress: '' }`
 */
function getPrismConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const { response: displayCheckpointData, error } = yield api_1.Network.getConfig();
        if (error)
            throw error;
        if (!(displayCheckpointData === null || displayCheckpointData === void 0 ? void 0 : displayCheckpointData.prism_bridge_address))
            throw 'no prism_bridge_address';
        const web3 = (0, web3_2.getWeb3)(api_1.Network.getRpcRoute());
        const bridgeAddress = displayCheckpointData.prism_bridge_address;
        const prismContract = yield (0, web3_2.getSimBridgeContract)(web3, bridgeAddress);
        const [ledgerAddress, assetAddress] = yield Promise.all([
            prismContract.methods.ledger_contract().call(),
            prismContract.methods.asset_contract().call(),
        ]);
        return { ledgerAddress, assetAddress, bridgeAddress };
    });
}
exports.getPrismConfig = getPrismConfig;
/**
 * approve token transfer permission
 *
 * @example
 * ```ts
 * const walletInfo = {};
 * const contract = await approveNFT('0x00000....','0x00000....', '1', '721' , walletInfo);
 * const contract = await approveNFT('0x00000....','0x00000....', '1', '1155' , walletInfo);
 *
 * ```
 *
 * @param tokenAddress - payment token contract address
 * @param deckAddress - contract address for operating token transfer
 * @param tokenId - approve tokenId
 * @param nftType - nft type value , 721 | 1155
 * @param web3WalletInfo - wallet struct data {@link IWebLinkedInfo}
 *
 * @throws `fail approveNFT`
 *
 * @returns PromiEvent<TransactionReceipt>
 */
const approveNFT = (tokenAddress, deckAddress, tokenId, nftType, web3WalletInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
    let contractData = '';
    if (nftType == '721') {
        const nft721Contract = (0, web3_2.getNFT721Contract)(web3, tokenAddress);
        contractData = nft721Contract.methods.approve(deckAddress, tokenId).encodeABI();
    }
    if (nftType == '1155') {
        const nft1155Contract = (0, web3_2.getNFT1155Contract)(web3, tokenAddress);
        contractData = nft1155Contract.methods.setApprovalForAll(deckAddress, true).encodeABI();
    }
    const nonce = yield web3.eth.getTransactionCount(web3WalletInfo.account);
    const gasPrice = yield web3.eth.getGasPrice();
    const estimategas = yield web3.eth.estimateGas({
        to: web3WalletInfo.account,
        data: contractData,
    });
    const txParams = {
        from: web3WalletInfo.account,
        to: tokenAddress,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(3000000),
        gas: web3.utils.toHex(estimategas),
        nonce: nonce,
        data: contractData,
        chainId: web3WalletInfo.chainId,
    };
    const signed_txn = yield web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr);
    if (signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction) {
        return yield web3.eth.sendSignedTransaction(signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction);
    }
    else {
        throw Error('fail approveNFT');
    }
});
exports.approveNFT = approveNFT;
/**
 * Obtain domain name resolution records
 *
 * @remarks
 * Get the eth\fra wallet address in the domain registration record
 *
 * @example
 * ```ts
 * const result = getDomainCurrentText('xxx.fra');
 * ```
 *
 * @param name - fra domain
 *
 * @throws `fail approveNFT`
 *
 * @returns `Returns {eth:'', fra:''} if parsing is successful, otherwise null`
 */
const getDomainCurrentText = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const { response: displayCheckpointData, error } = yield api_1.Network.getConfig();
    if (error)
        throw error;
    if (!(displayCheckpointData === null || displayCheckpointData === void 0 ? void 0 : displayCheckpointData.fns_registry))
        throw 'no fns_registry contract address';
    const web3 = (0, web3_2.getWeb3)(api_1.Network.getRpcRoute());
    const fnsRegistryContract = (0, web3_2.getFNSRegistryContract)(web3, displayCheckpointData.fns_registry);
    const result = yield fnsRegistryContract.methods.currentText(eth_ens_namehash_1.default.hash(name)).call();
    if (result.includes('eth') || result.includes('fra')) {
        return JSON.parse(result);
    }
    return null;
});
exports.getDomainCurrentText = getDomainCurrentText;
/**
 * Transfer NFT to native chain
 *
 * @remarks
 * Transfer nft721 and nft1155 assets from evm chain to native chain
 *
 * @example
 * ```ts
 * const walletInfo = {};
 * const bridgeAddress = '0x000...',
 * const recipientAddress = 'fra wallet address',
 *
 * const nftInfo = {
 *    address: '0x000...',
 *    tokenId: '0',
 *    amount: '1',
 *    type: '721', // When nft-type is equal to 721, amount can only fill in 1
 * }
 *
 * const nftInfo = {
 *    address: '0x000...',
 *    tokenId: '0',
 *    amount: '3',
 *    type: '1155', // When nft-type is equal to 1155, the amount can be filled in with the owned amount
 * }
 *
 * const contract = frcNftToBar(bridgeAddress, recipientAddress, nftInfo.address, nftInfo.amount, nftInfo.tokenId,  nftInfo.type, walletInfo);
 * ```
 *

 *
 * @param bridgeAddress -  evm-bridge contract address, used to bridge evm to assets on the original chain
 * @param recipientAddress - On the native chain, fra wallet address
 * @param tokenAddress - evm chain, nft contract address
 * @param tokenAmount - transfer nft amount，nft721:1, nft1155: custom amount
 * @param tokenId - transfer nft tokenId
 * @param nftType - nft type, value: 721 | 1155
 * @param web3WalletInfo - wallet An instance of {@link IWebLinkedInfo}
 *
 * @returns TransactionReceipt
 */
const frcNftToBar = (bridgeAddress, recipientAddress, tokenAddress, tokenAmount, tokenId, nftType, web3WalletInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
    const contract = (0, web3_2.getSimBridgeContract)(web3, bridgeAddress);
    const findoraTo = (0, exports.fraAddressToHashAddress)(recipientAddress);
    let contractData = '';
    if (nftType == '721') {
        contractData = contract.methods.depositFRC721(tokenAddress, findoraTo, tokenId).encodeABI();
    }
    if (nftType == '1155') {
        contractData = contract.methods.depositFRC1155(tokenAddress, findoraTo, tokenId, tokenAmount).encodeABI();
    }
    const nonce = yield web3.eth.getTransactionCount(web3WalletInfo.account);
    const gasPrice = yield web3.eth.getGasPrice();
    const estimategas = yield web3.eth.estimateGas({
        to: web3WalletInfo.account,
        data: contractData,
    });
    const txParams = {
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
    const signed_txn = yield web3.eth.accounts.signTransaction(txParams, web3WalletInfo.privateStr);
    if (signed_txn === null || signed_txn === void 0 ? void 0 : signed_txn.rawTransaction) {
        return yield web3.eth.sendSignedTransaction(signed_txn.rawTransaction);
    }
    else {
        throw Error('fail frc20ToBar');
    }
});
exports.frcNftToBar = frcNftToBar;
/**
 * Return the number of tokens
 *
 * @remarks
 * Get the number of tokens owned by a wallet
 *
 * @example
 * ```ts
 * const walletInfo = {};
 *
 * let decimals = true; // decimals true, returns the number of ether units
 * const contract = tokenBalance(walletInfo,'0x00000....', decimals, 'wallet address');
 *
 * let decimals = false; // decimals true, returns the number of wei units
 * const contract = tokenBalance(walletInfo,'0x00000....', decimals, 'wallet address');
 *
 * ```
 *
 * @param web3WalletInfo - wallet struct data {@link IWebLinkedInfo}
 * @param tokenAddress - token contract address
 * @param decimals - boolean
 * @param account - wallet address
 *
 * @returns return string balance
 */
const tokenBalance = (web3WalletInfo, tokenAddress, decimals, account) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = (0, web3_2.getWeb3)(web3WalletInfo.rpcUrl);
    const erc20Contract = (0, web3_2.getErc20Contract)(web3, tokenAddress);
    const contractData = erc20Contract.methods.balanceOf(account).encodeABI();
    const txParams = {
        from: web3WalletInfo.account,
        to: tokenAddress,
        data: contractData,
    };
    const callResultHex = yield web3.eth.call(txParams);
    let balance = web3.utils.hexToNumberString(callResultHex);
    if (decimals) {
        balance = yield (0, web3_2.calculationDecimalsAmount)(erc20Contract, web3, web3WalletInfo.account, tokenAddress, balance, 'formWei');
    }
    return balance;
});
exports.tokenBalance = tokenBalance;
/**
 * Return the number of tokens
 *
 * @remarks
 * Get the number of tokens owned by a wallet
 *
 * @example
 * ```ts
 * const walletInfo = {};
 *
 * const contract = sendAccountToEvm(walletInfo,'10', '0x00000....', 'fra native asset type', '');
 * ```
 *
 * @param walletInfo - wallet An instance of {@link WalletKeypar}
 * @param amount - transfer amount
 * @param ethAddress - The wallet address of the evm test chain to receive the transfer
 * @param assetCode - transfer asset type
 * @param lowLevelData - When the fra chain is converted from native to evm, fill in "" here, and when transferring to a non-fra-evm chain, you need to pass the calculation result
 *
 * @returns TransactionBuilder which should be used in `Transaction.submitTransaction`
 */
const sendAccountToEvm = (walletInfo, amount, ethAddress, assetCode, lowLevelData) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const address = ledger.base64_to_bech32(ledger.get_coinbase_address());
    const fraAssetCode = ledger.fra_get_asset_code();
    const mainAssetCode = assetCode || fraAssetCode;
    const assetBlindRules = {
        isAmountBlind: false,
        isTypeBlind: false,
    };
    let transactionBuilder = yield Transaction.sendToAddressV2(walletInfo, address, amount, mainAssetCode, assetBlindRules);
    const asset = yield AssetApi.getAssetDetails(assetCode);
    const decimals = asset.assetRules.decimals;
    const convertAmount = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString(10));
    transactionBuilder = transactionBuilder.add_operation_convert_account(walletInfo.keypair, ethAddress, convertAmount, mainAssetCode, lowLevelData);
    transactionBuilder = transactionBuilder.sign(walletInfo.keypair);
    // transactionBuilder = transactionBuilder.sign_origin(walletInfo.keypair);
    return transactionBuilder;
});
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
const sendEvmToAccount = (fraAddress, amount, ethPrivate, ethAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const accountPublickey = ledger.public_key_from_bech32(fraAddress);
    const asset = yield AssetApi.getAssetDetails(ledger.fra_get_asset_code());
    const decimals = asset.assetRules.decimals;
    const utxoNumbers = BigInt((0, bigNumber_1.toWei)(amount, decimals).toString(10));
    let nonce = '';
    try {
        const result = yield api_1.Network.getAbciNoce(ethAddress);
        if (result.response && result.response.result.response.code === 0) {
            nonce = result.response.result.response.value;
            nonce = js_base64_1.default.atob(nonce);
            nonce = JSON.parse(nonce);
        }
        else {
            throw new Error('Get nonce error');
        }
    }
    catch (err) {
        const e = err;
        throw new Error(`Get nonce error "${ethAddress}". Error - ${e.message}`);
    }
    let result = '';
    try {
        result = ledger.transfer_to_utxo_from_account(accountPublickey, BigInt(utxoNumbers), ethPrivate, BigInt(nonce));
    }
    catch (err) {
        const e = err;
        throw new Error(`Evm to Account wasm error". Error - ${e.message}`);
    }
    let submitResult;
    try {
        submitResult = yield api_1.Network.submitEvmTx(js_base64_1.default.encode(result));
        if (!submitResult.response) {
            throw new Error('Could not submit of transactions. No response from the server.');
        }
        return submitResult;
    }
    catch (err) {
        const e = err;
        throw new Error(`Evm to Account submit error". Error - ${e.message}`);
    }
});
exports.sendEvmToAccount = sendEvmToAccount;
//# sourceMappingURL=evm.js.map