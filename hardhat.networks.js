const accounts = process.env.PRIVATE_KEY
  ? [process.env.PRIVATE_KEY]
  : {
      mnemonic: process.env.HDWALLET_MNEMONIC
    }

const networks = {
  coverage: {
    url: 'http://127.0.0.1:8555',
    blockGasLimit: 200000000,
    allowUnlimitedContractSize: true
  },
  localhost: {
    chainId: 1337,
    url: 'http://127.0.0.1:8545',
    allowUnlimitedContractSize: true,
    timeout: 1000 * 60
  }
}

if (process.env.ALCHEMY_URL && process.env.FORK_ENABLED) {
  networks.hardhat = {
    allowUnlimitedContractSize: true,
    chainId: 1,
    forking: {
      url: process.env.ALCHEMY_URL
    },
    accounts
  }
  if (process.env.FORK_BLOCK_NUMBER) {
    networks.hardhat.forking.blockNumber = parseInt(process.env.FORK_BLOCK_NUMBER)
  }
} else {
  networks.hardhat = {
    allowUnlimitedContractSize: true
  }
}

if (process.env.HDWALLET_MNEMONIC || process.env.PRIVATE_KEY) {
  networks.mumbai = {
    chainId: 80001,
    url: 'https://rpc-mumbai.maticvigil.com',
    accounts
  }
}

if (process.env.POLYGONSCAN_API_KEY && (process.env.HDWALLET_MNEMONIC || process.env.PRIVATE_KEY)) {
  networks.matic = {
    chainId: 137,
    url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.POLYGONSCAN_API_KEY}`,
    accounts
  }
} else {
  console.warn('No polygonscan or hdwallet available for testnets')
}

if (process.env.INFURA_API_KEY && (process.env.HDWALLET_MNEMONIC || process.env.PRIVATE_KEY)) {
  networks.kovan = {
    url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    accounts
  }

  networks.ropsten = {
    url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    accounts
  }

  networks.rinkeby = {
    url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    accounts
  }

  networks.mainnet = {
    url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    accounts
  }
} else {
  console.warn('No infura or hdwallet available for testnets')
}

module.exports = networks
