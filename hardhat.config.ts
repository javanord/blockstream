import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
require("@nomiclabs/hardhat-waffle");
const config: HardhatUserConfig = {
  paths: {
    sources: "./blockchain/contracts",
    cache: "./blockchain/cache",
    artifacts: "./blockchain/artifacts"
  },
  networks: {
    hardhat: {
      chainId: 1337,
    }
  },
  solidity: "0.8.17",
};

export default config;
