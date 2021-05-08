export interface SdkEnvironmentConfig {
  hostUrl: string;
  protocol: string;
  queryPort?: string;
  ledgerPort?: string;
  submissionPort?: string;
}

export default class Sdk {
  public static environment = {
    hostUrl: 'dev-staging.dev.findora.org',
    protocol: 'https',
    queryPort: '8667',
    ledgerPort: '8668',
    submissionPort: '8669',
  };

  public static init(sdkEnv: SdkEnvironmentConfig): void {
    Sdk.environment = { ...Sdk.environment, ...sdkEnv };
  }
}
