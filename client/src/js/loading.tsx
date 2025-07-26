export function showLoading(): void {
  const overlay = document.getElementById('loading-overlay') as HTMLElement | null;
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

export function hideLoading(): void {
  const overlay = document.getElementById('loading-overlay') as HTMLElement | null;
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// Create and inject loading overlay into DOM (once)
const loadingHTML = `
  <div id="loading-overlay" style="
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(14, 16, 19, 0.9);
    z-index: 9999;
    justify-content: center;
    align-items: center;
  ">
    <div style="
      width: 60px;
      height: 60px;
      border: 3px solid #333;
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s linear infinite;
    "></div>
  </div>
  <style>
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  </style>
`;

// Ensure DOM is loaded before injecting
if (typeof window !== 'undefined' && document.readyState !== 'loading') {
  document.body.insertAdjacentHTML('beforeend', loadingHTML);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
  });
}
