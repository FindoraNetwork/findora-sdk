"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKeypair = exports.restoreFromKeystoreString = exports.recoveryKeypairFromKeystore = exports.restoreFromKeystore = exports.restoreFromMnemonic = exports.restoreEvmKeyStore = exports.restoreEvmPrivate = exports.restoreFromPrivateKey = exports.getXfrPrivateKeyByBase64 = exports.getAddressPublicAndKey = exports.getPublicKeyByXfr = exports.getXfrPublicKeyByBase64 = exports.getAddressByPublicKey = exports.getAddress = exports.getPublicKeyStr = exports.getMnemonic = exports.getPrivateKeyStr = void 0;
const ledgerWrapper_1 = require("../../services/ledger/ledgerWrapper");
/**
 * Returns a private key
 * @rem
 * @remarks
 * Using a given {@link https://git@github.com:FindoraNetwork/wasm-js-bindings.git | Ledger } **XfrKeyPair** keypair it returns a private key.
 *
 * This method is used when user needs to retrieve a private key from the **XfrKeyPair** keypair
 *
 * @example
 *
 * ```ts
 * // We use Findora Ledger to generate a new keypair (in demo purposes)
 * const ledger = await getLedger();
 * const keypair = ledger.new_keypair();
 *
 * // Now, we use `getPrivateKeyStr` to return a provate key of this keypair
 * const privateStr = await getPrivateKeyStr(keypair);
 * ```
 * @param keypair - XfrKeyPair
 * @returns Private key
 *
 * @throws `An error returned by Ledger with a prefix added by SDK`
 */
const getPrivateKeyStr = (keypair) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    try {
        return ledger.get_priv_key_str(keypair).replace(/^"|"$/g, '');
    }
    catch (err) {
        throw new Error(`could not get priv key string, "${err}" `);
    }
});
exports.getPrivateKeyStr = getPrivateKeyStr;
const getMnemonic = (desiredLength, mnemonicLang = 'en') => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    try {
        const ledgerMnemonicString = ledger.generate_mnemonic_custom(desiredLength, mnemonicLang);
        const result = String(ledgerMnemonicString).split(' ');
        return result;
    }
    catch (err) {
        throw new Error(`could not generate custom mnemonic. Details are: "${err}"`);
    }
});
exports.getMnemonic = getMnemonic;
const getPublicKeyStr = (keypair) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    try {
        const publickey = ledger.get_pub_key_str(keypair).replace(/"/g, '');
        // other option is
        //  const publickey = ledger.public_key_to_base64(ledger.get_pk_from_keypair(keypair));
        //
        return publickey;
    }
    catch (err) {
        throw new Error(`could not get pub key string, "${err}" `);
    }
});
exports.getPublicKeyStr = getPublicKeyStr;
const getAddress = (keypair) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    try {
        return ledger.public_key_to_bech32(ledger.get_pk_from_keypair(keypair));
    }
    catch (err) {
        throw new Error(`could not get address string, "${err}" `);
    }
});
exports.getAddress = getAddress;
const getAddressByPublicKey = (publicKey) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    try {
        return ledger.base64_to_bech32(publicKey);
    }
    catch (err) {
        throw new Error(`could not get address by public key, "${err}" `);
    }
});
exports.getAddressByPublicKey = getAddressByPublicKey;
/**
 * @todo Add unit test
 */
const getXfrPublicKeyByBase64 = (publicKey) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    try {
        return ledger.public_key_from_base64(publicKey);
    }
    catch (err) {
        throw new Error(`could not get xfr public key by base64, "${err}" `);
    }
});
exports.getXfrPublicKeyByBase64 = getXfrPublicKeyByBase64;
/**
 * @todo Add unit test
 */
const getPublicKeyByXfr = (publicKey) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    try {
        return ledger.public_key_to_base64(publicKey);
    }
    catch (err) {
        throw new Error(`could not get base64 public key by xfr, "${err}" `);
    }
});
exports.getPublicKeyByXfr = getPublicKeyByXfr;
const getAddressPublicAndKey = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    try {
        const publickey = ledger.bech32_to_base64(address);
        return {
            address,
            publickey,
        };
    }
    catch (err) {
        throw new Error(`could not create a LightWalletKeypair, "${err}" `);
    }
});
exports.getAddressPublicAndKey = getAddressPublicAndKey;
const getXfrPrivateKeyByBase64 = (privateStr) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const toSend = `"${privateStr}"`;
    console.log('from sdk getXfrPrivateKeyByBase64 - to send 2', toSend);
    console.log('from sdk getXfrPrivateKeyByBase64 - privateStr 2 ', privateStr);
    let keypair;
    try {
        keypair = ledger.create_keypair_from_secret(toSend);
    }
    catch (error) {
        throw new Error(`could not restore keypair. details: "${error}"`);
    }
    if (!keypair) {
        throw new Error('could not restore keypair. Keypair is empty');
    }
    return keypair;
});
exports.getXfrPrivateKeyByBase64 = getXfrPrivateKeyByBase64;
/**
 * Creates an instance of {@link WalletKeypar} using given private key and password.
 *
 * @remarks
 * This method is used to restore a `wallet keypair`.
 *
 * The **Keypair** contains some essential information, such as:
 * - address
 * - public key
 * - key store
 *
 * and so on, and it is used for pretty much any _personalized_ operation that user can do using FindoraSdk
 *
 * @example
 *
 * ```ts
 * const password = 'qsjEI%123';
 * const pkey = 'XXXXXXXXXX';
 *
 * // Create a wallet info object using given private key and password
 * const walletInfo = await Keypair.restoreFromPrivateKey(pkey, password);
 * ```
 * @param privateStr - Private key
 * @param password - Password to be used to generate an encrypted KeyStore
 * @returns An instance of {@link WalletKeypar}
 *
 */
