import { CacheItem } from './services/cacheStore/types';
export interface SdkEnvironmentConfig {
    hostUrl: string;
    queryPort?: string;
    ledgerPort?: string;
    submissionPort?: string;
}
export default class Sdk {
    static environment: {
        hostUrl: string;
        queryPort: string;
        ledgerPort: string;
        submissionPort: string;
    };
    static init(sdkEnv: SdkEnvironmentConfig): void;
    static setUtxoData(walletAddress: string, utxoCache: CacheItem[]): Promise<true>;
}
