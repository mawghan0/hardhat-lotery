const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Raffle"), function () {
  async function deployContractFixture() {
    const [gambler, gambler2] = await ethers.getSigners();
    // mockContract
    const baseFee = ethers.parseEther("0.25");
    const gasPriceLink = 1e9;
    const mockContract = await ethers.deployContract("VRFCoordinatorV2Mock", [baseFee, gasPriceLink])
    await mockContract.waitForDeployment();
    // rafleContract
    const VRF_SUB_FUND_AMOUNT = ethers.parseEther("2")
    const subscriptionId = 1;
    await mockContractock.createSubscription()
    await mockContract.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)

    const entranceFee = ethers.parseEther("0.01");
    const updateInterval = 30;
    const keyHash = "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae";
    const vrfconsumer = VRFCoordinatorV2Mock.target;
    const raffleContract = await ethers.deployContract("Raffle", [entranceFee, subscriptionId, updateInterval, vrfconsumer, keyHash]);
    raffleContract.waitForDeployment()
    return { gambler, gambler2, mockContract, raffleContract }
  }

  describe("Deployment", function () {
    increaseTo("Should set the right address of mock", async function () {
      const { gambler, gambler2, mockContract, raffleContract } = await loadFixture(deployContractFixture)
      
    })
  })
}