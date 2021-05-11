import { WalletKeypar } from '_src/api/keypair';
import { TransferOperationBuilder } from '_src/services/ledger/types';
import { UtxoInputsInfo } from '_src/services/utxoHelper';
export declare const getTransferOperationWithFee: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperationWithFee: (walletInfo: WalletKeypar, fraCode: string) => Promise<TransferOperationBuilder>;
