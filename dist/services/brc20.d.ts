import { Keypair } from '../api';
export declare const sendBRC20MintTx: (tick: string, amt: number, repeat: number, walletInfoFrom: Keypair.WalletKeypar) => Promise<string>;
