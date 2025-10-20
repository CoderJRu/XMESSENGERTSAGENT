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

  // ===== TON ===== (✅ your version)
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

  // ===== Result =====
  return { EVM, BTC, SOL, APTOS, TON, IBC };
}
