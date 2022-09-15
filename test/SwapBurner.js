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
    this.MockToken = await ethers.getContractFactory('MockToken')
    this.MockUniswapRouter = await ethers.getContractFactory('MockUniswapRouter')
    this.SwapBurner = await ethers.getContractFactory('SwapBurner')
  })

  beforeEach(async () => {
    this.UBI = await this.MockToken.deploy('UBI Token', 'UBI', '1000000000000')
    this.WETH = await this.MockToken.deploy('WRAPPED ETH', 'WETH', '1000000000000')
    this.uniswapRouter = await this.MockUniswapRouter.deploy(this.WETH.address, this.UBI.address, 2)
    this.swapBurner = await this.SwapBurner.deploy(this.uniswapRouter.address, this.UBI.address)
  })

  it('Should have initialized correctly', async () => {
    //GIVEN
    //WHEN
    //THEN
  })
})
