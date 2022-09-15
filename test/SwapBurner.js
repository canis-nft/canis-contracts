/* eslint-disable no-undef */
const {expect} = require('chai')
const {ethers, deployments, getNamedAccounts} = require('hardhat')

describe('Swap Burner', function () {
  before(async () => {
    const signers = await ethers.getSigners()
    const {deployer} = await getNamedAccounts()
    this.deployer = deployer
    this.alice = signers[1]
    this.bob = signers[2]
    this.charly = signers[3]
    this.MockUBI = await ethers.getContractFactory('MockUBI')
    this.MockUniswapRouter = await ethers.getContractFactory('MockUniswapRouter')
    this.SwapBurner = await ethers.getContractFactory('SwapBurner')
  })

  beforeEach(async () => {
    this.UBIToken = await this.MockUBI.deploy()
    this.UniswapRouter = await this.MockUniswapRouter.deploy()
    this.canisNFT = await ethers.getContract('CanisNFT', this.deployer)
  })

  it('Should have initialized correctly', async () => {})
})
