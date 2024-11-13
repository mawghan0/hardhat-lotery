const networkConfig = {
  11155111: {
    name: "sepolia",
    vrfCoordinator: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    keyHash: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    entranceFee: ethers.parseEther("0.01")
  },
  31337: {
    name: "hardhat",
    vrfCoordinator: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    keyHash: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
    entranceFee: ethers.parseEther("0.01")
  }
}

const developmentChains = ["localhost", "hardhat"]

module.exports = { developmentChains, networkConfig };