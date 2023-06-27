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
exports.getMaxAtxoSid = exports.getAbarCommitment = exports.getConfig = exports.checkNullifierHashSpent = exports.getAbarMemos = exports.getOwnedAbars = exports.getLatestBlock = exports.getRpcPayload = exports.sendRpcCallV2 = exports.sendRpcCall = exports.getDelegateInfo = exports.getValidatorList = exports.submitEvmTx = exports.getAbciInfo = exports.getAbciNoce = exports.getTransactionDetails = exports.getTxListByPrismReceive = exports.getTxListByPrismSend = exports.getTxListByStakingUnDelegation = exports.getTxListByStakingDelegation = exports.getTxListByClaim = exports.getTxList = exports.getAnonymousTxList = exports.getParamsForTransparentTxList = exports.getHashSwap = exports.getBlock = exports.getTransactionStatus = exports.getIssuedRecords = exports.getAssetToken = exports.submitTransaction = exports.getSubmitTransactionData = exports.getStateCommitment = exports.getMTLeafInfo = exports.getAbarOwnerMemo = exports.getOwnerMemo = exports.getUtxo = exports.getRelatedSids = exports.getOwnedSids = exports.apiGet = exports.apiPost = exports.getRpcRoute = void 0;
const axios_1 = __importDefault(require("axios"));
const json_bigint_1 = __importDefault(require("json-bigint"));
const Sdk_1 = __importDefault(require("../../Sdk"));
const ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
const _axios = axios_1.default.create({});
_axios.defaults.transformResponse = [
    data => {
        try {
            return (0, json_bigint_1.default)({ useNativeBigInt: true }).parse(data);
        }
        catch (_) {
            return data;
        }
    },
];
const getQueryRoute = () => {
    const { hostUrl, queryPort } = Sdk_1.default.environment;
    const url = `${hostUrl}:${queryPort}`;
    return url;
};
const getSubmitRoute = () => {
    const { hostUrl, submissionPort } = Sdk_1.default.environment;
    const url = `${hostUrl}:${submissionPort}`;
    return url;
};
const getLedgerRoute = () => {
    const { hostUrl, ledgerPort } = Sdk_1.default.environment;
    const url = `${hostUrl}:${ledgerPort}`;
    return url;
};
const getExplorerApiRoute = () => {
    const { hostUrl, explorerApiPort } = Sdk_1.default.environment;
    const url = `${hostUrl}:${explorerApiPort}`;
    return url;
};
const getRpcRoute = () => {
    const { hostUrl, rpcPort } = Sdk_1.default.environment;
    const url = `${hostUrl}:${rpcPort}`;
    return url;
};
exports.getRpcRoute = getRpcRoute;
const apiPost = (url, data, config) => __awaiter(void 0, void 0, void 0, function* () {
    let axiosResponse;
    try {
        axiosResponse = yield _axios.post(url, data, config);
    }
    catch (err) {
        const e = err;
        return { error: { message: e.message } };
    }
    try {
        const myResponse = axiosResponse.data;
        return { response: myResponse };
    }
    catch (err) {
        const e = err;
        return { error: { message: e.message } };
    }
});
exports.apiPost = apiPost;
const apiGet = (url, config) => __awaiter(void 0, void 0, void 0, function* () {
    let axiosResponse;
    try {
        axiosResponse = yield _axios.get(url, config);
    }
    catch (err) {
        const e = err;
        return { error: { message: e.message } };
    }
    try {
        const myResponse = axiosResponse.data;
        return { response: myResponse };
    }
    catch (err) {
        const e = err;
        return { error: { message: e.message } };
    }
});
exports.apiGet = apiGet;
const getOwnedSids = (address, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getQueryRoute()}/get_owned_utxos/${address}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    const { response, error } = dataResult;
    if (error) {
        return { error };
    }
    if (Array.isArray(response)) {
        return { response };
    }
    if (parseFloat(response) > 0) {
        return { response: [response] };
    }
    return { response: [] };
});
exports.getOwnedSids = getOwnedSids;
const getRelatedSids = (address, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getQueryRoute()}/get_related_txns/${address}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    const { response, error } = dataResult;
    if (error) {
        return { error };
    }
    if (Array.isArray(response)) {
        return { response };
    }
    if (parseFloat(response) > 0) {
        return { response: [response] };
    }
    return dataResult;
});
exports.getRelatedSids = getRelatedSids;
const getUtxo = (utxoSid, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getLedgerRoute()}/utxo_sid/${utxoSid}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getUtxo = getUtxo;
const getOwnerMemo = (utxoSid, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getQueryRoute()}/get_owner_memo/${utxoSid}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getOwnerMemo = getOwnerMemo;
const getAbarOwnerMemo = (atxoSid, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getQueryRoute()}/get_abar_memo/${atxoSid}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getAbarOwnerMemo = getAbarOwnerMemo;
const getMTLeafInfo = (atxoSid, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getQueryRoute()}/get_abar_proof/${atxoSid}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getMTLeafInfo = getMTLeafInfo;
/**
 * Returns state commitment
 *
 * @remarks
 * An important property of a Findora ledger is the ability to authenticate transactions.
 * Users can authenticate transactions against a small tag called the state commitment.
 * The state commitment is a commitment to the current state of the ledger.
 * The state commitment response is a tuple containing the state commitment and the state commitment version.
 *
 *
 * @returns An instace of StateCommitmentDataResult
 */
