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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentBalance = exports.toHex = exports.calculationDecimalsAmount = exports.getNameResolverContract = exports.getSimBridgeContract = exports.getPrismXXAssetContract = exports.getNFT1155Contract = exports.getNFT721Contract = exports.getFNSRegistryContract = exports.getPrismProxyContract = exports.getErc20Contract = exports.getWeb3 = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const web3_1 = __importDefault(require("web3"));
const Erc20_json_1 = __importDefault(require("./abis/Erc20.json"));
const FNSRegistry_json_1 = __importDefault(require("./abis/FNSRegistry.json"));
const NFT1155_json_1 = __importDefault(require("./abis/NFT1155.json"));
const NFT721_json_1 = __importDefault(require("./abis/NFT721.json"));
const NameResolver_json_1 = __importDefault(require("./abis/NameResolver.json"));
const PrismProxy_json_1 = __importDefault(require("./abis/PrismProxy.json"));
const PrismXXAsset_json_1 = __importDefault(require("./abis/PrismXXAsset.json"));
const SimBridge_json_1 = __importDefault(require("./abis/SimBridge.json"));
/**
 * Returns a Web3
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * ```
 *
 * @param rpcUrl - RPC_NETWORK_URL
 * @returns Web3
 *
 */
const getWeb3 = (rpcUrl) => {
    const provider = new web3_1.default.providers.HttpProvider(rpcUrl);
    const web3 = new web3_1.default(provider);
    return web3;
};
exports.getWeb3 = getWeb3;
/**
 * Returns a ERC20 Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getErc20Contract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
const getErc20Contract = (web3, address) => {
    return new web3.eth.Contract(Erc20_json_1.default, address);
};
exports.getErc20Contract = getErc20Contract;
/**
 * Returns a PrismProxy Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = PrismProxyContract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
const getPrismProxyContract = (web3, address) => {
    return new web3.eth.Contract(PrismProxy_json_1.default, address);
};
exports.getPrismProxyContract = getPrismProxyContract;
/**
 * Returns a NFT721 Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getNFT721Contract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
const getNFT721Contract = (web3, address) => {
    return new web3.eth.Contract(NFT721_json_1.default, address);
};
exports.getNFT721Contract = getNFT721Contract;
/**
 * Returns a NFT1155 Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getNFT1155Contract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
const getNFT1155Contract = (web3, address) => {
    return new web3.eth.Contract(NFT1155_json_1.default, address);
};
exports.getNFT1155Contract = getNFT1155Contract;
/**
 * Returns a PrismXXAsset Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getPrismXXAssetContract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
const getPrismXXAssetContract = (web3, address) => {
    return new web3.eth.Contract(PrismXXAsset_json_1.default, address);
};
exports.getPrismXXAssetContract = getPrismXXAssetContract;
/**
 * Returns a SimBridge Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getSimBridgeContract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
const getSimBridgeContract = (web3, address) => {
    return new web3.eth.Contract(SimBridge_json_1.default, address);
};
exports.getSimBridgeContract = getSimBridgeContract;
/**
 * Returns a NameResolver Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getNameResolverContract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
const getNameResolverContract = (web3, address) => {
    return new web3.eth.Contract(NameResolver_json_1.default, address);
};
exports.getNameResolverContract = getNameResolverContract;
/**
 * Returns a FNSRegistry Contract
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getFNSRegistryContract(web3, contract_address);
 * ```
 *
 * @param web3 - Web3
 * @param address - contract address
 *
 * @returns Contract
 *
 */
const getFNSRegistryContract = (web3, address) => {
    return new web3.eth.Contract(FNSRegistry_json_1.default, address);
};
exports.getFNSRegistryContract = getFNSRegistryContract;
const toHex = (value, padding) => {
    const temp1 = ethers_1.ethers.utils.hexZeroPad(ethers_1.ethers.utils.hexlify(new bignumber_js_1.default(value).toNumber()), padding);
    return temp1;
};
exports.toHex = toHex;
/**
 * calculation decimals amount
 *
 * @example
 * ```ts
 * const web3 = getWeb3("RPC_NETWORK_URL");
 * const contract_address = '0x....';
 * const contract = getErc20Contract(web3, contract_address);
 * const amount = calculationDecimalsAmount(contract, web3, 'from address', 'to address', '0.2', 'toWei');
 * const amount = calculationDecimalsAmount(contract, web3, 'from address', 'to address', '21000', 'formWei');
 *
 * ```
 * @param contract - getErc20Contract()
 * @param web3 - Web3
 * @param from - wallet address
 * @param to - wallet address
 * @param amount - calculation amount
 * @param type - value: toWei | formWei
 *
 * @returns Contract
 *
 */
const calculationDecimalsAmount = (contract, web3, from, to, amount, type) => __awaiter(void 0, void 0, void 0, function* () {
    const contractData = yield contract.methods.decimals().encodeABI();
    const txParams = {
        from,
        to,
        data: contractData,
    };
    const callResultHex = yield web3.eth.call(txParams);
    const erc20Decimals = web3.utils.hexToNumberString(callResultHex);
    const ten = new bignumber_js_1.default(10);
    const power = ten.exponentiatedBy(erc20Decimals);
    if (type === 'toWei') {
        return new bignumber_js_1.default(amount).times(power).toString(10);
    }
    return new bignumber_js_1.default(amount).div(power).toFormat(4);
});
exports.calculationDecimalsAmount = calculationDecimalsAmount;
const getCurrentBalance = (web3, account) => __awaiter(void 0, void 0, void 0, function* () {
    return yield web3.eth.getBalance(account);
});
exports.getCurrentBalance = getCurrentBalance;
//# sourceMappingURL=web3.js.map