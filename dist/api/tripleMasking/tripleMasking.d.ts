import { AnonTransferOperationBuilder, AxfrOwnerMemo, TransactionBuilder } from '../../services/ledger/types';
import * as FindoraWallet from '../../types/findoraWallet';
import * as Keypair from '../keypair';
interface BalanceInfo {
    assetType: string;
    amount: string;
}
interface AtxoMapItem {
    amount: string;
    atxoSid: string;
    assetType: string;
    commitment: string;
}
interface AnonWalletBalanceInfo {
    publickey: string;
    balances: BalanceInfo[];
}
export interface CommitmentsResponseMap {
    [key: string]: [string, number[], number];
}
export interface ProcessedCommitmentsMap {
    commitmentKey: string;
    commitmentAxfrPublicKey: string;
    commitmentAssetType: string;
    commitmentAmount: string;
}
/**
 * The `genAnonKeys` function is an asynchronous function that generates anonymous wallet key pairs.
 * It uses the `Keypair` module to generate a mnemonic phrase and restore a wallet key pair
 * from the generated mnemonic.
 *
 * @remarks
 * The `WalletKeypair` interface represents a pair of keys for a wallet and has the following structure:
 *
 * @remarks
 * The function internally uses the `Keypair` module, which should be imported and available in the module where this function is used.
 *
 * @remarks
 * The `Keypair.getMnemonic` and `Keypair.restoreFromMnemonic` functions are assumed to be defined within the `Keypair` module. These functions are used to generate a mnemonic and restore a wallet key pair from the mnemonic, respectively.
 *
 * @remarks
 * The `Keypair.getMnemonic` function creates a new mnemonic phrase with a given length (in this example, it is 24).
 *
 * @remarks
 * The `Keypair.restoreFromMnemonic` function is used to restore a wallet key pair from the generated mnemonic.
 *
 * @remarks
 * The string `'passwordfoo'` passed as the second argument to `Keypair.restoreFromMnemonic` is a placeholder and should be replaced with the actual password or passphrase for restoring the wallet key pair.
 *
 * @example
 * ```typescript
 * interface WalletKeypair {
 *   publicKey: string;
 *   privateKey: string;
 * }
 * ```
 *
 * ```typescript
 * import { genAnonKeys } from './your-module';
 *
 * async function generateAnonymousKeys() {
 *   try {
 *     const walletKeys = await genAnonKeys();
 *     console.log('Public Key:', walletKeys.publickey);
 *     console.log('Private Key:', walletKeys.privateStr);
 *   } catch (error) {
 *     console.error('Error generating anonymous keys:', error);
 *   }
 * }
 *
 * generateAnonymousKeys();
 * ```
 *
 * @returns The function returns a promise that resolves to a `WalletKeypair` object.
 */
export declare const genAnonKeys: () => Promise<Keypair.WalletKeypar>;
/**
 * The `getAbarOwnerMemo` function is an asynchronous function that retrieves the abar owner memo data for a given atxoSid.
 *
 * @param atxoSid - The atxoSid for which to fetch the abar owner memo data.
 *
 * @remarks
 * This function depends on the external `ledger` module, which should be imported from the wasm module and available in the module where this function is used.
 * It also relies on the `Network` module, which should be imported separately and accessible in the module.
 *
 * @remarks
 * The `abarOwnerMemo` is returned as an instance of `AxfrOwnerMemo`.
 *
 * @remarks
 * Ensure that the `ledger` module is imported from the wasm module and the `Network` module is imported separately. Replace `"atxoSid123456"` in the example with the actual atxoSid for which you want to fetch the abar owner memo data.
 *
 * @example
 * ```typescript
 * const atxoSid = "atxoSid123456";
 *
 * try {
 *   const abarOwnerMemo = await getAbarOwnerMemo(atxoSid);
 *
 *   console.log("Abar Owner Memo:");
 *   console.log(abarOwnerMemo);
 * } catch (error) {
 *   console.error("Error fetching abar owner memo data:", error);
 * }
 * ```
 *
 * @returns A promise that resolves to an instance of `AxfrOwnerMemo` representing the abar owner memo data.
 *
 * @throws Throws an error if there is a failure in fetching or decoding the abar memo data.
 */
export declare const getAbarOwnerMemo: (atxoSid: string) => Promise<AxfrOwnerMemo>;
/**
 * The `getAnonKeypairFromJson` function is an asynchronous function that converts a WalletKeypar object from JSON format to AnonKeyPair format.
 *
 * @param anonKeys - An object of type `WalletKeypar` containing the wallet's public key and private key in JSON format.
 *
 * @remarks
 * This function depends on the external `Keypair` module, which should be imported and available in the module where this function is used.
 *
 * @example
 * ```typescript
 * const anonKeys = {
 *   publickey: "base64publickey",
 *   privateStr: "base64privatekey",
 * };
 *
 * try {
 *   const anonKeyPair = await getAnonKeypairFromJson(anonKeys);
 *
 *   console.log("Converted AnonKeyPair:");
 *   console.log("Axfr Secret Key:", anonKeyPair.aXfrSecretKeyConverted);
 *   console.log("Axfr Public Key:", anonKeyPair.axfrPublicKeyConverted);
 * } catch (error) {
 *   console.error("Error converting AnonKeyPair from JSON:", error);
 * }
 * ```
 *
 * @returns A promise that resolves to an object containing the converted Axfr Secret Key and Axfr Public Key.
 */
