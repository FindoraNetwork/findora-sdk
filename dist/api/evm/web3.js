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
exports.getConfigContract = exports.getRewardContract = exports.getStakingContract = exports.getSystemContract = exports.getCurrentBalance = exports.toHex = exports.calculationDecimalsAmount = exports.getNameResolverContract = exports.getSimBridgeContract = exports.getPrismXXAssetContract = exports.getNFT1155Contract = exports.getNFT721Contract = exports.getFNSRegistryContract = exports.getPrismProxyContract = exports.getErc20Contract = exports.getWeb3 = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var ethers_1 = require("ethers");
var web3_1 = __importDefault(require("web3"));
var Config_json_1 = __importDefault(require("./abis/Config.json"));
var Erc20_json_1 = __importDefault(require("./abis/Erc20.json"));
var FNSRegistry_json_1 = __importDefault(require("./abis/FNSRegistry.json"));
var NameResolver_json_1 = __importDefault(require("./abis/NameResolver.json"));
var NFT1155_json_1 = __importDefault(require("./abis/NFT1155.json"));
var NFT721_json_1 = __importDefault(require("./abis/NFT721.json"));
var PrismProxy_json_1 = __importDefault(require("./abis/PrismProxy.json"));
var PrismXXAsset_json_1 = __importDefault(require("./abis/PrismXXAsset.json"));
var Reward_json_1 = __importDefault(require("./abis/Reward.json"));
var SimBridge_json_1 = __importDefault(require("./abis/SimBridge.json"));
var Staking_json_1 = __importDefault(require("./abis/Staking.json"));
var System_json_1 = __importDefault(require("./abis/System.json"));
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
var getWeb3 = function (rpcUrl) {
    var provider = new web3_1.default.providers.HttpProvider(rpcUrl);
    var web3 = new web3_1.default(provider);
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
var getErc20Contract = function (web3, address) {
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
var getPrismProxyContract = function (web3, address) {
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
var getNFT721Contract = function (web3, address) {
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
var getNFT1155Contract = function (web3, address) {
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
var getPrismXXAssetContract = function (web3, address) {
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
var getSimBridgeContract = function (web3, address) {
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
var getNameResolverContract = function (web3, address) {
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
var getFNSRegistryContract = function (web3, address) {
    return new web3.eth.Contract(FNSRegistry_json_1.default, address);
};
exports.getFNSRegistryContract = getFNSRegistryContract;
var getSystemContract = function (web3, address) {
    return new web3.eth.Contract(System_json_1.default, address);
};
exports.getSystemContract = getSystemContract;
var getStakingContract = function (web3, address) {
    return new web3.eth.Contract(Staking_json_1.default, address);
};
exports.getStakingContract = getStakingContract;
var getRewardContract = function (web3, address) {
    return new web3.eth.Contract(Reward_json_1.default, address);
};
exports.getRewardContract = getRewardContract;
var getConfigContract = function (web3, address) {
    return new web3.eth.Contract(Config_json_1.default, address);
};
exports.getConfigContract = getConfigContract;
var toHex = function (covertThis, padding) {
    var temp1 = ethers_1.ethers.utils.hexZeroPad(ethers_1.ethers.utils.hexlify(new bignumber_js_1.default(covertThis).toNumber()), padding);
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
var calculationDecimalsAmount = function (contract, web3, from, to, amount, type) { return __awaiter(void 0, void 0, void 0, function () {
    var contractData, txParams, callResultHex, erc20Decimals, ten, power;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, contract.methods.decimals().encodeABI()];
            case 1:
                contractData = _a.sent();
                txParams = {
                    from: from,
                    to: to,
                    data: contractData,
                };
                return [4 /*yield*/, web3.eth.call(txParams)];
            case 2:
                callResultHex = _a.sent();
                erc20Decimals = web3.utils.hexToNumberString(callResultHex);
                ten = new bignumber_js_1.default(10);
                power = ten.exponentiatedBy(erc20Decimals);
                if (type === 'toWei') {
                    return [2 /*return*/, new bignumber_js_1.default(amount).times(power).toString(10)];
                }
                return [2 /*return*/, new bignumber_js_1.default(amount).div(power).toFormat(4)];
        }
    });
}); };
exports.calculationDecimalsAmount = calculationDecimalsAmount;
var getCurrentBalance = function (web3, account) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, web3.eth.getBalance(account)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getCurrentBalance = getCurrentBalance;
//# sourceMappingURL=web3.js.map