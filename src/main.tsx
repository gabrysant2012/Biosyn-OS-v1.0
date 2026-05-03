import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Defensive check for environments where window.fetch might be read-only
if (typeof window !== 'undefined') {
  try {
    // Some libraries check for fetch this way and might try to patch it.
    // By accessing it early, we might trigger some initialization if needed,
    // although the error usually happens during assignment.
    const _ = window.fetch;
  } catch (e) {
    console.warn('Fetch access warning:', e);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