const getStateCommitment = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getLedgerRoute()}/global_state`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getStateCommitment = getStateCommitment;
const getSubmitTransactionData = (data) => {
    let txData;
    if (!data) {
        return { response: txData };
    }
    try {
        txData = json_bigint_1.default.parse(data);
        return { response: txData };
    }
    catch (err) {
        const e = err;
        return { error: { message: `Can't submit transaction. Can't parse transaction data. ${e.message}` } };
    }
};
exports.getSubmitTransactionData = getSubmitTransactionData;
const submitTransaction = (data, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getSubmitRoute()}/submit_transaction`;
    const { response: txData, error } = (0, exports.getSubmitTransactionData)(data);
    if (error) {
        return { error };
    }
    const dataResult = yield (0, exports.apiPost)(url, txData, config);
    return dataResult;
});
exports.submitTransaction = submitTransaction;
const getAssetToken = (assetCode, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getLedgerRoute()}/asset_token/${assetCode}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getAssetToken = getAssetToken;
const getIssuedRecords = (address, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getQueryRoute()}/get_issued_records/${address}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getIssuedRecords = getIssuedRecords;
/**
 * Returns transaction status
 *
 * @remarks
 * Using the transaction handle, user can fetch the status of the transaction from the query server.
 *
 * @returns An instace of TransactionStatusDataResult
 */
