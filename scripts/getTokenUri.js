const {getCanisNFT} = require('../utils/helpers')
const {dim} = require('../utils/utils')
const fetch = require('node-fetch')

async function main() {
  if (!process.env.CANISNFT_ADDRESS || !process.env.TOKEN_URI) {
    console.error('PLEASE PROVIDE THE CORRECT ENV VARIABLES')
    return 1
  } else {
    dim(`------- FETCHING NFT METATADA FOR ${process.env.TO} -------`)
    const CanisNFT = await getCanisNFT(process.env.CANISNFT_ADDRESS)
    const response = await CanisNFT.tokenURI(1)

    const metadata_url = response
    console.log(`Metadata URL: ${metadata_url}`)

    const metadata = await fetch(metadata_url).then((res) => res.json())
    console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
