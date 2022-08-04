import { CACHE_ENTRIES } from './config/cache';
import Cache from './services/cacheStore/factory';
import { FileCacheProvider, MemoryCacheProvider } from './services/cacheStore/providers';
import { CacheItem } from './services/cacheStore/types';

type SdkCacheProvider = typeof FileCacheProvider | typeof MemoryCacheProvider;

export interface SdkEnvironmentConfig {
  hostUrl: string;
  configServerUrl?: string;
  queryPort?: string;
  ledgerPort?: string;
  submissionPort?: string;
  cacheProvider?: SdkCacheProvider;
  cachePath?: string;
}

const SdkDefaultEnvironment = {
  hostUrl: 'https://dev-evm.dev.findora.org',
  configServerUrl: 'http://columbus-config-qa02.s3-website-us-west-1.amazonaws.com/',
  queryPort: '8667',
  ledgerPort: '8668',
  submissionPort: '8669',
  explorerApiPort: '26657',
  rpcPort: '8545',
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
