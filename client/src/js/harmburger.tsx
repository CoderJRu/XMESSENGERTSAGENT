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
    item.addEventListener('click', () => {
      if (open) {
        open = false;
        ToggleHamburger();
      }
    });
  });
});

