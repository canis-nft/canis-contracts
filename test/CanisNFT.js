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
    this.canisNFT = await ethers.getContractAt('CanisNFT', this.deployer)
  })

  it('Should have initialized correctly', async () => {
    //GIVEN
    console.log('EVERYTHING FINE')
    //WHEN
    //THEN
  })
})
