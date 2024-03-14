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
    amount: string;
    seller: string;
    unitsAmount: string;
    unitsPrice: string;
    fraPrice: string;
    fraTotalPrice: string;
    create_time: number;
};
type TradingListingListResponse = {
    total: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    data: TradingListingDetail[];
};
export declare const sendBRC20DeployTx: (tick: string, totalSupply: number, limitPerMint: number, walletInfoFrom: Keypair.WalletKeypar) => Promise<string>;
export declare const sendBRC20MintTx: (tick: string, amt: number, repeat: number, walletInfoFrom: Keypair.WalletKeypar) => Promise<string>;
export declare const getMiddleman: (listId: number, baseUrl: string) => Promise<any>;
export declare const addList: (ticker: string, totalPrice: string, amount: string, baseUrl: string, walletInfoFrom: Keypair.WalletKeypar) => Promise<{
    txHash: string;
    confirmResult: boolean;
}>;
export declare const buy: (listId: number, amt: string, baseUrl: string, walletInfoFrom: Keypair.WalletKeypar) => Promise<{
    txHash: string;
    buyResult: any;
}>;
export declare const getTradingListingList: (pageNo: number, pageCount: number, ticker: string, baseUrl: string, walletInfoFrom: Keypair.WalletKeypar, listingState?: number, withoutMyListings?: boolean) => Promise<TradingListingListResponse>;
export {};
