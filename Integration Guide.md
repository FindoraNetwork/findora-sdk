# Integration Guide

This guide will walk 3rd party developers on how to:
* Setup the `Findora SDK`
* Use the most commonly used SDK features

Developers should be able to integrate Findora features such as sending FRA to another wallet, checking the FRA balance, etc. into their crypto wallet, crypto exchange or Dapp by following this guide.

## **Findora SDK Setup**

- **1.** **How do I setup the Findora SDK (i.e. this is a required step to use any of the other info in this document)?**

    ```jsx
    // First, we need to import the findora sdk package
    const findoraSdk = await import('findora-sdk');

    // Before using the sdk, we need to configure it so it knows which server to connect to 
    const sdkEnv = { hostUrl: 'http://127.0.0.1' };
    const { Sdk } = findoraSdk;
    Sdk.default.init(sdkEnv);

    // That is it! after that Findora sdk is ready to use! 
    ```

- **2. How to create a Findora wallet?**

    ```jsx
    // Note: The SDK must be setup before you can proceed with the instructions below (i.e. see step #1) 

    // To create an account we would use one of the Findora SDK APIs. 
    // In this example, we use Keypair API to create a Findora wallet
    const { Keypair: KeypairApi } = findoraSdk.Api;

    // This wallet info below will be used for any operation related to the SDK
    const walletInfo = await KeypairApi.createKeypair(password);
    ```

- **3. How can I send FRA to another wallet?**

    ```jsx
    // Note: The SDK must be setup before you can proceed with the instructions below (i.e. see step #1) 

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi  } = findoraSdk.Api;

    // First step is to restore your wallet using a mnemonic phrase or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // We are going to use a native FRA asset code since we are sending FRA
    const assetCode = await AssetApi.getFraAssetCode();

    // Next, we create an instance of the transaction builder - that is what is going to be broadcast to the network
    const transactionBuilder = await TransactionApi.sendToAddress(
      walletInfo,
      address,
      numbers,
      assetCode,
      assetBlindRules,
    );

    // Finally, we will broadcasting this transaction to the network
    const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);
    ```

- **4. How can I send FRA to multiple wallets?**

    ```jsx
    // Note: The SDK must be setup before you can proceed with the instructions below (i.e. see step #1) 

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi } = findoraSdk.Api;

    // The first step is to restore your wallet using a mnemonic phrase, or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // We are going to use a native FRA asset code, since we are sending FRA
    const assetCode = await AssetApi.getFraAssetCode();

    // Specify how much FRA to send to each recipient
    const numbersForAlice = '0.1';
    const numbersForPeter = '0.2';

    // Use `getAddressPublicAndKey` helper to prepare an object with an address and public key, 
    // as both values would be needed by the transaction api
    const aliceWalletInfo = await KeypairApi.getAddressPublicAndKey(aliceAddress);
    const peterWalletInfo = await KeypairApi.getAddressPublicAndKey(peterAddress);

    // Prepare the receipient data
    const recieversInfo = [
      { reciverWalletInfo: aliceWalletInfo, amount: numbersForAlice },
      { reciverWalletInfo: peterWalletInfo, amount: numbersForPeter },
    ];

    // Create an instance of the transaction builder - that is what is going to be broadcast to the network
    const transactionBuilder = await TransactionApi.sendToMany(
      walletInfo,
      recieversInfo,
      assetCode,
      assetBlindRules,
    );

    // Finally, broadcast this transaction to the network
    const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);
    ```

- **5. I want to create a custom asset, how can I do that?**

    ```jsx
    // Here we are assuming that SDK has already been imported and configured, 
    // please see "**1. How to configure / initialize Findora SDK?**"

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi } = findoraSdk.Api;

    // First step is to restore your wallet using a mnemonic phrase, or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // Next, we need to generate a random asset code to ensure it is unique and it does not exists yet
    // It would return somethig like 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs=' - it is rnadom, 
    // but it follows certain format and that is why we need to use that helper
    const tokenCode = await AssetApi.getRandomAssetCode();

    // Then we create an instance of the transaction builder - that is what is going to be broadcasted to the network
    const assetBuilder = await AssetApi.defineAsset(walletInfo, tokenCode);

    // Lastly, we are broadcasting this transaction to the network
    const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);

    ```

