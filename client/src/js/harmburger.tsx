export let open: boolean = false;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const hamburger = document.querySelector<HTMLElement>(".hamburger");
const hamburgerPlane = document.querySelector<HTMLElement>(".hamburger-plane");
const xmUlMenu = document.querySelector<HTMLElement>(".xm-ul-menu");

hamburger?.addEventListener("click", async () => {
  open = !open;
  ToggleHamburger();
});

export function ToggleHamburger(): void {
  if (!hamburger || !hamburgerPlane || !xmUlMenu) return;

  if (open) {
    hamburger.classList.add("active");
    hamburgerPlane.classList.add("active");
    xmUlMenu.classList.add("active");
  } else {
    hamburger.classList.remove("active");
    hamburgerPlane.classList.remove("active");
    xmUlMenu.classList.remove("active");
  }
}

document.querySelector("html")?.addEventListener("mousedown", async () => {
  if (!open) return;

  await delay(500);

  if (open) {
    open = false;
    ToggleHamburger();
  }
});

