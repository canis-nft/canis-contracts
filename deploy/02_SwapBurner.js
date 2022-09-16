const {getUnnamedAccounts} = require('hardhat')
const {dim, green, cyan, chainName, displayResult} = require('../utils/utils')
const version = 'v0.1.0'
const ContractName = 'SwapBurner'

module.exports = async (hardhat) => {
  const {getNamedAccounts, deployments, getChainId} = hardhat
  const {deploy} = deployments
  const {deployer} = await getNamedAccounts()
  const accounts = await getUnnamedAccounts()

  const {uniswapRouter, ubiToken} = {
    uniswapRouter: !process.env.UNISWAP_ROUTER ? accounts[0] : process.env.UNISWAP_ROUTER,
    ubiToken: !process.env.UBI_TOKEN ? accounts[1] : process.env.UBI_TOKEN
  }

  const chainId = parseInt(await getChainId(), 10)

  const isTestEnvironment = chainId === 31337 || chainId === 1337

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  dim(`Blockchain Canis Contracts - Deploy ${ContractName}`)
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')

  dim(`network: ${chainName(chainId)} (${isTestEnvironment ? 'local' : 'remote'})`)
  dim(`deployer: ${deployer}`)

  cyan(`\nDeploying ${ContractName}...`)
  const SwapBurnerResult = await deploy(ContractName, {
    args: [uniswapRouter, ubiToken],
    contract: ContractName,
    from: deployer,
    skipIfAlreadyDeployed: false
  })

  displayResult(ContractName, SwapBurnerResult)

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  green('Contract Deployments Complete!')
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')

  return true
}

const id = ContractName + version
module.exports.tags = [ContractName, version]
module.exports.id = id
