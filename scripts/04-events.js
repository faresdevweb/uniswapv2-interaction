const hre = require("hardhat");
const { ethers } = hre;
const { BigNumber } = ethers;

async function main() {
  const PAIR_ADDRESS = "0x9382988a9BC661ecCc69DEAe72ff92847eD38052";

  // Importer l'ABI du contrat de Pair Uniswap
  const PAIR_ABI =
    require("@uniswap/v2-periphery/build/IUniswapV2Pair.json").abi;

  // Initialiser le contrat de la Pair
  const pairContract = new ethers.Contract(
    PAIR_ADDRESS,
    PAIR_ABI,
    ethers.provider
  );

  // Récupérer les événements depuis le début
  const allEvents = await pairContract.queryFilter("*", 0, "latest");

  allEvents.forEach((event) => {
    console.log(
      "-----------------------------------------------------------------"
    );
    console.log(`Event: ${event.event} - Block Number: ${event.blockNumber}`);
    Object.entries(event.args).forEach(([key, value]) => {
      if (BigNumber.isBigNumber(value)) {
        // Format pour les valeurs BigNumber, supposant 18 décimales
        console.log(`${key}: ${ethers.utils.formatUnits(value, 18)}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });
  });
  console.log(
    "-----------------------------------------------------------------"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
