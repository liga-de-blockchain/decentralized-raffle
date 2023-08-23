import { ethers } from "hardhat";

async function main() {


  const raffler = await ethers.deployContract("RaffleContract", ["0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625", 
    "2828", ["João", "Nasser", "Testa", "Gi", "Dias"]]);

  await raffler.waitForDeployment();

  console.log(
    `deployed in ${await raffler.getAddress()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
