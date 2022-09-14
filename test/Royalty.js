/* eslint-disable no-undef */
const { expect } = require('chai')
const { ethers, deployments, getNamedAccounts } = require('hardhat')

/**
 * By default, ContractFactory and Contract instances are connected to the first signer.
 */

async function sendEtherTo(signer, amountInEther, to) {
  const tx = await signer.sendTransaction({
    to: to,
    value: ethers.utils.parseEther(amountInEther),
    gasLimit: 50000
  })
}

describe('Royalty', function () {
  before(async () => {
    const signers = await ethers.getSigners()
    const { deployer, royaltyReceiver } = await getNamedAccounts()
    this.deployer = deployer
    this.royaltyReceiver = royaltyReceiver
    this.Royalty = await ethers.getContractFactory('Royalty')
  })

  beforeEach(async () => {
    await deployments.fixture(['Royalty'])
    this.royalty = await ethers.getContract('Royalty', this.deployer)
  })

  it('Should have initialized correctly', async () => {
    //GIVEN
    const expectedOwner = this.deployer
    const expectedRoyaltyReceiver = this.royaltyReceiver
    //WHEN
    const owner = await this.royalty.owner()
    const royaltyReceiver = await this.royalty.royaltyReceiver()
    //THEN
    expect(owner).to.be.equal(expectedOwner)
    expect(royaltyReceiver).to.be.equal(expectedRoyaltyReceiver)
  })

  it('Should receive ether', async () => {
    //GIVEN
    const signers = await ethers.getSigners()
    nftMarketPlace = signers[1]
    let amountInEther = '0.02'
    await sendEtherTo(nftMarketPlace, amountInEther, this.royalty.address)
    const balance = await ethers.provider.getBalance(this.royalty.address)
    //THEN
    expect(amountInEther).to.be.equal(ethers.utils.formatEther(balance))
  })

  it('Should execute shareout splitter owner', async () => {
    //GIVEN
    const signers = await ethers.getSigners()
    nftMarketPlace = signers[1]
    let amountInEther = '0.04'
    await sendEtherTo(nftMarketPlace, amountInEther, this.royalty.address)
    const royaltyReceiver = await this.royalty.royaltyReceiver()

    //WHEN //THEN
    await expect(this.royalty.shareout())
      .to.emit(this.royalty, 'ShareoutExecuted')
      .withArgs(ethers.utils.parseEther(amountInEther))

    const balance = ethers.utils.formatEther(await ethers.provider.getBalance(royaltyReceiver))
    expect(balance).to.be.equal(amountInEther)
    expect('0.0').to.be.equal(ethers.utils.formatEther(await ethers.provider.getBalance(this.royalty.address)))
  })

  it('Should execute shareout splitter no-owner', async () => {
    //GIVEN
    const signers = await ethers.getSigners()
    const nftMarketPlace = signers[1]
    const sender = signers[2]
    let amountInEther = '0.06'
    const royaltyContract = await ethers.getContract('Royalty', sender)
    await sendEtherTo(nftMarketPlace, amountInEther, royaltyContract.address)
    //WHEN //THEN
    await expect(royaltyContract.shareout()).to.be.revertedWith("Ownable: caller is not the owner")
  })

  it('Should execute shareout splitter without balance', async () => {
    //GIVEN
    const signers = await ethers.getSigners()
    let amountInEther = '0.06'
    //WHEN //THEN
    await expect(this.royalty.shareout()).to.be.revertedWith("There is not available founds to transfer")
  })

  it('Should be able to change royalty receiver owner', async () => {
    //GIVEN
    const signers = await ethers.getSigners()
    const owner = await this.royalty.owner();
    const newowner = signers[1].address
    //WHEN //THEN
    await expect(this.royalty.transferOwnership(newowner))
      .to.emit(this.royalty, 'OwnershipTransferred')
      .withArgs(owner, newowner)

    expect(newowner).to.be.equal(await this.royalty.owner())

  })

  it('Should not be able to change royalty receiver no-owner', async () => {
    //GIVEN
    const signers = await ethers.getSigners()
    const owner = signers[1]
    const newoner = signers[2]
    const royaltyContract = await ethers.getContract('Royalty', owner)
    //WHEN //THEN
    await expect(royaltyContract.transferOwnership(newoner.address)).to.be.revertedWith("Ownable: caller is not the owner")
  })

  it('Should be able to get balance', async () => {
    //GIVEN
    const balance = await ethers.provider.getBalance(this.royalty.address)
    const expectedBalance = '0.0'
    //THEN
    expect(expectedBalance).to.be.equal(ethers.utils.formatEther(balance))
  })

})
