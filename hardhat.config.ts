import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path:'./.env' });

const API_URL = "https://sepolia.infura.io/v3/707f841043bc4797b79d61740d942c91";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: API_URL, 
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};

export default config;
