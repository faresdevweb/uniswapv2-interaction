const hre = require("hardhat");
const { ethers } = hre;
const { utils, constants } = require("ethers");

async function main() {
  const [owner] = await ethers.getSigners();

  // Remplacer par les adresses de vos contrats déployés
  const USDT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const USDC_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const ROUTER_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  const PAIR_ADDRESS = "0x9382988a9BC661ecCc69DEAe72ff92847eD38052";
  const IUniswapV2Pair = require("@uniswap/v2-periphery/build/IUniswapV2Pair.json");
  const PAIR_ABI = IUniswapV2Pair.abi;

  const pair = new ethers.Contract(PAIR_ADDRESS, PAIR_ABI, owner);

  // Importer l'ABI du Router Uniswap V2
  const UNISWAP_ROUTER_ABI =
    require("@uniswap/v2-periphery/build/UniswapV2Router02.json").abi;

  // Initialiser le contrat du Router
  const router = new ethers.Contract(ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, owner);

  // Montant à échanger
  const amountIn = utils.parseUnits("1000", 6);
  const amountOutMin = 0;

  // Deadline de la transaction
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

  // Effectuer le swap USDT vers USDC
  const tx = await router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    [USDT_ADDRESS, USDC_ADDRESS],
    owner.address,
    deadline
  );

  await tx.wait();

  console.log("tx", tx);

  console.log(`Swap effectué avec succès!`);

  console.log(
    "-----------------------------------------------------------------"
  );
  console.log("check reserve");
  let reserves;
  reserves = await pair.getReserves();
  console.log("reserve: ", reserves);
  // Accéder aux valeurs des réserves
  console.log("USDT Liquidity : ", ethers.utils.formatEther(reserves.reserve0));
  console.log("USDC Liquidity : ", ethers.utils.formatEther(reserves.reserve1));
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
