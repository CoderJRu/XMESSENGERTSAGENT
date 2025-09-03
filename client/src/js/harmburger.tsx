import { isConnected } from "./connectWallet";
import { getConnectedEthAddress } from "../walletstore.tsx";

export let open: boolean = false;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const hamburger = document.querySelector<HTMLElement>(".hamburger");
const hamburgerPlane = document.querySelector<HTMLElement>(".hamburger-plane");
const xmUlMenu = document.querySelector<HTMLElement>(".xm-ul-menu");
const mobileProfileIcon = document.querySelector<HTMLElement>("#mobile-profile-icon");
const headerBar = document.querySelector<HTMLElement>(".Header-bar");

hamburger?.addEventListener("click", async () => {
  open = !open;
  ToggleHamburger();
});

// Mobile profile icon click handler
mobileProfileIcon?.addEventListener("click", () => {
  // Import and call profile function
  const profileEvent = new CustomEvent('showProfileSettings');
  document.dispatchEvent(profileEvent);
});

export function ToggleHamburger(): void {
  if (!hamburger || !hamburgerPlane || !xmUlMenu || !mobileProfileIcon || !headerBar) return;

  if (open) {
    hamburger.classList.add("active");
    hamburgerPlane.classList.add("active");
    xmUlMenu.classList.add("active");
    mobileProfileIcon.classList.add("active");
    headerBar.classList.add("active");
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    // Apply disabled state to menu items if not connected
    updateMenuItemsState();
  } else {
    hamburger.classList.remove("active");
    hamburgerPlane.classList.remove("active");
    xmUlMenu.classList.remove("active");
    mobileProfileIcon.classList.remove("active");
    headerBar.classList.remove("active");
    // Restore body scroll when menu is closed
    document.body.style.overflow = '';
  }
}

// Update menu items state based on connection status
function updateMenuItemsState(): void {
  const menuItems = document.querySelectorAll('.xm-list-items');
  const connected = isConnected || !!getConnectedEthAddress();
  
  menuItems.forEach(item => {
    const htmlItem = item as HTMLElement;
    if (!connected) {
      htmlItem.classList.add('disabled');
      htmlItem.style.pointerEvents = 'none';
      htmlItem.style.opacity = '0.4';
      htmlItem.style.cursor = 'not-allowed';
      // Prevent any click events
      htmlItem.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
    } else {
      htmlItem.classList.remove('disabled');
      htmlItem.style.pointerEvents = 'auto';
      htmlItem.style.opacity = '1';
      htmlItem.style.cursor = 'pointer';
      htmlItem.onclick = null;
    }
  });
}

// Close menu when clicking outside
document.querySelector("html")?.addEventListener("mousedown", async (e) => {
  if (!open) return;
  
  // Don't close if clicking on the hamburger or profile icon
  const target = e.target as HTMLElement;
  if (target.closest('.hamburger') || target.closest('#mobile-profile-icon')) return;

  await delay(300);

  if (open) {
    open = false;
    ToggleHamburger();
  }
});

// Close menu when clicking on menu items
document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.xm-list-items');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const connected = isConnected || !!getConnectedEthAddress();
      // Prevent any action if wallet is not connected
      if (!connected) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      // Only close menu if wallet is connected
      if (open && connected) {
        open = false;
        ToggleHamburger();
      }
    });
  });
});

