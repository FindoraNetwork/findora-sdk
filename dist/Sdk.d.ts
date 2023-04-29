import { FileCacheProvider, MemoryCacheProvider } from './services/cacheStore/providers';
import { CacheItem } from './services/cacheStore/types';
type SdkCacheProvider = typeof FileCacheProvider | typeof MemoryCacheProvider;
export interface SdkEnvironmentConfig {
    hostUrl: string;
    blockScanerUrl: string;
    configServerUrl?: string;
    queryPort?: string;
    ledgerPort?: string;
    submissionPort?: string;
    cacheProvider?: SdkCacheProvider;
    cachePath?: string;
}
export default class Sdk {
    static environment: {
        hostUrl: string;
        blockScanerUrl: string;
        configServerUrl: string;
        queryPort: string;
        ledgerPort: string;
        submissionPort: string;
        explorerApiPort: string;
        rpcPort: string;
        cacheProvider: import("./services/cacheStore/types").CacheProvider;
        cachePath: string;
    };
    static init(sdkEnv: SdkEnvironmentConfig): void;
    static reset(): void;
    static setUtxoData(walletAddress: string, utxoCache: CacheItem[]): Promise<true>;
}
export {};