export declare const getAnonKeypairFromJson: (anonKeys: Keypair.WalletKeypar) => Promise<{
    aXfrSecretKeyConverted: import("findora-wallet-wasm/web").XfrKeyPair;
    axfrPublicKeyConverted: import("findora-wallet-wasm/web").XfrPublicKey;
}>;
/**
 * The `openAbar` function opens (decrypts) an owned Abar item.
 *
 * @param abar - The owned Abar item to open.
 * @param anonKeys - The wallet keypair used for decryption.
 *
 * @returns A promise that resolves to an object containing the opened Abar information.
 *
 * @throws An error if there was an issue opening the Abar or retrieving the required information.
 *
 * @remarks
 * The `openAbar` function takes an owned Abar item and a wallet keypair as input.
 * It decrypts the owned Abar item using the provided keypair and retrieves additional information required for the decryption process.
 * The function returns an object containing the opened Abar information, including the decrypted amount, asset type, and the opened Abar itself.
 *
 * Example usage:
 * ```typescript
 * const abar = {
 *   abarData: {
 *     atxoSid: '0xabcdef1234567890',
 *     ownedAbar: 'encrypted-abar-data',
 *   },
 * };
 *
 * const anonKeys = {
 *   publickey: 'anon-public-key',
 *   privateStr: 'anon-private-key',
 * };
 *
 * try {
 *   const openedAbar = await openAbar(abar, anonKeys);
 *   console.log(openedAbar);
 *   // {
 *   //   amount: '100',
 *   //   assetType: 'ABC',
 *   //   abar: // opened Abar object
 *   // }
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export declare const openAbar: (abar: FindoraWallet.OwnedAbarItem, anonKeys: Keypair.WalletKeypar) => Promise<FindoraWallet.OpenedAbarInfo>;
/**
 * The `isNullifierHashSpent` function checks if a given nullifier hash is spent.
 *
 * @param hash - The nullifier hash to check.
 *
 * @returns A promise that resolves to a boolean indicating if the nullifier hash is spent (`true`) or not spent (`false`).
 *
 * @throws An error if there was an issue checking the nullifier hash spent status.
 *
 * @remarks
 * The `isNullifierHashSpent` function uses the given nullifier hash to check if it is spent. It calls the network's `checkNullifierHashSpent` function and retrieves the response indicating if the hash is spent or not.
 * The function handles error scenarios and returns a boolean value indicating the spent status of the nullifier hash.
 *
 * Example usage:
 * ```typescript
 * const hash = '0xabcdef1234567890';
 *
 * try {
 *   const isSpent = await isNullifierHashSpent(hash);
 *   console.log(isSpent); // true or false
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export declare const isNullifierHashSpent: (hash: string) => Promise<boolean>;
/**
 * The `genNullifierHash` function is an asynchronous function that generates a nullifier hash for a given set of parameters using zero-knowledge proof functionality.
 *
 * @param atxoSid - The identifier for the atxo (Anonymous Transferable eXtended Output) for which the nullifier hash is generated. It is a positive number in string format.
 * @param ownedAbar - An object representing an OwnedAbar with zero-knowledge proof functionality. It is fetched using a given string called `commitmentHash`.
 * @param axfrSpendKey - The spend key used to create the AxfrOwnerMemo for the `abarOwnerMemo`.
 *
 * @remarks
 * The `ledger` object is imported from the WebAssembly (wasm) module and provides various methods for cryptographic operations.
 *
 * @remarks
 * The function makes use of the zero-knowledge proof functionality to generate the nullifier hash. It performs the following steps:
 * 1. Retrieves the ledger instance using the `getLedger` function.
 * 2. Fetches the abar owner memo data for the given `atxoSid` using the `Network.getAbarOwnerMemo` function.
 * 3. Decodes the abar owner memo data into an `AxfrOwnerMemo` object using the `AxfrOwnerMemo.from_json` method of the `ledger`.
 * 4. Creates a key pair from the `axfrSpendKey` using the `ledger.create_keypair_from_secret` method.
 * 5. Fetches the mTLeafInfo data for the given `atxoSid` using the `Network.getMTLeafInfo` function.
 * 6. Decodes the mTLeafInfo data into an `MTLeafInfo` object using the `MTLeafInfo.from_json` method of the `ledger`.
 * 7. Decodes the `ownedAbar` object into an `Abar` object using the `ledger.abar_from_json` method.
 * 8. Generates the nullifier hash using the `ledger.gen_nullifier_hash` method with the provided parameters.
 * 9. Returns the generated nullifier hash.
 *
 * @remarks
 * This function is used in several scenarios, including but not limited to:
 * - Validating whether a commitment (and its related abar) is spent or not spent.
 *
 * @example
 * ```typescript
 * const atxoSid = "1234";
 * const ownedAbar = // OwnedAbar object
 * const axfrSpendKey = // Spend key
 *
 * try {
 *   const nullifierHash = await genNullifierHash(atxoSid, ownedAbar, axfrSpendKey);
 *   console.log("Nullifier Hash:", nullifierHash);
 * } catch (error) {
 *   console.error("Error generating nullifier hash:", error);
 * }
 * ```
 *
 * @throws Throws an error if any step in the nullifier hash generation process fails.
 *
 * @returns The function returns a promise that resolves to the generated nullifier hash.
 */
