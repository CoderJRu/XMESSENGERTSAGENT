import { createRoot } from 'react-dom/client';
import App from './App';
import './css/base.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('react-root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
});