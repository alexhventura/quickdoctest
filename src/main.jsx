import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/i18n';
import './index.css';
import App from './App.jsx';
import AppProviders from '@/providers/AppProviders';

/** Remove SW legado (não usamos PWA offline) que pode servir HTML/JS antigo */
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
  if ('caches' in window) {
    caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
  }
}

const savedTheme = localStorage.getItem('qd_theme') || 'dark';
document.documentElement.classList.toggle('dark', savedTheme === 'dark');
document.documentElement.lang =
  localStorage.getItem('qd_lang') === 'pt'
    ? 'pt-BR'
    : localStorage.getItem('qd_lang') === 'es'
      ? 'es'
      : 'en';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
