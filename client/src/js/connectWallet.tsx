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

  if (isConnected && !demosConnected) {
    demosConnected = true;
    // Show Ethereum wallet connection modal after demos wallet connection
    setTimeout(() => {
      showEthereumWalletModal();
    }, 1000);
  }

  if (demosConnected && ethConnected) {
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
        <span style="color: #4CAF50;">All wallets connected</span>
      `;
    }
  } else if (demosConnected && !ethConnected) {
    if (connectPara) {
      connectPara.innerHTML = `
        <svg style="display: inline-block; width: 20px; height: 20px; margin-right: 8px; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="#FFA726" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span style="color: #FFA726;">Connect Ethereum wallet to continue</span>
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

// Ethereum wallet data
export interface EthereumWalletData {
  address: string;
  isConnected: boolean;
}

export let ethereumWallet: EthereumWalletData = {
  address: "",
  isConnected: false,
};

// Track connection states
export let demosConnected = false;
export let ethConnected = false;

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
    const gridInput = document.querySelector<HTMLInputElement>(".modern-phrase-input");
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
          "Demos Wallet Connected!",
          "Your Demos account has been successfully connected. Next, connect your Ethereum wallet for token balances.",
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
    .then(() => {
      console.log("Phrases copied to clipboard");
      // Show visual feedback
      const copyBtn = document.querySelector('.copy-phrases-btn') as HTMLElement;
      if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>Copied!`;
        copyBtn.style.background = 'rgba(76, 175, 80, 0.3)';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        }, 2000);
      }
    })
    .catch((err) => console.error("Failed to copy phrases:", err));
}

// Make function globally available
(window as any).copyPhrasesToClipboard = copyPhrasesToClipboard;

function handlePhraseClick(event: Event): void {
  const phraseElement = event.currentTarget as HTMLElement;
  const phraseItem = phraseElement.closest('.phrase-item') as HTMLElement;
  if (phraseItem) {
    // Add visual feedback
    phraseItem.style.borderColor = getRandomColor();
    phraseItem.style.background = 'rgba(255, 255, 255, 0.15)';
    
    // Reset after a short delay
    setTimeout(() => {
      phraseItem.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      phraseItem.style.background = 'rgba(255, 255, 255, 0.05)';
    }, 200);
  }
  copyPhrasesToClipboard();
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Connecting wallet event listeners...");
  
  const phraseParas = document.querySelectorAll<HTMLElement>(".phrase-word");
  console.log("Found phrase words:", phraseParas.length);
  phraseParas.forEach((para) => {
    para.style.cursor = "pointer";
    para.addEventListener("click", handlePhraseClick);
  });
  
  // Also add click handlers to phrase items for better UX
  const phraseItems = document.querySelectorAll<HTMLElement>(".phrase-item");
  console.log("Found phrase items:", phraseItems.length);
  phraseItems.forEach((item) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", handlePhraseClick);
  });
  
  // Add event listener for dynamic content
  const observer = new MutationObserver(() => {
    const newPhraseParas = document.querySelectorAll<HTMLElement>(".phrase-word:not([data-listener])");
    const newPhraseItems = document.querySelectorAll<HTMLElement>(".phrase-item:not([data-listener])");
    
    newPhraseParas.forEach((para) => {
      para.style.cursor = "pointer";
      para.addEventListener("click", handlePhraseClick);
      para.setAttribute("data-listener", "true");
    });
    
    newPhraseItems.forEach((item) => {
      item.style.cursor = "pointer";
      item.addEventListener("click", handlePhraseClick);
      item.setAttribute("data-listener", "true");
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
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

    const gridItems = document.querySelectorAll<HTMLElement>(".phrase-word");
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

  

    document
      .getElementById("grey-background-id")
      ?.setAttribute("hidden", "true");

    const gridItems = document.querySelectorAll<HTMLElement>(".phrase-word");
    gridItems.forEach((item) => {
      item.innerHTML = "NULL";
    });
    const response = await XmComponents.createAccount(keypair, publicKey,phraseList);
    const results = response;
    isConnected = true;

    if (results.status === "success") {
      data = results.data;
      console.log(data);
      updateButtonStates();
      showSuccessPopup(
        "Demos Wallet Created!",
        "Your new Demos wallet account has been created successfully. Next, connect your Ethereum wallet for token balances.",
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

// Ethereum wallet connection functions
function showEthereumWalletModal(): void {
  document.getElementById("ethereum-wallet-modal")?.removeAttribute("hidden");
}

function hideEthereumWalletModal(): void {
  document.getElementById("ethereum-wallet-modal")?.setAttribute("hidden", "true");
}

function checkEthereumWallet(): boolean {
  return typeof (window as any).ethereum !== 'undefined';
}

async function connectEthereumWallet(): Promise<void> {
  if (!checkEthereumWallet()) {
    alert('Please install MetaMask or another Ethereum wallet!');
    return;
  }

  try {
    showLoading();
    const accounts = await (window as any).ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    if (accounts.length > 0) {
      ethereumWallet.address = accounts[0];
      ethereumWallet.isConnected = true;
      ethConnected = true;
      
      hideEthereumWalletModal();
      updateButtonStates();
      updateTokenBalances();
      
      showSuccessPopup(
        "Ethereum Wallet Connected!",
        "Your Ethereum wallet has been connected successfully. Token balances will now be displayed."
      );
    }
  } catch (error) {
    console.error('Failed to connect Ethereum wallet:', error);
    alert('Failed to connect Ethereum wallet. Please try again.');
  } finally {
    hideLoading();
  }
}

// Token balance functions
async function updateTokenBalances(): Promise<void> {
  if (!ethereumWallet.isConnected) return;
  
  try {
    // X Token balance
    const xTokenBalance = await getTokenBalance(
      ethereumWallet.address,
      "0xa2D65c475c4378d6bD955FE21EF219F0199e6bA2"
    );
    
    // XNFT balance (using same contract for now)
    const xnftBalance = await getNFTBalance(
      ethereumWallet.address,
      "0xa2D65c475c4378d6bD955FE21EF219F0199e6bA2"
    );
    
    // Update dashboard display
    updateDashboardBalances(xTokenBalance, xnftBalance);
  } catch (error) {
    console.error('Failed to update token balances:', error);
  }
}

async function getTokenBalance(address: string, contractAddress: string): Promise<string> {
  try {
    const data = `0x70a08231000000000000000000000000${address.slice(2)}`;
    const result = await (window as any).ethereum.request({
      method: 'eth_call',
      params: [{
        to: contractAddress,
        data: data
      }, 'latest']
    });
    
    // Convert hex result to decimal and format
    const balance = parseInt(result, 16);
    return formatTokenBalance(balance);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return '0';
  }
}

async function getNFTBalance(address: string, contractAddress: string): Promise<string> {
  try {
    // For NFTs, we'll use balanceOf method
    const data = `0x70a08231000000000000000000000000${address.slice(2)}`;
    const result = await (window as any).ethereum.request({
      method: 'eth_call',
      params: [{
        to: contractAddress,
        data: data
      }, 'latest']
    });
    
    const balance = parseInt(result, 16);
    return balance.toString();
  } catch (error) {
    console.error('Error fetching NFT balance:', error);
    return '0';
  }
}

function formatTokenBalance(balance: number): string {
  if (balance === 0) return '0';
  if (balance >= 1000000) {
    return (balance / 1000000).toFixed(1) + 'M';
  }
  if (balance >= 1000) {
    return (balance / 1000).toFixed(1) + 'k';
  }
  return balance.toString();
}

function updateDashboardBalances(xTokenBalance: string, xnftBalance: string): void {
  // Update X Token balance
  const xTokenElement = document.querySelector('.dual-section-left .rewards-val-para');
  if (xTokenElement) {
    xTokenElement.textContent = xTokenBalance;
  }
  
  // Update NFT balance
  const xnftElement = document.querySelector('.dual-section-right .rewards-val-para');
  if (xnftElement) {
    xnftElement.textContent = xnftBalance;
  }
}

// Event listeners for Ethereum wallet
document.addEventListener('DOMContentLoaded', () => {
  // Connect Ethereum wallet button
  document.getElementById('connect-ethereum-btn')?.addEventListener('click', connectEthereumWallet);
  
  // Cancel Ethereum wallet connection
  document.getElementById('cancel-ethereum-btn')?.addEventListener('click', hideEthereumWalletModal);
  
  // Skip Ethereum wallet connection
  document.getElementById('skip-ethereum-btn')?.addEventListener('click', () => {
    hideEthereumWalletModal();
    ethConnected = true; // Mark as completed even if skipped
    updateButtonStates();
  });
});
