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

// Select a cryptocurrency
function selectCrypto(symbol: string): void {
  console.log(`🪙 Selected crypto: ${symbol}`);
  
  if (!currentTargetButton) return;
  
  // Find the crypto data
  const crypto = CRYPTO_TOKENS.find(c => c.symbol === symbol);
  if (!crypto) return;
  
  // Update the button text (find the text node)
  const textNodes = Array.from(currentTargetButton.childNodes).filter(
    node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
  );
  
  if (textNodes.length > 0) {
    textNodes[0].textContent = crypto.symbol;
  } else {
    // Fallback: look for the first text content
    const textElements = currentTargetButton.querySelectorAll('*');
    for (const element of Array.from(textElements)) {
      if (element.textContent?.includes('ETH') || element.textContent?.includes('USDT') || element.textContent?.includes('BTC')) {
        element.textContent = crypto.symbol;
        break;
      }
    }
  }
  
  // Add visual feedback
  currentTargetButton.style.transform = 'scale(0.95)';
  setTimeout(() => {
    if (currentTargetButton) {
      currentTargetButton.style.transform = 'scale(1)';
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
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCryptoSelector);
} else {
  initializeCryptoSelector();
}