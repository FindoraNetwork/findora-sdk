import { Asset, Keypair, Transaction, Network } from '../api';
import { log, now, readFile, writeFile, getRandomNumber, delay } from '../services/utils';

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
    console.log('confirmList result, ', result);

    const { data } = result;

    console.log('confirmList response data', data);

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
