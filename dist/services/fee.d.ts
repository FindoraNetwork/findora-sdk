import { WalletKeypar } from '../api/keypair';
import { TransferOperationBuilder, XfrPublicKey } from './ledger/types';
import { UtxoInputsInfo } from './utxoHelper';
export declare const getTransferOperationWithFee: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo) => Promise<TransferOperationBuilder>;
export declare const getTransferOperation: (walletInfo: WalletKeypar, utxoInputs: UtxoInputsInfo, numbers: number, utxoNumbers: BigInt, toPublickey: XfrPublicKey) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperationWithFee: (walletInfo: WalletKeypar, fraCode: string) => Promise<TransferOperationBuilder>;
export declare const buildTransferOperation: (walletInfo: WalletKeypar, fraCode: string, numbers: number, toPublickey: XfrPublicKey) => Promise<TransferOperationBuilder>;
