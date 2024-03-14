import { Asset, Keypair, Transaction, Network } from '../api';
import { delay } from '../services/utils';

import axios, { AxiosHeaders } from 'axios';

type Brc20TransferType = {
  tick: string;
  amt: string;
  receiver: string;
};

type FRATransferType = {
  amt: string;
  receiver: string;
};

export interface FRATransferRequestParams {
  receiver: string;
  amt: number;
}

export interface FRATransferRequest {
  session: { origin: string };
  requestApproval: boolean;
  data: {
    params: FRATransferRequestParams;
  };
}

export type ListedItemResponse = {
  amount: string;
  create_time: number;
  from: string;
  id: number;
  price: string;
  state: 0 | 1;
  ticker: string;
  to: string;
};

export type TradingListingDetail = {
  id: number;
  ticker: string;
  amount: string; // 1,000
  seller: string; // fra12345
  unitsAmount: string; // 23,000
  unitsPrice: string; // $23.44 FRA
  fraPrice: string; // fra 244.99
  fraTotalPrice: string; // $203.44
  create_time: number;
};

type TradingListingListResponse = {
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  data: TradingListingDetail[];
};
const brcEnpoints = {
  balance: '/balance',
  balanceAll: '/balance/all',
  tokenList: '/tokenList',
  tokenDetail: '/token/:id/detail',
  tokenHolders: '/token/userRank',
  tokenDeployCheck: '/token/check/:ticker',

  addList: '/addList',
  confirmList: '/confirmList',
  cancelList: '/cancelList',
  listedList: '/list',
  orderList: '/orderList',
  myList: '/myList',
  middleman: '/account',
  market: '/market',
  banner: '/banner',
  buy: '/buy',
};

// const { tick, totalSupply,  limitPerMint, rndSecMin, rndSecMax } = currentRecord;
export const sendBRC20DeployTx = async (
  tick: string,
  totalSupply: number,
  limitPerMint: number,
  walletInfoFrom: Keypair.WalletKeypar,
) => {
  try {
    const params = { tick, max: totalSupply, lim: limitPerMint };

    const transactionBuilder = await Transaction.brc20Deploy(walletInfoFrom, params);

    const myTxInJson = transactionBuilder.transaction();
    const myTxInBase64 = Buffer.from(myTxInJson).toString('base64');

    const result = await Network.submitBRC20Tx(myTxInBase64);

    console.log('submitBRC20Tx deploy result', result);

    const { response } = result;

    return response?.result?.hash ?? '';
  } catch (er) {
    console.log(er);
  }
  return '';
};

export const sendBRC20MintTx = async (
  tick: string,
  amt: number,
  repeat: number,
  walletInfoFrom: Keypair.WalletKeypar,
) => {
  try {
    const params = { tick, amt, repeat };
    const transactionBuilder = await Transaction.brc20Mint(walletInfoFrom, params);

    const myTxInJson = transactionBuilder.transaction();
    const myTxInBase64 = Buffer.from(myTxInJson).toString('base64');

    const result = await Network.submitBRC20Tx(myTxInBase64);

    console.log('submitBRC20Tx mint result', result);

    const { response } = result;

    return response?.result?.hash ?? '';
  } catch (er) {
    console.log(er);
  }
  return '';
};

const getAxios = () => {
  const _axios = axios.create({});

  // Unified processing
  _axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      return Promise.reject(error);
    },
  );
  return _axios;
};

export const getMiddleman = async (listId: number, baseUrl: string) => {
  const _axios = getAxios();
  try {
    const { data } = await _axios.get(`${baseUrl}${brcEnpoints.middleman}`, { params: { listId } });
    return data.result;
  } catch (error) {
    console.log(error);
  }
  return '';
};

const confirmList = async (listId: number, user: string, baseUrl: string) => {
  try {
    const formData = new FormData();
    formData.append('listId', `${listId}`);
    formData.append('user', user);

    const headers = new AxiosHeaders();
    headers.setContentType('multipart/form-data');
    const _axios = getAxios();

    const result = await _axios.post(`${baseUrl}${brcEnpoints.confirmList}`, formData, { headers });

    const { data } = result;

    console.log('confirmList result data', data);

    if (data.result === 'ok') {
      return true;
    }
  } catch (error) {
    console.log('confirmList error', error);
  }
  return false;
};

