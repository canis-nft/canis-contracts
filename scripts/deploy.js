const {dim, cyan, chainName, green, displayResult} = require('../utils/utils')

module.exports = async (hardhat) => {
  const {getNamedAccounts, deployments, getChainId, ethers} = hardhat
  const {deploy} = deployments

  let {deployer, admin} = await getNamedAccounts()

  const chainId = parseInt(await getChainId(), 10)

  const isTestEnvironment = chainId === 31337 || chainId === 1337

  const signer = await ethers.provider.getSigner(deployer)

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  dim('Blockchain Canis Contracts - Deploy Script')
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')

  dim(`network: ${chainName(chainId)} (${isTestEnvironment ? 'local' : 'remote'})`)
  dim(`deployer: ${deployer}`)
  if (!admin) {
    admin = signer._address
  }
  dim('admin:', admin)

  if (isTestEnvironment) {
    //testnet mocks
  }

  cyan('\nDeploying MyNFT...')
  const MyNFTResult = await deploy('MyNFT', {
    contract: 'MyNFT',
    from: deployer,
    skipIfAlreadyDeployed: true
  })
  displayResult('MyNFT', MyNFTResult)

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  green('Contract Deployments Complete!')
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')
}
