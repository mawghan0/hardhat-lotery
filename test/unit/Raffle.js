const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("Raffle", function () {
  async function deployContractFixture() {
    const [gambler, gambler2] = await ethers.getSigners();
    // mockContract
    const baseFee = ethers.parseEther("0.25");
    const gasPriceLink = 1e9;
    const mockContract = await ethers.deployContract("VRFCoordinatorV2Mock", [baseFee, gasPriceLink])
    await mockContract.waitForDeployment();
    // console.log(`mock contract is deployed at: ${mockContract.target}`)
    // rafleContract
    const VRF_SUB_FUND_AMOUNT = ethers.parseEther("2")
    const subscriptionId = 1;
    await mockContract.createSubscription()
    // console.log('creating subs')
    await mockContract.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    // console.log('funding subs')
    const subs = await mockContract.getSubscription(subscriptionId)
    // console.log('complete fund subs')
    console.log(subs)

    const entranceFee = ethers.parseEther("0.01");
    const updateInterval = 30;
    const keyHash = "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae";
    const vrfconsumer = mockContract.target;
    const raffleContract = await ethers.deployContract("Raffle", [entranceFee, subscriptionId, updateInterval, vrfconsumer, keyHash]);
    raffleContract.waitForDeployment()
    await mockContract.addConsumer(subscriptionId, raffleContract.target);
    return { gambler, gambler2, mockContract, raffleContract, entranceFee, updateInterval }
  }

  describe("Deployment", function () {
    it("Initializes state and interval correctly", async function () {
      const { raffleContract } = await loadFixture(deployContractFixture)
      const raffleState = await raffleContract.getRaffleState()
      const raffleInterval = await raffleContract.getInterval()
      // console.log(`state: ${raffleState}`)
      // console.log(`interval: ${raffleInterval}`)
      expect(raffleState.toString()).to.equal("0")
      expect(raffleInterval.toString()).to.equal("30")
    })
  })
  describe("enterRaffle", function () {
    it("revert when not enough pay", async function () {
      const { raffleContract } = await loadFixture(deployContractFixture)
      await expect(raffleContract.enterRaffle()).to.be.revertedWithCustomError(raffleContract, "Raffle__NotEnoughETHEntered");
    })
    it("records players when they enter", async function () {
      const { raffleContract, gambler, gambler2, entranceFee } = await loadFixture(deployContractFixture)
      await raffleContract.enterRaffle({ value: entranceFee })
      await raffleContract.connect(gambler2).enterRaffle({ value: entranceFee })
      const player1 = await raffleContract.getPlayer(0)
      const player2 = await raffleContract.getPlayer(1)
      expect(player1).to.equal(gambler)
      expect(player2).to.equal(gambler2)
    })
    it("emits an event", async function () {
      const { raffleContract, entranceFee } = await loadFixture(deployContractFixture)
      await expect(raffleContract.enterRaffle({ value: entranceFee })).to.be.emit(raffleContract, "RaffleEnter");
    })
    it("doesn't allow enter when raffle is calculating", async function () {
      const { raffleContract, entranceFee, updateInterval, mockContract } = await loadFixture(deployContractFixture)
      await raffleContract.enterRaffle({ value: entranceFee })
      await network.provider.send("evm_increaseTime", [updateInterval + 1])
      await network.provider.send("evm_mine", [])
      const subs = await raffleContract.s_subscriptionId()
      console.log(subs)
      const subsId = await mockContract.getSubscription(subs)
      console.log(subsId)
      await raffleContract.performUpkeep("0x")

      await expect(raffleContract.enterRaffle({ value: entranceFee })).to.be.revertedWithCustomError(raffleContract, "Raffle__NotOpen");
    })
  })

})