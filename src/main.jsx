import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// vite-plugin-pwa handles service worker registration automatically

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