const restoreFromPrivateKey = (privateStr, password) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    console.log('from sdk restoreFromPrivateKey privateStr', privateStr);
    const keypair = yield (0, exports.getXfrPrivateKeyByBase64)(privateStr);
    // const toSend = `"${privateStr}"`;
    //
    // let keypair;
    //
    // try {
    //   keypair = ledger.create_keypair_from_secret(toSend);
    // } catch (error) {
    //   throw new Error(`could not restore keypair. details: "${error as Error}"`);
    // }
    //
    // if (!keypair) {
    //   throw new Error('could not restore keypair. Keypair is empty');
    // }
    const keypairStr = ledger.keypair_to_str(keypair);
    const encrypted = ledger.encryption_pbkdf2_aes256gcm(keypairStr, password);
    const publickey = yield (0, exports.getPublicKeyStr)(keypair);
    const address = yield (0, exports.getAddress)(keypair);
    return {
        keyStore: encrypted,
        publickey,
        address,
        keypair,
        privateStr,
    };
});
exports.restoreFromPrivateKey = restoreFromPrivateKey;
/*
 * Recover ethereum address from ecdsa private key, eg. 0x73c71...*
 */
const restoreEvmPrivate = (privateStr, password) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const encrypted = ledger.encryption_pbkdf2_aes256gcm(privateStr, password);
    const address = ledger.recover_address_from_sk(privateStr);
    return {
        keyStore: encrypted,
        address,
    };
});
exports.restoreEvmPrivate = restoreEvmPrivate;
const restoreEvmKeyStore = (keyStore, password) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const data = new Uint8Array(Object.values(keyStore));
    const privateStr = ledger.decryption_pbkdf2_aes256gcm(data, password);
    const address = ledger.recover_address_from_sk(privateStr);
    return { privateKey: privateStr, address };
});
exports.restoreEvmKeyStore = restoreEvmKeyStore;
const restoreFromMnemonic = (mnemonic, password) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const keypair = ledger.restore_keypair_from_mnemonic_default(mnemonic.join(' '));
    const privateStr = yield (0, exports.getPrivateKeyStr)(keypair);
    const keyPairStr = ledger.keypair_to_str(keypair);
    const encrypted = ledger.encryption_pbkdf2_aes256gcm(keyPairStr, password);
    const publickey = yield (0, exports.getPublicKeyStr)(keypair);
    const address = yield (0, exports.getAddress)(keypair);
    return {
        keyStore: encrypted,
        publickey,
        address,
        keypair,
        privateStr,
    };
});
exports.restoreFromMnemonic = restoreFromMnemonic;
const restoreFromKeystore = (keyStore, ksPassword, password) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    try {
        const keyPairStr = ledger.decryption_pbkdf2_aes256gcm(keyStore, ksPassword);
        const keypair = ledger.keypair_from_str(keyPairStr);
        const encrypted = ledger.encryption_pbkdf2_aes256gcm(keyPairStr, password);
        const publickey = yield (0, exports.getPublicKeyStr)(keypair);
        const address = yield (0, exports.getAddress)(keypair);
        const privateStr = yield (0, exports.getPrivateKeyStr)(keypair);
        return {
            keyStore: encrypted,
            publickey,
            address,
            keypair,
            privateStr,
        };
    }
    catch (err) {
        throw new Error(`could not restore keypair from the key string. Details: "${err.message}"`);
    }
});
exports.restoreFromKeystore = restoreFromKeystore;
const recoveryKeypairFromKeystore = (keyStore, password) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    try {
        const keyPairStr = ledger.decryption_pbkdf2_aes256gcm(keyStore, password);
        const keypair = ledger.keypair_from_str(keyPairStr);
        const publickey = yield (0, exports.getPublicKeyStr)(keypair);
        const address = yield (0, exports.getAddressByPublicKey)(publickey);
        return {
            publickey,
            address,
            keypair,
        };
    }
    catch (err) {
        throw new Error(`could not recovery keypair from the key store. Details: "${err.message}"`);
    }
});
exports.recoveryKeypairFromKeystore = recoveryKeypairFromKeystore;
const restoreFromKeystoreString = (keyStoreString, ksPassword, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keyStoreObject = JSON.parse(keyStoreString).encryptedKey;
        const keyStore = new Uint8Array(Object.values(keyStoreObject));
        const result = yield (0, exports.restoreFromKeystore)(keyStore, ksPassword, password);
        return result;
    }
    catch (err) {
        throw new Error(`could not restore keypair from the key store string. Details: "${err.message}"`);
    }
});
exports.restoreFromKeystoreString = restoreFromKeystoreString;
const createKeypair = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const ledger = yield (0, ledgerWrapper_1.getLedger)();
    const mnemonic = yield (0, exports.getMnemonic)(24);
    const keypair = ledger.restore_keypair_from_mnemonic_default(mnemonic.join(' '));
    try {
        const keyPairStr = ledger.keypair_to_str(keypair);
        const encrypted = ledger.encryption_pbkdf2_aes256gcm(keyPairStr, password);
        const privateStr = yield (0, exports.getPrivateKeyStr)(keypair);
        const publickey = yield (0, exports.getPublicKeyStr)(keypair);
        const address = yield (0, exports.getAddress)(keypair);
        return {
            keyStore: encrypted,
            publickey,
            address,
            keypair,
            privateStr,
        };
    }
    catch (err) {
        throw new Error(`could not create a WalletKeypar, "${err}" `);
    }
});
exports.createKeypair = createKeypair;
//# sourceMappingURL=keypair.js.map