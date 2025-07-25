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

//

const supaKey: any = process.env["SUPABASE_KEY"];
const supaUrl: any = process.env["SUPABASE_URL"];
const supabase: any = createClient(supaUrl, supaKey);

export const InsertDb = async (newData: any, pubKey: any) => {
  try {
    const { data, error } = await supabase.from("user").insert({
      api: pubKey,
      data: newData,
    });
  } catch (err) {}
};

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

const generatePhrases = async (): Promise<void> => {
  const results: any = await generateKeypair();
};
