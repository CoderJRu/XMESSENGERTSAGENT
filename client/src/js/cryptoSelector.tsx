// Cryptocurrency Selection Modal Functionality

interface CryptoData {
  symbol: string;
  name: string;
  balance: string;
  isMain?: boolean;
}

// Available cryptocurrencies
const cryptoData: CryptoData[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: '0.0000', isMain: true },
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.0000' },
  { symbol: 'BNB', name: 'BNB', balance: '0.0000' },
  { symbol: 'TON', name: 'Toncoin', balance: '0.0000' },
  { symbol: 'XRPL', name: 'XRP Ledger', balance: '0.0000' },
  { symbol: 'ARB', name: 'Arbitrum', balance: '0.0000' }
];

// Track which button triggered the modal
let currentTargetButton: HTMLElement | null = null;

// Helper function to safely get an element by ID
function getElement(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with ID "${id}" not found`);
  return el;
}

// Show the crypto selector modal
export function showCryptoSelector(targetButton: HTMLElement): void {
  currentTargetButton = targetButton;
  const overlay = getElement('crypto-selector-overlay');
  const searchInput = getElement('crypto-search-input') as HTMLInputElement;
  
  // Show the modal
  overlay.removeAttribute('hidden');
  
  // Focus on search input after animation
  setTimeout(() => {
    searchInput.focus();
  }, 300);
  
  // Clear any previous search
  searchInput.value = '';
  filterCryptos('');
}

// Hide the crypto selector modal
export function hideCryptoSelector(): void {
  const overlay = getElement('crypto-selector-overlay');
  overlay.setAttribute('hidden', 'true');
  currentTargetButton = null;
}

// Filter cryptocurrencies based on search term
function filterCryptos(searchTerm: string): void {
  const cryptoItems = document.querySelectorAll('.crypto-item');
  const term = searchTerm.toLowerCase();
  
  cryptoItems.forEach((item) => {
    const element = item as HTMLElement;
    const symbol = element.dataset.symbol?.toLowerCase() || '';
    const name = element.dataset.name?.toLowerCase() || '';
    
    if (symbol.includes(term) || name.includes(term)) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  });
}

// Handle crypto selection
function selectCrypto(symbol: string): void {
  if (!currentTargetButton) return;
  
  // Find the crypto data
  const crypto = cryptoData.find(c => c.symbol === symbol);
  if (!crypto) return;
  
  // Update the button text
  const textNode = Array.from(currentTargetButton.childNodes)
    .find(node => node.nodeType === Node.TEXT_NODE);
  
  if (textNode) {
    textNode.textContent = crypto.symbol;
  }
  
  // Add a subtle animation to show the change
  currentTargetButton.style.transform = 'scale(0.95)';
  setTimeout(() => {
    if (currentTargetButton) {
      currentTargetButton.style.transform = 'scale(1)';
    }
  }, 150);
  
  // Hide the modal
  hideCryptoSelector();
  
  console.log(`Selected crypto: ${crypto.symbol} (${crypto.name})`);
}

// Initialize the crypto selector functionality
function initializeCryptoSelector(): void {
  try {
    // Close button event listener
    getElement('crypto-close-btn').addEventListener('click', hideCryptoSelector);
    
    // Overlay click to close (click outside modal)
    getElement('crypto-selector-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        hideCryptoSelector();
      }
    });
    
    // Search input event listener
    const searchInput = getElement('crypto-search-input') as HTMLInputElement;
    searchInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      filterCryptos(target.value);
    });
    
    // Crypto item click event listeners
    document.querySelectorAll('.crypto-item').forEach((item) => {
      item.addEventListener('click', () => {
        const element = item as HTMLElement;
        const symbol = element.dataset.symbol;
        if (symbol) {
          selectCrypto(symbol);
        }
      });
    });
    
    // Use event delegation for coin selection buttons (more robust for dynamic content)
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest('.sell-buy-button') as HTMLElement;
      
      if (button) {
        console.log('🔍 Coin button clicked:', button);
        e.preventDefault();
        e.stopPropagation();
        showCryptoSelector(button);
      }
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = getElement('crypto-selector-overlay');
        if (!overlay.hasAttribute('hidden')) {
          hideCryptoSelector();
        }
      }
    });
    
    // Log current coin buttons for debugging
    const coinButtons = document.querySelectorAll('.sell-buy-button');
    console.log('🪙 Found coin buttons:', coinButtons.length);
    
    console.log('🪙 Crypto selector initialized successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize crypto selector:', error);
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCryptoSelector);
} else {
  initializeCryptoSelector();
}