/* eslint-disable no-undef */
const {expect} = require('chai')
const {ethers, deployments, getNamedAccounts} = require('hardhat')

/**
 * By default, ContractFactory and Contract instances are connected to the first signer.
 */
describe('Canis NFT', function () {
  before(async () => {
    const signers = await ethers.getSigners()
    const {deployer} = await getNamedAccounts()
    this.deployer = deployer
    this.owner = signers[0]
    this.alice = signers[1]
    this.bob = signers[2]
    this.charly = signers[3]
    this.royaltyReceiver = signers[4]
    this.CanisNFT = await ethers.getContractFactory('CanisNFT')
  })

  beforeEach(async () => {
    await deployments.fixture(['CanisNFT'])
    this.canisNFT = await ethers.getContract('CanisNFT', this.deployer)
  })

  it('Should have initialized correctly', async () => {
    //GIVEN
    const expectedName = 'CanisNFT'
    const expectedSymbol = 'CAN'
    const expectedTokenSupply = '3'
    const expectedTokenURI =
      'https://bafybeiahsj6so2jofeadwprofvphxo6g5d662xwzolztg6xgs3g4qa4vvi.ipfs.nftstorage.link/metadata/'
    const expectedOwner = this.deployer
    //WHEN
    const name = await this.canisNFT.name()
    const symbol = await this.canisNFT.symbol()
    const tokenSupply = await this.canisNFT.CAP()
    const baseTokenUri = await this.canisNFT.baseTokenUri()
    const owner = await this.canisNFT.owner()
    //THEN
    expect(name).to.be.equal(expectedName)
    expect(symbol).to.be.equal(expectedSymbol)
    expect(tokenSupply).to.be.equal(expectedTokenSupply)
    expect(baseTokenUri).to.be.equal(expectedTokenURI)
    expect(owner).to.be.equal(expectedOwner)
  })

  it('Should not create contract if cap is zero', async () => {
    //GIVEN
    const name = 'CanisNFT'
    const symbol = 'CAN'
    const cap = 0
    const tokenURI = ''
    const royaltyReciever = this.deployer
    const feeNumerator = 10
    //WHEN //THEN
    await expect(this.CanisNFT.deploy(cap, tokenURI, name, symbol, royaltyReciever, feeNumerator)).to.be.revertedWith(
      'NFTCapped: cap is 0'
    )
  })

  it('Should be able to mint', async () => {
    //GIVEN
    const aliceInitialBalance = await this.canisNFT.balanceOf(this.alice.address)
    //WHEN
    await expect(this.canisNFT.connect(this.alice).safeMint())
      .to.emit(this.canisNFT, 'Transfer')
      .withArgs(ethers.constants.AddressZero, this.alice.address, 1)
    const aliceFinalBalance = await this.canisNFT.balanceOf(this.alice.address)
    //THEN
    expect(aliceInitialBalance).to.be.equal(0)
    expect(aliceFinalBalance).to.be.equal(1)
  })

  it('Should revert to get a not minted tokenUri', async () => {
    //GIVEN
    const bobInitialBalance = await this.canisNFT.balanceOf(this.bob.address)
    expect(bobInitialBalance).to.be.equal(0)
    //WHEN //THEN
    await expect(this.canisNFT.connect(this.bob).tokenURI(2)).to.be.revertedWith('ERC721: invalid token ID')
  })

  it('Should be able to get tokenUri once token was minted', async () => {
    //GIVEN
    const expectedBaseTokenURI =
      'https://bafybeiahsj6so2jofeadwprofvphxo6g5d662xwzolztg6xgs3g4qa4vvi.ipfs.nftstorage.link/metadata/'
    const bobInitialBalance = await this.canisNFT.balanceOf(this.bob.address)
    //WHEN
    await this.canisNFT.connect(this.alice).safeMint()
    await this.canisNFT.connect(this.bob).safeMint()
    const bobFinalBalance = await this.canisNFT.balanceOf(this.bob.address)
    const bobTokenURI = await this.canisNFT.tokenURI(2)
    //THEN
    expect(bobInitialBalance).to.be.equal(0)
    expect(expectedBaseTokenURI + '2').to.be.equal(bobTokenURI)
    expect(bobFinalBalance).to.be.equal(1)
  })

  it('Should not mint if user has already one nft', async () => {
    //GIVEN
    await this.canisNFT.connect(this.alice).safeMint()
    const aliceBalance = await this.canisNFT.balanceOf(this.alice.address)
    //WHEN
    expect(aliceBalance).to.be.equal(1)
    //THEN
    await expect(this.canisNFT.connect(this.alice).safeMint()).to.be.revertedWith(
      'CANISNFT: OWNER CANNOT HAVE MORE THAN ONE NFT'
    )
  })

  it('Should not be able to mint once gap limit is reached', async () => {
    //GIVEN
    await this.canisNFT.connect(this.alice).safeMint()
    await this.canisNFT.connect(this.bob).safeMint()
    await this.canisNFT.connect(this.charly).safeMint()
    //WHEN
    const aliceBalance = await this.canisNFT.balanceOf(this.alice.address)
    const bobBalance = await this.canisNFT.balanceOf(this.bob.address)
    const charlyBalance = await this.canisNFT.balanceOf(this.charly.address)
    //THEN
    expect(aliceBalance).to.be.equal(1)
    expect(bobBalance).to.be.equal(1)
    expect(charlyBalance).to.be.equal(1)
    await expect(this.canisNFT.safeMint()).to.be.revertedWith('NFTCAPPED: cap exceeded')
  })

  it('Should be able to change owner', async () => {
    //GIVEN
    const currentOwner = await this.canisNFT.owner()
    const newOwner = this.owner.address
    //WHEN
    await this.canisNFT.transferOwnership(newOwner)
    const expectedNewOwner = await this.canisNFT.owner()
    //THEN
    expect(currentOwner).to.be.equal(this.deployer)
    expect(newOwner).to.be.equal(expectedNewOwner)
  })

  it('Should set default token royalty', async () => {
    //GIVEN
    const royaltyReceiver = this.royaltyReceiver.address
    const feeNumerator = 100
    //WHEN //THEN
    await expect(this.canisNFT.setDefaultRoyalty(royaltyReceiver, feeNumerator))
      .to.emit(this.canisNFT, 'DefaultRoyaltyUpdated')
      .withArgs(royaltyReceiver, feeNumerator)
  })

  it('If not set, royalty info should return constructor values', async () => {
    //GIVEN //WHEN
    const tokenId = 0
    const salePrice = 1000
    const {receiver, royaltyAmount} = await this.canisNFT.royaltyInfo(tokenId, salePrice)
    //THEN
    expect(receiver).to.be.equal(this.deployer)
    expect(royaltyAmount).to.be.equal(0)
  })

  it('Should be able to get default token royalty for a non-minted token', async () => {
    //GIVEN
    const expectedRoyaltyReceiver = this.royaltyReceiver.address
    const expectedFeeNumerator = '10'
    await this.canisNFT.setDefaultRoyalty(expectedRoyaltyReceiver, expectedFeeNumerator)
    //WHEN
    const tokenId = 0
    const salePrice = 1000
    const {receiver, royaltyAmount} = await this.canisNFT.royaltyInfo(tokenId, salePrice)
    //THEN
    expect(receiver).to.be.equal(expectedRoyaltyReceiver)
    expect(royaltyAmount).to.be.equal('1')
  })

  it('Should be able to get token default royalty for minted token', async () => {
    //GIVEN
    await this.canisNFT.connect(this.alice).safeMint()
    const salePrice = 10
    //WHEN
    const {receiver, royaltyAmount} = await this.canisNFT.royaltyInfo(0, salePrice)
    //THEN
    expect(receiver).to.be.equal(this.deployer)
    expect(royaltyAmount).to.be.equal('0')
  })

  it('Should be able to set custom royalty', async () => {
    //GIVEN
    const defaultRoyaltyReceiver = this.deployer
    const customRoyaltyReceiver = this.royaltyReceiver.address
    const customFeeNumerator = 10
    const salePrice = 1000
    //WHEN
    const {receiver: defaultReceiver, royaltyAmount: defaultRoyaltyAmount} = await this.canisNFT.royaltyInfo(
      1,
      salePrice
    )
    await this.canisNFT.setTokenRoyalty(0, customRoyaltyReceiver, customFeeNumerator)
    const {receiver: customReceiver, royaltyAmount: customRoyalty} = await this.canisNFT.royaltyInfo(0, salePrice)
    //THEN
    expect(defaultReceiver).to.be.equal(defaultRoyaltyReceiver)
    expect(defaultRoyaltyAmount).to.be.equal(0)
    expect(customReceiver).to.be.equal(customRoyaltyReceiver)
    expect(customRoyalty).to.be.equal(1)
  })

  it('Should be able to reset token royalty for a token', async () => {
    //GIVEN
    const {receiver: initialRoyaltyReceiver, royaltyAmount: initialRoyaltyAmount} = await this.canisNFT.royaltyInfo(
      0,
      10
    )
    await this.canisNFT.setTokenRoyalty(0, this.royaltyReceiver.address, '10')
    const {receiver: updatedRoyaltyReceiver, royaltyAmount: updatedRoyaltyAmount} = await this.canisNFT.royaltyInfo(
      0,
      1000
    )
    //WHEN
    await this.canisNFT.resetTokenRoyalty(0)
    const {receiver: finalRoyaltyReceiver, royaltyAmount: finalRoyaltyAmount} = await this.canisNFT.royaltyInfo(0, 1000)
    //THEN
    expect(initialRoyaltyReceiver).to.be.equal(this.deployer)
    expect(initialRoyaltyAmount).to.be.equal(0)
    expect(updatedRoyaltyReceiver).to.be.equal(this.royaltyReceiver.address)
    expect(updatedRoyaltyAmount).to.be.equal(1)
    expect(finalRoyaltyReceiver).to.be.equal(initialRoyaltyReceiver)
    expect(finalRoyaltyAmount).to.be.equal(initialRoyaltyAmount)
  })

  it('Should not have a default value for contractUri', async () => {
    //GIVEN
    //WHEN
    const value = await this.canisNFT.contractURI()
    //THEN
    expect(value.length).to.be.equal(0)
  })

  it('Should return setted value for contractUri', async () => {
    //GIVEN
    const contractUri = 'https://ipfs.io/ipfs/QmbBXi3zGaFZ4S2cAea56cGhpD6eSRNL9b6BCUnrTpukT6'
    //WHEN //THEN
    await expect(this.canisNFT.setContractURI(contractUri))
      .to.emit(this.canisNFT, 'ContractURIUpdated')
      .withArgs(contractUri)
  })
})
