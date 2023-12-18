const hre = require("hardhat");
const { ethers } = require("hardhat");
const { utils, constants } = ethers;

const routerArtifact = require("@uniswap/v2-periphery/build/UniswapV2Router02.json");

async function main() {
  const accounts = await ethers.getSigners();
  const account = accounts[1]; // Utilisation du deuxième compte

  console.log(
    "-----------------------------------------------------------------"
  );
  console.log("account : ", account.address);

  // Adresses des contrats USDT et USDC déployés
  const USDT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const USDC_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  // Récupérer les instances des contrats USDT et USDC
  const usdtContract = await ethers.getContractAt(
    "Tether",
    USDT_ADDRESS,
    account
  );
  const usdcContract = await ethers.getContractAt(
    "UsdCoin",
    USDC_ADDRESS,
    account
  );

  console.log("Minting tokens for account");
  await usdtContract.mint(account.address, ethers.utils.parseEther("1000000"));
  await usdcContract.mint(account.address, ethers.utils.parseEther("1000000"));

  console.log("Approving tokens for router");
  const routerAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  await usdtContract.approve(routerAddress, constants.MaxUint256);
  await usdcContract.approve(routerAddress, constants.MaxUint256);

  console.log("Adding liquidity...");
  const token0Amount = utils.parseUnits("150000", 18);
  const token1Amount = utils.parseUnits("150000", 18);
  const deadline = Math.floor(Date.now() / 1000) + 10 * 60;

  const routerContract = new ethers.Contract(
    routerAddress,
    routerArtifact.abi,
    account
  );

  const addLiquidityTx = await routerContract.addLiquidity(
    USDT_ADDRESS,
    USDC_ADDRESS,
    token0Amount,
    token1Amount,
    0, // montant minimal de token0 que vous acceptez de recevoir
    0, // montant minimal de token1 que vous acceptez de recevoir
    account.address,
    deadline
  );
  await addLiquidityTx.wait();

  console.log("Liquidity added");
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
