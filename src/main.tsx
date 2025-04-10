
import { createRoot } from 'react-dom/client'
import { StrictMode, Suspense } from 'react';
import App from './App.tsx'
import './index.css'

const container = document.getElementById("root");

if (!container) {
  throw new Error("Could not find root element with id 'root'");
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <Suspense fallback={<div>Chargement...</div>}>
      <App />
    </Suspense>
  </StrictMode>
);
