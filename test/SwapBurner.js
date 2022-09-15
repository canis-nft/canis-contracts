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
    const expectedUniswapAddress = this.uniswapRouter.address
    const expectedUBIToken = this.UBI.address
    const expectedOwner = this.deployer
    //WHEN
    const uniswapRouter = await this.swapBurner.Uniswap()
    const ubiToken = await this.swapBurner.UBI()
    const owner = await this.swapBurner.owner()
    //THEN
    expect(expectedUniswapAddress).to.be.equal(uniswapRouter)
    expect(expectedUBIToken).to.be.equal(ubiToken)
    expect(owner).to.be.equal(this.deployer)
  })

  it('Should be able to approve UniswapRouter', async () => {
    //GIVEN
    const initialAllowance = await this.UBI.allowance(this.swapBurner.address, this.uniswapRouter.address)
    const allowance = '1000000'
    //WHEN
    await this.swapBurner.approveUniSwap(allowance)
    const finalAllowance = await this.UBI.allowance(this.swapBurner.address, this.uniswapRouter.address)
    //THEN
    expect(initialAllowance).to.be.equal(0)
    expect(finalAllowance).to.be.equal(allowance)
  })

  it('Should be able to increase allowance to UniswapRouter', async () => {
    //GIVEN
    const allowance = '1000000'
    await this.swapBurner.approveUniSwap(allowance)
    const initialAllowance = await this.UBI.allowance(this.swapBurner.address, this.uniswapRouter.address)
    const toAddAllowance = '50'
    //WHEN
    await this.swapBurner.increaseUniswapAllowance(toAddAllowance)
    const finalAllowance = await this.UBI.allowance(this.swapBurner.address, this.uniswapRouter.address)
    //THEN
    expect(initialAllowance).to.be.equal(allowance)
    expect(finalAllowance).to.be.equal('1000050')
  })

  it('Should be able to decrease allowance to UniswapRouter', async () => {
    //GIVEN
    const allowance = '1000050'
    await this.swapBurner.approveUniSwap(allowance)
    const initialAllowance = await this.UBI.allowance(this.swapBurner.address, this.uniswapRouter.address)
    const toDecreaseAllowance = '50'
    //WHEN
    await this.swapBurner.decreaseUniswapAllowance(toDecreaseAllowance)
    const finalAllowance = await this.UBI.allowance(this.swapBurner.address, this.uniswapRouter.address)
    //THEN
    expect(initialAllowance).to.be.equal(allowance)
    expect(finalAllowance).to.be.equal('1000000')
  })

  it('Should be able to receive ether, swap and burn UBI tokens', async () => {
    //GIVEN
    //WHEN
    //THEN
  })
})
