//require("dotenv").config();
//
///** @type import('hardhat/config').HardhatUserConfig */
//module.exports = {
//  solidity: "0.8.19",
//  networks: {
//    hardhat: {
//      forking: {
//        url: `${process.env.MAINNET}`,
//      },
//    },
//  },
//};

require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
        details: { yul: false },
      },
    },
  },
};
