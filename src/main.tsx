import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

try {
  const wipeFlag = "dazzle-local-cart-cleared-v3"
  if (localStorage.getItem(wipeFlag) !== "1") {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (key && key.startsWith("dazzle-cart")) keys.push(key)
    }
    for (const key of keys) localStorage.removeItem(key)
    localStorage.setItem(wipeFlag, "1")
  }
} catch {
  /* private mode */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
