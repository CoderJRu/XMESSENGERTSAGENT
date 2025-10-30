import { EVM, BTC, TON, XRPL, NEAR, IBC } from "@kynesyslabs/demosdk/xm-websdk";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { clusterApiUrl } from "@solana/web3.js";
import { SOLANA } from "@kynesyslabs/demosdk/xm-websdk";
import { Network } from "@aptos-labs/ts-sdk";
import { APTOS } from "@kynesyslabs/demosdk/xmcore";
import { XMScript } from "@kynesyslabs/demosdk/types";
import { prepareXMPayload } from "@kynesyslabs/demosdk/websdk";
import * as bIP_39 from "./BIP39Handle.tsx";
export enum ChainType {
  EVM,
  BTC,
  SOL,
  APTOS,
  _TON,
  XRPL,
  IBC,
  NEAR,
}

export var currentChainType: ChainType = ChainType.EVM;
export function setChainType(chain: ChainType) {
  currentChainType = chain;
  console.log("🔄 Chain switched to:", ChainType[chain]);
}
//const evm_rpc = "https://sepolia.infura.io/v3/YOUR-PROJECT-ID";
const btc_rpc = "/api/btc/";
const network = BTC.networks.bitcoin;
const testnet = clusterApiUrl("testnet");
const xrp_rpc_url = "wss://s.altnet.rippletest.net/";
//"wss://xrplcluster.com"//"wss://s.altnet.rippletest.net/"//"wss://s.altnet.rippletest.net:51233";
const with_reconnect = false;
const ibc_rpc_url = "https://rpc.elgafar-1.stargaze-apis.com";
const near_rpc_url = "https://rpc.testnet.near.org";
const networkId = "testnet";
// const devnet = clusterApiUrl("devnet")
// const mainnet = clusterApiUrl("mainnet-beta")

export const getInstance = async (rpc_url: string) => {
  var instance: any = null;
  switch (currentChainType) {
    case ChainType.EVM:
      instance = await EVM.create(rpc_url);
      break;
    case ChainType.BTC:
      rpc_url = btc_rpc;
      instance = await BTC.create(rpc_url, network);
      break;
    case ChainType.SOL:
      rpc_url = testnet;
      instance = await SOLANA.create(rpc_url);
      break;
    case ChainType.APTOS:
      // Initialize with network
      const aptos = new APTOS("", Network.DEVNET);
      // Using a custom RPC endpoint
      // new APTOS("https://custom-aptos-rpc.com", Network.DEVNET)
      instance = aptos;
      break;
    case ChainType._TON:
      // Get the rpc url
      const endpoint = await getHttpEndpoint({
        network: "testnet",
      });
      instance = await TON.create(endpoint);
      break;
    case ChainType.XRPL:
      instance = new XRPL(xrp_rpc_url);
      await instance.connect(with_reconnect);
      break;
    case ChainType.IBC:
      instance = await IBC.create(ibc_rpc_url);
      break;
    case ChainType.NEAR:
      instance = await NEAR.create(near_rpc_url);
      break;
  }

  return instance;
};

export const connectWallet = async (instance: any, privateKey: any) => {
  await instance.connectWallet(privateKey);
  return instance;
};

export const connectIBCWallet = async (
  instance: any,
  privateKey: any,
  mnemonic: any,
) => {
  await instance.connectWallet(mnemonic, {
    prefix: "stars",
    gasPrice: "0.012ustars",
  });
  return instance;
};

export const connectNEARWallet = async (instance: any, privateKey: any) => {
  await instance.connectWallet(privateKey, {
    accountId: "cwilvx.testnet",
  });
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
  demos: any,
) => {
  const tx = await instance.preparePay(recipientAddress, amount);
  const signedTx = await demos.sign(tx);
  console.log("signed tx: ", signedTx);
};

export const makeIBCTransfer = async (
  instance: any,
  address: string,
  amount: string,
  demos: any,
) => {
  const tx = await instance.preparePay(address, amount, {
    denom: "ustars",
  });
  //
  const signedTx = await demos.sign(tx);
  console.log("signed tx: ", signedTx);
};

export const makeTONTransfer = async (
  address: string,
  amount: string,
  instance: any,
  demos: any,
) => {
  const tx = await instance.prepareTransfer(address, amount);
  const signedTx = await demos.sign(tx);
  console.log("signed tx: ", signedTx);
};

export const makeAPTOSTransfer = async (
  aptos: any,
  demos: any,
  recipient: string,
  amount: string,
) => {
  // Get the signed tx as hex string
  const tx = aptos.preparePay(recipient, amount);

  // Broadcast the tx
  const payload: XMScript = {
    operations: {
      aptos_pay: {
        chain: "aptos",
        subchain: "devnet",
        is_evm: false,
        rpc: null,
        task: {
          signedPayloads: [tx],
          params: null,
          type: "pay",
        },
      },
    },
    operations_order: ["aptos_pay"],
  };

  // Create the Demos tx
  const demostx = await prepareXMPayload(payload, demos);
  console.log("tx", demostx);

  // Validate Demos tx
  const validityData = await demos.confirm(demostx);
  console.log("validityData", validityData);

  // Broadcast
  const res = await demos.broadcast(validityData);
  console.log("res", JSON.stringify(res, null, 2));
};
