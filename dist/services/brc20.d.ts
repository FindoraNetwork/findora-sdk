import { Keypair } from '../api';
export interface FRATransferRequestParams {
    receiver: string;
    amt: number;
}
export interface FRATransferRequest {
    session: {
        origin: string;
    };
    requestApproval: boolean;
    data: {
        params: FRATransferRequestParams;
    };
}
export declare const sendBRC20MintTx: (tick: string, amt: number, repeat: number, walletInfoFrom: Keypair.WalletKeypar) => Promise<string>;
export declare const getMiddleman: (listId: number, baseUrl: string) => Promise<any>;
export declare const addList: (ticker: string, totalPrice: string, amount: string, baseUrl: string, walletInfoFrom: Keypair.WalletKeypar) => Promise<{
    txHash: string;
    confirmResult: boolean;
}>;