export declare const genNullifierHash: (atxoSid: string, ownedAbar: FindoraWallet.OwnedAbar, axfrSpendKey: string) => Promise<string>;
/**
 * The `getOwnedAbars` function retrieves the owned abars associated with a given commitment.
 *
 * @param givenCommitment - The commitment for which to retrieve the owned abars.
 *
 * @returns A promise that resolves to an array of owned abar items.
 *
 * @throws An error if there was an issue retrieving the owned abars or if the response is missing or invalid.
 *
 * @remarks
 * The `getOwnedAbars` function uses the `Network.getOwnedAbars` function to fetch the owned abars associated with the provided commitment. It handles error scenarios by throwing informative error messages.
 *
 * Example usage:
 * ```typescript
 * const commitment = 'exampleCommitment'; // Commitment value
 *
 * try {
 *   const ownedAbars = await getOwnedAbars(commitment);
 *   console.log(ownedAbars);
 *   // [
 *   //   {
 *   //     commitment: 'exampleCommitment',
 *   //     abarData: {
 *   //       atxoSid: 'atxoSidValue',
 *   //       ownedAbar: // ownedAbar object
 *   //     },
 *   //   },
 *   // ]
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export declare const getOwnedAbars: (givenCommitment: string) => Promise<FindoraWallet.OwnedAbarItem[]>;
/**
 * The `getSpentAbars` function retrieves a list of spent abars (Anonymous Banknote Asset Records) associated with the given commitments and anonymous keys.
 *
 * @param anonKeys - The sender's anonymous keys.
 * @param givenCommitmentsList - The list of commitments associated with the sender's owned abars.
 *
 * @returns A promise that resolves to an array of spent abars.
 *
 * @throws An error if there was an issue retrieving the owned abars or checking the nullifier hash spent status, or if the response is missing or invalid.
 *
 * @remarks
 * The `getSpentAbars` function retrieves the owned abars for each given commitment using the `getOwnedAbars` function. It then checks the nullifier hash spent status for each abar by generating the nullifier hash and using the `isNullifierHashSpent` function. The function handles error scenarios and returns an array of spent abars.
 *
 * Example usage:
 * ```typescript
 * const anonKeys =  // anonymous keys object - Sender's anonymous keys
 * const commitments = ['commitment1', 'commitment2']; // List of commitments
 *
 * try {
 *   const spentAbars = await getSpentAbars(anonKeys, commitments);
 *   console.log(spentAbars);
 *   // [
 *   //   {
 *   //     // spent abar item
 *   //   },
 *   //   {
 *   //     // spent abar item
 *   //   },
 *   // ]
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export declare const getSpentAbars: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<FindoraWallet.OwnedAbarItem[]>;
/**
 * The `getBalanceMaps` function retrieves the balance maps for the provided unspent abars using the given anonymous keys.
 *
 * @param unspentAbars - The array of unspent abars to retrieve the balance maps for.
 * @param anonKeys - The anonymous keys associated with the wallet.
 *
 * @returns An object containing the asset details map, balances map, used assets, and ATXO map.
 *
 * @remarks
 * The `getBalanceMaps` function iterates over each unspent abar in the provided array, opens (decrypts) the abar using the `openAbar` function, and constructs the balance maps. It also retrieves the asset details using the `Asset.getAssetDetails` function and stores them in the asset details map. The `plus` function is used to perform arithmetic operations on the balance amounts, provided by the big number helper.
 *
 * Example usage:
 * ```typescript
 * const unspentAbars: FindoraWallet.OwnedAbarItem[] = [...]; // Array of unspent abars
 * const anonKeys: Keypair.WalletKeypar = ...; // Anonymous keys associated with the wallet
 *
 * const balanceMaps = await getBalanceMaps(unspentAbars, anonKeys);
 *
 * console.log(balanceMaps.assetDetailsMap); // Asset details map containing asset types as keys and asset details as values
 * console.log(balanceMaps.balancesMap); // Balances map containing asset types as keys and balance amounts as values
 * console.log(balanceMaps.usedAssets); // Array of used asset types
 * console.log(balanceMaps.atxoMap); // ATXO map containing asset types as keys and an array of ATXO items as values
 * ```
 */
export declare const getBalanceMaps: (unspentAbars: FindoraWallet.OwnedAbarItem[], anonKeys: Keypair.WalletKeypar) => Promise<{
    assetDetailsMap: {
        [key: string]: FindoraWallet.IAsset;
    };
    balancesMap: {
        [key: string]: string;
    };
    usedAssets: string[];
    atxoMap: {
        [key: string]: AtxoMapItem[];
    };
}>;
/**
 * The `getAbarBalance` function is an asynchronous function that retrieves the balance information for a wallet's owned abars.
 *
 * @param unspentAbars - An array of `OwnedAbarItem` objects representing the unspent abars for the wallet.
 * @param anonKeys - An object of type `WalletKeypar` containing the wallet's public key and private key.
 *
 * @remarks
 * The function internally uses the `getBalanceMaps` helper function to create an object with a list of details related to the balance information.
 * It also utilizes the `fromWei` helper function to convert the balance from a big integer to a human-readable format.
 *
 * @remarks
 * The unspent abars are created using zero-proof functionality and are fetched by providing the commitment hash.
 *
 * @example
 * ```typescript
 * const unspentAbars = [...]; // Array of OwnedAbarItem objects
 * const anonKeys = {
 *   publickey: "...",
 *   privateStr: "...",
 * };
 *
 * try {
 *   const balanceInfo = await getAbarBalance(unspentAbars, anonKeys);
 *
 *   console.log("Public Key:", balanceInfo.publickey);
 *   console.log("Balances:");
 *   for (const balance of balanceInfo.balances) {
 *     console.log("Asset Type:", balance.assetType);
 *     console.log("Amount:", balance.amount);
 *   }
 * } catch (error) {
 *   console.error("Error retrieving abar balance:", error);
 * }
 * ```
 *
 * @returns A promise that resolves to an object of type `AnonWalletBalanceInfo` containing the wallet's public key and an array of `BalanceInfo` objects representing the balances for each asset type.
 */
export declare const getAbarBalance: (unspentAbars: FindoraWallet.OwnedAbarItem[], anonKeys: Keypair.WalletKeypar) => Promise<AnonWalletBalanceInfo>;
/**
 * The `getUnspentAbars` function retrieves the unspent abars for a given list of commitments using the provided anonymous keys.
 *
 * @param anonKeys - The anonymous keys associated with the wallet.
 * @param givenCommitmentsList - The list of commitments to retrieve unspent abars for.
 *
 * @returns An array of unspent abars.
 *
 * @remarks
 * The `getUnspentAbars` function uses the `getOwnedAbars` function to retrieve the owned abars for each given commitment. It then checks the spending status of each abar and adds the unspent abars to the result array.
 *
 * Example usage:
 * ```typescript
 * const anonKeys: Keypair.WalletKeypar = ...; // Anonymous keys associated with the wallet
 * const givenCommitmentsList: string[] = [...]; // List of commitments
 *
 * const unspentAbars = await getUnspentAbars(anonKeys, givenCommitmentsList);
 *
 * console.log(unspentAbars); // Array of unspent abars
 * ```
 */
export declare const getUnspentAbars: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<FindoraWallet.OwnedAbarItem[]>;
/**
 * The `getBalance` function retrieves the balances of abars for the given commitments using the provided anonymous keys.
 *
 * @param anonKeys - The anonymous keys associated with the wallet.
 * @param givenCommitmentsList - The list of commitments to retrieve the balances for.
 *
 * @returns The balances of abars for the given commitments.
 *
 * @remarks
 * The `getBalance` function calls the `getUnspentAbars` function to retrieve the unspent abars and then calculates the balances using the `getAbarBalance` function.
 *
 * Example usage:
 * ```typescript
 * const anonKeys: Keypair.WalletKeypar = ...; // Anonymous keys associated with the wallet
 * const givenCommitmentsList: string[] = [...]; // List of commitments
 *
 * const balances = await getBalance(anonKeys, givenCommitmentsList);
 *
 * console.log(balances); // Balances of abars for the given commitments
 * ```
 */
