import '@testing-library/jest-dom/extend-expect';
import Sdk from './Sdk';
import { FileCacheProvider, MemoryCacheProvider } from './services/cacheStore/providers';

afterEach(() => Sdk.reset());

describe('SdkMain', () => {
  describe('init', () => {
    it('initializes sdk environment with given values', async () => {
      const sdkEnv = {
        hostUrl: 'pHost',
        queryPort: 'p8667',
        ledgerPort: 'p8668',
        submissionPort: 'p8669',
        explorerApiPort: 'p26657',
        cacheProvider: FileCacheProvider,
        cachePath: 'pCacheDir',
      };

      Sdk.init(sdkEnv);

      expect(Sdk.environment.hostUrl).toEqual('pHost');
      expect(Sdk.environment.queryPort).toEqual('p8667');
      expect(Sdk.environment.ledgerPort).toEqual('p8668');
      expect(Sdk.environment.submissionPort).toEqual('p8669');
      expect(Sdk.environment.explorerApiPort).toEqual('p26657');

      expect(Sdk.environment.cacheProvider).toEqual({
        read: FileCacheProvider.read,
        write: FileCacheProvider.write,
      });

      expect(Sdk.environment.cachePath).toEqual('pCacheDir');
    });

    it('initializes sdk environment with default values', async () => {
      expect(Sdk.environment.hostUrl).toEqual('https://dev-staging.dev.findora.org');
      expect(Sdk.environment.queryPort).toEqual('8667');
      expect(Sdk.environment.ledgerPort).toEqual('8668');
      expect(Sdk.environment.submissionPort).toEqual('8669');
      expect(Sdk.environment.explorerApiPort).toEqual('26657');

      expect(Sdk.environment.cacheProvider).toEqual({
        read: MemoryCacheProvider.read,
        write: MemoryCacheProvider.write,
      });

      expect(Sdk.environment.cachePath).toEqual('./cache');
    });
  });

  describe('reset', () => {
    it('resets the environment with default values', async () => {
      const sdkEnv = {
        hostUrl: 'foo',
        queryPort: 'bar',
      };

      Sdk.init(sdkEnv);

      expect(Sdk.environment.hostUrl).toEqual('foo');
      expect(Sdk.environment.queryPort).toEqual('bar');

      Sdk.reset();

      expect(Sdk.environment.hostUrl).toEqual('https://dev-staging.dev.findora.org');
      expect(Sdk.environment.queryPort).toEqual('8667');
      expect(Sdk.environment.ledgerPort).toEqual('8668');
      expect(Sdk.environment.submissionPort).toEqual('8669');
      expect(Sdk.environment.explorerApiPort).toEqual('26657');

      expect(Sdk.environment.cacheProvider).toEqual({
        read: MemoryCacheProvider.read,
        write: MemoryCacheProvider.write,
      });

      expect(Sdk.environment.cachePath).toEqual('./cache');
    });
  });
});
