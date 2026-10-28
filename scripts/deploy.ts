import hre from "hardhat";

const { ethers, network } = hre;

async function main() {
  console.log(`Starting deployment of Wave contract on network: ${network.name} (chainId: ${network.config.chainId})...`);

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer account configured. Please set PRIVATE_KEY in .env");
  }

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deploying with account: ${deployer.address}`);
  console.log(`Account balance: ${ethers.formatEther(balance)} tBOT`);

  const WaveFactory = await ethers.getContractFactory("Wave");
  const wave = await WaveFactory.deploy();

  await wave.waitForDeployment();
  const waveAddress = await wave.getAddress();

  console.log("\n==================================================");
  console.log(`🎉 Wave contract successfully deployed!`);
  console.log(`Contract Address: ${waveAddress}`);
  console.log(`Network: ${network.name}`);
  console.log(`Explorer: https://scan.bohr.life/address/${waveAddress}`);
  console.log("==================================================\n");
  console.log(`Action Required:`);
  console.log(`Add this contract address to your .env.local file:`);
  console.log(`NEXT_PUBLIC_WAVE_CONTRACT_ADDRESS=${waveAddress}\n`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
