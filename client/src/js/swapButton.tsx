// Swap Button Functionality with Smooth Animations
// This handles the vertical swap button between buy/sell sections

interface SwapData {
  coinText: string;
  coinIcon: HTMLElement | null;
  hasEthHighlight: boolean;
}

// Get coin data from a sell-buy-button
function getCoinData(button: HTMLElement): SwapData {
  const coinText = Array.from(button.childNodes)
    .find(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
    ?.textContent?.trim() || 'ETH';
  
  const coinIcon = button.querySelector('.coin-icon-container') as HTMLElement || 
                   button.querySelector('.sell-buy-img:first-child') as HTMLElement || 
                   button.children[0] as HTMLElement;
  
  const hasEthHighlight = button.classList.contains('eth-main-selected');
  
  return { coinText, coinIcon, hasEthHighlight };
}

// Set coin data to a sell-buy-button
function setCoinData(button: HTMLElement, data: SwapData): void {
  // Update text content
  const textNodes = Array.from(button.childNodes).filter(
    node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
  );
  
  if (textNodes.length > 0) {
    textNodes[0].textContent = ` ${data.coinText} `;
  }
  
  // Update icon
  if (data.coinIcon && button.children[0]) {
    const clonedIcon = data.coinIcon.cloneNode(true) as HTMLElement;
    button.children[0].replaceWith(clonedIcon);
  }
  
  // Update ETH highlight
  button.classList.remove('eth-main-selected');
  if (data.hasEthHighlight) {
    button.classList.add('eth-main-selected');
  }
}

// Perform the swap with animations
function performSwap(): void {
  console.log('🔄 Swap button clicked - performing coin swap');
  
  const sellBuyButtons = document.querySelectorAll('.sell-buy-button');
  if (sellBuyButtons.length < 2) {
    console.log('❌ Not enough coin buttons found for swap');
    return;
  }
  
  const firstButton = sellBuyButtons[0] as HTMLElement;
  const secondButton = sellBuyButtons[1] as HTMLElement;
  
  // Get current coin data
  const firstData = getCoinData(firstButton);
  const secondData = getCoinData(secondButton);
  
  console.log(`🔄 Swapping: ${firstData.coinText} ↔ ${secondData.coinText}`);
  
  // Add swap animation class
  firstButton.classList.add('coin-swapping-out');
  secondButton.classList.add('coin-swapping-out');
  
  // Perform the swap after animation starts
  setTimeout(() => {
    setCoinData(firstButton, secondData);
    setCoinData(secondButton, firstData);
    
    // Remove outgoing animation and add incoming animation
    firstButton.classList.remove('coin-swapping-out');
    secondButton.classList.remove('coin-swapping-out');
    firstButton.classList.add('coin-swapping-in');
    secondButton.classList.add('coin-swapping-in');
    
    // Clean up animation classes
    setTimeout(() => {
      firstButton.classList.remove('coin-swapping-in');
      secondButton.classList.remove('coin-swapping-in');
    }, 300);
    
  }, 150); // Half of the animation duration
  
  console.log(`✅ Swap completed: ${secondData.coinText} ↔ ${firstData.coinText}`);
}

// Initialize swap button functionality
function initializeSwapButton(): void {
  console.log('🔧 Initializing swap button functionality...');
  
  const swapButtons = document.querySelectorAll('.vertswap-button');
  
  swapButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Add click animation to the swap button
      const swapBtn = button as HTMLElement;
      swapBtn.classList.add('swap-button-clicked');
      
      // Remove click animation after a short delay
      setTimeout(() => {
        swapBtn.classList.remove('swap-button-clicked');
      }, 200);
      
      // Perform the swap
      performSwap();
    });
    
    console.log(`✅ Swap button ${index + 1} initialized`);
  });
  
  console.log('✅ All swap buttons initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSwapButton);
} else {
  initializeSwapButton();
}