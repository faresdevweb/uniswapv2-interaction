const hre = require("hardhat");
const { ethers } = hre;

const ERC20_ABI =
  require("@openzeppelin/contracts/build/contracts/ERC20.json").abi;

async function main() {
  const [owner] = await ethers.getSigners();

  const USDT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const USDC_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  // ABI du contrat ERC20 (standard pour les fonctions comme balanceOf)

  // Créer une instance du contrat USDT pour interagir avec
  const usdtContract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, owner);

  // Créer une instance du contrat USDC pour interagir avec
  const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, owner);

  // Obtenir le solde de USDT de l'utilisateur
  const ownerUSDTBalance = await usdtContract.balanceOf(owner.address);
  console.log(
    `Solde USDT: ${ethers.utils.formatEther(ownerUSDTBalance, 6)} USDT`
  );

  // Obtenir le solde de USDC de l'utilisateur
  const ownerUSDCBalance = await usdcContract.balanceOf(owner.address);
  console.log(
    `Solde USDC: ${ethers.utils.formatEther(ownerUSDCBalance, 6)} USDC`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
