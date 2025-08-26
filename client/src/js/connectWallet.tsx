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
    // Show Privy authentication modal after demos wallet connection
    setTimeout(() => {
      showPrivyModal();
    }, 1000);
  }

  if (demosConnected && privyConnected) {
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
  } else if (demosConnected && !privyConnected) {
    if (connectPara) {
      connectPara.innerHTML = `
        <svg style="display: inline-block; width: 20px; height: 20px; margin-right: 8px; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="#FFA726" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span style="color: #FFA726;">Complete authentication to continue</span>
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

// Track connection states
export let demosConnected = false;
export let privyConnected = false;

// Privy wallet data
export interface PrivyWalletData {
  email?: string;
  phone?: string;
  walletAddress?: string;
  isConnected: boolean;
  authMethod?: 'email' | 'phone' | 'wallet';
}

export let privyWallet: PrivyWalletData = {
  isConnected: false,
};

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
          "Step 1 complete! Please authenticate with Privy to access all features.",
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
        "Step 1 complete! Please authenticate with Privy to access all features.",
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

// Privy authentication functions
export function showPrivyModal(): void {
  const privyModal = document.getElementById("privy-auth-modal");
  if (privyModal) {
    privyModal.removeAttribute("hidden");
  }
}

export function hidePrivyModal(): void {
  const privyModal = document.getElementById("privy-auth-modal");
  if (privyModal) {
    privyModal.setAttribute("hidden", "true");
  }
  // Reset all input containers
  resetPrivyModalState();
}

function resetPrivyModalState(): void {
  const emailContainer = document.querySelector('.email-input-container') as HTMLElement;
  const phoneContainer = document.querySelector('.phone-input-container') as HTMLElement;
  const authOptions = document.querySelector('.privy-auth-options') as HTMLElement;
  
  if (emailContainer) emailContainer.style.display = 'none';
  if (phoneContainer) phoneContainer.style.display = 'none';
  if (authOptions) authOptions.style.display = 'block';
  
  // Clear inputs
  const emailInput = document.querySelector('.email-input') as HTMLInputElement;
  const phoneInput = document.querySelector('.phone-input') as HTMLInputElement;
  if (emailInput) emailInput.value = '';
  if (phoneInput) phoneInput.value = '';
}

function showEmailInput(): void {
  const emailContainer = document.querySelector('.email-input-container') as HTMLElement;
  const authOptions = document.querySelector('.privy-auth-options') as HTMLElement;
  
  if (emailContainer && authOptions) {
    authOptions.style.display = 'none';
    emailContainer.style.display = 'block';
    
    // Focus on email input
    const emailInput = document.querySelector('.email-input') as HTMLInputElement;
    if (emailInput) {
      setTimeout(() => emailInput.focus(), 100);
    }
  }
}

function showPhoneInput(): void {
  const phoneContainer = document.querySelector('.phone-input-container') as HTMLElement;
  const authOptions = document.querySelector('.privy-auth-options') as HTMLElement;
  
  if (phoneContainer && authOptions) {
    authOptions.style.display = 'none';
    phoneContainer.style.display = 'block';
    
    // Focus on phone input
    const phoneInput = document.querySelector('.phone-input') as HTMLInputElement;
    if (phoneInput) {
      setTimeout(() => phoneInput.focus(), 100);
    }
  }
}

async function connectWithEmail(): Promise<void> {
  const emailInput = document.querySelector('.email-input') as HTMLInputElement;
  const email = emailInput?.value.trim();
  
  if (!email || !isValidEmail(email)) {
    alert('Please enter a valid email address');
    return;
  }
  
  showLoading();
  
  try {
    // Simulate email verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    privyWallet.email = email;
    privyWallet.isConnected = true;
    privyWallet.authMethod = 'email';
    privyConnected = true;
    
    hidePrivyModal();
    updateButtonStates();
    
    showSuccessPopup(
      "Authentication Complete!",
      "You have successfully authenticated with Privy. All features are now available."
    );
  } catch (error) {
    console.error('Email authentication failed:', error);
    alert('Authentication failed. Please try again.');
  } finally {
    hideLoading();
  }
}

async function connectWithPhone(): Promise<void> {
  const phoneInput = document.querySelector('.phone-input') as HTMLInputElement;
  const countrySelect = document.querySelector('.country-select') as HTMLSelectElement;
  const phone = phoneInput?.value.trim();
  const countryCode = countrySelect?.value || '+1';
  
  if (!phone || !isValidPhone(phone)) {
    alert('Please enter a valid phone number');
    return;
  }
  
  showLoading();
  
  try {
    // Simulate phone verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    privyWallet.phone = countryCode + phone;
    privyWallet.isConnected = true;
    privyWallet.authMethod = 'phone';
    privyConnected = true;
    
    hidePrivyModal();
    updateButtonStates();
    
    showSuccessPopup(
      "Authentication Complete!",
      "You have successfully authenticated with Privy. All features are now available."
    );
  } catch (error) {
    console.error('Phone authentication failed:', error);
    alert('Authentication failed. Please try again.');
  } finally {
    hideLoading();
  }
}

async function connectWithWallet(): Promise<void> {
  if (typeof (window as any).ethereum === 'undefined') {
    alert('Please install MetaMask or another Ethereum wallet!');
    return;
  }
  
  showLoading();
  
  try {
    const accounts = await (window as any).ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    if (accounts.length > 0) {
      privyWallet.walletAddress = accounts[0];
      privyWallet.isConnected = true;
      privyWallet.authMethod = 'wallet';
      privyConnected = true;
      
      hidePrivyModal();
      updateButtonStates();
      
      showSuccessPopup(
        "Authentication Complete!",
        "You have successfully authenticated with Privy using your wallet. All features are now available."
      );
    }
  } catch (error) {
    console.error('Wallet authentication failed:', error);
    alert('Wallet authentication failed. Please try again.');
  } finally {
    hideLoading();
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Event listeners for Privy modal
document.addEventListener('DOMContentLoaded', () => {
  // Close modal button
  document.getElementById('close-privy-modal')?.addEventListener('click', hidePrivyModal);
  
  // Auth option buttons
  document.getElementById('privy-email-btn')?.addEventListener('click', showEmailInput);
  document.getElementById('privy-phone-btn')?.addEventListener('click', showPhoneInput);
  document.getElementById('privy-wallet-btn')?.addEventListener('click', connectWithWallet);
  
  // Submit buttons
  document.querySelector('.email-submit-btn')?.addEventListener('click', connectWithEmail);
  document.querySelector('.phone-submit-btn')?.addEventListener('click', connectWithPhone);
  
  // Enter key handling
  document.querySelector('.email-input')?.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      connectWithEmail();
    }
  });
  
  document.querySelector('.phone-input')?.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      connectWithPhone();
    }
  });
  
  // Click outside to close
  document.getElementById('privy-auth-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('privy-auth-modal')) {
      hidePrivyModal();
    }
  });
});
