import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

// Dynamically determine basename for GitHub Pages or other subpath deployments
const getBasename = () => {
  const path = window.location.pathname;
  if (window.location.hostname.includes('github.io')) {
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      return `/${segments[0]}`;
    }
  }
  return '/';
};

const basename = getBasename();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#f9fafb' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#f9fafb' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);