const getTransactionStatus = (handle, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getSubmitRoute()}/txn_status/${handle}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getTransactionStatus = getTransactionStatus;
const getBlock = (height, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getExplorerApiRoute()}/block`;
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params: { height } }));
    return dataResult;
});
exports.getBlock = getBlock;
const getHashSwap = (hash, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getExplorerApiRoute()}/tx_search`;
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params: { query: `"tx.prehash='${hash}'"` } }));
    return dataResult;
});
exports.getHashSwap = getHashSwap;
const getParamsForTransparentTxList = (address, type, page = 1) => {
    const query = type === 'from' ? `"addr.from.${address}='y'"` : `"addr.to.${address}='y'"`;
    const params = {
        query,
        page,
        per_page: 10,
        order_by: '"desc"',
    };
    return params;
};
exports.getParamsForTransparentTxList = getParamsForTransparentTxList;
const getAnonymousTxList = (subject, type, page = 1) => {
    const query = type === 'to' ? `"commitment.created.${subject}='y'"` : `"nullifier.used.${subject}='y'"`;
    const params = {
        query,
        page,
        per_page: 10,
        order_by: '"desc"',
    };
    return params;
};
exports.getAnonymousTxList = getAnonymousTxList;
const getTxList = (subject, type, page = 1, per_page, config) => __awaiter(void 0, void 0, void 0, function* () {
    const { blockScanerUrl } = Sdk_1.default.environment;
    const url = `${blockScanerUrl}/api/txs`;
    const params = { [type]: subject, page, per_page };
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    console.log(dataResult);
    return dataResult;
});
exports.getTxList = getTxList;
const getTxListByClaim = (subject, page = 1, page_size, config) => __awaiter(void 0, void 0, void 0, function* () {
    const { blockScanerUrl } = Sdk_1.default.environment;
    const url = `${blockScanerUrl}/api/staking/claim`;
    const params = { address: subject, page, page_size };
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    return dataResult;
});
exports.getTxListByClaim = getTxListByClaim;
const getTxListByStakingDelegation = (subject, page = 1, page_size, config) => __awaiter(void 0, void 0, void 0, function* () {
    const { blockScanerUrl } = Sdk_1.default.environment;
    const url = `${blockScanerUrl}/api/tx/delegation`;
    const params = { address: subject, page, page_size };
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    return dataResult;
});
exports.getTxListByStakingDelegation = getTxListByStakingDelegation;
const getTxListByStakingUnDelegation = (subject, page = 1, page_size, config) => __awaiter(void 0, void 0, void 0, function* () {
    const { blockScanerUrl } = Sdk_1.default.environment;
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const url = `${blockScanerUrl}/api/staking/undelegation`;
    const params = { pubkey: ledger.bech32_to_base64(subject), page, page_size };
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    return dataResult;
});
exports.getTxListByStakingUnDelegation = getTxListByStakingUnDelegation;
const getTxListByPrismSend = (subject, page = 1, page_size, config) => __awaiter(void 0, void 0, void 0, function* () {
    const { blockScanerUrl } = Sdk_1.default.environment;
    const url = `${blockScanerUrl}/api/tx/prism/records/send`;
    const params = { address: subject, page, page_size };
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    return dataResult;
});
exports.getTxListByPrismSend = getTxListByPrismSend;
const getTxListByPrismReceive = (subject, page = 1, page_size, config) => __awaiter(void 0, void 0, void 0, function* () {
    const { blockScanerUrl } = Sdk_1.default.environment;
    const url = `${blockScanerUrl}/api/tx/prism/records/receive`;
    const params = { address: subject, page, page_size };
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    return dataResult;
});
exports.getTxListByPrismReceive = getTxListByPrismReceive;
const getTransactionDetails = (hash, config) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        hash: `0x${hash}`,
    };
    const url = `${getExplorerApiRoute()}/tx`;
    console.log('🚀 ~ file: network.ts ~ line 372 ~ url', url);
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    return dataResult;
});
exports.getTransactionDetails = getTransactionDetails;
const getAbciNoce = (data, config) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const ethAddressJson = ledger.get_serialized_address(data);
    const url = `${getExplorerApiRoute()}/abci_query`;
    const params = {
        path: '"module/account/nonce"',
        data: `"${ethAddressJson}"`,
        prove: false,
    };
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    return dataResult;
});
exports.getAbciNoce = getAbciNoce;
const getAbciInfo = (data, config) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const ethAddressJson = ledger.get_serialized_address(data);
    const url = `${getExplorerApiRoute()}/abci_query`;
    const params = {
        path: '"module/account/info"',
        data: `"${ethAddressJson}"`,
        prove: false,
    };
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    return dataResult;
});
exports.getAbciInfo = getAbciInfo;
const submitEvmTx = (tx, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getExplorerApiRoute()}`;
    const params = {
        id: 58,
        jsonrpc: '2.0',
        method: 'broadcast_tx_sync',
        params: {
            tx,
        },
    };
    const dataResult = yield (0, exports.apiPost)(url, params, Object.assign({}, config));
    return dataResult;
});
exports.submitEvmTx = submitEvmTx;
const getValidatorList = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getLedgerRoute()}/validator_list`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getValidatorList = getValidatorList;
const getDelegateInfo = (publickey, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getLedgerRoute()}/delegation_info/${publickey}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getDelegateInfo = getDelegateInfo;
const sendRpcCall = (url, givenPayload, config) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultPayload = {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_protocolVersion',
        params: [],
    };
    const payload = Object.assign(Object.assign({}, defaultPayload), givenPayload);
    const dataResult = yield (0, exports.apiPost)(url, payload, Object.assign({}, config));
    return dataResult;
});
exports.sendRpcCall = sendRpcCall;
const sendRpcCallV2 = (givenPayload, config) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultPayload = {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_protocolVersion',
        params: [],
    };
    const url = `${(0, exports.getRpcRoute)()}`;
    const payload = Object.assign(Object.assign({}, defaultPayload), givenPayload);
    const dataResult = yield (0, exports.apiPost)(url, payload, Object.assign({}, config));
    return dataResult;
});
exports.sendRpcCallV2 = sendRpcCallV2;
const getRpcPayload = (msgId, method, extraParams) => {
    const payload = {
        id: msgId,
        method,
        params: extraParams,
    };
    return payload;
};
exports.getRpcPayload = getRpcPayload;
const getLatestBlock = (extraParams, config) => __awaiter(void 0, void 0, void 0, function* () {
    const msgId = 1;
    const method = 'eth_blockNumber';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = yield (0, exports.sendRpcCallV2)(payload, config);
    return dataResult;
});
exports.getLatestBlock = getLatestBlock;
const getOwnedAbars = (commitment, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getQueryRoute()}/owned_abars/${commitment}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getOwnedAbars = getOwnedAbars;
const getAbarMemos = (startSid, endSid, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getQueryRoute()}/get_abar_memos`;
    const params = { start: startSid.trim(), end: endSid.trim() };
    const dataResult = yield (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    return dataResult;
});
exports.getAbarMemos = getAbarMemos;
const checkNullifierHashSpent = (hash, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getQueryRoute()}/check_nullifier_hash/${hash}`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.checkNullifierHashSpent = checkNullifierHashSpent;
const getConfig = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getLedgerRoute()}/display_checkpoint`;
    const dataResult = yield (0, exports.apiGet)(url, config);
    return dataResult;
});
exports.getConfig = getConfig;
const getAbarCommitment = (atxoSid, config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getQueryRoute()}/get_abar_commitment/${atxoSid.trim()}`;
    const dataResult = yield (0, exports.apiGet)(url, Object.assign({}, config));
    return dataResult;
});
exports.getAbarCommitment = getAbarCommitment;
const getMaxAtxoSid = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${getQueryRoute()}/get_max_atxo_sid`;
    const dataResult = yield (0, exports.apiGet)(url, Object.assign({}, config));
    return dataResult;
});
exports.getMaxAtxoSid = getMaxAtxoSid;
//# sourceMappingURL=network.js.map