import { EVM } from "@kynesyslabs/demosdk/xm-websdk";

const rpc_url = "https://sepolia.infura.io/v3/YOUR-PROJECT-ID";
const instance = await EVM.create(rpc_url);
