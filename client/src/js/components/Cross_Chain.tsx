import { EVM, BTC } from "@kynesyslabs/demosdk/xm-websdk";
import { disconnect } from "process";

enum ChainType {
  EVM,
  BTC,
  SOL,
  APTOS,
}

export var currentChainType: ChainType = ChainType.EVM;
const evm_rpc = "https://sepolia.infura.io/v3/YOUR-PROJECT-ID";

export const getInstance = async (rpc_url: string) => {
  const instance: any = null;
  switch (currentChainType) {
    case ChainType.EVM:
      const rpc_url = evm_rpc;
      const instance = await EVM.create(rpc_url);

      break;
    case ChainType.BTC:
    case ChainType.SOL:
    case ChainType.APTOS:
  }

  return instance;
};

export const connectWallet = async (instance: any, privateKey: any) => {
  await instance.connectWallet(privateKey);
  return instance;
};

export const disconnectWallet = async (instance: any) => {
  await instance.disconnect();
};

export const getAddress = async (instance: any) => {
  const address = instance.getAddress();
  console.log(`Address: ${address}`);
  return address;
};

export const getBalance = async (address: any, instance: any) => {
  const balance = await instance.getBalance(address);
  console.log(`Balance: ${balance} ETH`);
  return balance;
};

export const makeTransfer = async (
  recipientAddress: any,
  amount: string,
  instance: any,
) => {
  const signedTx = await instance.preparePay(recipientAddress, amount);
};
