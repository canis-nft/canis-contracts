const networks = require('./hardhat.networks')

require('@nomicfoundation/hardhat-toolbox')
require('hardhat-deploy')
require('hardhat-deploy-ethers')
require('@nomiclabs/hardhat-etherscan')
require('hardhat-abi-exporter')
require('hardhat-gas-reporter')
require('hardhat-docgen')
require('hardhat-contract-sizer')

const testnetAdmin = '0x080D834838dc9EE7154a5d13E03073CA2ADd0C92' // Account 1
const testnetUser1 = '0x09394bf9046485B043E4476dED219b3D718E6A90' // Account 3
const testnetUser2 = '0x9A669b35D0Fc83a3272A37aab7A3147c4dc5546b' // Account 4
const testnetUser3 = '0x8E0496C9786f8271Bc3712c9e5F794A137c2Dc87' // Account 5

const config = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  networks,
  gasReporter: {
    currency: 'USD',
    gasPrice: 1,
    enabled: process.env.REPORT_GAS ? true : false
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
    admin: {
      42: testnetAdmin,
      4: testnetAdmin,
      3: testnetAdmin,
      43113: testnetAdmin,
    },
    testnetUser1: {
      default: testnetUser1,
      3: testnetUser1,
      4: testnetUser1,
      42: testnetUser1,
      43113: testnetUser1,
    },
    testnetUser2: {
      default: testnetUser2,
      3: testnetUser2,
      4: testnetUser2,
      42: testnetUser2,
      43113: testnetUser2,
    },
    testnetUser3: {
      default: testnetUser3,
      3: testnetUser3,
      4: testnetUser3,
      42: testnetUser3,
      43113: testnetUser3,
    },
    royaltyReceiver: {
      31337: '0x080D834838dc9EE7154a5d13E03073CA2ADd0C92'
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  mocha: {
    timeout: 30000
  },
  abiExporter: {
    path: './abis',
    runOnCompile: true,
    clear: true,
    flat: true
  }
}

module.exports = config
