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
    // Note: The SDK must be setup before you can proceed with the instructions below (i.e. see step #1) 

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi } = findoraSdk.Api;

    // First step is to restore your wallet using a mnemonic phrase or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // Generate a random asset code to ensure it is unique and it does not yet exist
    // It should return something like 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs=' (i.e. it will be random)
    // but it follows a certain format and that is why we need to use that helper
    const tokenCode = await AssetApi.getRandomAssetCode();

    // Then we create an instance of the transaction builder - that is what is going to be broadcast to the network
    const assetBuilder = await AssetApi.defineAsset(walletInfo, tokenCode);

    // Finally, broadcast this transaction to the network
    const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);

    ```

- **6. Ok, I have a new asset, but it has no balance! How can I issue some amount of this asset?**

    ```jsx
    // Note: The SDK must be setup before you can proceed with the instructions below (i.e. see step #1) 

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi } = findoraSdk.Api;

    // First, restore your wallet using a mnemonic phrase or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // Pass the asset code which you want to issue 
    const tokenCode = 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs=';

    // Specify how much of the asset to issue?
    const amountToIssue = '5000';

    // Optionally, you can hide the transaction amount (i.e. the issued amount would be hidden on the block explorer)
    // For that we use AssetBlindRules - but again, it is completely optional!
    const assetBlindRules = { isAmountBlind: true };

    // Create an instance of the transaction builder - this is what will be broadcast to the network
    const issueAssetBuilder = await AssetApi.issueAsset(walletInfo, tokenCode, amountToIssue, assetBlindRules);

    // Finally, broadcasting the transaction to the network
    const resultHandle = await TransactionApi.submitTransaction(issueAssetBuilder);
    ```

- **7. How can I send custom asset to another wallet?**

    ```jsx
    // Note: The SDK must be setup before you can proceed with the instructions below (i.e. see step #1) 
    
    
    // This is nearly identical to sending FRA but use the custom asset code instead
    // (i.e. 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs=') instead of using FRA asset code from AssetApi.getFraAssetCode()
    // See details below:

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi  } = findoraSdk.Api;

    // First, restore your wallet using a mnemonic phrase or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // Below is the only difference from sending FRA - the rest is exactly the same
    // const assetCode = await AssetApi.getFraAssetCode(); // <- that is to send FRA
    const assetCode = 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs='; // <- that is to send this particular asset

    // Create an instance of the transaction builder - that is what will be broadcast to the network
    const transactionBuilder = await TransactionApi.sendToAddress(
      walletInfo,
      address,
      numbers,
      assetCode,
      assetBlindRules,
    );

    // Finally, broadcasting this transaction to the network
    const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);
    ```

- **8. Ok, how to send tokens confidentially?**

    ```jsx
    // Note: The SDK must be setup before you can proceed with the instructions below (i.e. see step #1) 

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi } = findoraSdk.Api;

    // First, restore your wallet using a mnemonic phrase or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // Use the native FRA asset code
    const assetCode = await AssetApi.getFraAssetCode(); // <- that is to send FRA
    // or, if we want to send custom asset, we would use smth like this
    // const assetCode = 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs='; // <- that is to send this particular asset

    // Specify how much of this asset to send to recipients
    const numbersForAlice = '0.1';
    const numbersForPeter = '0.2';

    // We use `getAddressPublicAndKey` helper to prepare an object with an address and public key 
    // as both values would be needed by the transaction api
    const aliceWalletInfo = await KeypairApi.getAddressPublicAndKey(aliceAddress);
    const peterWalletInfo = await KeypairApi.getAddressPublicAndKey(peterAddress);

    // Preparing receipients' data
    const recieversInfo = [
      { reciverWalletInfo: aliceWalletInfo, amount: numbersForAlice },
      { reciverWalletInfo: peterWalletInfo, amount: numbersForPeter },
    ];

    // Define this transaction to have a confidential value, or asset type, or both
    // For that we are creating an object with AssetBlindRules.
    // In this example we are only "hiding" the amount, and keeping the type visible.
    const assetBlindRulesForSend = { isTypeBlind: false, isAmountBlind: true };
    // If you do not want to enable a particular asset blind rule, (i.e. you are not hiding asset type)
    // then you can drop this option and keep as below:
    // const assetBlindRulesForSend = { isAmountBlind: true };

    // Create an instance of the transaction builder - that is what will be broadcast to the network
    const transactionBuilder = await TransactionApi.sendToMany(
      walletInfo,
      recieversInfo,
      assetCode,
      assetBlindRules,
    );

    // Finally, broadcast this transaction to the network
    const resultHandle = await TransactionApi.submitTransaction(transactionBuilder);

    ```

- **9. How I can check the balance?**

    ```jsx
    // Note: The SDK must be setup before you can proceed with the instructions below (i.e. see step #1) 

    const { Keypair: KeypairApi, Asset: AssetApi, Transaction: TransactionApi } = findoraSdk.Api;

    // First, restore your wallet using a mnemonic phrase or, alternatively, a private key
    // a. Restore from mnemonic
    const walletInfo = await KeypairApi.restoreFromMnemonic(yourMnenomic, password);
    // b. Or, alternatively, restore from private key
    const anotherWalletInfo = await KeypairApi.restoreFromPrivateKey(pkey, password);

    // By default, `getBalance` checks for FRA balance, 
    // but we can pass an additional argument to check a custom asset balance
    const balance = await AccountApi.getBalance(walletInfo);

    const assetCode = 'W4-AkZy73UGA6z8pUTv4YOjRNuFwD03Bpk0YPJkKPzs='; 
    const anotherBalance = await AccountApi.getBalance(walletInfo, assetCode);
    ```
