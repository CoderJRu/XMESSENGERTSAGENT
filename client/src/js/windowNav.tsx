import { isConnected } from "./connectWallet";
import { getConnectedEthAddress } from "../walletstore.tsx";
let currentWindowIndex = 0;

// Helper function to safely get an element by ID
function getElement(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with ID "${id}" not found`);
  return el;
}

getElement("home-connect").addEventListener("click", () => {
  if (currentWindowIndex !== 0 && isConnected === false) {
    currentWindowIndex = 0;
    refresh();
  }
});

getElement("dashboard-index").addEventListener("click", () => {
  if (currentWindowIndex !== 1) {
    console.log(
      "currentConnectedAddress from nav is ",
      getConnectedEthAddress(),
    );
    currentWindowIndex = 1;
    refresh();
  }
});

getElement("crypto-transfer").addEventListener("click", () => {
  if (currentWindowIndex !== 2) {
    currentWindowIndex = 2;
    refresh();
  }
});

getElement("chat").addEventListener("click", () => {
  if (currentWindowIndex !== 3) {
    currentWindowIndex = 3;
    refresh();
  }
});

getElement("nodes").addEventListener("click", () => {
  if (currentWindowIndex !== 4) {
    currentWindowIndex = 4;
    refresh();
  }
});

getElement("treasury").addEventListener("click", () => {
  if (currentWindowIndex !== 5) {
    currentWindowIndex = 5;
    refresh();
  }
});

getElement("validators").addEventListener("click", () => {
  if (currentWindowIndex !== 6) {
    currentWindowIndex = 6;
    refresh();
  }
});

function refresh(): void {
  const sections = [
    ".home-contents",
    ".dashboard-plane",
    ".swap-plane",
    ".chat-plane",
    ".nodes-plane",
    ".treasury-plane",
    ".validator-plane",
  ];

  sections.forEach((selector, index) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;
    if (index === currentWindowIndex) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

function handleToggleSwitch(isChecked: boolean): void {
  const swapReg = getElement("swap-reg");
  const sendReg = getElement("send-reg");
  const toggleSwap = getElement("swap-send-toggle") as HTMLInputElement;
  const toggleSend = getElement("swap-send-toggle-send") as HTMLInputElement;

  if (isChecked) {
    swapReg.setAttribute("hidden", "true");
    sendReg.removeAttribute("hidden");
    toggleSwap.checked = true;
    toggleSend.checked = true;
  } else {
    sendReg.setAttribute("hidden", "true");
    swapReg.removeAttribute("hidden");
    toggleSwap.checked = false;
    toggleSend.checked = false;
  }
}

(getElement("swap-send-toggle") as HTMLInputElement).addEventListener(
  "change",
  function () {
    handleToggleSwitch(this.checked);
  },
);

(getElement("swap-send-toggle-send") as HTMLInputElement).addEventListener(
  "change",
  function () {
    handleToggleSwitch(this.checked);
  },
);

// Coin list toggle
getElement("coin-list-id").addEventListener("click", () => {
  getElement("coin-list-id").style.display = "none";
});

document
  .querySelector(".swap-div-height-mod")
  ?.addEventListener("click", () => {
    getElement("coin-list-id").style.display = "flex";
  });

refresh();
