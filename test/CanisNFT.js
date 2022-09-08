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
    //WHEN //THEN
    await expect(this.CanisNFT.deploy(cap, tokenURI, name, symbol)).to.be.revertedWith('NFTCapped: cap is 0')
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
})
