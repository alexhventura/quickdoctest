import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/i18n';
import './index.css';
import App from './App.jsx';
import AppProviders from '@/providers/AppProviders';

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
