const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { abi, contractAddress } = require("./constant")
require("dotenv/config")

describe("Raffle", function () {
  const PRIVATE_KEY = process.env.PRIVATE_KEY
  const INFURA_API_KEY = process.env.INFURA_API_KEY
  it("Initializes all", async function () {
    const provider = new ethers.JsonRpcProvider(`https://rpc.sepolia.org`)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const raffleSepoliaContract = new ethers.Contract(
      contractAddress,
      abi,
      wallet
    );
    // console.log(raffleSepoliaContract.interface)

    const raffleEntranceFee = await raffleSepoliaContract.getEntranceFee()
    const startingTimeStamp = await raffleSepoliaContract.getLatestTimeStamp()
    console.log(`entranceFee: ${raffleEntranceFee})`)
    console.log(`startingTimeStamp: ${startingTimeStamp}`)

    await new Promise(async (resolve, reject) => {
      raffleSepoliaContract.once("WinnerPicked", async () => {
        try {
          const recentWinner = await raffleSepoliaContract.getRecentWinner()
          console.log(`winner: ${recentWinner}`)
          const raffleState = await raffleSepoliaContract.getRaffleState()
          const endingTimeStamp = await raffleSepoliaContract.getLastTimeStamp()
          await expect(raffleSepoliaContract.getPlayer(0)).to.be.reverted
          expect(raffleState.toString()).to.be.equal("0")
          expect(startingTimeStamp).to.be.below(endingTimeStamp)
          resolve()
        } catch (error) {
          console.log(error)
          reject(error)
        }
      })
      console.log("Entering Raffle...")
      await raffleSepoliaContract.enterRaffle({ value: raffleEntranceFee })

      console.log("Ok, time to wait...")
    })
  })
})