export const addList = async (
  ticker: string,
  totalPrice: string,
  amount: string,
  baseUrl: string,
  walletInfoFrom: Keypair.WalletKeypar,
) => {
  const _axios = getAxios();

  const user = walletInfoFrom.address;

  try {
    const formData = new FormData();
    formData.append('ticker', ticker);
    formData.append('user', user);
    formData.append('totalPrice', totalPrice);
    formData.append('amount', amount);

    const headers = new AxiosHeaders();
    headers.setContentType('multipart/form-data');

    const { data } = await _axios.post(`${baseUrl}${brcEnpoints.addList}`, formData, { headers });
    console.log('addList response data', data);

    const { listId } = data;

    if (listId) {
      const receiver = await getMiddleman(listId, baseUrl);

      const fraTx = await fraTransfer(
        {
          amt: '0.1',
          receiver,
        },
        walletInfoFrom,
      );
      console.log(`addList fraTx - "${fraTx}"`);

      const brc20Tx = await transfer(
        {
          tick: ticker,
          amt: `${amount}`,
          receiver,
        },
        walletInfoFrom,
      );

      console.log(`addList brc20Tx - "${brc20Tx}"`);

      if (!fraTx || !brc20Tx) {
        console.log(
          'addList error!! either fraTransfer or brc20Transfer has failed, returning an empty string without calling list confirm',
        );

        return { txHash: brc20Tx, confirmResult: false };
      }

      const confirmResult = await confirmList(listId, user, baseUrl);

      return { txHash: brc20Tx, confirmResult };
    }
  } catch (error) {
    console.log(error);
  }

  return { txHash: '', confirmResult: false };
};

const sendBRC20TransferTx = async (
  tick: string,
  amt: number,
  receiver: string,
  walletInfoFrom: Keypair.WalletKeypar,
) => {
  try {
    // const _account = await this.getCurrentAccount();
    // const walletInfo = await Keypair.restoreFromPrivateKey(_account.privateKey.replace(/"/g, ''), '123');

    // again, we Probably need a reciepient here too?
    const transactionBuilder = await Transaction.brc20Transfer(walletInfoFrom, {
      receiverAddress: receiver,
      amt,
      tick,
    });

    const myTxInJson = transactionBuilder.transaction();
    const myTxInBase64 = Buffer.from(myTxInJson).toString('base64');

    const result = await Network.submitBRC20Tx(myTxInBase64);

    console.log('submitBRC20Tx transfer result', result);

    return result;
    // const { response } = result;

    // return response?.result?.hash ?? '';
  } catch (er) {
    console.log(er);
  }
  return {};
};

const sendFRATransferTx = async (data: FRATransferType, walletInfoFrom: Keypair.WalletKeypar) => {
  const { amt, receiver } = data;

  try {
    const assetCode = await Asset.getFraAssetCode();

    const assetBlindRules: Asset.AssetBlindRules = {
      isTypeBlind: false,
      isAmountBlind: false,
    };

    const transactionBuilder = await Transaction.sendToAddressV2(
      walletInfoFrom,
      receiver,
      `${amt}`,
      assetCode,
      assetBlindRules,
    );

    const result = await Transaction.submitTransaction(transactionBuilder);

    console.log('submit tx result (for sending fra), ', result);

    let txHash = '';

    while (txHash === '') {
      await delay(5000);
      const response = await Network.getHashSwap(result);
      const [tx] = response?.response?.result?.txs ?? [];
      console.log('tx hash swap result after waiting 5sec', tx);
      const { hash } = tx || {};
      txHash = tx ? hash : '';
    }
    return txHash;
  } catch (er) {
    console.log('sendFRATransferTx err', er);
  }
  return '';
};

