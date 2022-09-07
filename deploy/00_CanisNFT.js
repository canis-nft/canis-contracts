const {dim, green, cyan, chainName, displayResult} = require('../utils/utils')
const version = 'v0.1.0'
const ContractName = 'CanisNFT'

module.exports = async (hardhat) => {
  const {getNamedAccounts, deployments, getChainId} = hardhat
  const {deploy} = deployments
  const {deployer} = await getNamedAccounts()

  const {cap, tokenUri, name, symbol} = {
    cap: !process.env.TOKEN_SUPPLY ? 300 : process.env.TOKEN_SUPPLY,
    tokenUri: !process.env.TOKEN_URI
      ? 'https://bafybeiahsj6so2jofeadwprofvphxo6g5d662xwzolztg6xgs3g4qa4vvi.ipfs.nftstorage.link/metadata'
      : process.env.TOKEN_URI,
    name: !process.env.NFT_NAME ? 'CanisNFT' : process.env.NFT_NAME,
    symbol: !process.env.NFT_SYMBOL ? 'CAN' : process.env.NFT_SYMBOL
  }

  const chainId = parseInt(await getChainId(), 10)

  const isTestEnvironment = chainId === 31337 || chainId === 1337

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  dim(`Blockchain Canis Contracts - Deploy ${ContractName}`)
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')

  dim(`network: ${chainName(chainId)} (${isTestEnvironment ? 'local' : 'remote'})`)
  dim(`deployer: ${deployer}`)

  cyan(`\nDeploying ${ContractName}...`)
  const CanisNFTResult = await deploy(ContractName, {
    args: [cap, tokenUri, name, symbol],
    contract: ContractName,
    from: deployer,
    skipIfAlreadyDeployed: false
  })

  displayResult(ContractName, CanisNFTResult)

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  green('Contract Deployments Complete!')
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')

  return true
}

const id = ContractName + version
module.exports.tags = [ContractName, version]
module.exports.id = id
