const hre = require("hardhat");
const { ethers } = hre;

const PAIR_ABI = require("@uniswap/v2-periphery/build/IUniswapV2Pair.json").abi;

async function main() {
  console.log(
    "-----------------------------------------------------------------"
  );
  const [owner] = await ethers.getSigners();
  const PAIR_ADDRESS = "0x9382988a9BC661ecCc69DEAe72ff92847eD38052";

  // Importer l'ABI du contrat de Pair Uniswap

  // Initialiser le contrat de la Pair
  const pairContract = new ethers.Contract(PAIR_ADDRESS, PAIR_ABI, owner);

  const reserves = await pairContract.getReserves();
  const reserveUSDT = ethers.utils.formatUnits(reserves.reserve0, 18); // Convertir en unités lisibles
  const reserveUSDC = ethers.utils.formatUnits(reserves.reserve1, 18);

  const price1USDTinUSDC = reserveUSDC / reserveUSDT;
  const price1USDCinUSDT = reserveUSDT / reserveUSDC;

  console.log("Prix 1 USDT en USDC : ", price1USDTinUSDC);
  console.log("Prix 1 USDC en USDT : ", price1USDCinUSDT);
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
