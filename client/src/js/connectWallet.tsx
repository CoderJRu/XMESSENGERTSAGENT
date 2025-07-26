import { showLoading, hideLoading } from "./loading";
import * as XmComponents from "../js/components/request";

export let isConnected: boolean = false;

export interface WalletData {
  username: string;
  publicKey: string;
  [key: string]: any;
}

export let data: WalletData = {
  username: "",
  publicKey: "",
};

export let peer: any = null;

export function updateUserData(username: string, publicKey: string): void {
  data.username = username;
  data.publicKey = publicKey;
}

export let phraseList: string[] = [];
export let publicKey: string = "";
let privateKey: string = "";

showLoading();

document
  .getElementById("connect-wallet-button-id")
  ?.addEventListener("click", async () => {
    const gridInput = document.querySelector<HTMLInputElement>(".phrase-input");
    const tempPhrase = gridInput?.value.trim() ?? "";

    console.log(tempPhrase);
    showLoading();

    if (tempPhrase.length > 0) {
      const results = {}; //await XmComponents.loginPhrase(tempPhrase);

      if (results.status === "success") {
        data = results.data;
        peer = results.peer;
        isConnected = true;
        phraseList = tempPhrase.split(" ");

        const connectModal = document.getElementById(
          "grey-background-id-connect",
        );
        connectModal?.setAttribute("hidden", "true");

        hideLoading();
      } else {
        hideLoading();
      }
    }
  });

function getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function copyPhrasesToClipboard(): void {
  const phrases = phraseList.join(" ");
  navigator.clipboard
    .writeText(phrases)
    .then(() => console.log("Phrases copied to clipboard"))
    .catch((err) => console.error("Failed to copy phrases:", err));
}

function handlePhraseClick(event: Event): void {
  const phraseElement = event.currentTarget as HTMLElement;
  phraseElement.style.borderColor = getRandomColor();
  copyPhrasesToClipboard();
}

document.addEventListener("DOMContentLoaded", () => {
  const phraseParas = document.querySelectorAll<HTMLElement>(".phrase-para");
  phraseParas.forEach((para) => {
    para.style.cursor = "pointer";
    para.addEventListener("click", handlePhraseClick);
  });
});

document
  .getElementById("create-button-id")
  ?.addEventListener("click", async () => {
    document.getElementById("grey-background-id")?.removeAttribute("hidden");
    showLoading();

    const bodyJson = { pass: "00000" };

    const response = await fetch("/generatePhrases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyJson),
    });

    const results = await response.json();

    if (results._res === "error") {
      hideLoading();
      return;
    }

    const yourMnemonics = results._res._mnemonics;
    const phrases = yourMnemonics.split(" ");
    phraseList = phrases;
    privateKey = results._res._privateKey;
    publicKey = results._res._publicKey;

    console.log("public key is", publicKey);

    const gridItems = document.querySelectorAll<HTMLElement>(".phrase-para");
    gridItems.forEach((item, index) => {
      item.innerHTML = phrases[index] ?? "";
    });

    hideLoading();
  });

document
  .getElementById("cancel-wallet-button-id")
  ?.addEventListener("click", () => {
    document
      .getElementById("grey-background-id")
      ?.setAttribute("hidden", "true");
  });

document.getElementById("connect-button-id")?.addEventListener("click", () => {
  document
    .getElementById("grey-background-id-connect")
    ?.removeAttribute("hidden");
});

document
  .getElementById("cancel-connect-wallet-button-id")
  ?.addEventListener("click", () => {
    document
      .getElementById("grey-background-id-connect")
      ?.setAttribute("hidden", "true");
  });

document
  .getElementById("create-wallet-button-id")
  ?.addEventListener("click", async () => {
    const bodyJson = {
      Keypair: {
        publicKey,
        privateKey,
      },
    };

    showLoading();

    const response = await fetch("/createAccount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyJson),
    });

    const results = await response.json();

    document
      .getElementById("grey-background-id")
      ?.setAttribute("hidden", "true");

    const gridItems = document.querySelectorAll<HTMLElement>(".phrase-para");
    gridItems.forEach((item) => {
      item.innerHTML = "NULL";
    });

    isConnected = true;

    if (results._res === "success") {
      data = results.data;
      console.log(data);
    }

    hideLoading();
  });

hideLoading();
