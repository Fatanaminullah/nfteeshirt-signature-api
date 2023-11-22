const { InfuraProvider } = require("@ethersproject/providers");
const { Contract } = require("@ethersproject/contracts");
const config = require("./config");

const abi = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];

const mappingCollectionAddress = (collection) => {
  switch (collection) {
    case "karafuru":
      return config.contractAddress;
    case "furu-spirits":
      return config.contractAddressSpirits;
    case "karafuru-x-hypebeast-x-atmos":
      return config.contractAddress3d;
    default:
      return config.contractAddress;
  }
};

// Get owner address of token id
exports.getOwnerOf = async (tokenId, contractAddress) => {
  const provider = new InfuraProvider(config.projectNetwork, config.projectId);
  const contract = new Contract(contractAddress, abi, provider);

  const response = await contract.ownerOf(tokenId);
  return response;
};

// Get the total number of token that has been minted
exports.getBalanceOf = async (account, collection) => {
  const provider = new InfuraProvider(config.projectNetwork, config.projectId);
  const contract = new Contract(
    mappingCollectionAddress(collection),
    abi,
    provider
  );

  const response = await contract.balanceOf(account);
  return +response.toString();
};