export declare const getBalance: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<AnonWalletBalanceInfo>;
/**
 * The `getSpentBalance` function retrieves the balances of spent abars for the given commitments using the provided anonymous keys.
 *
 * @param anonKeys - The anonymous keys associated with the wallet.
 * @param givenCommitmentsList - The list of commitments to retrieve the balances for.
 *
 * @returns The balances of spent abars for the given commitments.
 *
 * @remarks
 * The `getSpentBalance` function calls the `getSpentAbars` function to retrieve the spent abars and then calculates the balances using the `getAbarBalance` function.
 *
 * Example usage:
 * ```typescript
 * const anonKeys: Keypair.WalletKeypar = ...; // Anonymous keys associated with the wallet
 * const givenCommitmentsList: string[] = [...]; // List of commitments
 *
 * const balances = await getSpentBalance(anonKeys, givenCommitmentsList);
 *
 * console.log(balances); // Balances of spent abars for the given commitments
 * ```
 */
export declare const getSpentBalance: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<AnonWalletBalanceInfo>;
/**
 * The `getAllAbarBalances` function retrieves both spent and unspent balances of abars for the given commitments using the provided anonymous keys.
 *
 * @param anonKeys - The anonymous keys associated with the wallet.
 * @param givenCommitmentsList - The list of commitments to retrieve the balances for.
 *
 * @returns An object containing the spent balances, unspent balances, and the given commitments list.
 *
 * @remarks
 * The `getAllAbarBalances` function calls the `getSpentBalance` and `getBalance` functions to retrieve the spent and unspent balances respectively.
 *
 * Example usage:
 * ```typescript
 * const anonKeys: Keypair.WalletKeypar = ...; // Anonymous keys associated with the wallet
 * const givenCommitmentsList: string[] = [...]; // List of commitments
 *
 * const allBalances = await getAllAbarBalances(anonKeys, givenCommitmentsList);
 *
 * console.log(allBalances.spentBalances); // Balances of spent abars for the given commitments
 * console.log(allBalances.unSpentBalances); // Balances of unspent abars for the given commitments
 * console.log(allBalances.givenCommitmentsList); // The given commitments list
 * ```
 */
export declare const getAllAbarBalances: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<{
    spentBalances: AnonWalletBalanceInfo;
    unSpentBalances: AnonWalletBalanceInfo;
    givenCommitmentsList: string[];
}>;
/**
 * Transfer the exact amount of funds from a 'transparent' to 'anonymous' wallet
 *
 * @remarks
 * This function is used to transfer the exact amount of provided asset code from the sender to the receiver.
 * It is calling `sendToAddress` function to obtain an utxo with the exact amount, and then it is calling `barToAbar`
 * with a fetched utxo sid number
  *
 * @example
 *
 * ```ts
  // returns a tx builder to be submitted to the nextwork
  const { transactionBuilder } = await barToAbarAmount(senderWalletInfo, amount, fraAssetCode, receiverPublickey);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```
 * @returns a promise with an object that contains the TransactionBuilder, which should be used in `Transaction.submitTransaction`
 */
export declare const barToAbarAmount: (walletInfo: Keypair.WalletKeypar, amount: string, assetCode: string, receiverAxfrPublicKey: string) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
/**
 * Transfer funds from a 'transparent' to 'anonymous' wallet
 *
 * @remarks
 * Using a given array of utxo sids, this function fetches the associated utxo objects and confidentially transfers those
 * utxos (bars) to a given receiverPublicKey. After the transaction is submitted, the receiver will receive a list of one (or multiple)
 * atxos (aka abars).
 * Please note, this function is only meant to transfer the particularly provided utxos, and it is not used for transferring a custom
 * amount. To transfer the custom amount, please use `barToAbarAmount`
 *
 * @example
 *
 * ```ts
  // returns a tx builder to be submitted to the nextwork
  const { transactionBuilder } = await TripleMasking.barToAbar(senderWalletInfo, arrayOfUtxoSids, receiverPublickey);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
 * ```

    @throws `Could not fetch utxo for sids `
    @throws `Could not fetch memo data for sid `
    @throws `Could not get decode memo data or get assetRecord`
    @throws `Could not add bar to abar operation`
    @throws `Could not get fee inputs for bar to abar operation`
    @throws `Could not add fee for bar to abar operation`
    @throws `could not get a list of commitments strings `
    @throws `list of commitments strings is empty`
    @throws `could not build and sign txn`

 * @returns a promise with an object that contains the TransactionBuilder, which should be used in `Transaction.submitTransaction`
 */