- **6. Ok, I have a new asset, but it has no balance! How can I issue some amount of this asset?**

    ```jsx
    // Here we are assuming that SDK has already been imported and configured, 
    // please see "**1. How to configure / initialize Findora SDK?**"

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi } = findoraSdk.Api;

    // First step is to restore your wallet using a mnemonic phrase, or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // Next, we need to pass the asset code, which we we want to issue 
    const tokenCode = 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs=';

    // How much of this asset we want to issue?
    const amountToIssue = '5000';

    // Optionally, we can hide the ammount of this transaction, so the exact issued amount would be hidden
    // For that we use AssetBlindRules - but again, it is completely optional!
    const assetBlindRules = { isAmountBlind: true };

    // Then we create an instance of the transaction builder - that is what is going to be broadcasted to the network
    const issueAssetBuilder = await AssetApi.issueAsset(walletInfo, tokenCode, amountToIssue, assetBlindRules);

    // Lastly, we are broadcasting this transaction to the network
    const resultHandle = await TransactionApi.submitTransaction(issueAssetBuilder);
    ```

- **7. How can I send custom asset to another wallet?**

    ```jsx
    // It is almost identical to sending FRA - we simply use custom asset code 
    // (i.e. 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs=') instead of using FRA asset code from AssetApi.getFraAssetCode()
    // See details below

    // Here we are assuming that SDK has already been imported and configured, 
    // please see "**1. How to configure / initialize Findora SDK?**"

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi  } = findoraSdk.Api;

    // First step is to restore your wallet using a mnemonic phrase, or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // Here is the only difference from sending FRA - the rest is exactly the same!
    // const assetCode = await AssetApi.getFraAssetCode(); // <- that is to send FRA
    const assetCode = 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs='; // <- that is to send this particular asset

    // Next, we create an instance of the transaction builder - that is what is going to be broadcasted to the network
    const transactionBuilder = await TransactionApi.sendToAddress(
      walletInfo,
      address,
      numbers,
      assetCode,
      assetBlindRules,
    );

    // Lastly, we are broadcasting this transaction to the network
    const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);
    ```

- **8. Ok, how to send tokens confidentially?**

    ```jsx
    // Here we are assuming that SDK has already been imported and configured, 
    // please see "**1. How to configure / initialize Findora SDK?**"

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi } = findoraSdk.Api;

    // First step is to restore your wallet using a mnemonic phrase, or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // We are going to use a native FRA asset code
    const assetCode = await AssetApi.getFraAssetCode(); // <- that is to send FRA
    // or, if we want to send custom asset, we would use smth like this
    // const assetCode = 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs='; // <- that is to send this particular asset

    // How much of this asset we are sending to each of receivers
    const numbersForAlice = '0.1';
    const numbersForPeter = '0.2';

    // We use `getAddressPublicAndKey` helper to prepare an object with an address and public key, 
    // as both values would be needed by the transaction api
    const aliceWalletInfo = await KeypairApi.getAddressPublicAndKey(aliceAddress);
    const peterWalletInfo = await KeypairApi.getAddressPublicAndKey(peterAddress);

    // Next, we are preparing receipients data
    const recieversInfo = [
      { reciverWalletInfo: aliceWalletInfo, amount: numbersForAlice },
      { reciverWalletInfo: peterWalletInfo, amount: numbersForPeter },
    ];

    // Here is how we can define this transaction to have confidential value, or asset type, or both
    // For that we are creating an object with AssetBlindRules.
    // In this example we are only "hiding" the amount, and keeping the type visible.
    const assetBlindRulesForSend = { isTypeBlind: false, isAmountBlind: true };
    // If we do not want to enable a particular asset blind rule, (i.e. we we are not hiding asset type)
    // we can drop this option and keep it like this
    // const assetBlindRulesForSend = { isAmountBlind: true };

    // Then we create an instance of the transaction builder - that is what is going to be broadcasted to the network
    const transactionBuilder = await TransactionApi.sendToMany(
      walletInfo,
      recieversInfo,
      assetCode,
      assetBlindRules,
    );

    // Lastly, we are broadcasting this transaction to the network
    const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);

    ```

- **9. I feel like I spent a lot.. How I can check the balance?**

    ```jsx
    // Here we are assuming that SDK has already been imported and configured, 
    // please see "**1. How to configure / initialize Findora SDK?**"

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi } = findoraSdk.Api;

    // First step is to restore your wallet using a mnemonic phrase, or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // By default `getBalance` is checking for FRA balance, 
    // but we can pass an additional argument to check a custom asset balance
    const balance = await AccountApi.getBalance(walletInfo);

    const assetCode = 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs='; 
    const anotherBalance = await AccountApi.getBalance(walletInfo, assetCode);
    ```
