const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("RaffleModule", (m) => {
  const entranceFee = 1;
  const subscriptionId = "";
  const updateInterval = 1;

  const raffle = m.contract("Raffle", [entranceFee, subscriptionId, updateInterval], {
    entranceFee: lockedAmount,
    subscriptionId: lockedAmount,
    updateInterval: lockedAmount,
  });

  return { raffle };
});