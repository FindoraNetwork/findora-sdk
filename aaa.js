/*

  一、evm -> native, 转账成功的同时，

    前置条件：
    显示资产  20、721、1155



    1、转账

    export async function getPrismConfig() {

      URL: https://prod-testnet.prod.findora.org:8668/display_checkpoint

      Get Request /display_checkpoint, 去使用 prism_bridge_address: "0x275f13f0a99C4b9710A8Cde3927b611d0DaA2A08"

      const web3 = getWeb3(Network.getRpcRoute());

      const bridgeAddress = prism_bridge_address;

      const prismContract = await getSimBridgeContract(web3, bridgeAddress);

      const [ledgerAddress, assetAddress] = await Promise.all([
        prismContract.methods.ledger_contract().call(),
        prismContract.methods.asset_contract().call(),
      ]);

      return { ledgerAddress, assetAddress, bridgeAddress };
    }

    export const fraAddressToHashAddress = (address: string) => {
      const { data, prefix } = bech32ToBuffer.decode(address);
      if (prefix == 'eth') {
        return '0x01' + Buffer.from(data).toString('hex');
      }
      return '0x' + Buffer.from(data).toString('hex');
    };

    export async function evmToNativeOfFRC721(
      nativeWallet: string, // fra
      evmWallet: ethers.Wallet,
      assetCode: string,
      tokenId: string,
    ) {

      const findoraTo = fraAddressToHashAddress(nativeWallet);
      // 将 fra 格式的地址，转化为 0x格式的地址

      const { bridgeAddress, ledgerAddress } = await getPrismConfig(evmWallet);

      const erc721Contract = await getERC721Contract({
        address: assetCode,
        wallet: evmWallet,
      });

      const prismContract = await getSimBridgeContract({
        address: bridgeAddress,
        wallet: evmWallet,
      });

      const ownerOf = await erc721Contract.ownerOf(tokenId);
      if (ownerOf !== evmWallet.address) throw 'not tokenId';

      const tsxApprove = await erc721Contract.approve(ledgerAddress, tokenId);
      const resultApprove = await tsxApprove.wait();

      if (resultApprove.status == 1) {
        const tsxDeposit = await prismContract.depositFRC721(
          assetCode,
          findoraTo,
          tokenId,
        );
        const resultDeposit = await tsxDeposit.wait();
        console.log(`Tsx Hash: ${resultDeposit.hash}`);
      }
    }


     to地址，是在自己的钱包里面，同时，把转账的资产，添加到资产管理列表里
     to地址，不再自己钱包里面，就不用管了 （ corssAsset ）

    2、往资产管理列表添加资产时，需要设置正确 tokenAssetType，
      - 通过 UI 交互行为 ，决定转的什么类型 （客户端钱包使用此方案）
      - 使用 第 二 步骤的方法，进行判断

  二、将 evm 跨到 native 的资产，添加到 资产管理列表

    1、判断资产是什么类型，需要使用 PrismXXAssetContract 合约的 getTokenType 方法，传递的参数 是这种编码格式 `0x${Buffer.from(tokenAddress, 'base64').toString('hex')}`。

    const TOKEN_TYPE = {
      FRC20: 0,
      FRC721: 1,
      FRC1155: 2,
      FRA: -1,
      CUSTOMNATIVE: -2,
    };


    tokenAddress = '输入框输入的资产地址， base64格式'
    hashAddress = `0x${Buffer.from(tokenAddress, 'base64').toString('hex')}` // 把base64 转换为 hash
    tokenAssetType = PrismXXAssetContract.getTokenType(hashAddress)

    if (tokenAssetType == '0') {
      if (tokenAddress === findoraWasm.fra_get_asset_code()) {
        tokenAssetType = String(TOKEN_TYPE.FRA);
      } else {
        const tokenAssetInfo = await prismAssetContract.methods.getERC20Info(assetTypeContractParam1).call();
        if (tokenAssetInfo == '0x0000000000000000000000000000000000000000') {
          tokenAssetType = String(TOKEN_TYPE.CUSTOMNATIVE);
        } else {
          tokenAssetType = String(TOKEN_TYPE.FRC20);
        }
      }
    }

    const assetData: FindoraWallet.IAssetCustom = {
      assetCode: tokenAddress,
      nickname: values.nickname,
      nicknames: [],
      address: values.address,
      type: Number(tokenAssetType),
      options: {
        builtIn: false,
        owned: false,
      },
    };

    将 assetData ，添加到资产管理列表

    三、 native -> evm

    console.log('1、[send FRA]');
    await nativeToEvm(nativeWallet, evmWallet, await AssetApi.getFraAssetCode());

    console.log('2、[send FRC20]');
    await nativeToEvm(nativeWallet, evmWallet, frc20AssetCode);

    console.log('3、[send FRC721]');
    await nativeToEvm(nativeWallet, evmWallet, frc721AssetCode);

    console.log('4、[send FRC1155]');
    await nativeToEvm(nativeWallet, evmWallet, frc1155AssetCode);

    -------

    export async function nativeToEvm(
      nativeWallet: WalletKeypar,
      evmWallet: string,
      assetCode: string,
      amount: string,
    ) {
      const findoraSdk = await import('@findora-network/findora-sdk.js');
      const {
        Evm: EvmApi,
        Asset: AssetApi,
        Transaction: TransactionApi,
      } = findoraSdk.Api;

      const transactionBuilder = await EvmApi.sendAccountToEvm(
        nativeWallet,
        '10',
        evmWallet,
        assetCode,
        '',
      );

      const handle = await TransactionApi.submitTransaction(transactionBuilder);
      await sleep(10 * 6000);

      const hash = await getNativeHash(handle);

      console.log(
        `native to evm (FRA) : ${NETWORK_CONFIG.explorerUrl}/transactionshash?hash=${hash}`,
      );
    }

 *
 */
