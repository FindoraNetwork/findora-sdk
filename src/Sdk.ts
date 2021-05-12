import { CACHE_ENTRIES } from './config/cache';
import Cache from './services/cacheStore/factory';
import { MemoryCacheProvider as CacheProvider } from './services/cacheStore/providers';
import { CacheItem } from './services/cacheStore/types';

export interface SdkEnvironmentConfig {
  hostUrl: string;
  queryPort?: string;
  ledgerPort?: string;
  submissionPort?: string;
}

export default class Sdk {
  public static environment = {
    hostUrl: 'https://dev-staging.dev.findora.org',
    queryPort: '8667',
    ledgerPort: '8668',
    submissionPort: '8669',
  };

  public static init(sdkEnv: SdkEnvironmentConfig): void {
    Sdk.environment = { ...Sdk.environment, ...sdkEnv };
  }

  public static async setUtxoData(walletAddress: string, utxoCache: CacheItem[]): Promise<true> {
    const cacheDataToSave: CacheItem = {};

    utxoCache.forEach(item => {
      cacheDataToSave[`sid_${item.sid}`] = item;
    });

    await Cache.write(`${CACHE_ENTRIES.UTXO_DATA}_${walletAddress}`, { ...cacheDataToSave }, CacheProvider);

    return true;
  }
}