export declare const barToAbar: (walletInfo: Keypair.WalletKeypar, sids: number[], receiverPublicKey: string) => Promise<FindoraWallet.BarToAbarResult<TransactionBuilder>>;
/**
 * The `prepareAnonTransferOperationBuilder` function prepares an anonymous transfer operation builder.
 * The transfer operation can be used to build an anonymous transfer operation for transferring assets from one wallet to another.
 *
 * @param walletInfo - The wallet keypair of the sender.
 * @param receiverXfrPublicKey - The anonymous public key of the receiver.
 * @param abarAmountToTransfer - The amount of the asset being transferred.
 * @param additionalOwnedAbarItems - (Optional) Additional owned Abar items to include in the transfer.
 * @throws {Error} If an error occurs during the preparation of the transfer operation builder.
 * @returns {Promise<FindoraWallet.AnonTransferOperationBuilder>} The prepared anonymous transfer operation builder.
 *
 * @remarks
 * The `prepareAnonTransferOperationBuilder` function prepares an anonymous transfer operation builder by following these steps:
 * 1. Retrieve the anonymous transfer operation builder using the `getAnonTransferOperationBuilder` method.
 * 2. Convert the sender's aXfrSecretKey to the appropriate format using the `getAnonKeypairFromJson` method.
 * 3. Convert the receiver's Xfr public key from base64 to the appropriate format using the `getXfrPublicKeyByBase64` method.
 * 4. Extract the ownedAbarToUseAsSource and additionalOwnedAbars from the `additionalOwnedAbarItems` array.
 * 5. Retrieve the abarPayloadOne by calling the `getAbarTransferInputPayload` method with the ownedAbarToUseAsSource and walletInfo.
 * 6. Add the first input to the anonymous transfer operation builder using the `add_input` method, passing the necessary parameters from abarPayloadOne.
 * 7. Convert the abarAmountToTransfer to the appropriate format using the `toWei` method and assign it to the toAmount variable.
 * 8. Initialize an empty array named addedInputs.
 * 9. Iterate over the additionalOwnedAbars array and add inputs to the anonymous transfer operation builder for each ownedAbarItemOne.
 *    - If the length of addedInputs becomes equal to or exceeds 4, throw an error indicating that the amount being sent is too large to send at once.
 *    - Retrieve the abarPayloadNext by calling the `getAbarTransferInputPayload` method with ownedAbarItemOne and walletInfo.
 *    - Add the additional input to the anonymous transfer operation builder using the `add_input` method, passing the necessary parameters from abarPayloadNext.
 *    - Push ownedAbarItemOne to the addedInputs array.
 * 10. Retrieve the ledger using the `getLedger` method.
 * 11. Retrieve the amountAssetType by calling the `open_abar` method on the ledger instance, passing the necessary parameters from abarPayloadOne.
 * 12. Add the output to the anonymous transfer operation builder using the `add_output` method, passing the toAmount, amountAssetType.asset_type, and receiverXfrPublicKeyConverted.
 * 13. Add the sender's aXfrSpendKeySender to the anonymous transfer operation builder using the `add_keypair` method.
 * 14. Return the prepared anonymous transfer operation builder.
 *
 * @example
 *
 * ```ts
 * import { Keypair, FindoraWallet } from 'your-library';
 *
 * const walletInfo: Keypair.WalletKeypar = {
 *   aXfrSecretKeyConverted: 'abcdefg1234567890',
 *   // other wallet info
 * };
 *
 * const receiverXfrPublicKey = 'hijklmn0987654321';
 * const abarAmountToTransfer = '10';
 *
 * // Additional owned Abar items
 * const additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[] = [
 *   {
 *     // additional owned Abar item details
 *   },
 *   {
 *     // additional owned Abar item details
 *   },
 * ];
 *
 * try {
 *   const anonTransferOperationBuilder = await prepareAnonTransferOperationBuilder(
 *     walletInfo,
 *     receiverXfrPublicKey,
 *     abarAmountToTransfer,
 *     additionalOwnedAbarItems,
 *   );
 *
 *   // Continue building the anonymous transfer operation using the anonTransferOperationBuilder
 *
 * } catch (error) {
 *   console.error('An error occurred while preparing the anonymous transfer operation builder:', error);
 * }
 *
 * ```
 */
