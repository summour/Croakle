import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initNativePwaLock } from './utils/nativeScrollLock';

// Initialize native PWA viewport lock to prevent pull-to-refresh and rubber-band bounce
initNativePwaLock();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

