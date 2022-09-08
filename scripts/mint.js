const chalk = require('chalk')
const {getCanisNFT} = require('../utils/helpers')
const {dim, green, yellow} = require('../utils/utils')

async function main() {
  if (!process.env.CANISNFT_ADDRESS || !process.env.TO) {
    console.error('PLEASE PROVIDE THE MISSING ADDRESSES')
    return 1
  } else {
    dim(`------- MINTING NFT TO ${process.env.TO} -------`)
    const CanisNFT = await getCanisNFT(process.env.CANISNFT_ADDRESS)
    const tx = await CanisNFT.safeMint(process.env.TO)
    yellow('------- AWAITING TRANSACTION -------')
    const txResult = await tx.wait()
    green('------- NFT MINTED SUCCESSFULLY -------')
    console.log(txResult)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
