import { DemosWebAuth } from "@kynesyslabs/demosdk/websdk";
import { Demos } from "@kynesyslabs/demosdk/websdk";
import bip39 from "bip39";
import { setupMessenger } from "./instantMessage.js";
export async function connectSdk() {
 // var result = await demos.connect("http://84.247.128.61:53550");
  //console.log("nodes results ", result.connected);
  const demos = new Demos()
  await demos.connect("http://84.247.128.61:53550")

  console.log("connected to rpc:", demos.connected)
}

//me();

const identity = DemosWebAuth.getInstance();

export const generateKeypair = async () => {
  const mnemonics = bip39.generateMnemonic();
  console.log("mememonics ", mnemonics);
  const optional_seed = await bip39.mnemonicToSeed(mnemonics);
  const [status, keypair] = await identity.create(optional_seed);
  const privateKey = keypair.privateKey;
  const publicKey = keypair.publicKey;
  //console.log("privateKey is ", priavteKey);
  //console.log("mnemonices is ", mnemonics);
  //console.log("publicKey is ", publicKey);
  // await loggingMnemonics(mnemonics);

  // console.log("keypairs is ", keypair);
  // console.log("status is ", status);

  var newKeys = {
    publicKey: Buffer.from(publicKey).toString("hex"),
    privateKey: Buffer.from(privateKey).toString("hex"),
  };

  return {
    _mnemonics: mnemonics,
    _status: status,
    _keypair: newKeys,
    _publicKey: Buffer.from(publicKey).toString("hex"),
    _privateKey: Buffer.from(privateKey).toString("hex"),
  };
};

//generateKeypair();

export const loggingMnemonics = async (mnemonics:any) => {
  const seed = bip39.mnemonicToSeedSync(mnemonics);
  const keypair = DemosWebAuth.keyPairFromMnemonic(seed);
  const [status, message] = await identity.login(keypair.privateKey);
  const msg = "Xmessenger is coming!⚔️⚔️⚔️";
  const bufferMsg = Buffer.from(msg);
  const [_status, signature] = await identity.sign(bufferMsg);
  console.log("signature is ", identity.publicKey);
 // const peer = await setupMessenger(identity, _id);
  //await peer.sendMessage("target-peer-id", "Hello from me!");
  //await identity.logout();
  return {
    status: status,
    keypair: keypair,
    identity: identity,
  };
};
//

export const loggingPrivateKey = async (privateKey) => {
  const [status, message] = await identity.login(privateKey);
};
