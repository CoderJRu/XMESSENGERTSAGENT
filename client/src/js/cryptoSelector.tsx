// Modern Crypto Selector - Bulletproof Implementation
// This creates a dynamic modal that avoids z-index conflicts

interface CryptoToken {
  symbol: string;
  name: string;
  balance: string;
  isMain?: boolean;
  iconClass: string;
}

// Available cryptocurrencies
const CRYPTO_TOKENS: CryptoToken[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: '0.0000', isMain: true, iconClass: 'eth-bg' },
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.0000', iconClass: 'btc-bg' },
  { symbol: 'BNB', name: 'BNB', balance: '0.0000', iconClass: 'bnb-bg' },
  { symbol: 'TON', name: 'Toncoin', balance: '0.0000', iconClass: 'ton-bg' },
  { symbol: 'XRPL', name: 'XRP Ledger', balance: '0.0000', iconClass: 'xrpl-bg' },
  { symbol: 'ARB', name: 'Arbitrum', balance: '0.0000', iconClass: 'arb-bg' },
  { symbol: 'USDT', name: 'Tether USD', balance: '0.0000', iconClass: 'usdt-bg' },
  { symbol: 'USDC', name: 'USD Coin', balance: '0.0000', iconClass: 'usdc-bg' },
  { symbol: 'X', name: 'X Token', balance: '0.0000', iconClass: 'x-bg' }
];

let currentTargetButton: HTMLElement | null = null;
let cryptoModal: HTMLElement | null = null;

// Create the modal HTML dynamically
function createCryptoModal(): HTMLElement {
  const backdrop = document.createElement('div');
  backdrop.className = 'crypto-modal-backdrop';
  
  backdrop.innerHTML = `
    <div class="crypto-modal-container" onclick="event.stopPropagation()">
      <div class="crypto-modal-header">
        <div class="crypto-modal-title-row">
          <h2 class="crypto-modal-title">Select Token</h2>
          <button class="crypto-modal-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="crypto-search-box">
          <svg class="crypto-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input type="text" class="crypto-search-input" placeholder="Search tokens..." />
        </div>
      </div>
      <div class="crypto-modal-content">
        ${generateCoinList()}
      </div>
    </div>
  `;
  
  return backdrop;
}

