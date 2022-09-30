const { exec } = require('child_process');

exec(
  `abi-types-generator './src/api/evm/abis/Erc20.json' --output='./src/api/evm/types' --name=Erc20 --provider=web3`,
);
exec(
  `abi-types-generator './src/api/evm/abis/SimBridge.json' --output='./src/api/evm/types' --name=SimBridge --provider=web3`,
);
exec(
  `abi-types-generator './src/api/evm/abis/PrismXXAsset.json' --output='./src/api/evm/types' --name=PrismXXAsset --provider=web3`,
);
exec(
  `abi-types-generator './src/api/evm/abis/NFT721.json' --output='./src/api/evm/types' --name=NFT721 --provider=web3`,
);
exec(
  `abi-types-generator './src/api/evm/abis/NFT1155.json' --output='./src/api/evm/types' --name=NFT1155 --provider=web3`,
);
