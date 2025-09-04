// Install these first:
// npm install bip39 ethers @solana/web3.js tweetnacl bs58 bip32 tiny-secp256k1 aptos

import * as bip39 from "bip39";
import { ethers } from "ethers";
import { Keypair as SolKeypair } from "@solana/web3.js";
import bs58 from "bs58";
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import * as bip32 from "bip32";
import * as ecc from "tiny-secp256k1";

// Setup bip32 factory for modern Node.js
const BIP32 = bip32.BIP32Factory(ecc);

interface GeneratedKeys {
  EVM: string;
  BTC: string;
  SOL: string;
  APTOS: string;
  TON: string;
  XRPL: string;
  IBC: string;
}

export async function generateKeys(mnemonic?: string): Promise<{ mnemonic: string; keys: GeneratedKeys }> {
  // 1️⃣ Generate mnemonic if not provided
  if (!mnemonic) mnemonic = bip39.generateMnemonic();

  // 2️⃣ Convert mnemonic to seed
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // 3️⃣ Ensure seed is a Buffer
  if (!Buffer.isBuffer(seed)) throw new Error("Seed is not a Buffer");

  // 4️⃣ Create root node safely
  const root = BIP32.fromSeed(seed);

  function getPrivateKeyHex(node: ReturnType<typeof root.derivePath>, name: string): string {
    if (!node.privateKey) throw new Error(`${name} private key is undefined`);
    return (node.privateKey as Buffer).toString("hex");
  }

  // 5️⃣ EVM (Ethereum, BSC, Polygon)
  const nodeEVM = root.derivePath("m/44'/60'/0'/0/0");
  const evmPrivateKey = getPrivateKeyHex(nodeEVM, "EVM");

  // 6️⃣ BTC
  const nodeBTC = root.derivePath("m/44'/0'/0'/0/0");
  const btcPrivateKey = getPrivateKeyHex(nodeBTC, "BTC");

  // 7️⃣ SOL
  const nodeSOL = root.derivePath("m/44'/501'/0'/0'");
  if (!nodeSOL.privateKey) throw new Error("SOL private key is undefined");
  const solKeypair = SolKeypair.fromSeed(nodeSOL.privateKey.slice(0, 32));
  const solPrivateKey = bs58.encode(solKeypair.secretKey);

  // 8️⃣ Aptos
  const nodeAPTOS = root.derivePath("m/44'/637'/0'/0'/0'");
  if (!nodeAPTOS.privateKey) throw new Error("APTOS private key is undefined");
  const privateKey = new Ed25519PrivateKey(nodeAPTOS.privateKey);
  const aptosAccount = Account.fromPrivateKey({ privateKey, legacy: false });
  const aptosPrivateKey = aptosAccount.privateKey.toString("hex");

  // 9️⃣ Placeholders for other chains
  const tonPrivateKey = "TON_PRIVATE_KEY_PLACEHOLDER";
  const xrplPrivateKey = "XRPL_PRIVATE_KEY_PLACEHOLDER";
  const ibcPrivateKey = "IBC_PRIVATE_KEY_PLACEHOLDER";

  return {
    mnemonic,
    keys: {
      EVM: evmPrivateKey,
      BTC: btcPrivateKey,
      SOL: solPrivateKey,
      APTOS: aptosPrivateKey,
      TON: tonPrivateKey,
      XRPL: xrplPrivateKey,
      IBC: ibcPrivateKey,
    },
  };
}


// Optional: standalone mnemonic generator
export function generateMnemonic(): string {
  return bip39.generateMnemonic(); // 12 words
}
