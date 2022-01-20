declare namespace FindoraWallet {
  export interface IAssetRules {
    decimals: number;
    transferable: boolean;
    updatable: boolean;
    transfer_multisig_rules: any;
    max_units: null | number;
    tracing_policies: any[];
  }
  export interface ILedgerAsset {
    memo: string;
  }

  export interface IPureAsset extends ILedgerAsset {
    code: {
      val: number[];
    };
    issuer: {
      key: string;
    };
    asset_rules: IAssetRules;
  }

  export interface IAsset extends ILedgerAsset {
    address: string;
    code: string;
    issuer: string;
    memo: string;
    assetRules: IAssetRules;
    numbers: BigInt;
    name: string;
    options?: IAssetCustomOptions;
    ownerMemo?: any;
    record?: any;
  }

  export interface IAssetCustomOptions {
    builtIn: boolean;
    owned: boolean;
  }

  export interface IAssetCustom {
    options?: IAssetCustomOptions;
    assetCode: string;
    nickname: string;
    nicknames: string[];
    address: string;
  }

  export interface IWallet {
    keyStore?: Uint8Array | string;
    publickey?: string;
    address?: string;
    name?: string;
    keypair?: any;
    privateKey?: string;
  }

  interface FormattedAnonKeys {
    axfrPublicKey: string;
    axfrSecretKey: string;
    decKey: string;
    encKey: string;
  }

  export interface BarToAbarData {
    anonKeysFormatted: FormattedAnonKeys;
    randomizers: string[];
  }
  export interface BarToAbarResult<T> {
    transactionBuilder: T;
    barToAbarData: BarToAbarData;
    sid: string;
  }

  export interface AnonKeysResponse<T> {
    keysInstance: T;
    formatted: FormattedAnonKeys;
  }
}
