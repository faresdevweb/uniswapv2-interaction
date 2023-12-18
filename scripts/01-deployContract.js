const hre = require("hardhat");
const ethers = hre.ethers;
const { Contract, ContractFactory, utils, constants, log } = require("ethers");

const WETH9 = require("../WETH9.json");

const factoryArtifact = require("@uniswap/v2-core/build/UniswapV2Factory.json");
const routerArtifact = require("@uniswap/v2-periphery/build/UniswapV2Router02.json");
const pairArtifact = require("@uniswap/v2-periphery/build/IUniswapV2Pair.json");

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(
    "-----------------------------------------------------------------"
  );
  const FactoryContract = new ContractFactory(
    factoryArtifact.abi,
    factoryArtifact.bytecode,
    owner
  );
  const factory = await FactoryContract.deploy(owner.address);
  console.log("factory deployed adress: ", factory.address);
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log("Deploying ShitCoin...");
  const shitCoin = await ethers.getContractFactory("ShitCoin", owner);
  console.log("usdt deployed address: ", shitCoin.address);
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log("minting token for owner");
  await shitCoin
    .connect(owner)
    .mint(owner.address, utils.parseEther("1000000000"));
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log("create pair...");
  const tx1 = await factory.createPair(usdt.address, usdc.address);
  await tx1.wait();
  const pairAddress = await factory.getPair(usdt.address, usdc.address);
  console.log("pair address: ", pairAddress);
  const pair = new Contract(pairAddress, pairArtifact.abi, owner);
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
  console.log("Deploying WETH...");
  const Weth = new ContractFactory(WETH9.abi, WETH9.bytecode, owner);
  const weth = await Weth.deploy();
  console.log("weth deployed address: ", weth.address);
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log("Deploying UniswapV2Router02...");
  const Router = new ContractFactory(
    routerArtifact.abi,
    routerArtifact.bytecode,
    owner
  );
  const router = await Router.deploy(factory.address, weth.address);
  console.log("router deployed address: ", router.address);
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log("approve...");
  const approval1 = await usdt.approve(router.address, constants.MaxUint256);
  await approval1.wait();
  const approval2 = await usdc.approve(router.address, constants.MaxUint256);
  await approval2.wait();
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log(
    "-----------------------------------------------------------------"
  );
  console.log("add liquidity...");
  const token0Amount = utils.parseUnits("100000");
  const token1Amount = utils.parseUnits("100000");
  const deadline = Math.floor(Date.now() / 1000 + 10 * 60);
  const addLiquidityTx = await router
    .connect(owner)
    .addLiquidity(
      usdt.address,
      usdc.address,
      token0Amount,
      token1Amount,
      0,
      0,
      owner.address,
      deadline,
      {
        gasLimit: utils.hexlify(1000000),
      }
    );
  await addLiquidityTx.wait();
  console.log(
    "-----------------------------------------------------------------"
  );
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
