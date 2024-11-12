const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();  // Get the deployer's address
  console.log("Deploying contracts with the account:", deployer.address);

  // Step 1: Deploy VRFCoordinatorV2Mock contract
  console.log("Deploying VRFCoordinatorV2Mock...");
  const baseFee = ethers.parseEther("0.25");  // Example base fee
  const gasPriceLink = 1e9;  // Example gas price in LINK
  const VRFCoordinatorV2Mock = await ethers.deployContract("VRFCoordinatorV2Mock", [baseFee, gasPriceLink])
  await VRFCoordinatorV2Mock.waitForDeployment();

  console.log("VRFCoordinatorV2Mock deployed to:", VRFCoordinatorV2Mock.target);

  // Step 2: Deploy the Raffle contract with VRFCoordinatorV2Mock address
  console.log("Deploying Raffle contract...");
  const VRF_SUB_FUND_AMOUNT = ethers.parseEther("2")
  let subscriptionId = 1;
  const subsId = await VRFCoordinatorV2Mock.createSubscription()
  await subsId.wait(1)
  await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
  




  const entranceFee = ethers.parseEther("0.01");  // Example entrance fee
  // Example subscription ID
  const updateInterval = 30;  // Example update interval (30 sec)
  const keyHash = "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae";  // Replace with actual keyHash from your config
  const vrfconsumer = VRFCoordinatorV2Mock.target;

  const raffle = await ethers.deployContract("Raffle", [entranceFee, subscriptionId, updateInterval, vrfconsumer, keyHash]);

  console.log("Raffle contract deployed to:", raffle.target);
  await VRFCoordinatorV2Mock.addConsumer(subscriptionId, raffle.target)
  const tesSub = await VRFCoordinatorV2Mock.getSubscription(1);
  console.log("--------------------------------------")
  console.log(tesSub)
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
