import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
import { SubmitEvmTxResult } from '../network/types';
export declare const sendAccountToEvm: (walletInfo: WalletKeypar, amount: string, ethAddress: string) => Promise<TransactionBuilder>;
export declare const sendEvmToAccount: (fraAddress: string, amount: string, ethPrivate: string, ethAddress: string) => Promise<SubmitEvmTxResult>;
