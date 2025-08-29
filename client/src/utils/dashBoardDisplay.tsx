import * as balance from "./balances.tsx";
import { getConnectedEthAddress } from "../walletstore.tsx";
import { mouseUpdate } from "../js/components/RexyMath.tsx";
//getHTMLComponents;
const total_Xtokens_owned = document.getElementById(
  "X-tokenowned-id",
) as HTMLElement;
const total_Xnft_owned = document.getElementById(
  "total-xnftowned-id",
) as HTMLElement;
const box = document.body as HTMLElement;
//end

console.log("calling setupSwipeWithMouseMove...");

mouseUpdate(
  (direction: any) => {
    console.log("Mouse moving:", direction);
    // update your function here
    refreshBalances();
  },
  10000,
  10,
); // fires every 500ms at most, after moving ≥10px

const refreshBalances = async () => {
  const ethAddress = getConnectedEthAddress();
  if (ethAddress) {
    const allBalanaces = await balance.getBalances(ethAddress);
    console.log("all balaances are :", allBalanaces);
  } else {
    return;
  }
};
