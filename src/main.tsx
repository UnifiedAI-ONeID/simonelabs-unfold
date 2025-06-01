
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './components/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import './index.css'
import './i18n'  // Import i18n configuration

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="simonelabs-ui-theme">
      <App />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
);
