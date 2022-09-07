const {dim, green, cyan, chainName, displayResult} = require('../utils/utils')
const version = 'v0.1.0'
const ContractName = 'CanisNFT'

module.exports = async (hardhat) => {
  const {getNamedAccounts, deployments, getChainId} = hardhat
  const {deploy} = deployments
  const {deployer} = await getNamedAccounts()

  const chainId = parseInt(await getChainId(), 10)

  const isTestEnvironment = chainId === 31337 || chainId === 1337

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  dim('Blockchain Canis Contracts - Deploy CanisNFT')
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')

  dim(`network: ${chainName(chainId)} (${isTestEnvironment ? 'local' : 'remote'})`)
  dim(`deployer: ${deployer}`)

  cyan(`\nDeploying ${ContractName}...`)
  const CanisNFTResult = await deploy(ContractName, {
    args: [300],
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
module.exports.tags = [id, version]
module.exports.id = id
