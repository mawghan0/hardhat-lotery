const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("Raffle", function () {
  async function deployContractFixture() {
    const [gambler, gambler2, gambler3, gambler4] = await ethers.getSigners();
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
    // const subs = await mockContract.getSubscription(subscriptionId)
    // console.log('complete fund subs')
    // console.log(subs)

    const entranceFee = ethers.parseEther("0.01");
    const updateInterval = 30;
    const keyHash = "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae";
    const vrfconsumer = mockContract.target;
    const raffleContract = await ethers.deployContract("Raffle", [entranceFee, subscriptionId, updateInterval, vrfconsumer, keyHash]);
    raffleContract.waitForDeployment()
    await mockContract.addConsumer(subscriptionId, raffleContract.target);
    return { gambler, gambler2, mockContract, raffleContract, entranceFee, updateInterval, gambler3, gambler4 }
  }
})