const { ethers } = require('ethers')

async function main() {
    let randomWallet = ethers.Wallet.createRandom();
    console.log(`address: ${randomWallet.address}`)
    console.log(`mnemonic: ${JSON.stringify(randomWallet.mnemonic)}`)
    console.log(`privateKey: ${randomWallet.privateKey}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });