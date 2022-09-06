const {getNamedAccounts} = require('hardhat')
const {getCanisNFT} = require('../utils/helpers')
const {dim, green, yellow} = require('../utils/utils')

async function main() {
  if (!process.env.CANISNFT_ADDRESS || !process.env.TO) {
    console.error('PLEASE PROVIDE THE MISSING ADDRESSES')
    return 1
  } else {
    dim(`------- MINTING NFT TO ${process.env.TO} -------`)
    const {deployer} = await getNamedAccounts()
    const CanisNFT = await getCanisNFT(deployer)
    const tx = await CanisNFT.mint(process.env.TO)
    yellow('------- AWAITING TRANSACTION -------')
    const txResult = await tx.wait()
    green('------- NFT MINTED SUCCESSFULLY -------')
    green(txResult)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
