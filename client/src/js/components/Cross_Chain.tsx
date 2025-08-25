import { EVM, BTC, TON, XRPL } from "@kynesyslabs/demosdk/xm-websdk";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { clusterApiUrl } from "@solana/web3.js";
import { SOLANA } from "@kynesyslabs/demosdk/xm-<localsdk|websdk>";
import { Network } from "@aptos-labs/ts-sdk";
import { APTOS } from "@kynesyslabs/demosdk/xmcore";
import { XMScript } from "@kynesyslabs/demosdk/types";
import { prepareXMPayload } from "@kynesyslabs/demosdk/websdk";

enum ChainType {
  EVM,
  BTC,
  SOL,
  APTOS,
  _TON,
  XRPL,
}

export var currentChainType: ChainType = ChainType.EVM;
const evm_rpc = "https://sepolia.infura.io/v3/YOUR-PROJECT-ID";
const btc_rpc = "https://blockstream.info/testnet/api";
const network = BTC.networks.testnet;
const testnet = clusterApiUrl("testnet");
const xrp_rpc_url = "wss://s.altnet.rippletest.net:51233";
const with_reconnect = false;
// const devnet = clusterApiUrl("devnet")
// const mainnet = clusterApiUrl("mainnet-beta")

export const getInstance = async (rpc_url: string) => {
  var instance: any = null;
  var rpc_url: string = "";
  switch (currentChainType) {
    case ChainType.EVM:
      rpc_url = evm_rpc;
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
  }

  return instance;
};

export const connectWallet = async (instance: any, privateKey: any) => {
  var instance: any = null;
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
  demos: any,
) => {
  const signedTx = await instance.preparePay(recipientAddress, amount);
};

export const makeTONTransfer = async (
  address: string,
  amount: string,
  instance: any,
) => {
  const tx = await instance.prepareTransfer(address, amount);
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
