import { Keypair, Transaction, Network } from '../api';

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
