import { showLoading, hideLoading } from "./loading";
import * as XmComponents from "../js/components/request";

export let isConnected: boolean = false;

// Success popup functions
export function showSuccessPopup(title: string, message: string): void {
  const overlay = document.getElementById("success-popup-overlay");
  const titleEl = document.getElementById("success-title");
  const messageEl = document.getElementById("success-message");

  if (overlay && titleEl && messageEl) {
    titleEl.textContent = title;
    messageEl.textContent = message;
    overlay.classList.add("show");
  }
}

export function hideSuccessPopup(): void {
  const overlay = document.getElementById("success-popup-overlay");
  if (overlay) {
    overlay.classList.remove("show");
  }
}

// Button state management
export function updateButtonStates(): void {
  const connectBtn = document.getElementById(
    "connect-button-id",
  ) as HTMLButtonElement;
  const createBtn = document.getElementById(
    "create-button-id",
  ) as HTMLButtonElement;
  const connectPara = document.querySelector(".connect-para") as HTMLElement;

  if (isConnected) {
    if (connectBtn) {
      connectBtn.textContent = "Connected";
      connectBtn.disabled = true;
    }
    if (createBtn) {
      createBtn.disabled = true;
    }
    if (connectPara) {
      connectPara.innerHTML = `
        <svg style="display: inline-block; width: 20px; height: 20px; margin-right: 8px; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        <span style="color: #4CAF50;">Wallet connected</span>
      `;
    }
  }
}

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
let keypair: any = null;

showLoading();

document
  .getElementById("connect-wallet-button-id")
  ?.addEventListener("click", async () => {
    const gridInput = document.querySelector<HTMLInputElement>(".phrase-input");
    const tempPhrase = gridInput?.value.trim() ?? "";

    console.log(tempPhrase);
    showLoading();

    if (tempPhrase.length > 0) {
      const results: any = await XmComponents.loginPhrase(tempPhrase);

      if ((results as any).status === "success") {
        data = (results as any).data;
        peer = (results as any).peer;
        isConnected = true;
        phraseList = tempPhrase.split(" ");

        const connectModal = document.getElementById(
          "grey-background-id-connect",
        );
        connectModal?.setAttribute("hidden", "true");

        hideLoading();
        updateButtonStates();
        showSuccessPopup(
          "Wallet Connected!",
          "Your account has been successfully connected. Welcome back!",
        );
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

    const generateJson = await XmComponents.generatePhrases();
    const results = generateJson;

    if (results._status === "error") {
      hideLoading();
      return;
    }

    const yourMnemonics = results._mnemonics;
    const phrases = yourMnemonics.split(" ");
    phraseList = phrases;
    privateKey = results._privateKey;
    publicKey = results._publicKey;
    keypair = results._keypair;
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
    //

    const response = await XmComponents.createAccount(keypair, publicKey);
    const results = response;

    document
      .getElementById("grey-background-id")
      ?.setAttribute("hidden", "true");

    const gridItems = document.querySelectorAll<HTMLElement>(".phrase-para");
    gridItems.forEach((item) => {
      item.innerHTML = "NULL";
    });

    isConnected = true;

    if (results.status === "success") {
      data = results.data;
      console.log(data);
      updateButtonStates();
      showSuccessPopup(
        "Account Created!",
        "Your new wallet account has been created successfully. Your recovery phrases have been generated.",
      );
    }

    hideLoading();
  });

// Success popup close handler
document.getElementById("success-close-btn")?.addEventListener("click", () => {
  hideSuccessPopup();
});

// Close popup when clicking outside
document
  .getElementById("success-popup-overlay")
  ?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("success-popup-overlay")) {
      hideSuccessPopup();
    }
  });

hideLoading();
