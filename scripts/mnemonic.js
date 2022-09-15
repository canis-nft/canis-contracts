const { ethers } = require('ethers')

async function main() {

    let mnemonic = "radar blur cabbage chef fix engine embark joy scheme fiction master release";
    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);

    console.log(`address: ${mnemonicWallet.address}`)
    console.log(`mnemonic: ${JSON.stringify(mnemonicWallet.mnemonic)}`)
    console.log(`privateKey: ${mnemonicWallet.privateKey}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });