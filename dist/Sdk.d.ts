import { FileCacheProvider, MemoryCacheProvider } from './services/cacheStore/providers';
import { CacheItem } from './services/cacheStore/types';
declare type SdkCacheProvider = typeof FileCacheProvider | typeof MemoryCacheProvider;
export interface SdkEnvironmentConfig {
    hostUrl: string;
    queryPort?: string;
    ledgerPort?: string;
    submissionPort?: string;
    cacheProvider?: SdkCacheProvider;
    cachePath?: string;
}
export default class Sdk {
    static environment: {
        hostUrl: string;
        queryPort: string;
        ledgerPort: string;
        submissionPort: string;
        cacheProvider: import("./services/cacheStore/types").CacheProvider;
        cachePath: string;
    };
    static init(sdkEnv: SdkEnvironmentConfig): void;
    static setUtxoData(walletAddress: string, utxoCache: CacheItem[]): Promise<true>;
}
export {};