export declare const prepareAnonTransferOperationBuilder: (walletInfo: Keypair.WalletKeypar, receiverXfrPublicKey: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<AnonTransferOperationBuilder>;
/**
 * The `getAbarTransferFee` function calculates the transfer fee for an abar transfer operation from one account to another.
 *
 * @param anonKeysSender - The anonymous keys of the sender account.
 * @param anonPubKeyReceiver - The anonymous public key of the receiver account.
 * @param abarAmountToTransfer - The amount to be transferred.
 * @param additionalOwnedAbarItems - Owned abar items to consider for the fee calculation.
 *
 * @returns The calculated transfer fee for the abar transfer operation.
 *
 * @remarks
 * The `getAbarTransferFee` function uses the `prepareAnonTransferOperationBuilder` helper function to prepare an anonymous transfer operation builder, which allows the calculation of the expected fee.
 *
 * The `fromWei` helper function is used to convert the calculated fee from a big integer format to a human-readable format with 6 decimal places.
 *
 * Example usage:
 * ```typescript
 * const anonKeysSender: Keypair.WalletKeypar = ...; // Sender's anonymous keys
 * const anonPubKeyReceiver: string = ...; // Receiver's anonymous public key
 * const abarAmountToTransfer: string = "10"; // Amount of abars to transfer
 * const additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[] = [...]; // Additional owned abar items
 *
 * const calculatedFee = await getAbarTransferFee(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems);
 *
 * console.log(calculatedFee); // Calculated transfer fee
 * ```
 */
export declare const getAbarTransferFee: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<string>;
/**
 * The `getSendAtxo` function retrieves a list of send ATXOs (Anonymous Transaction Outputs) for a given asset and amount.
 *
 * @param code - The asset code for the ATXOs.
 * @param amount - The amount to transfer.
 * @param commitments - The list of commitments associated with the sender's owned abars.
 * @param anonKeys - The sender's anonymous keys.
 *
 * @returns A promise that resolves to an array of send ATXOs.
 *
 * @throws An error if there was an issue retrieving the unspent abars or balance maps, or if the response is missing or invalid.
 *
 * @remarks
 * The `getSendAtxo` function uses the `getUnspentAbars` and `getBalanceMaps` functions to fetch the unspent abars and balance maps associated with the provided commitments and anonymous keys.
 * It then filters the balance maps for the specified asset code and calculates the required send ATXOs to transfer the specified amount.
 * The function handles error scenarios and returns an empty array if the sum of the selected ATXOs is less than the specified amount.
 *
 * Example usage:
 * ```typescript
 * const assetCode = 'ABC'; // Asset code
 * const amount = BigInt(100); // Amount to transfer
 * const commitments = ['commitment1', 'commitment2']; // List of commitments
 * const anonKeys = // anonymous keys object -  Sender's anonymous keys
 *
 * try {
 *   const sendAtxos = await getSendAtxo(assetCode, amount, commitments, anonKeys);
 *   console.log(sendAtxos);
 *   // [
 *   //   {
 *   //     amount: BigInt(50),
 *   //     sid: 'atxoSid1',
 *   //     commitment: 'commitment1',
 *   //   },
 *   //   {
 *   //     amount: BigInt(60),
 *   //     sid: 'atxoSid2',
 *   //     commitment: 'commitment2',
 *   //   },
 *   // ]
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export declare const getSendAtxo: (code: string, amount: BigInt, commitments: string[], anonKeys: Keypair.WalletKeypar) => Promise<{
    amount: BigInt;
    sid: string;
    commitment: string;
}[]>;
/**
 * The `getTotalAbarTransferFee` function calculates the total fee for transferring abars from the sender to the receiver.
 *
 * @param anonKeysSender - The sender's anonymous keys.
 * @param anonPubKeyReceiver - The receiver's anonymous public key.
 * @param abarAmountToTransfer - The amount to transfer.
 * @param additionalOwnedAbarItems - Owned abar items to include in the transfer operation.
 *
 * @returns A promise that resolves to the calculated fee for the abar transfer operation.
 *
 * @throws An error if there was an issue preparing the anonymous transfer operation builder or calculating the fee.
 *
 * @remarks
 * The `getTotalAbarTransferFee` function prepares an anonymous transfer operation builder using the sender's anonymous keys,
 * receiver's anonymous public key, abar amount to transfer, and additional owned abar items.
 * It then retrieves the expected fee estimate from the transfer operation builder and converts it to a human-readable format.
 * The function handles error scenarios and returns the calculated fee for the abar transfer operation.
 *
 * Example usage:
 * ```typescript
 * const anonKeysSender =  // sender's anonymous keys object
 * const anonPubKeyReceiver = 'receiverPublicKey';
 * const abarAmountToTransfer = '100';
 * const additionalOwnedAbarItems = [
 *   {
 *     // additional owned abar item
 *   },
 *   {
 *     // additional owned abar item
 *   },
 * ];
 *
 * try {
 *   const fee = await getTotalAbarTransferFee(anonKeysSender, anonPubKeyReceiver, abarAmountToTransfer, additionalOwnedAbarItems);
 *   console.log(fee); // '0.012345'
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export declare const getTotalAbarTransferFee: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<string>;
/**
 * The `getAbarToAbarAmountPayload` function is an asynchronous function that calculates the payload required for a transfer of abars from one account to another.
 *
 * @param anonKeysSender - The anonymous keys of the sender account.
 * @param anonPubKeyReceiver - The anonymous public key of the receiver account.
 * @param amount - The amount of the asset to be transferred.
 * @param assetCode - The code of the asset for the abars being transferred.
 * @param givenCommitmentsList - The list of given commitments to consider for the transfer.
 *
 * @remarks
 * The `getAbarToAbarAmountPayload` function calculates the payload required for transferring abars from one account to another.
 *
 * This function relies on various helper functions and modules, such as `Asset`, `getUnspentAbars`, `getBalanceMaps`, `getSendAtxo`, `getAbarTransferFee`,
 * `getTotalAbarTransferFee`, `getOwnedAbars`, and `createBigNumber`, to retrieve asset details, unspent abars, balance maps,
 * calculate transfer fees, and perform other necessary operations.
 *
 * The function attempts to determine whether the given list of abars is enough to cover the transfer fee. If additional fee is required,
 * it recursively checks if more fee is needed until the required amount is met or an error occurs. The conditions for triggering an error include exceeding the allowed inputs and outputs limit, calculating the missing amount of the fee, or determining that the input payload contains enough abars to cover the fee.
 *
 * Note that the required dependencies, such as `Asset`, `getUnspentAbars`, `getBalanceMaps`, `getSendAtxo`, `getAbarTransferFee`, `getTotalAbarTransferFee`,
 * `getOwnedAbars`, and `createBigNumber`, should be imported and accessible within the module where this function is used.
 *
 * The returned value is an object with the following properties:
 * - `commitmentsToSend`: An array of commitments that will be used to perform the transfer.
 * - `commitmentsForFee`: An array of commitments to be used to pay the transfer fee.
 * - `additionalAmountForFee`: The total estimated fee amount.
 *
 * @example
 * ```typescript
 * const anonKeysSender = {
 *   publickey: "senderPublicKey",
 *   privateStr: "senderPrivateKey",
 * };
 * const anonPubKeyReceiver = "receiverPublicKey";
 * const amount = "100";
 * const assetCode = "ABC";
 * const givenCommitmentsList = ["commitment1", "commitment2", "commitment3"];
 *
 * try {
 *   const payload = await getAbarToAbarAmountPayload(
 *     anonKeysSender,
 *     anonPubKeyReceiver,
 *     amount,
 *     assetCode,
 *     givenCommitmentsList
 *   );
 *
 *   console.log("Abar Transfer Payload:");
 *   console.log(payload);
 * } catch (error) {
 *   console.error("Error calculating abar transfer payload:", error);
 * }
 * ```
 *
 * @returns A promise that resolves to an object containing the payload details for the abar transfer, including the commitments to send, commitments for fee, and additional amount for fee.
 *
 * @throws Throws an error under the following conditions:
 * - If there are no abars available for the specified asset and sender account.
 * - If there are no FRA abars available to cover the transfer fee for the sender account.
 * - If the sender account does not have enough abars to perform the requested transfer.
 * - If there is a failure in calculating the transfer fee, such as an invalid amount or other errors.
 * - If the amount being sent is too large to be sent at once.
 * - If there is an error in decoding the abar memo data.
 * - If there is an error in converting the given AnonKeyPair from JSON.
 */
export declare const getAbarToAbarAmountPayload: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    commitmentsToSend: string[];
    commitmentsForFee: string[];
    additionalAmountForFee: string;
}>;
/**
 * Transfer funds from an 'anonymous' to another 'anonymous' wallet
 *
 * @remarks
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note, that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remained abars could be either FRA asset, or other custom assets.
 *
 * @example
 *
 * ```ts
 * const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbar(
 *    anonKeysSender,
 *    anonKeysReceiver.publickey,
 *    '2',
 *    additionalOwnedAbarItems,
 *  );

  // tx hash
 *  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);
 * ```
 *
 * @remarks

 Please also keep in mind, that this function returns an object `abarToBarData` which contains information about the new commitments,
 both for the sender (i.e. with the remainders from the transfer) and for the receiver (with a destination abar commitment value).

 Those commitments could be retrieved in this way.

* ```ts
*  const { commitmentsMap } = abarToAbarData;
*
*  const retrievedCommitmentsListReceiver = [];
*  const retrievedCommitmentsListSender= [];
*
*  for (const commitmentsMapEntry of commitmentsMap) {
*    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
*
*    if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
*      givenCommitmentsListSender.push(commitmentKey);
*    }
*
*    if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
*      retrievedCommitmentsListReceiver.push(commitmentKey);
*    }
*  }
* ```
*
* @throws 'The amount you are trying to send might be too big to be sent at once. Please try sending a smaller amount'
* @throws 'Could not process abar transfer. More fees are needed. Required amount at least "${calculatedFee} FRA"'
* @throws 'Could not build and sign abar transfer operation'
* @throws 'Could not get a list of commitments strings '
*
* @returns a promise with an object, containing the AnonTransferOperationBuilder, which should be used in `Transaction.submitAbarTransaction`
*/
export declare const abarToAbar: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, abarAmountToTransfer: string, additionalOwnedAbarItems?: FindoraWallet.OwnedAbarItem[]) => Promise<FindoraWallet.AbarToAbarResult<AnonTransferOperationBuilder>>;
/**
 * Transfer funds of the specific asset from an 'anonymous' to another 'anonymous' wallet
 *
 * @remarks
 * Using a given asset code and the amount, this function executes a confidential transfer. Abars for the transfer are
 * being retrieved using provided commitments array. The retrieved abars array must have enough FRA abars to cover the
 * transfer fee.
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 *
 * @example
 *
 * ```ts
 * const { anonTransferOperationBuilder, abarToAbarData } = await TripleMasking.abarToAbarAmount(
 *   anonKeysSender,
 *   anonKeysReceiver.publickey,
 *   amountToSend,
 *   assetCodeToUse,
 *   givenCommitmentsListSender,
 * );

 * // tx hash
 *  const resultHandle = await Transaction.submitAbarTransaction(anonTransferOperationBuilder);
 * ```
 *
 * @remarks

 Please also keep in mind that this function returns an object `abarToBarData` which contains information about the new commitments,
 both for the sender (i.e. with the remainders from the transfer) and for the receiver (with a destination abar commitment value).

 Those commitments could be retrieved in this way.

* ```ts
*  const { commitmentsMap } = abarToAbarData;
*
*  const retrievedCommitmentsListReceiver = [];
*  const retrievedCommitmentsListSender= [];
*
*  for (const commitmentsMapEntry of commitmentsMap) {
*    const { commitmentKey, commitmentAxfrPublicKey } = commitmentsMapEntry;
*
*    if (commitmentAxfrPublicKey === anonKeysSender.publickey) {
*      givenCommitmentsListSender.push(commitmentKey);
*    }
*
*    if (commitmentAxfrPublicKey === anonKeysReceiver.publickey) {
*      retrievedCommitmentsListReceiver.push(commitmentKey);
*    }
*  }
* ```
*
* @returns a promise with an object, containing the AnonTransferOperationBuilder, which should be used in `Transaction.submitAbarTransaction`
*/
export declare const abarToAbarAmount: (anonKeysSender: Keypair.WalletKeypar, anonPubKeyReceiver: string, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<FindoraWallet.AbarToAbarResult<AnonTransferOperationBuilder>>;
/**
 * Transfer funds from an 'anonymous' to a 'transparent' wallet
 *
 * @remarks
 * Using a given array of provided abars, (which are owned by the sender and are non-spent), sender can transfer
 * those abars to the receiverPublickey.
 * Please note that the provided abars must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 * Also, by specifying `hideAmount` and `hideAssetType` parameters, user can have either (or both) of them hidden.
 *
 * @example
 *
 * ```ts
  const { transactionBuilder } = await TripleMasking.abarToBar(anonKeysSender, receiverPublickey, abarsList);

  // tx hash
  const resultHandle = await Transaction.submitTransaction(transactionBuilder);
  
 * ```
* @throws `Could not add abar to bar operation", Error - ${error as Error}`
* @throws `Could not add an additional input for abar to bar transfer operation`
* @throws `Could not build txn`
*
* @returns a promise with an object, containing the TransactionBuilder, which should be used in `Transaction.submitTransaction`
*/
export declare const abarToBar: (anonKeysSender: Keypair.WalletKeypar, receiverXfrPublicKey: string, additionalOwnedAbarItems: FindoraWallet.OwnedAbarItem[], hideAmount?: boolean, hideAssetType?: boolean) => Promise<FindoraWallet.AbarToBarResult<TransactionBuilder>>;
/**
 * The `getAbarToBarAmountPayload` function retrieves the payload required for transferring abars to bars from one account to another. It simplifies the process by using the `getAbarToAbarAmountPayload` function internally.
 *
 * @param anonKeysSender - The anonymous keys of the sender account.
 * @param amount - The amount of the asset to be transferred.
 * @param assetCode - The code of the asset for the abars being transferred.
 * @param givenCommitmentsList - The list of given commitments to consider for the transfer.
 *
 * @returns An object containing the payload for the abar transfer, including the commitments to send the abars, the commitments to cover the transfer fee, and the additional amount required for the fee.
 *
 * @remarks
 * The `getAbarToBarAmountPayload` function internally uses the `getAbarToAbarAmountPayload` function to calculate the payload required for transferring abars.
 * It simplifies the process by providing a more streamlined interface and returning a subset of the payload.
 *
 * The `commitmentsToSend` field in the return value is an array of commitments that will be used to perform the abar transfer.
 *
 * The `commitmentsForFee` field in the return value is an array of commitments that will be used to pay the transfer fee.
 *
 * The `additionalAmountForFee` field in the return value is the additional amount required for the transfer fee, if applicable.
 * If this field is present and greater than zero, it indicates that additional abars need to be included to cover the fee.
 *
 * Example usage:
 * ```typescript
 * const anonKeysSender: Keypair.WalletKeypar = ...; // Sender's anonymous keys
 * const amount: string = "10"; // Amount of abars to transfer
 * const assetCode: string = "FOO"; // Asset code for the abars
 * const givenCommitmentsList: string[] = [...]; // List of given commitments
 *
 * const payload = await getAbarToBarAmountPayload(anonKeysSender, amount, assetCode, givenCommitmentsList);
 *
 * console.log(payload.commitmentsToSend); // Array of commitments for abar transfer
 * console.log(payload.commitmentsForFee); // Array of commitments for transfer fee
 * console.log(payload.additionalAmountForFee); // Additional amount required for the fee
 * ```
 */
export declare const getAbarToBarAmountPayload: (anonKeysSender: Keypair.WalletKeypar, amount: string, assetCode: string, givenCommitmentsList: string[]) => Promise<{
    commitmentsToSend: string[];
    commitmentsForFee: string[];
    additionalAmountForFee: string;
}>;
/**
 * Transfer the exact amount of the provided asset from an 'anonymous' to a 'transparent' wallet
 *
 * @remarks
 * Using a given array of provided commitments, (and associated abars that are owned by the sender and are non-spent), sender can transfer the
 * exact amount of the asset associated with the provided abars, to the receiver publickey.
 * Please note that the provided commitments must contain at least one abar with FRA asset, as that would be used to pay the fee,
 * and remaining abars could be either FRA asset, or other custom assets.
 * Its return value also contains a list of commitments spent during this operation, and a list of commitments with the transfer remainders (if any).
 * Also, by specifying `hideAmount` and `hideAssetType` parameters, user can have either (or both) of them hidden.
 *
 * @example
 * ```ts
 * const { transactionBuilder, remainderCommitements, spentCommitments } = await TripleMasking.abarToBarAmount(
 *   anonKeysSender,
 *   toWalletInfo.publickey,
 *   amountToSend,
 *   assetCodeToUse,
 *   givenCommitmentsListSender,
 * );
 *
 * // tx hash
 * const resultHandle = await Transaction.submitTransaction(transactionBuilder);
  
 * ```
* @returns a promise with an object, containing the TransactionBuilder, which should be used in `Transaction.submitTransaction`
*/
export declare const abarToBarAmount: (anonKeysSender: Keypair.WalletKeypar, receiverXfrPublicKey: string, amount: string, assetCode: string, givenCommitmentsList: string[], hideAmount?: boolean, hideAssetType?: boolean) => Promise<Required<FindoraWallet.AbarToBarResult<TransactionBuilder>>>;
/**
 * The `getNullifierHashesFromCommitments` function retrieves the nullifier hashes corresponding to the provided commitments.
 *
 * @param anonKeys - The anonymous keys associated with the commitments.
 * @param givenCommitmentsList - The list of commitments for which to retrieve the nullifier hashes.
 *
 * @returns A promise that resolves to an array of nullifier hashes.
 *
 * @throws An error if there was an issue retrieving the owned abars or generating the nullifier hash.
 *
 * @remarks
 * The `getNullifierHashesFromCommitments` function iterates over the given commitments and retrieves the owned abars associated with each commitment using the `getOwnedAbars` function. It then generates the nullifier hash for each owned abar using the `genNullifierHash` function. The function handles error scenarios by throwing informative error messages.
 *
 * Example usage:
 * ```typescript
 * const anonKeys = {
 *   publickey: 'ABC123', // Public key
 *   privateStr: 'xyzABC...', // Private key string
 * };
 * const commitments = ['commitment1', 'commitment2', 'commitment3']; // List of commitments
 *
 * try {
 *   const nullifierHashes = await getNullifierHashesFromCommitments(anonKeys, commitments);
 *   console.log(nullifierHashes); // ['hash1', 'hash2', 'hash3']
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export declare const getNullifierHashesFromCommitments: (anonKeys: Keypair.WalletKeypar, givenCommitmentsList: string[]) => Promise<string[]>;
/**
 * The `decryptAbarMemo` function is an asynchronous function that decrypts an abar memo item using the provided AnonKeyPair.
 *
 * @param abarMemoItem - An array containing the atxoSid and the abar memo data to be decrypted.
 * @param anonKeys - An object of type `WalletKeypar` containing the AnonKeyPair used for decryption.
 *
 * @remarks
 * This function internally uses the `getAnonKeypairFromJson` function to convert the AnonKeyPair from JSON format to the required format for decryption.
 * It also depends on the external `ledger` module, which should be imported from the wasm module and available in the module where this function is used.
 *
 * @remarks
 * In order to access the details of the decrypted abar item (e.g., amount, currency), the abar memo item needs to be decrypted.
 *
 * @example
 * ```typescript
 * const abarMemoItem = [
 *   "atxoSid123456",
 *   encryptedAbarMemoData // actual encrypted abar memo data in JSON format.
 * ];
 * const anonKeys = {
 *   publickey: "base64publickey",
 *   privateStr: "base64privatekey",
 * };
 *
 * try {
 *   const decryptedAbarData = await decryptAbarMemo(abarMemoItem, anonKeys);
 *
 *   if (decryptedAbarData) {
 *     console.log("Decrypted Abar Data:");
 *     console.log("atxoSid:", decryptedAbarData.atxoSid);
 *     console.log("Decrypted Abar:", decryptedAbarData.decryptedAbar);
 *     console.log("Owner:", decryptedAbarData.owner);
 *   } else {
 *     console.log("Failed to decrypt Abar Memo.");
 *   }
 * } catch (error) {
 *   console.error("Error decrypting Abar Memo:", error);
 * }
 * ```
 *
 * @returns A promise that resolves to an object of type `DecryptedAbarMemoData` containing the decrypted abar memo data, or `false` if decryption fails.
 */
export declare const decryptAbarMemo: (abarMemoItem: FindoraWallet.AbarMemoItem, anonKeys: Keypair.WalletKeypar) => Promise<FindoraWallet.DecryptedAbarMemoData | false>;
/**
 * The `getCommitmentByAtxoSid` function retrieves the commitment corresponding to the provided ATXO SID.
 *
 * @param atxoSid - The ATXO SID for which to retrieve the commitment.
 *
 * @returns A promise that resolves to an object containing the ATXO SID and the corresponding commitment.
 *
 * @throws An error if there was an issue retrieving the commitment or if no response was received.
 *
 * @remarks
 * The `getCommitmentByAtxoSid` function interacts with the network to fetch the commitment associated with the provided ATXO SID.
 * It utilizes the `getLedger` function to access the ledger and the `Network.getAbarCommitment` function to retrieve the commitment. The function handles error scenarios by throwing informative error messages.
 *
 * Example usage:
 * ```typescript
 * const atxoSid = 'ABC123'; // ATXO SID
 *
 * try {
 *   const commitment = await getCommitmentByAtxoSid(atxoSid);
 *   console.log(commitment); // { atxoSid: 'ABC123', commitment: 'xyzABC...' }
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export declare const getCommitmentByAtxoSid: (atxoSid: string) => Promise<FindoraWallet.AtxoCommitmentItem>;
export {};
