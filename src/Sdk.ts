import { CACHE_ENTRIES } from './config/cache';
import Cache from './services/cacheStore/factory';
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
  cacheProvider?: SdkCacheProvider;
  cachePath: string;
  brc20url?: string;
  brc20port?: string;
  needToAwaitForWasm?: boolean;
}

const SdkDefaultEnvironment: SdkEnvironmentConfig = {
  hostUrl: 'https://dev-evm.dev.findora.org',
  blockScanerUrl: '',
  configServerUrl: 'http://columbus-config-qa02.s3-website-us-west-1.amazonaws.com/',
  queryPort: '8667',
  ledgerPort: '8668',
  submissionPort: '8669',
  explorerApiPort: '26657',
  rpcPort: '8545',
  cacheProvider: MemoryCacheProvider,
  cachePath: './cache',
  brc20url: 'https://api-testnet.brc20.findora.org',
  brc20port: '',
  needToAwaitForWasm: false,
};

export default class Sdk {
  public static environment = { ...SdkDefaultEnvironment };

  public static init(sdkEnv: SdkEnvironmentConfig): void {
    console.log('sdk init was called');
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
      Sdk.environment.cacheProvider || MemoryCacheProvider,
    );

    return true;
  }
}
