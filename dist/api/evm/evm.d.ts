import { TransactionBuilder } from '../../services/ledger/types';
import { WalletKeypar } from '../keypair';
export declare const sendAccountToEvm: (walletInfo: WalletKeypar, amount: string, ethAddress: string) => Promise<TransactionBuilder>;
export declare const sendEvmToAccount: (fraAddress: string, amount: string, nonce: string, ethPrivate: string) => Promise<void>;
