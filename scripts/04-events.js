const hre = require("hardhat");
const { ethers } = hre;

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
    console.log(`Event: ${event.event} - Block Number: ${event.blockNumber}`);
    console.log(event.args);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
