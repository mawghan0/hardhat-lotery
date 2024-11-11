const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { networkConfig } = require("../../helper-hardhat-config")


module.exports = buildModule("RaffleModule", (m) => {
  const networkName = network.name;
  let chainId
  if (networkName == "localhost") {
    chainId = 31337
  } else if (networkName == "sepolia") {
    chainId = 11155111
  }
  const entranceFee = networkConfig[chainId]["entranceFee"];
  const subscriptionId = 1;
  const updateInterval = 1;
  const vrfconsumer = networkConfig[chainId]["vrfCoordinator"];
  const keyHash = (networkConfig[chainId]["keyHash"]);

  // const mock = m.contractAt("VRFCoordinatorV2Mock", vrfconsumer) 
  // console.log(mock.mock);
  const mockModule = m.contractAt("VRFCoordinatorV2Mock", vrfconsumer)

  console.log(mockModule.address)

  const raffle = m.contract("Raffle", [entranceFee, subscriptionId, updateInterval, vrfconsumer, keyHash], {
    entranceFee: entranceFee,
    subscriptionId: subscriptionId,
    updateInterval: updateInterval,
    vrfconsumer: vrfconsumer,
    keyHash: keyHash
  });

  return { raffle };
});