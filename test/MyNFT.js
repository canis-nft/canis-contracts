const {expect, assert} = require('chai')

describe('MyNFT', function () {
  beforeEach(async function () {
    const [owner, otherAccount] = await ethers.getSigners()

    this.MyNFT = await ethers.getContractFactory('MyNFT')
    this.MyNFT = await this.MyNFT.deploy()
    await this.MyNFT.deployed()
  })

  it('nnn', async function () {})
})
