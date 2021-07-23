import { CACHE_ENTRIES } from './config/cache';
import Cache from './services/cacheStore/factory';
import { FileCacheProvider, MemoryCacheProvider } from './services/cacheStore/providers';
import { CacheItem } from './services/cacheStore/types';

type SdkCacheProvider = typeof FileCacheProvider | typeof MemoryCacheProvider;

export interface SdkEnvironmentConfig {
  hostUrl: string;
  queryPort?: string;
  ledgerPort?: string;
  submissionPort?: string;
  cacheProvider?: SdkCacheProvider;
  cachePath?: string;
}

const SdkDefaultEnvironment = {
  hostUrl: 'https://dev-staging.dev.findora.org',
  queryPort: '8667',
  ledgerPort: '8668',
  submissionPort: '8669',
  explorerApiPort: '26657',
  cacheProvider: MemoryCacheProvider,
  cachePath: './cache',
};

export default class Sdk {
  public static environment = { ...SdkDefaultEnvironment };

  public static init(sdkEnv: SdkEnvironmentConfig): void {
    Sdk.environment = { ...SdkDefaultEnvironment, ...sdkEnv };
  }

  public static reset(): void {
    Sdk.environment = { ...SdkDefaultEnvironment };
  }

  public static async setUtxoData(walletAddress: string, utxoCache: CacheItem[]): Promise<true> {
    const cacheDataToSave: CacheItem = {};

    utxoCache.forEach(item => {
      cacheDataToSave[`sid_${item.sid}`] = item;
    });

    await Cache.write(
      `${CACHE_ENTRIES.UTXO_DATA}_${walletAddress}`,
      cacheDataToSave,
      Sdk.environment.cacheProvider,
    );

    return true;
  }
}
