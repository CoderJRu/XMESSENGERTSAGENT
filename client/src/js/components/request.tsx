// Buffer polyfill for browser compatibility
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Temporarily comment demos SDK to test core functionality
// import {
//   connectSdk,
//   loggingMnemonics,
//   generateKeypair,
// } from "./demosInstance.tsx";
import { createClient } from "@supabase/supabase-js";
import { generateID, generateFloatID, delay, abbrNum } from "./matheFunc.tsx";
import { lastNames, firstNames } from "./names.tsx";
// import { setupMessenger } from "./instantMessage.js";
import { promises } from "dns";
import { any } from "zod";

//

const supaUrl: any = import.meta.env.VITE_SUPABASE_URL;
const supaKey: any = import.meta.env.VITE_SUPABASE_KEY;
const supabase: any = createClient(supaUrl, supaKey);

export const InsertDb = async (newData: any, pubKey: any) => {
  try {
    const { data, error } = await supabase.from("user").insert({
      api: pubKey,
      data: newData,
    });
  } catch (err) {}
};

// const connectMe = async () => {
//   await connectSdk();
// };
// // connects the app to demos nodes :)
// connectMe();

const UpdateDb = async (
  table: any,
  data: any,
  target: any,
  targetValue: any,
) => {
  const { error } = await supabase
    .from(table)
    .update({
      data: data,
    })
    .eq(target, targetValue);
};

const FetchDb = async (table: any, target: any, targetValue: any) => {
  const { data: _data } = await supabase
    .from(table)
    .select()
    .eq(target, targetValue);
  return _data;
};
//generate phrases
type KeypairResult = {
  _mnemonics: string;
  _status: any;
  _keypair: {
    publicKey: string;
    privateKey: string;
  };
  _publicKey: string;
  _privateKey: string;
};

type AccountCreated = {
  status: string;
};

export const createAccount = async (
  Keypair: any,
  publicKey: string,
): Promise<AccountCreated> => {
  try {
    var _keyPair: any = Keypair;
    var publicKey: string = publicKey;
    console.log(_keyPair.publicKey);
    //return;
    var selectedFirstName = firstNames[generateID(0, firstNames.length - 1)];
    var selectedLastName = lastNames[generateID(0, lastNames.length - 1)];
    var _username =
      selectedFirstName + " " + selectedLastName + "_" + generateID(1000, 9999);
    var _newData = {
      id: generateID(1010101010101, 1781109012010999),
      username: _username,
      publicKey: publicKey,
    };
    await InsertDb(_newData, publicKey);
    const resultsJson: AccountCreated = {
      status: "success",
    };
    return resultsJson;
  } catch (err) {
    console.log(err);
    const resultsJson: AccountCreated = {
      status: "failed",
    };
    return resultsJson;
  }
};
type LoggedAccount = {
  status: string;
  data: any;
  peer: any;
};
export const loginPhrase = async (PhraseList: any): Promise<LoggedAccount> => {
  try {
    var _phraseList: any = PhraseList;
    // Temporarily return mock data for testing
    const loggedResults: LoggedAccount = {
      status: "success", 
      data: { id: "test", username: "TestUser", publicKey: "testkey" },
      peer: null
    };
    return loggedResults;
    // var status: any = await loggingMnemonics(_phraseList);
    const decoder: any = new TextDecoder();
    console.log(
      "public is ",
      Buffer.from(status.keypair.publicKey).toString("hex"),
    );
    var myData = await FetchDb(
      "user",
      "api",
      Buffer.from(status.keypair.publicKey).toString("hex"),
    );
    //
    if (myData.length > 0) {
      var fetchedData = myData[0].data;
      var myidentity = status.identity;
      var peer = await setupMessenger(myidentity, fetchedData.id);
      console.log("peer is ", peer);
      //ceate a message recieve promise of the logged data
      const loggedResults: LoggedAccount = {
        status: "success",
        data: fetchedData,
        peer: peer,
      };
      return loggedResults;
    } else {
      const loggedResults: LoggedAccount = {
        status: "failed",
        data: null,
        peer: null,
      };
      return loggedResults;
    }
  } catch (err) {
    console.log(err);
    const loggedResults: LoggedAccount = {
      status: "failed",
      data: null,
      peer: null,
    };
    return loggedResults;
  }
};

export const generatePhrases = async (): Promise<KeypairResult> => {
  // Temporarily return mock data for testing
  const resultsjson: KeypairResult = {
    _mnemonics: "test mnemonic phrase",
    _status: "success",
    _keypair: { publicKey: "testpubkey", privateKey: "testprivkey" },
    _publicKey: "testpubkey", 
    _privateKey: "testprivkey"
  };
  console.log(resultsjson);
  return resultsjson;
};