const transfer = async (data: Brc20TransferType, walletInfoFrom: Keypair.WalletKeypar): Promise<string> => {
  const { tick, amt, receiver } = data;

  try {
    const result = await sendBRC20TransferTx(tick, +amt, receiver, walletInfoFrom);
    console.log('transfer - sendBRC20TransferTx result', result);
    const { response } = result;

    return response?.result?.hash ?? '';
  } catch (error) {
    console.log(error);
    return '';
  }
};

const fraTransfer = async (data: FRATransferType, walletInfoFrom: Keypair.WalletKeypar): Promise<string> => {
  const { receiver, amt } = data;
  try {
    const data = await sendFRATransferTx(
      {
        receiver,
        amt,
      },
      walletInfoFrom,
    );
    console.log('sendFRATransferTx data response', data);

    return data;
  } catch (error) {
    console.log('ERROR!!! fra transfer error ', error);
    return '';
  }
};

export const buy = async (
  listId: number,
  amt: string,
  baseUrl: string,
  walletInfoFrom: Keypair.WalletKeypar,
) => {
  const _axios = getAxios();

  const user = walletInfoFrom.address;

  try {
    const receiver = await getMiddleman(listId, baseUrl);
    console.log('receiver for fra transfer', receiver);
    console.log('amount ', amt);
    console.log('listId', listId);
    console.log('user', user);

    const tx = await fraTransfer(
      {
        amt,
        receiver,
      },

      walletInfoFrom,
    );

    console.log('buy our fra tansfer tx!', tx);

    const formData = new FormData();

    formData.append('listId', `${listId}`);
    formData.append('user', user);
    formData.append('tx', tx);

    const headers = new AxiosHeaders();
    headers.setContentType('multipart/form-data');

    const url = `${baseUrl}${brcEnpoints.buy}`;
    console.log('url to post form', url);
    console.log('buy - tx, ', tx);

    if (!tx) {
      console.log('buy error!! fraTransfer has failed, returning the received tx');

      return { txHash: tx, buyResult: false };
    }

    const { data } = await _axios.post(url, formData, { headers });

    console.log('buy response data', data);

    if (data.result === 'ok') {
      return { txHash: tx, buyResult: data.result };
    }

    console.log('buy error!! buy request has failed, returning false as buy result');

    return { txHash: tx, buyResult: false };
  } catch (error) {
    console.log('buy error!!, ', error);
    return { txHash: '', buyResult: false };
  }
};

export const getTradingListingList = async (
  pageNo: number,
  pageCount: number,
  ticker: string,
  baseUrl: string,
  walletInfoFrom: Keypair.WalletKeypar,
  listingState = 0,
  withoutMyListings = true,
): Promise<TradingListingListResponse> => {
  const _axios = getAxios();

  const user = walletInfoFrom.address;

  try {
    const { data: responseData } = await _axios.get(`${baseUrl}${brcEnpoints.listedList}`, {
      params: {
        pageNo,
        pageCount,
        ticker: ticker.toLowerCase(),
        state: listingState,
      },
    });

    const { currentPage, pageSize, totalPages, total, data: ourData } = responseData;

    const dataToReturn: TradingListingDetail[] = ourData.map((item: ListedItemResponse) => {
      const { ticker, amount, create_time, from, to, id, price, state } = item;

      const pricePerUnit = +price / +amount;

      const res = {
        id,
        seller: from,
        to,
        ticker: ticker.trim(),
        amount,
        unitsAmount: `${pricePerUnit}`,
        unitsPrice: 0,
        fraPrice: price,
        fraTotalPrice: 0,
        create_time,
        state,
      };

      return res;
    });

    const filteredDataToReturn = withoutMyListings
      ? dataToReturn.filter(element => element.seller !== user)
      : dataToReturn;

    const data: TradingListingListResponse = {
      data: filteredDataToReturn,
      total,
      currentPage,
      pageSize,
      totalPages,
    };

    return data;
  } catch (error) {
    console.log('getTradingListingList error', error);
    // return null;

    const data: TradingListingListResponse = {
      data: [],
      total: 0,
      currentPage: pageNo,
      pageSize: pageCount,
      totalPages: 0,
    };

    return data;
  }
};
