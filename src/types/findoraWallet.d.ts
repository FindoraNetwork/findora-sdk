declare namespace FindoraWallet {
  export interface IAssetRules {
    decimals: number;
    transferable: boolean;
    updatable: boolean;
    transfer_multisig_rules: any;
    max_units: null | number;
  }

  export interface IAsset {
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
}
