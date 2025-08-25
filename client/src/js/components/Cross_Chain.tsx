import { EVM } from "@kynesyslabs/demosdk/xm-websdk";

export const getInstance = async (rpc_url: string) => {
  const instance = await EVM.create(rpc_url);
};

export const getAddress = async (privateKey: any, instance: any) => {
  await instance.connectWallet(privateKey);
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