// Get the appropriate icon SVG for each token
function getTokenIcon(symbol: string): string {
  const icons: Record<string, string> = {
    ETH: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <path d="M16.498 4v8.87l7.497 3.35L16.498 4z" fill="#fff" fill-opacity=".602"/>
      <path d="M16.498 4L9 16.22l7.498-3.35V4z" fill="#fff"/>
      <path d="M16.498 21.968v6.027L24 17.616l-7.502 4.352z" fill="#fff" fill-opacity=".602"/>
      <path d="M16.498 27.995v-6.028L9 17.616l7.498 10.38z" fill="#fff"/>
      <path d="M16.498 20.573l7.497-4.353-7.497-3.348v7.701z" fill="#fff" fill-opacity=".2"/>
      <path d="M9 16.22l7.498 4.353v-7.701L9 16.22z" fill="#fff" fill-opacity=".602"/>
    </svg>`,
    
    BTC: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#F7931A"/>
      <path d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.113-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313L8.53 19.998l2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538z" fill="#fff"/>
    </svg>`,
    
    BNB: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
      <path d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.26L16 26l-6.144-6.144-2.26-2.26zm13.624-1.596L23.48 16l2.26 2.26L28 16l-2.26-2.26zM16 14.52L14.52 16L16 17.48L17.48 16L16 14.52z" fill="#fff"/>
    </svg>`,
    
    TON: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#0088CC"/>
      <path d="M8.5 11.5h15v2h-15v-2zm0 3h15v2h-15v-2zm0 3h15v2h-15v-2zm0 3h15v2h-15v-2z" fill="#fff"/>
    </svg>`,
    
    XRPL: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#23292F"/>
      <path d="M8 8l8 8 8-8h-4l-4 4-4-4H8zm0 16l8-8 8 8h-4l-4-4-4 4H8z" fill="#fff"/>
    </svg>`,
    
    ARB: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#2D374B"/>
      <path d="M16 8l8 5.33-8 5.34-8-5.34L16 8zm-8 6.67l8 5.33v5.33l-8-5.33V14.67zm16 0v5.33l-8 5.33V20l8-5.33z" fill="#96BEDC"/>
    </svg>`,
    
    USDT: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#26A17B"/>
      <path d="M15.5 18.5v2.5c1.5 0 2.5-.5 2.5-1.25s-1-1.25-2.5-1.25zm0-3.5v2.5c1.5 0 2.5-.5 2.5-1.25s-1-1.25-2.5-1.25zm0-6v2h5v2h-5v.5c2.5 0 4.5 1 4.5 2.75s-2 2.75-4.5 2.75c-2.5 0-4.5-1-4.5-2.75s2-2.75 4.5-2.75v-.5h-5v-2h5v-2h-5v-2h10v2h-5z" fill="#fff"/>
    </svg>`,
    
    USDC: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#2775CA"/>
      <circle cx="16" cy="16" r="6" fill="none" stroke="#fff" stroke-width="2"/>
      <path d="M18.5 14c0-.8-.7-1.5-1.5-1.5h-2c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5h2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-2c-.8 0-1.5-.7-1.5-1.5M16 10v2M16 20v2" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    
    X: `<img src="src/img/X.jpg" width="32" height="32" style="border-radius: 50%; object-fit: cover;" alt="X Token" />`
  };
  
  return icons[symbol] || `<div style="width: 32px; height: 32px; background: #666; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${symbol}</div>`;
}

// Generate the coin list HTML
function generateCoinList(): string {
  return CRYPTO_TOKENS.map(token => `
    <div class="crypto-coin-item ${token.isMain ? 'main-coin' : ''}" data-symbol="${token.symbol}">
      <div class="crypto-coin-left">
        <div class="crypto-coin-icon ${token.iconClass}">${getTokenIcon(token.symbol)}</div>
        <div class="crypto-coin-info">
          <h3>${token.symbol}</h3>
          <p>${token.name}</p>
        </div>
      </div>
      <div class="crypto-coin-right">
        <span>${token.balance}</span>
        ${token.isMain ? '<div class="crypto-main-badge">MAIN</div>' : ''}
      </div>
    </div>
  `).join('');
}

// Show the crypto selector
function showCryptoSelector(targetButton: HTMLElement): void {
  console.log('🚀 Opening crypto selector for button:', targetButton);
  
  currentTargetButton = targetButton;
  
  // Remove any existing modal
  if (cryptoModal) {
    cryptoModal.remove();
  }
  
  // Create new modal
  cryptoModal = createCryptoModal();
  
  // Add event listeners
  setupModalEventListeners();
  
  // Append to body (end of DOM to avoid z-index issues)
  document.body.appendChild(cryptoModal);
  
  // Focus on search input
  setTimeout(() => {
    const searchInput = cryptoModal?.querySelector('.crypto-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }, 100);
  
  console.log('✅ Crypto selector opened successfully');
}

// Hide the crypto selector
function hideCryptoSelector(): void {
  console.log('🔒 Closing crypto selector');
  
  if (cryptoModal) {
    // Remove event listener first
    document.removeEventListener('keydown', handleEscKey);
    // Remove the modal completely
    cryptoModal.remove();
    cryptoModal = null;
  }
  
  currentTargetButton = null;
}

// Setup all modal event listeners
function setupModalEventListeners(): void {
  if (!cryptoModal) return;
  
  // Close button
  const closeBtn = cryptoModal.querySelector('.crypto-modal-close');
  closeBtn?.addEventListener('click', hideCryptoSelector);
  
  // Click outside to close
  cryptoModal.addEventListener('click', hideCryptoSelector);
  
  // Search functionality
  const searchInput = cryptoModal.querySelector('.crypto-search-input') as HTMLInputElement;
  searchInput?.addEventListener('input', handleSearch);
  
  // Coin selection
  const coinItems = cryptoModal.querySelectorAll('.crypto-coin-item');
  Array.from(coinItems).forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const symbol = (item as HTMLElement).dataset.symbol;
      if (symbol) {
        selectCrypto(symbol);
      }
    });
  });
  
  // ESC key to close
  document.addEventListener('keydown', handleEscKey);
}

