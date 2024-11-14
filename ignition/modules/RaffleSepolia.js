const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("RaffleModule", (m) => {
  const entranceFee = ethers.parseEther("0.01")
  const subscriptionId = "12179";
  const updateInterval = "30";
  const vrfconsumer = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
  const keyHash = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c"

  const raffle = m.contract("Raffle", [entranceFee, subscriptionId, updateInterval, vrfconsumer, keyHash], {
    entranceFee: entranceFee,
    subscriptionId: subscriptionId,
    updateInterval: updateInterval,
    vrfconsumer: vrfconsumer,
    keyHash: keyHash
  });

  return { raffle };
});