const { dim, green, cyan, chainName, displayResult } = require('../utils/utils')
const version = 'v0.1.0'
const contractName = 'CanisNFT'
const config = require('../config')

module.exports = async (hardhat) => {
  const { getNamedAccounts, deployments, getChainId } = hardhat
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = parseInt(await getChainId(), 10)

  const {
    cap,
    name,
    symbol,
    defaultRoyaltyReceiver,
    defaultFeeNumerator,
    startGiftingIndex,
    endGiftingIndex,
    contractUri } = config[contractName][chainId]

  const isTestEnvironment = chainId === 31337 || chainId === 1337

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  dim(`Blockchain Canis Contracts - Deploy ${contractName}`)
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')

  dim(`network: ${chainName(chainId)} (${isTestEnvironment ? 'local' : 'remote'})`)
  dim(`deployer: ${deployer}`)

  cyan(`\nDeploying ${contractName}...`)
  const CanisNFTResult = await deploy(contractName, {
    args: [cap, name, symbol, defaultRoyaltyReceiver, defaultFeeNumerator, startGiftingIndex, endGiftingIndex, contractUri],
    contract: contractName,
    from: deployer,
    skipIfAlreadyDeployed: false
  })

  displayResult(contractName, CanisNFTResult)

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  green('Contract Deployments Complete!')
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')

  return true
}

const id = contractName + version
module.exports.tags = [contractName, version]
module.exports.id = id
