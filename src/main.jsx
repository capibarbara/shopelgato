import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Admin from './Admin'
import './index.css'

function Router(){
  const path = window.location.pathname
  if (path === '/admin') return <Admin />
  return <App />
}

createRoot(document.getElementById('root')).render(<Router />)