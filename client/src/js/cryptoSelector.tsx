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
  { symbol: 'ARB', name: 'Arbitrum', balance: '0.0000', iconClass: 'arb-bg' }
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

// Generate the coin list HTML
function generateCoinList(): string {
  return CRYPTO_TOKENS.map(token => `
    <div class="crypto-coin-item ${token.isMain ? 'main-coin' : ''}" data-symbol="${token.symbol}">
      <div class="crypto-coin-left">
        <div class="crypto-coin-icon ${token.iconClass}">${token.symbol}</div>
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
  coinItems.forEach(item => {
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
    for (const element of textElements) {
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