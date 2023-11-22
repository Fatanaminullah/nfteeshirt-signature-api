const { InfuraProvider } = require('@ethersproject/providers');
const { Wallet } = require('@ethersproject/wallet');

const config = {
  projectNetwork: process.env.INFURA_PROJECT_NETWORK,
  projectId: process.env.INFURA_PROJECT_ID,
  projectSecret: process.env.INFURA_PROJECT_SECRET,
  privateKey: process.env.ETHERS_WHITELIST_PRIVATE_KEY,
  metaIdContractAddress: process.env.ETHERS_META_ID_CONTRACT_ADDRESS,
}

const Network = {
  'rinkeby': 'rinkeby',
  'mainnet': 'mainnet',
}

const ChainId = {
  'rinkeby': 4,
  'mainnet': 1,
}

exports.generateNonce = () => {
  return Math.floor(Math.random() * 10000);
}

exports.generateSignature = async (minter, tokenId, nonce) => {
  const provider = new InfuraProvider(Network[config.projectNetwork], {
    projectId: config.projectId,
    projectSecret: config.projectSecret,
  });

  const wallet = new Wallet(config.privateKey, provider);

  const signature = await wallet._signTypedData(
    {
      name: 'SOS Meta ID',
      version: '1',
      chainId: ChainId[config.projectNetwork],
      verifyingContract: config.metaIdContractAddress,
    },
    {
      Whitelist: [
        { name: 'minter', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
      ],
    },
    {
      minter,
      tokenId,
      nonce,
    },
  );

  return signature;
}