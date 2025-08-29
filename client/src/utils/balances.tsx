import { ethers } from "ethers";


const ETH_RPC = "https://mainnet.infura.io/v3/f73cf42608a44a429c2c3d7e51563084"; // <-- replace with your provider (Alchemy/Infura/Ankr)

const provider = new ethers.JsonRpcProvider(ETH_RPC);

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const ERC721_ABI = ["function balanceOf(address owner) view returns (uint256)"];
//

export async function getBalances(address: string) {

  // ETH balance
  const ethBalanceWei = await provider.getBalance(address);
  const ethBalance = ethers.formatEther(ethBalanceWei);

  // ERC20 token balance
  const erc20 = new ethers.Contract(
    "0xabec00542d141bddf58649bfe860c6449807237c",
    ERC20_ABI,
    provider
  );
  const tokenBalanceRaw = await erc20.balanceOf(address);
  const decimals = await erc20.decimals();
  const symbol = await erc20.symbol();
  const tokenBalance = ethers.formatUnits(tokenBalanceRaw, decimals);

  // NFT (ERC721) balance
  const nft = new ethers.Contract(
    "0xa2D65c475c4378d6bD955FE21EF219F0199e6bA2",
    ERC721_ABI,
    provider
  );
  const nftBalance = await nft.balanceOf(address);

  return {
    ethBalance,
    tokenBalance,
    tokenSymbol: symbol,
    nftBalance: nftBalance.toString(),
  };
}