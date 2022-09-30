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
export interface FormattedAnonKeys {
    axfrSecretKey: string;
    axfrPublicKey: string;
}
export interface BarToAbarData {
    receiverAxfrPublicKey: string;
    commitments: string[];
}
export interface AbarToBarData {
    anonKeysSender: FormattedAnonKeys;
}
export interface ProcessedCommitmentsMap {
    commitmentKey: string;
    commitmentAxfrPublicKey: string;
    commitmentAssetType: string;
    commitmentAmount: string;
}
export interface AbarToAbarData {
    anonKeysSender: FormattedAnonKeys;
    anonPubKeyReceiver: string;
    commitmentsMap: ProcessedCommitmentsMap[];
}
export interface BarToAbarResult<T> {
    transactionBuilder: T;
    barToAbarData: BarToAbarData;
    sids: number[];
}
export interface AnonKeysResponse<T> {
    keysInstance: T;
    formatted: FormattedAnonKeys;
}
export interface OwnedAbar {
    commitment: string;
}
export interface OwnedAbarData {
    atxoSid: string;
    ownedAbar: OwnedAbar;
}
export interface OwnedAbarItem {
    commitment: string;
    abarData: OwnedAbarData;
}
export declare type MTleafNode = {
    siblings1: string;
    siblings2: string;
    is_left_child: number;
    is_right_child: number;
};
export interface OpenedAbar {
    amount: string;
    asset_type: number[];
    blind: string;
    pub_key: string;
    owner_memo: {
        blind_share: string;
        lock: {
            ciphertext: string;
            ephemeral_public_key: string;
        };
    };
    mt_leaf_info: {
        path: {
            nodes: MTleafNode[];
        };
        root: string;
        root_version: string;
        uid: string;
    };
}
export interface OpenedAbarInfo {
    abar: OpenedAbar;
    amount: string;
    assetType: string;
}
export interface AbarMemoData {
    point: string;
    ctext: number[];
}
export declare type AbarMemoItem = [string, AbarMemoData];
export interface DecryptedAbarMemoData {
    atxoSid: string;
    decryptedAbar: Uint8Array;
    owner: FormattedAnonKeys;
}
export interface AtxoCommitmentItem {
    atxoSid: string;
    commitment: string;
}
