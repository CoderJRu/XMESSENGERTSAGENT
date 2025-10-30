// ====== Imports ======
import { ethers } from "ethers";
import { AptosAccount } from "aptos";
import * as solanaWeb3 from "@solana/web3.js";
import * as tonMnemonic from "tonweb-mnemonic";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import * as secp from "@noble/secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import { mnemonicToSeedSync } from "@scure/bip39";
import { HDKey } from "@scure/bip32";
import { Secp256k1 } from "@cosmjs/crypto";
import { toHex } from "@cosmjs/encoding";
import * as rippleKeypairs from "ripple-keypairs"; // ✅ NEW IMPORT

// ====== Helpers ======
const u8ToHex = (b: Uint8Array) =>
  Array.from(b)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");

// ====== Main Function ======
export async function generateAllKeys(mnemonic: string) {
  const seed = mnemonicToSeedSync(mnemonic);
  const root = HDKey.fromMasterSeed(seed);
  const getPriv = (path: string) => root.derive(path).privateKey!;

  // ===== EVM =====
  const evmPriv = getPriv("m/44'/60'/0'/0/0");
  const evmWallet = new ethers.Wallet(u8ToHex(evmPriv));
  const EVM = {
    privateKey: evmWallet.privateKey,
    publicKey: evmWallet.signingKey.publicKey,
    address: evmWallet.address,
  };

  // ===== BTC =====
  let btcPrivU8 = getPriv("m/44'/0'/0'/0/0");
  if (btcPrivU8.length !== 32) btcPrivU8 = btcPrivU8.slice(0, 32);
  const btcPubU8 = secp.getPublicKey(btcPrivU8, true);
  const { address: btcAddress } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(btcPubU8),
  });
  const BTC = {
    privateKey: u8ToHex(btcPrivU8),
    publicKey: u8ToHex(btcPubU8),
    address: btcAddress || "",
  };

  // ===== Solana =====
  const solPriv = getPriv("m/44'/501'/0'/0'");
  const solKeypair = solanaWeb3.Keypair.fromSeed(solPriv.slice(0, 32));
  const SOL = {
    privateKey: u8ToHex(solKeypair.secretKey),
    publicKey: solKeypair.publicKey.toBase58(),
    address: solKeypair.publicKey.toBase58(),
  };

  // ===== Aptos =====
  const aptPriv = getPriv("m/44'/637'/0'/0'/0'");
  const aptAccount = new AptosAccount(aptPriv);
  const APTOS = {
    privateKey: Buffer.from(aptAccount.signingKey.secretKey).toString("hex"),
    publicKey: Buffer.from(aptAccount.signingKey.publicKey).toString("hex"),
    address: aptAccount.address().toString(),
  };

  // ===== TON =====
  const tonWords = mnemonic.trim().split(" ");
  const tonKeyPair = await tonMnemonic.mnemonicToKeyPair(tonWords);
  const TON = {
    privateKey: Buffer.from(tonKeyPair.secretKey).toString("hex"),
    publicKey: Buffer.from(tonKeyPair.publicKey).toString("hex"),
  };

  // ===== IBC (Cosmos SDK) =====
  const ibcPriv = getPriv("m/44'/118'/0'/0/0");
  const pub = await Secp256k1.makeKeypair(ibcPriv);
  const IBC = { privateKey: toHex(ibcPriv), publicKey: toHex(pub.pubkey) };

  // ===== XRPL (Ripple) ===== 🌀
  const xrpPriv = getPriv("m/44'/144'/0'/0/0");

  // make sure it's 32 bytes
  let xrpPrivU8 = xrpPriv;
  if (xrpPrivU8.length !== 32) xrpPrivU8 = xrpPrivU8.slice(0, 32);

  // hex of private
  const xrpPrivHex = u8ToHex(xrpPrivU8);

  // derive compressed public key (33 bytes) using noble secp
  const xrpPubU8 = secp.getPublicKey(xrpPrivU8, true); // compressed = true
  const xrpPubHex = u8ToHex(xrpPubU8);

  // derive XRP address from public key hex
  const xrpAddress = rippleKeypairs.deriveAddress(xrpPubHex);

  // final object
  const XRPL = {
    privateKey: xrpPrivHex, // hex private key (32 bytes)
    publicKey: xrpPubHex, // compressed secp256k1 pubkey hex
    address: xrpAddress, // classic XRP address (r...)
  };

  // ===== Result =====
  return { EVM, BTC, SOL, APTOS, TON, IBC, XRPL };
}

export let NetworkRPCS: any = {
  // EVM networks
  ETH: {
    name: "eth",
    rpc_testnet: "https://ethereum-sepolia-rpc.publicnode.com",
    rpc_mainnet: "https://ethereum-rpc.publicnode.com"
  },
  BNB: {
    name: "bnb",
    rpc_testnet: "https://bsc-testnet-rpc.publicnode.com",
    rpc_mainnet: "https://bsc-rpc.publicnode.com"
  },
  ARB: {
    name: "arbitrum",
    rpc_testnet: "https://arbitrum-sepolia-rpc.publicnode.com",
    rpc_mainnet: "https://arbitrum-rpc.publicnode.com"
  },

  // BTC
  BTC: {
    name: "btc",
    rpc_testnet: "https://testnet-api.smartbit.com.au/v1/blockchain/",
    rpc_mainnet: "https://blockchain.info/"
  },

  // Solana
  SOL: {
    name: "sol",
    rpc_testnet: "https://api.testnet.solana.com",
    rpc_mainnet: "https://api.mainnet-beta.solana.com"
  },

  // Aptos
  APTOS: {
    name: "aptos",
    rpc_testnet: "https://fullnode.testnet.aptoslabs.com/v1",
    rpc_mainnet: "https://fullnode.mainnet.aptoslabs.com/v1"
  },

  // Toncoin
  TON: {
    name: "ton",
    rpc_testnet: "https://toncenter.com/api/v2/jsonRPC?network=testnet",
    rpc_mainnet: "https://toncenter.com/api/v2/jsonRPC"
  },

  // IBC (Cosmos / generic)
  IBC: {
    name: "ibc",
    rpc_testnet: "https://rpc-testnet.cosmos.network:26657",
    rpc_mainnet: "https://rpc.cosmos.network:26657"
  },

  // XRP Ledger
  XRPL: {
    name: "xrpl",
    rpc_testnet: "https://s.altnet.rippletest.net:51234",
    rpc_mainnet: "https://s1.ripple.com:51234"
  },
};