// Handle search filtering
function handleSearch(e: Event): void {
  const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
  const coinItems = cryptoModal?.querySelectorAll('.crypto-coin-item');
  
  coinItems?.forEach(item => {
    const element = item as HTMLElement;
    const symbol = element.dataset.symbol?.toLowerCase() || '';
    const name = element.querySelector('p')?.textContent?.toLowerCase() || '';
    
    if (symbol.includes(searchTerm) || name.includes(searchTerm)) {
      element.style.display = 'flex';
    } else {
      element.style.display = 'none';
    }
  });
}

// Handle ESC key
function handleEscKey(e: KeyboardEvent): void {
  if (e.key === 'Escape' && cryptoModal) {
    hideCryptoSelector();
  }
}

// Create mini icon for button
function createMiniIcon(symbol: string): string {
  const miniIcons: Record<string, string> = {
    ETH: `<svg width="24" height="24" viewBox="0 0 32 32" style="border-radius: 50%; background: #627EEA;">
      <path d="M16.498 8v5.87l4.5 2.03L16.498 8z" fill="#fff" fill-opacity=".8"/>
      <path d="M16.498 8L12 15.9l4.498-2.03V8z" fill="#fff"/>
      <path d="M16.498 18.97v3.63L21 16.61l-4.502 2.36z" fill="#fff" fill-opacity=".8"/>
      <path d="M16.498 22.6v-3.63L12 16.61l4.498 5.99z" fill="#fff"/>
    </svg>`,
    BTC: `<svg width="24" height="24" viewBox="0 0 32 32" style="border-radius: 50%; background: #F7931A;">
      <path d="M19.5 14.5c.2-1.4-.8-2.2-2.2-2.7l.5-1.9-1.2-.3-.5 1.8c-.3-.07-.6-.14-.9-.21l.5-1.9-1.2-.3-.5 1.9c-.25-.06-.5-.11-.74-.17l-1.6-.4-.3 1.2s.86.2.84.21c.47.12.55.43.54.68l-.54 2.17c.03.008.07.02.12.04l-.12-.03-.76 3.05c-.06.14-.2.36-.53.27.01.017-.84-.21-.84-.21L10 19.5l1.5.37c.28.07.56.14.83.21l-.48 1.93 1.2.3.48-1.92c.32.09.63.17.93.24l-.48 1.9 1.2.3.48-1.93c1.98.37 3.47.22 4.1-1.57.5-1.44-.02-2.27-1.07-2.82.76-.17 1.33-.67 1.48-1.71z" fill="#fff"/>
    </svg>`,
    BNB: `<svg width="24" height="24" viewBox="0 0 32 32" style="border-radius: 50%; background: #F3BA2F;">
      <path d="M14 12l2-2 2 2 1.5-1.5L16 7l-3.5 3.5L14 12zm-6 4l1.5-1.5L11 16l-1.5 1.5L8 16zm6 2l2 2 2-2 1.5 1.5L16 25l-3.5-3.5L14 20zm8-2l1.5-1.5L25 16l-1.5 1.5L22 16zM16 14l-1 1 1 1 1-1-1-1z" fill="#fff"/>
    </svg>`,
    TON: `<svg width="24" height="24" viewBox="0 0 32 32" style="border-radius: 50%; background: #0088CC;">
      <path d="M10 11h12v2H10v-2zm0 3h12v2H10v-2zm0 3h12v2H10v-2zm0 3h12v2H10v-2z" fill="#fff"/>
    </svg>`,
    XRPL: `<svg width="24" height="24" viewBox="0 0 32 32" style="border-radius: 50%; background: #23292F;">
      <path d="M10 10l6 6 6-6h-3l-3 3-3-3h-3zm0 12l6-6 6 6h-3l-3-3-3 3h-3z" fill="#fff"/>
    </svg>`,
    ARB: `<svg width="24" height="24" viewBox="0 0 32 32" style="border-radius: 50%; background: #2D374B;">
      <path d="M16 10l6 4-6 4-6-4 6-4zm-6 5l6 4v4l-6-4v-4zm12 0v4l-6 4v-4l6-4z" fill="#96BEDC"/>
    </svg>`,
    USDT: `<svg width="24" height="24" viewBox="0 0 32 32" style="border-radius: 50%; background: #26A17B;">
      <path d="M16 6.5c5.25 0 9.5 4.25 9.5 9.5s-4.25 9.5-9.5 9.5-9.5-4.25-9.5-9.5 4.25-9.5 9.5-9.5zM16 11v2h4v2h-4v2c2 0 3.5.5 3.5 1.5s-1.5 1.5-3.5 1.5c-2 0-3.5-.5-3.5-1.5s1.5-1.5 3.5-1.5v-2h-4v-2h4v-2h-4v-2h8v2h-4z" fill="#fff"/>
    </svg>`,
    USDC: `<svg width="24" height="24" viewBox="0 0 32 32" style="border-radius: 50%; background: #2775CA;">
      <circle cx="16" cy="16" r="6" fill="none" stroke="#fff" stroke-width="2"/>
      <path d="M18.5 14c0-.8-.7-1.5-1.5-1.5h-2c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5h2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-2c-.8 0-1.5-.7-1.5-1.5M16 10v2M16 20v2" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    X: `<img src="src/img/X.jpg" width="24" height="24" style="border-radius: 50%; object-fit: cover;" alt="X" />`
  };
  
  return miniIcons[symbol] || `<div style="width: 24px; height: 24px; background: #666; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">${symbol}</div>`;
}

// Select a cryptocurrency
function selectCrypto(symbol: string, targetButton?: HTMLElement): void {
  console.log(`🪙 Selected crypto: ${symbol}`);
  
  // Use provided button or current target
  const buttonToUpdate = targetButton || currentTargetButton;
  if (!buttonToUpdate) return;
  
  // Find the crypto data
  const crypto = CRYPTO_TOKENS.find(c => c.symbol === symbol);
  if (!crypto) return;
  
  // Update the coin icon (replace Ellipse.png or existing icon container)
  let iconElement = buttonToUpdate.querySelector('.sell-buy-img:first-child') as HTMLElement;
  
  // If not found, it might be a replaced div container (from previous selection)
  if (!iconElement) {
    iconElement = buttonToUpdate.children[0] as HTMLElement;
  }
  
  if (iconElement) {
    const iconContainer = document.createElement('div');
    iconContainer.innerHTML = createMiniIcon(symbol);
    iconContainer.style.display = 'flex';
    iconContainer.style.alignItems = 'center';
    iconContainer.style.justifyContent = 'center';
    iconContainer.className = 'coin-icon-container'; // Add class to identify it
    iconElement.replaceWith(iconContainer);
  }
  
  // Update the button text (find the text node)
  const textNodes = Array.from(buttonToUpdate.childNodes).filter(
    node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
  );
  
  if (textNodes.length > 0) {
    textNodes[0].textContent = ` ${crypto.symbol} `;
  } else {
    // Fallback: look for the first text content
    const textElements = buttonToUpdate.querySelectorAll('*');
    for (const element of Array.from(textElements)) {
      if (element.textContent?.includes('ETH') || element.textContent?.includes('USDT') || element.textContent?.includes('BTC')) {
        element.textContent = crypto.symbol;
        break;
      }
    }
  }
  
  // Add light green highlight if ETH is selected (main chain)
  buttonToUpdate.classList.remove('eth-main-selected');
  if (symbol === 'ETH') {
    buttonToUpdate.classList.add('eth-main-selected');
  }
  
  // Add visual feedback
  buttonToUpdate.style.transform = 'scale(0.95)';
  setTimeout(() => {
    if (buttonToUpdate) {
      buttonToUpdate.style.transform = 'scale(1)';
    }
  }, 150);
  
  // Close the modal
  hideCryptoSelector();
  
  console.log(`✅ Button updated to: ${crypto.symbol}`);
}

// Initialize the crypto selector system
function initializeCryptoSelector(): void {
  console.log('🔧 Initializing Modern Crypto Selector...');
  
  // Use event delegation for maximum compatibility
  document.addEventListener('click', (e) => {
    // Prevent the modal from closing when we're trying to open it
    if (cryptoModal && (e.target as HTMLElement).closest('.crypto-modal-container')) {
      return;
    }
    
    const target = e.target as HTMLElement;
    const coinButton = target.closest('.sell-buy-button') as HTMLElement;
    
    if (coinButton) {
      console.log('🎯 Coin button clicked:', {
        className: coinButton.className,
        textContent: coinButton.textContent?.trim()
      });
      
      e.preventDefault();
      e.stopPropagation();
      
      // Small delay to ensure any existing click handlers finish
      setTimeout(() => {
        showCryptoSelector(coinButton);
      }, 10);
    }
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (cryptoModal) {
      cryptoModal.remove();
    }
  });
  
  console.log('✅ Modern Crypto Selector initialized');
  
  // Test function for debugging
  (window as any).testCryptoModal = () => {
    console.log('🧪 Manual test: Opening crypto selector...');
    const testButton = document.querySelector('.sell-buy-button') as HTMLElement;
    if (testButton) {
      showCryptoSelector(testButton);
    } else {
      console.log('❌ No coin buttons found for testing');
    }
  };

  // Test function for swap functionality
  (window as any).testSwapFunctionality = () => {
    console.log('🧪 Testing swap functionality...');
    
    // First, set specific coins to test
    const coinButtons = document.querySelectorAll('.sell-buy-button');
    if (coinButtons.length >= 2) {
      const button1 = coinButtons[0] as HTMLElement;
      const button2 = coinButtons[1] as HTMLElement;
      
      // Set ETH on first button and BTC on second
      selectCrypto('ETH', button1);
      setTimeout(() => {
        selectCrypto('BTC', button2);
        
        setTimeout(() => {
          console.log('🔍 Before swap:');
          console.log('Button 1:', button1.textContent?.trim(), 'Has ETH highlight:', button1.classList.contains('eth-main-selected'));
          console.log('Button 2:', button2.textContent?.trim(), 'Has ETH highlight:', button2.classList.contains('eth-main-selected'));
          
          // Now trigger swap
          const swapButton = document.querySelector('.vertswap-button') as HTMLElement;
          if (swapButton) {
            console.log('🔄 Triggering swap...');
            swapButton.click();
            
            // Check result after animation
            setTimeout(() => {
              console.log('🔍 After swap:');
              console.log('Button 1:', button1.textContent?.trim(), 'Has ETH highlight:', button1.classList.contains('eth-main-selected'));
              console.log('Button 2:', button2.textContent?.trim(), 'Has ETH highlight:', button2.classList.contains('eth-main-selected'));
              
              // Verify ETH highlight follows the ETH coin
              const button1HasETH = button1.textContent?.trim().includes('ETH');
              const button2HasETH = button2.textContent?.trim().includes('ETH');
              const button1HasHighlight = button1.classList.contains('eth-main-selected');
              const button2HasHighlight = button2.classList.contains('eth-main-selected');
              
              if ((button1HasETH && button1HasHighlight && !button2HasHighlight) || 
                  (button2HasETH && button2HasHighlight && !button1HasHighlight)) {
                console.log('✅ ETH highlight correctly follows the ETH coin');
              } else {
                console.log('❌ ETH highlight not following correctly');
              }
            }, 700);
          }
        }, 200);
      }, 200);
    }
  };
}

// Set default selected coins on page load
function setDefaultCoins(): void {
  console.log('🎯 Setting default coins: ETH and USDT');
  
  // Wait a bit for the page to be fully loaded
  setTimeout(() => {
    const coinButtons = document.querySelectorAll('.sell-buy-button');
    
    if (coinButtons.length >= 2) {
      // Set ETH as first button (already has ETH text by default)
      const ethButton = coinButtons[0] as HTMLElement;
      selectCrypto('ETH', ethButton);
      
      // Set USDT as second button (currently shows USDT text)
      const usdtButton = coinButtons[1] as HTMLElement;
      selectCrypto('USDT', usdtButton);
      
      console.log('✅ Default coins set: ETH and USDT');
    } else {
      console.log('⚠️ Could not find coin buttons for default selection');
    }
  }, 1000);
}


// Coin Swap Functionality
function initializeCoinSwappers(): void {
  console.log('🔄 Initializing coin swap functionality...');
  
  // Find all swap buttons
  const swapButtons = document.querySelectorAll('.vertswap-button');
  
  swapButtons.forEach(button => {
    button.addEventListener('click', handleCoinSwap);
  });
  
  console.log(`✅ Initialized ${swapButtons.length} coin swap buttons`);
}

function handleCoinSwap(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  
  const swapButton = event.currentTarget as HTMLElement;
  console.log('🔄 Coin swap button clicked');
  
  // Check if button is already disabled (animation in progress)
  if (swapButton.hasAttribute('data-swapping')) {
    console.log('⚠️ Swap already in progress, ignoring click');
    return;
  }
  
  // Use robust DOM traversal to find container with sell-buy-button elements
  const container = findContainerWithCoinButtons(swapButton);
  if (!container) {
    console.log('❌ Could not find container with coin buttons');
    return;
  }
  
  // Find the two coin buttons in this container
  const coinButtons = container.querySelectorAll('.sell-buy-button');
  if (coinButtons.length < 2) {
    console.log('❌ Need at least 2 coin buttons to swap');
    return;
  }
  
  const topButton = coinButtons[0] as HTMLElement;
  const bottomButton = coinButtons[1] as HTMLElement;
  
  // Disable button during animation
  swapButton.setAttribute('data-swapping', 'true');
  swapButton.style.pointerEvents = 'none';
  
  // Animate the swap with smooth transitions
  animateCoinSwap(topButton, bottomButton, swapButton);
}

// Robust DOM traversal to find container with coin buttons
function findContainerWithCoinButtons(swapButton: HTMLElement): HTMLElement | null {
  let currentElement = swapButton.parentElement;
  let maxDepth = 10; // Prevent infinite loops
  
  while (currentElement && maxDepth > 0) {
    // Check if this element contains at least 2 sell-buy-button elements
    const coinButtons = currentElement.querySelectorAll('.sell-buy-button');
    if (coinButtons.length >= 2) {
      console.log(`✅ Found container with ${coinButtons.length} coin buttons`);
      return currentElement;
    }
    
    // Move up to parent
    currentElement = currentElement.parentElement;
    maxDepth--;
  }
  
  console.log('❌ Could not find ancestor containing coin buttons');
  return null;
}

function animateCoinSwap(topButton: HTMLElement, bottomButton: HTMLElement, swapButton: HTMLElement): void {
  console.log('🎬 Starting coin swap animation...');
  
  // Add smooth transition CSS
  const transitionCSS = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
  topButton.style.transition = transitionCSS;
  bottomButton.style.transition = transitionCSS;
  swapButton.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
  
  // Animate swap button rotation
  swapButton.style.transform = 'rotate(180deg)';
  
  // Get current positions
  const topRect = topButton.getBoundingClientRect();
  const bottomRect = bottomButton.getBoundingClientRect();
  const distance = bottomRect.top - topRect.top;
  
  // Phase 1: Move buttons to swap positions
  topButton.style.transform = `translateY(${distance}px)`;
  bottomButton.style.transform = `translateY(-${distance}px)`;
  
  // Phase 2: After animation, actually swap the content
  setTimeout(() => {
    swapCoinButtonContents(topButton, bottomButton);
    
    // Reset positions
    topButton.style.transform = '';
    bottomButton.style.transform = '';
    swapButton.style.transform = '';
    
    // Remove transitions after animation
    setTimeout(() => {
      topButton.style.transition = '';
      bottomButton.style.transition = '';
      swapButton.style.transition = '';
      
      // Re-enable swap button
      swapButton.removeAttribute('data-swapping');
      swapButton.style.pointerEvents = '';
      
      console.log('✅ Coin swap animation completed');
    }, 100);
  }, 600);
}

function swapCoinButtonContents(button1: HTMLElement, button2: HTMLElement): void {
  // Extract current button contents
  const button1Content = extractButtonContent(button1);
  const button2Content = extractButtonContent(button2);
  
  // Swap the contents
  setButtonContent(button1, button2Content);
  setButtonContent(button2, button1Content);
  
  console.log(`🔀 Swapped coins: ${button2Content.symbol} ↔ ${button1Content.symbol}`);
}

interface ButtonContent {
  symbol: string;
  icon: string;
  classes: string[];
}

function extractButtonContent(button: HTMLElement): ButtonContent {
  // Get the current symbol from text content
  const textContent = button.textContent?.trim() || 'ETH';
  const symbol = textContent.replace(/\s+/g, ' ').trim();
  
  // Get the icon (first child that's either img or div container)
  const iconElement = button.querySelector('.coin-icon-container') || button.querySelector('.sell-buy-img:first-child');
  const icon = iconElement ? iconElement.outerHTML : '';
  
  // Get classes (like eth-main-selected)
  const classes = Array.from(button.classList);
  
  return { symbol, icon, classes };
}

function setButtonContent(button: HTMLElement, content: ButtonContent): void {
  // Set the symbol text
  const textNodes = Array.from(button.childNodes).filter(
    node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
  );
  
  if (textNodes.length > 0) {
    textNodes[0].textContent = ` ${content.symbol} `;
  } else {
    // Fallback: replace any existing text content
    const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
    let textNode;
    while (textNode = walker.nextNode()) {
      if (textNode.textContent?.trim() && !textNode.parentElement?.tagName.match(/IMG|SVG/)) {
        textNode.textContent = ` ${content.symbol} `;
        break;
      }
    }
  }
  
  // Set the icon (replace first icon element)
  const iconElement = button.querySelector('.coin-icon-container') || button.querySelector('.sell-buy-img:first-child');
  if (iconElement && content.icon) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content.icon;
    iconElement.replaceWith(tempDiv.firstChild!);
  }
  
  // Reset to base class and properly handle ETH highlighting
  button.className = 'sell-buy-button';
  
  // Add ETH highlight only if the symbol is actually ETH
  if (content.symbol === 'ETH') {
    button.classList.add('eth-main-selected');
    console.log('✅ Added ETH highlight to button with ETH symbol');
  }
  
  // Add other non-highlighting classes (excluding eth-main-selected)
  content.classes.forEach(cls => {
    if (cls !== 'sell-buy-button' && cls !== 'eth-main-selected') {
      button.classList.add(cls);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeCryptoSelector();
    initializeCoinSwappers();
    setDefaultCoins();
  });
} else {
  initializeCryptoSelector();
  initializeCoinSwappers();
  setDefaultCoins();
}