const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MockModule", (m) => {
  const baseFee = ethers.parseEther("0.25");
  const gasPriceLink = 1e9;

  const mock = m.contract("VRFCoordinatorV2Mock", [baseFee, gasPriceLink,], {
    baseFee: baseFee,
    gasPriceLink: gasPriceLink,
  });

  return { mock };
});