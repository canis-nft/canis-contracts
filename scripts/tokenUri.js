const chalk = require('chalk')
const { ethers, getNamedAccounts, getChainId } = require('hardhat')

const { getCanisNFT } = require('../utils/helpers')
const { dim, green, yellow, cyan } = require('../utils/utils')
const posters = require('../metadata/posters')
const config = require('../config')

async function main() {
  const { deployer } = await getNamedAccounts()
  const chainId = parseInt(await getChainId(), 10)
  const myconfig = config['CanisNFT'][chainId]
  canisNFT = await ethers.getContract('CanisNFT', deployer)

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  dim(` CanisNFT Contracts - TokenUri `)
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')

  const name = await this.canisNFT.name()
  const symbol = await this.canisNFT.symbol()
  const cap = await this.canisNFT.CAP()
  const { receiver, royaltyAmount } = await this.canisNFT.royaltyInfo(1, 1000)
  const startGiftingIndex = await this.canisNFT.startGiftingIndex()
  const endGiftingIndex = await this.canisNFT.endGiftingIndex()
  const contractUri = await this.canisNFT.contractURI()
  const owner = await this.canisNFT.owner()

  yellow(`\nTokenUris...`)

  for (let i = 1; i <= 150; i++) {
    const tokenURI = await canisNFT.tokenURI(i);
    cyan(`tokenId: ${i} - tokenURI: ${tokenURI}`)
  }

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  green('CanisNFT Contracts - TokenUri Complete!')
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });