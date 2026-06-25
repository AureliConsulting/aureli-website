import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './styles/index.css'

try {
  const stored = localStorage.getItem('aureli-theme')
  const theme = stored === 'dark' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
} catch {
  document.documentElement.setAttribute('data-theme', 'light')
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
