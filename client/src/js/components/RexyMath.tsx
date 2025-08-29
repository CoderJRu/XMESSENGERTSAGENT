export function toHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function shortenMiddle(
  str: string,
  startLength = 6,
  endLength = 4,
): string {
  if (str.length <= startLength + endLength + 3) return str;
  return `${str.slice(0, startLength)}...${str.slice(-endLength)}`;
}

export function mouseUpdateByDrag(
  element: HTMLElement,
  onSwipe: (direction: string) => void,
) {
  let startX = 0;
  let startY = 0;
  let isDown = false;

  element.addEventListener("mousedown", (e: MouseEvent) => {
    isDown = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  element.addEventListener("mouseup", (e: MouseEvent) => {
    if (!isDown) return;
    isDown = false;

    const endX = e.clientX;
    const endY = e.clientY;

    const diffX = endX - startX;
    const diffY = endY - startY;

    let direction = "";

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      direction = diffX > 0 ? "right" : "left";
    } else {
      // Vertical swipe
      direction = diffY > 0 ? "down" : "up";
    }

    onSwipe(direction);
  });
}

export function mouseUpdate(
  onMove: (direction: "left" | "right" | "up" | "down") => void,
  delayMs: number = 100,
  threshold: number = 10,
) {
  let lastX = 0;
  let lastY = 0;
  let lastUpdateTime = 0;
  let isFirstMove = true;

  function handleMove(x: number, y: number) {
    if (isFirstMove) {
      lastX = x;
      lastY = y;
      isFirstMove = false;
      return;
    }

    const diffX = x - lastX;
    const diffY = y - lastY;

    if (Math.abs(diffX) < threshold && Math.abs(diffY) < threshold) return;

    let direction: "left" | "right" | "up" | "down";
    if (Math.abs(diffX) > Math.abs(diffY)) {
      direction = diffX > 0 ? "right" : "left";
    } else {
      direction = diffY > 0 ? "down" : "up";
    }

    const now = Date.now();
    if (now - lastUpdateTime >= delayMs) {
      onMove(direction);
      lastUpdateTime = now;
    }

    lastX = x;
    lastY = y;
  }

  // 🖱 Desktop
  document.body.addEventListener("mousemove", (e) => {
    handleMove(e.clientX, e.clientY);
  });

  // 📱 Mobile
  document.body.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  });
}
