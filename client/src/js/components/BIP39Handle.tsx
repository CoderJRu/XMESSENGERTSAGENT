import * as bip39 from "bip39";

/**
 * Generate a new mnemonic phrase (BIP39)
 */
export function generateMnemonic(): string {
  const mnemonic = bip39.generateMnemonic(); // defaults to 12 words
  return mnemonic;
}
