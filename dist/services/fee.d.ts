import { WalletKeypar } from '../api/keypair';
import { TransferOperationBuilder } from './ledger/types';
import { UtxoInputsInfo } from './utxoHelper';
export declare const getTransferOperationWithFee: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperationWithFee: (walletInfo: WalletKeypar, fraCode: string) => Promise<TransferOperationBuilder>;
