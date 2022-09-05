const chalk = require('chalk')

function dim() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.dim.call(chalk, ...arguments))
  }
}

function cyan() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.cyan.call(chalk, ...arguments))
  }
}

function yellow() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.yellow.call(chalk, ...arguments))
  }
}

function green() {
  if (!process.env.HIDE_DEPLOY_LOG) {
    console.log(chalk.green.call(chalk, ...arguments))
  }
}

function displayResult(name, result) {
    if (!result.newlyDeployed) {
      yellow(`Re-used existing ${name} at ${result.address}`)
    } else {
      green(`${name} deployed at ${result.address}`)
    }
}

const chainName = (chainId) => {
    switch(chainId) {
      case 3: return 'Ropsten';
      case 4: return 'Rinkeby';
      case 42: return 'Kovan';
      case 31337: return 'HardhatEVM';
      case 80001: return 'Mumbai';
      default: return 'Unknown';
    }
}

module.exports = async (hardhat) => {
    const { getNamedAccounts, deployments, getChainId, ethers } = hardhat
    const { deploy } = deployments

    const harnessDisabled = !!process.env.DISABLE_HARNESS

    let {
        deployer,
        admin,
    } = await getNamedAccounts()

    const chainId = parseInt(await getChainId(), 10)

    const isTestEnvironment = chainId === 31337 || chainId === 1337

    const signer = await ethers.provider.getSigner(deployer)

    dim("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    dim("Blockchain Canis Contracts - Deploy Script")
    dim("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")
  
    dim(`network: ${chainName(chainId)} (${isTestEnvironment ? 'local' : 'remote'})`)
    dim(`deployer: ${deployer}`)
    if (!admin) {
      admin = signer._address
    }
    dim("admin:", admin)

    if (isTestEnvironment) {
        //testnet mocks
    }

    cyan("\nDeploying MyNFT...")
    const MyNFTResult = await deploy("MyNFT", {
        contract: 'MyNFT',
        from: deployer,
        skipIfAlreadyDeployed: true
    })
    displayResult('MyNFT', MyNFTResult)

    dim("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    green("Contract Deployments Complete!")
    dim("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n")

};