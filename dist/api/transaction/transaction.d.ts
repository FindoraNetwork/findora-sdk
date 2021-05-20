import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
export declare const getTransactionBuilder: () => Promise<TransactionBuilder>;
export declare const sendTxToAddress: (walletInfo: WalletKeypar, toWalletInfo: WalletKeypar, numbers: number) => Promise<string>;
