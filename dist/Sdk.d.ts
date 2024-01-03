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
    explorerApiPort?: string;
    rpcPort?: string;
    cacheProvider: SdkCacheProvider;
    cachePath: string;
    brc20url?: string;
    brc20port?: string;
}
export default class Sdk {
    static environment: {
        hostUrl: string;
        blockScanerUrl: string;
        configServerUrl?: string | undefined;
        queryPort?: string | undefined;
        ledgerPort?: string | undefined;
        submissionPort?: string | undefined;
        explorerApiPort?: string | undefined;
        rpcPort?: string | undefined;
        cacheProvider: import("./services/cacheStore/types").CacheProvider;
        cachePath: string;
        brc20url?: string | undefined;
        brc20port?: string | undefined;
    };
    static init(sdkEnv: SdkEnvironmentConfig): void;
    static reset(): void;
    static setUtxoData(walletAddress: string, utxoCache: CacheItem[]): Promise<true>;
}
export {};
