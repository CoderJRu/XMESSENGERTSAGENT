import {
  connectSdk,
  loggingMnemonics,
  generateKeypair,
} from "./demosInstance.tsx";
import { createClient } from "@supabase/supabase-js";
import { generateID, generateFloatID, delay, abbrNum } from "./matheFunc.tsx";
import { lastNames, firstNames } from "./names.tsx";
import { setupMessenger } from "./instantMessage.js";
import { promises } from "dns";
import { any } from "zod";
import { Buffer } from "buffer";
import { toHex } from "./RexyMath.tsx";
import { publicKey } from "../connectWallet.tsx";
//

const supaKey: any = import.meta.env.VITE_SUPABASE_KEY;
export var demos: any = null;
const supaUrl: any = import.meta.env.VITE_SUPABASE_URL;
export const supabase: any = createClient(supaUrl, supaKey);

export const InsertDb = async (newData: any, pubKey: any) => {
  try {
    const { data, error } = await supabase.from("user").insert({
      api: pubKey,
      data: newData,
    });
  } catch (err) {}
};

const connectMe = async () => {
  demos = await connectSdk();
};
// connects the app to demos nodes :)
connectMe();

export const UpdateDbData = async (
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

const FetchAll = async (table: any, row: any) => {
  try {
    const { data: _allData } = await supabase.from(table).select(row);
    //
    return _allData;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const FetchDb = async (table: any, target: any, targetValue: any) => {
  const { data: _data } = await supabase
    .from(table)
    .select()
    .eq(target, targetValue);
  return _data;
};
//generate phrases

type fetchedAllData = {
  status: any;
  alldata: any;
};

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
  data: any;
};

export const createAccount = async (
  Keypair: any,
  publicKey: string,
  _phraseList: any,
): Promise<AccountCreated> => {
  try {
    var _keyPair: any = Keypair;
    var publicKey: string = publicKey;
    console.log("🔑 Creating account with public key:", _keyPair.publicKey);
    
    // Check if demos SDK is connected
    if (!demos) {
      console.error("❌ Demos SDK is not initialized. Reconnecting...");
      demos = await connectSdk();
    }
    
    if (!demos.connected) {
      console.error("❌ Demos SDK is not connected. Status:", demos.connected);
      throw new Error("Demos SDK not connected");
    }
    
    console.log("✅ Demos SDK is connected");
    
    var selectedFirstName = firstNames[generateID(0, firstNames.length - 1)];
    var selectedLastName = lastNames[generateID(0, lastNames.length - 1)];
    var _username =
      selectedFirstName + " " + selectedLastName + "_" + generateID(1000, 9999);
    var _newData = {
      id: generateID(1010101010101, 1781109012010999),
      username: _username,
      publicKey: publicKey,
    };
    
    console.log("📝 Inserting user data into database...");
    await InsertDb(_newData, publicKey);
    console.log("✅ User data inserted");
    
    console.log("🔐 Logging mnemonics...");
    var status: any = await loggingMnemonics(_phraseList, demos);
    console.log("✅ Mnemonics logged successfully");
    
    var myidentity = status.identity;
    const resultsJson: AccountCreated = {
      status: "success",
      data: _newData,
    };
    console.log("🎉 Account created successfully!");
    return resultsJson;
  } catch (err) {
    console.error("❌ Error creating account:", err);
    console.error("Error details:", err instanceof Error ? err.message : err);
    const resultsJson: AccountCreated = {
      status: "failed",
      data: null,
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
    var status: any = await loggingMnemonics(_phraseList, demos);

    const decoder: any = new TextDecoder();
    console.log(
      "public is ",
      Buffer.from(status.keypair.publicKey).toString("hex"),
    );
    console.log("public is ", toHex(status.keypair.publicKey));
    var myData = await FetchDb("user", "api", toHex(status.keypair.publicKey));
    console.log("the logged data is :", myData);

    //
    if (myData.length > 0) {
      var fetchedData = myData[0].data;
      var myidentity = status.identity;
      /*
      var peer = await setupMessenger(
        toHex(status.keypair.publicKey),
        fetchedData.id,
      );
      */
      // console.log("peer is ", peer);

      //ceate a message recieve promise of the logged data
      const loggedResults: LoggedAccount = {
        status: "success",
        data: fetchedData,
        peer: null,
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
  const { _mnemonics, _status, _keypair, _publicKey, _privateKey } =
    await generateKeypair();

  const resultsjson: KeypairResult = {
    _mnemonics,
    _status,
    _keypair,
    _publicKey,
    _privateKey,
  };

  console.log(resultsjson);
  return resultsjson;
};

export const searchUsers = async (query: string): Promise<fetchedAllData> => {
  try {
    const _alldata = await FetchAll("user", "api");

    //
    console.log("your supabase data is ", _alldata);
    var dataList: any = [];
    if (_alldata != null)
      if (_alldata.length > 0) {
        for (let i = 0; i < _alldata.length; ++i) {
          if (_alldata[i].api.includes(query)) {
            const _modAllData = {
              public_key: _alldata[i].api,
              last_seen: "",
              last_msgs: "",
            };
            //
            dataList.push(_modAllData);
          }
        }
      }
    const resultsJson: fetchedAllData = {
      status: true,
      alldata: dataList,
    };
    //
    console.log(resultsJson);
    return resultsJson;
  } catch (err) {
    console.log(err);
    const resultsJson: fetchedAllData = {
      status: false,
      alldata: null,
    };
    //
    console.log(resultsJson);
    return resultsJson;
  }
};
