export interface SdkEnvironmentConfig {
    hostUrl: string;
    protocol: string;
    queryPort?: string;
    ledgerPort?: string;
    submissionPort?: string;
}
export default class Sdk {
    static environment: {
        hostUrl: string;
        protocol: string;
        queryPort: string;
        ledgerPort: string;
        submissionPort: string;
    };
    static init(sdkEnv: SdkEnvironmentConfig): void;
}
