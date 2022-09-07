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

  it('Should be able to mint', async () => {
    //GIVEN
    const aliceInitialBalance = await this.canisNFT.balanceOf(this.alice.address)
    //WHEN
    const tokenId = await this.canisNFT.connect(this.alice).safeMint()
    const aliceFinalBalance = await this.canisNFT.balanceOf(this.alice.address)
    //THEN
    expect(aliceInitialBalance).to.be.equal(0)
  })

  xit('Should be able to get tokenUri once token was minted', async () => {})

  xit('Should not mint if user has already one nft', async () => {})

  xit('Should not be able to mint once gap limit is reached', async () => {})
})
